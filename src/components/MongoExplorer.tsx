/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import {
  Database,
  Code,
  Copy,
  Check,
  Search,
  FileCode2,
} from 'lucide-react';

export const MongoExplorer: React.FC = () => {
  const { getMongoCollections, getMongooseSchemasCode } = useClaimsStore();
  const collections = getMongoCollections();
  const [activeCollectionName, setActiveCollectionName] = useState('cases');
  const [searchFilter, setSearchFilter] = useState('');
  const [showSchemasModal, setShowSchemasModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeCollection =
    collections.find((c) => c.name === activeCollectionName) || collections[0];

  const filteredData = activeCollection.data.filter((item: any) => {
    if (!searchFilter) return true;
    return JSON.stringify(item).toLowerCase().includes(searchFilter.toLowerCase());
  });

  const handleCopySchemas = () => {
    navigator.clipboard.writeText(getMongooseSchemasCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              In-App MongoDB Document Explorer & BSON Inspector
            </h2>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              Reactive BSON Store Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Directly inspect documents across all 9 master collections or export production-ready Mongoose schemas.
          </p>
        </div>

        <button
          onClick={() => setShowSchemasModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <FileCode2 className="w-4 h-4 text-emerald-400" />
          <span>Export Mongoose Schemas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Collections ({collections.length})
          </div>

          <div className="space-y-1">
            {collections.map((col) => {
              const isSelected = col.name === activeCollectionName;
              return (
                <button
                  key={col.name}
                  onClick={() => {
                    setActiveCollectionName(col.name);
                    setSearchFilter('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="font-mono">{col.name}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {col.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900">
                db.{activeCollection.name}.find()
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                {filteredData.length} document(s) returned
              </span>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter document fields..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950 overflow-y-auto max-h-[600px] text-xs font-mono text-slate-200 leading-relaxed space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-slate-500 text-center py-8 font-sans">
                No documents match the current filter query.
              </div>
            ) : (
              filteredData.map((doc: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto shadow-2xs"
                >
                  <div className="text-slate-500 text-[10px] pb-1 border-b border-slate-800 mb-2 flex items-center justify-between">
                    <span>Document #{idx + 1}</span>
                    <span className="text-slate-600">_id: {doc._id || doc.caseNumber || doc.dcnId}</span>
                  </div>
                  <pre className="text-emerald-400 text-[11px]">
                    {JSON.stringify(doc, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showSchemasModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-600" /> Production Mongoose Schemas Exporter
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete TypeScript Mongoose models ready to paste directly into your backend service.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySchemas}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => setShowSchemasModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 overflow-y-auto flex-1 text-xs font-mono text-slate-200 leading-relaxed">
              <pre className="text-blue-300">{getMongooseSchemasCode()}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
