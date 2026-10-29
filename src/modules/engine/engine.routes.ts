/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  INITIAL_CUSTOMERS,
  INITIAL_POLICIES,
  INITIAL_DOCTORS,
  INITIAL_CASES,
  INITIAL_CLAIMS,
  INITIAL_TASKS,
  INITIAL_EVIDENCES,
  INITIAL_FRAUD_ASSESSMENTS,
  INITIAL_EVENTS,
} from '../../data/mockData';
import {
  EXTENDED_CUSTOMERS,
  EXTENDED_POLICIES,
  EXTENDED_CLAIMS,
} from '../../data/extendedMembers';

export const engineRouter = Router();

function getDb() {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    return mongoose.connection.db;
  }
  return null;
}

/**
 * GET /api/engine/state
 * Fetches all live master records directly from MongoDB Atlas collections.
 */
engineRouter.get('/state', async (req: Request, res: Response) => {
  try {
    const db = getDb();

    if (!db) {
      // In-memory fallback if disconnected
      return res.json({
        source: 'IN_MEMORY_FALLBACK',
        database: 'in-memory',
        customers: [...INITIAL_CUSTOMERS, ...EXTENDED_CUSTOMERS],
        policies: [...INITIAL_POLICIES, ...EXTENDED_POLICIES],
        claims: [...INITIAL_CLAIMS, ...EXTENDED_CLAIMS],
        cases: INITIAL_CASES,
        tasks: INITIAL_TASKS,
        evidences: INITIAL_EVIDENCES,
        fraudAssessments: INITIAL_FRAUD_ASSESSMENTS,
        events: INITIAL_EVENTS,
        doctors: INITIAL_DOCTORS,
      });
    }

    const [
      customers,
      policies,
      claims,
      cases,
      tasks,
      evidences,
      fraudAssessments,
      events,
      doctors,
    ] = await Promise.all([
      db.collection('customers').find().toArray(),
      db.collection('policies').find().toArray(),
      db.collection('claims').find().toArray(),
      db.collection('cases').find().toArray(),
      db.collection('tasks').find().toArray(),
      db.collection('evidences').find().toArray(),
      db.collection('fraud_assessments').find().toArray(),
      db.collection('events').find().toArray(),
      db.collection('doctors').find().toArray(),
    ]);

    res.json({
      source: 'MONGODB_ATLAS',
      database: mongoose.connection.name,
      customers: customers.length > 0 ? customers : [...INITIAL_CUSTOMERS, ...EXTENDED_CUSTOMERS],
      policies: policies.length > 0 ? policies : [...INITIAL_POLICIES, ...EXTENDED_POLICIES],
      claims: claims.length > 0 ? claims : [...INITIAL_CLAIMS, ...EXTENDED_CLAIMS],
      cases: cases.length > 0 ? cases : INITIAL_CASES,
      tasks: tasks.length > 0 ? tasks : INITIAL_TASKS,
      evidences: evidences.length > 0 ? evidences : INITIAL_EVIDENCES,
      fraudAssessments: fraudAssessments.length > 0 ? fraudAssessments : INITIAL_FRAUD_ASSESSMENTS,
      events: events.length > 0 ? events : INITIAL_EVENTS,
      doctors: doctors.length > 0 ? doctors : INITIAL_DOCTORS,
    });
  } catch (error: any) {
    console.error('[Engine API Error] /state:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/engine/case
 * Saves or updates a case directly in MongoDB Atlas.
 */
engineRouter.post('/case', async (req: Request, res: Response) => {
  try {
    const caseDoc = req.body;
    if (!caseDoc || !caseDoc._id) {
      return res.status(400).json({ error: 'Missing case data or _id' });
    }

    const db = getDb();
    if (db) {
      await db.collection('cases').updateOne(
        { _id: caseDoc._id },
        { $set: caseDoc },
        { upsert: true }
      );
    }

    res.json({ success: true, caseId: caseDoc._id });
  } catch (error: any) {
    console.error('[Engine API Error] /case:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/engine/task
 * Saves or updates a task directly in MongoDB Atlas.
 */
engineRouter.post('/task', async (req: Request, res: Response) => {
  try {
    const taskDoc = req.body;
    if (!taskDoc || !taskDoc._id) {
      return res.status(400).json({ error: 'Missing task data or _id' });
    }

    const db = getDb();
    if (db) {
      await db.collection('tasks').updateOne(
        { _id: taskDoc._id },
        { $set: taskDoc },
        { upsert: true }
      );
    }

    res.json({ success: true, taskId: taskDoc._id });
  } catch (error: any) {
    console.error('[Engine API Error] /task:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/engine/sync
 * Syncs in-memory changes back into MongoDB Atlas collections.
 */
engineRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    if (!db) {
      return res.json({ success: true, warning: 'Database offline, synced locally' });
    }

    const { cases, tasks, evidences, claims, events } = req.body;

    if (Array.isArray(cases)) {
      for (const c of cases) {
        if (c._id) {
          await db.collection('cases').updateOne({ _id: c._id }, { $set: c }, { upsert: true });
        }
      }
    }

    if (Array.isArray(tasks)) {
      for (const t of tasks) {
        if (t._id) {
          await db.collection('tasks').updateOne({ _id: t._id }, { $set: t }, { upsert: true });
        }
      }
    }

    if (Array.isArray(evidences)) {
      for (const e of evidences) {
        const id = e._id || e.dcnId;
        if (id) {
          await db.collection('evidences').updateOne({ _id: id }, { $set: { ...e, _id: id } }, { upsert: true });
        }
      }
    }

    if (Array.isArray(claims)) {
      for (const cl of claims) {
        if (cl._id) {
          await db.collection('claims').updateOne({ _id: cl._id }, { $set: cl }, { upsert: true });
        }
      }
    }

    if (Array.isArray(events)) {
      for (const ev of events) {
        if (ev.eventId) {
          await db.collection('events').updateOne({ eventId: ev.eventId }, { $set: ev }, { upsert: true });
        }
      }
    }

    res.json({ success: true, message: 'All collections synchronized to MongoDB Atlas.' });
  } catch (error: any) {
    console.error('[Engine API Error] /sync:', error);
    res.status(500).json({ error: error.message });
  }
});
