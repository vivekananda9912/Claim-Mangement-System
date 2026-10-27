/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose from 'mongoose';

// In-memory document storage dictionary partitioned by collection name
const documentStore: Record<string, any[]> = {};

function getNestedValue(obj: any, path: string): any {
  if (obj == null) return undefined;
  if (!path.includes('.')) return obj[path];
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr == null) return undefined;
    curr = curr[part];
  }
  return curr;
}

function matchesFilter(doc: any, filter: any): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, val] of Object.entries(filter)) {
    if (key === '$or' && Array.isArray(val)) {
      if (!val.some((subFilter) => matchesFilter(doc, subFilter))) return false;
      continue;
    }

    if (key === '$and' && Array.isArray(val)) {
      if (!val.every((subFilter) => matchesFilter(doc, subFilter))) return false;
      continue;
    }

    // Check if doc has array of objects matching nested query, e.g. dependents.memberId
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      const parentVal = doc[parentKey];
      if (Array.isArray(parentVal)) {
        const matchesAnyChild = parentVal.some((item) => {
          const itemVal = item[childKey];
          return itemVal === val || String(itemVal) === String(val);
        });
        if (!matchesAnyChild) return false;
        continue;
      }
    }

    const docVal = getNestedValue(doc, key);

    if (val instanceof Date) {
      if (!(docVal instanceof Date) || docVal.getTime() !== val.getTime()) return false;
      continue;
    }

    if (typeof val === 'object' && val !== null) {
      // Comparison operators $gt, $gte, $lt, $lte, $in, $ne
      if ('$gte' in val && !(docVal >= (val as any).$gte)) return false;
      if ('$gt' in val && !(docVal > (val as any).$gt)) return false;
      if ('$lte' in val && !(docVal <= (val as any).$lte)) return false;
      if ('$lt' in val && !(docVal < (val as any).$lt)) return false;
      if ('$in' in val && !((val as any).$in as any[]).includes(docVal)) return false;
      if ('$ne' in val && docVal === (val as any).$ne) return false;
      continue;
    }

    if (docVal !== val && String(docVal) !== String(val)) {
      return false;
    }
  }

  return true;
}

function applySort(list: any[], sortCriteria: any): any[] {
  if (!sortCriteria || Object.keys(sortCriteria).length === 0) return list;
  const copy = [...list];
  const [field, order] = Object.entries(sortCriteria)[0];
  const multiplier = order === -1 ? -1 : 1;

  copy.sort((a, b) => {
    const valA = getNestedValue(a, field);
    const valB = getNestedValue(b, field);
    if (valA === valB) return 0;
    if (valA == null) return -1 * multiplier;
    if (valB == null) return 1 * multiplier;
    return valA > valB ? 1 * multiplier : -1 * multiplier;
  });

  return copy;
}

let isInitialized = false;

export function enableInMemoryMongooseFallback() {
  if (isInitialized) return;
  isInitialized = true;

  // Intercept Model.prototype.save
  const origSave = mongoose.Model.prototype.save;
  mongoose.Model.prototype.save = async function (this: any, options?: any) {
    if (mongoose.connection.readyState === 1) {
      return origSave.apply(this, arguments as any);
    }

    const col = this.collection.name;
    if (!documentStore[col]) documentStore[col] = [];

    const existingIdx = documentStore[col].findIndex(
      (d: any) => d._id?.toString() === this._id?.toString()
    );

    if (existingIdx >= 0) {
      documentStore[col][existingIdx] = this;
    } else {
      documentStore[col].push(this);
    }
    return this;
  };

  // Intercept Model.find
  const origFind = mongoose.Model.find;
  (mongoose.Model as any).find = function (filter: any = {}) {
    if (mongoose.connection.readyState === 1) {
      return origFind.apply(this, arguments as any);
    }

    const col = this.collection.name;
    let sortCrit: any = null;
    let limitCount: number | null = null;

    const queryObj = {
      sort(criteria: any) {
        sortCrit = criteria;
        return this;
      },
      limit(n: number) {
        limitCount = n;
        return this;
      },
      async exec() {
        const list = documentStore[col] || [];
        let filtered = list.filter((d: any) => matchesFilter(d, filter));
        if (sortCrit) {
          filtered = applySort(filtered, sortCrit);
        }
        if (limitCount !== null) {
          filtered = filtered.slice(0, limitCount);
        }
        return filtered;
      },
      then(resolve: any, reject: any) {
        return this.exec().then(resolve, reject);
      },
    };

    return queryObj as any;
  };

  // Intercept Model.findOne
  const origFindOne = mongoose.Model.findOne;
  (mongoose.Model as any).findOne = function (filter: any = {}) {
    if (mongoose.connection.readyState === 1) {
      return origFindOne.apply(this, arguments as any);
    }

    const col = this.collection.name;
    let sortCrit: any = null;

    const queryObj = {
      sort(criteria: any) {
        sortCrit = criteria;
        return this;
      },
      async exec() {
        const list = documentStore[col] || [];
        let filtered = list.filter((d: any) => matchesFilter(d, filter));
        if (sortCrit) {
          filtered = applySort(filtered, sortCrit);
        }
        return filtered[0] || null;
      },
      then(resolve: any, reject: any) {
        return this.exec().then(resolve, reject);
      },
    };

    return queryObj as any;
  };

  // Intercept Model.findOneAndUpdate
  const origFindOneAndUpdate = mongoose.Model.findOneAndUpdate;
  (mongoose.Model as any).findOneAndUpdate = function (
    filter: any,
    update: any,
    options: any = {}
  ) {
    if (mongoose.connection.readyState === 1) {
      return origFindOneAndUpdate.apply(this, arguments as any);
    }

    const col = this.collection.name;
    const queryObj = {
      async exec() {
        const list = documentStore[col] || [];
        const doc = list.find((d: any) => matchesFilter(d, filter));
        if (!doc) return null;

        // Apply $set and $push
        if (update.$push) {
          for (const [field, pushVal] of Object.entries(update.$push)) {
            if (!doc[field]) doc[field] = [];
            doc[field].push(pushVal);
          }
        }
        if (update.$set) {
          for (const [field, setVal] of Object.entries(update.$set)) {
            doc[field] = setVal;
          }
        }
        return doc;
      },
      then(resolve: any, reject: any) {
        return this.exec().then(resolve, reject);
      },
    };

    return queryObj as any;
  };

  // Intercept Model.countDocuments
  (mongoose.Model as any).countDocuments = function (filter: any = {}) {
    const col = this.collection.name;
    const queryObj = {
      async exec() {
        const list = documentStore[col] || [];
        return list.filter((d: any) => matchesFilter(d, filter)).length;
      },
      then(resolve: any, reject: any) {
        return this.exec().then(resolve, reject);
      },
    };
    return queryObj as any;
  };

  console.log('[OmniClaim Mongo Adapter] In-memory Mongo-compatible engine enabled for offline/sandbox execution.');
}

export function clearInMemoryStore() {
  for (const key of Object.keys(documentStore)) {
    delete documentStore[key];
  }
}

export function getInMemoryCollection(name: string): any[] {
  return documentStore[name] || [];
}
