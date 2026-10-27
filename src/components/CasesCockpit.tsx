/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { Case, CareCategory } from '../types';
import {
  Search,
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  Clock,
  Layers,
  Activity,
  HeartPulse,
  Pill,
  Brain,
  Plus,
  X,
  User,
  Inbox,
  Filter,
} from 'lucide-react';

interface CasesCockpitProps {
  onSelectCase: (caseId: string) => void;
  onOpenNewCase: () => void;
  onOpenTask?: (taskId: string) => void;
}

export const CasesCockpit: React.FC<CasesCockpitProps> = ({
  onSelectCase,
  onOpenNewCase,
  onOpenTask,
}) => {
  const { cases, tasks } = useClaimsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<number | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<CareCategory | 'ALL'>('ALL');

  // Filtered cases for Analyst Workbasket
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.claimId.toLowerCase().includes(q) ||
        c.patientName.toLowerCase().includes(q) ||
        (c.patientHcid && c.patientHcid.toLowerCase().includes(q)) ||
        c.familyPolicyNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.assignedWorkbasket.toLowerCase().includes(q);

      const matchesStage = selectedStage === 'ALL' || c.currentStage === selectedStage;
      const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;

      return matchesSearch && matchesStage && matchesCat;
    });
  }, [cases, searchQuery, selectedStage, selectedCategory]);

  const getStageBadge = (stage: number) => {
    switch (stage) {
      case 1:
        return { label: '01. Capture Request', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 2:
        return { label: '02. Initial Review', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 3:
        return { label: '03. Claim & Auth Evidence', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 4:
        return { label: '04. Decision Stage (Doctor)', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 5:
        return { label: '05. Closeout & Settlement', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 6:
        return { label: '06. Closed & Archived', color: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: `Stage ${stage}`, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getStatusStyle = (status: Case['status']) => {
    switch (status) {
      case 'APPROVED':
      case 'SETTLED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'PENDING_EVIDENCE':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'PENDING_CLINICAL':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'IN_REVIEW':
      case 'FRAUD_HOLD':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'CLOSED':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header Bar with Prominent Intake Button */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              Analyst Workbasket (WB)
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">Active Queue: {filteredCases.length} Cases</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Claims Operations & Triage Workbasket
          </h1>
          <p className="text-xs text-slate-500">
            Search active claims portfolio, triage pending requests, or initiate intake for a new customer case.
          </p>
        </div>

        {/* Prominent Intake Action Button */}
        <button
          onClick={onOpenNewCase}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Intake New Case</span>
        </button>
      </div>

      {/* Global Case Search Box */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Global Search: Type Case ID (e.g. CASE-2026-0814), Claim ID, Patient Name, HCID (e.g. HCID-8492-1001-A), or Policy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 font-sans transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Analyst Workbasket (WB) Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Inbox className="w-4 h-4 text-blue-600" />
            <span>Active Workbasket Queue</span>
            <span className="text-[11px] font-normal text-slate-500">
              ({filteredCases.length} cases found)
            </span>
          </div>
          {searchQuery && (
            <span className="text-[11px] text-blue-700 font-mono">
              Filtered by: "{searchQuery}"
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <th className="py-3 px-4">Case # / Claim ID</th>
                <th className="py-3 px-4">Patient & HCID</th>
                <th className="py-3 px-4">Policy & Care Category</th>
                <th className="py-3 px-4">Current Stage Milestone</th>
                <th className="py-3 px-4 text-right">Billed Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Inbox className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No cases matched your search query</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try searching with a different term, or start an intake case below.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Clear Search
                        </button>
                      )}
                      <button
                        onClick={onOpenNewCase}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Intake New Case</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  const stageBadge = getStageBadge(c.currentStage);
                  return (
                    <tr
                      key={c._id}
                      onClick={() => onSelectCase(c._id)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      {/* Case & Claim ID */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(c._id);
                          }}
                          className="font-bold text-blue-600 hover:text-blue-800 hover:underline font-mono text-xs text-left cursor-pointer flex items-center gap-1 group"
                          title="Open case details"
                        >
                          <span>{c.caseNumber}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                        </button>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                          <span className="text-blue-700 font-semibold">{c.claimId}</span>
                          <span>·</span>
                          <span>{c.claimType === 'PRE_SERVICE' ? 'Pre-Auth' : 'Post-Service'}</span>
                        </div>
                      </td>

                      {/* Patient & HCID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{c.patientName}</div>
                        <div className="text-[11px] font-mono text-blue-700 font-semibold mt-0.5">
                          {c.patientHcid || 'HCID-8492-1001-A'}
                        </div>
                      </td>

                      {/* Policy & Care Line */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-700 text-[11px] font-semibold">
                          {c.familyPolicyNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {c.category.replace('_', ' ')}
                        </div>
                      </td>

                      {/* Current Stage Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${stageBadge.color}`}
                        >
                          {stageBadge.label}
                        </span>
                      </td>

                      {/* Financials */}
                      <td className="py-3 px-4 text-right font-mono">
                        <div className="font-bold text-slate-900">
                          ${c.financials.totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Net: ${c.financials.netPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(
                            c.status
                          )}`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Pick / Work Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(c._id);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                          <span>Pick Case</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
