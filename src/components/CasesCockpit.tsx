/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { Case, CareCategory } from '../types';
import {
  Search,
  Filter,
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
  const { cases, tasks, evidences, policies } = useClaimsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<number | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<CareCategory | 'ALL'>('ALL');

  // Quantitative KPIs
  const totalBilled = useMemo(
    () => cases.reduce((acc, c) => acc + c.financials.totalBilled, 0),
    [cases]
  );
  const activeReserves = useMemo(
    () => cases.reduce((acc, c) => acc + c.financials.preliminaryReserve, 0),
    [cases]
  );
  const missingDcnCount = useMemo(
    () => cases.filter((c) => c.missingDocumentTypes.length > 0).length,
    [cases]
  );
  const duplicateAlertsCount = useMemo(
    () => cases.filter((c) => c.tags.includes('Duplicate Alert') || c.status === 'IN_REVIEW').length,
    [cases]
  );

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.familyPolicyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = selectedStage === 'ALL' || c.currentStage === selectedStage;
      const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;

      return matchesSearch && matchesStage && matchesCat;
    });
  }, [cases, searchQuery, selectedStage, selectedCategory]);

  const getStageLabel = (stage: number) => {
    switch (stage) {
      case 1:
        return '01. Capture Request';
      case 2:
        return '02. Initial Review';
      case 3:
        return '03. Claim & Auth Evidence';
      case 4:
        return '04. Decision Stage';
      case 5:
        return '05. Closeout & Settlement';
      case 6:
        return '06. Closed & Archived';
      default:
        return `Stage ${stage}`;
    }
  };

  const getCategoryIcon = (category: CareCategory) => {
    switch (category) {
      case 'MEDICAL':
        return <HeartPulse className="w-3.5 h-3.5 text-blue-600" />;
      case 'PHARMACY':
      case 'PRESCRIPTION':
        return <Pill className="w-3.5 h-3.5 text-emerald-600" />;
      case 'BEHAVIORAL_HEALTH':
        return <Brain className="w-3.5 h-3.5 text-purple-600" />;
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
        return 'text-blue-700 bg-blue-50 border-blue-200';
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
    <div className="space-y-6">
      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Active Portfolio</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            ${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{cases.length}</span> active cases across 6 stages
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Preliminary Loss Reserve</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-950 mt-2">
            ${activeReserves.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Calculated allowable exposure
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>DCN Document Deficiencies</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-2">
            {missingDcnCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Stage 3 gating holds active
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Duplicate & SIU Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-900 mt-2">
            {duplicateAlertsCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Triage review required
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by case #, claim ID, member name, or policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter Controls (Functional segmented buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Care:
            </span>
            {(['ALL', 'MEDICAL', 'PHARMACY', 'PRESCRIPTION', 'BEHAVIORAL_HEALTH'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'All Care Lines' : cat.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        {/* Stage Filter Tabs (Functional segmented control) */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 mr-2 shrink-0">Stages:</span>
          {(['ALL', 1, 2, 3, 4, 5, 6] as const).map((stage) => {
            const label = stage === 'ALL' ? 'All Stages' : getStageLabel(stage);
            const count =
              stage === 'ALL'
                ? cases.length
                : cases.filter((c) => c.currentStage === stage).length;

            return (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  selectedStage === stage
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedStage === stage
                      ? 'bg-blue-800 text-blue-100'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* High-Density Case Records Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Case & Claim ID</th>
                <th className="py-3 px-4">Patient & Policy</th>
                <th className="py-3 px-4">Care Line</th>
                <th className="py-3 px-4">Current Stage Milestone</th>
                <th className="py-3 px-4">Workbasket & Priority</th>
                <th className="py-3 px-4 text-right">Billed / Reserve</th>
                <th className="py-3 px-4 text-right">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">No matching cases found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Adjust your search filters or initiate a new intake claim.
                    </p>
                    <button
                      onClick={onOpenNewCase}
                      className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      <Plus className="w-3.5 h-3.5" /> Intake Claim
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  return (
                    <tr
                      key={c._id}
                      onClick={() => onSelectCase(c._id)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      {/* Case & Claim ID */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 font-mono">
                          {c.caseNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-blue-700">{c.claimId}</span>
                          <span aria-hidden="true">·</span>
                          <span>{c.claimType === 'PRE_SERVICE' ? 'Pre-Auth' : 'Post-Service'}</span>
                        </div>
                      </td>

                      {/* Patient & Policy */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{c.patientName}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {c.familyPolicyNumber}
                        </div>
                      </td>

                      {/* Care Category */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          {getCategoryIcon(c.category)}
                          <span>{c.category.replace('_', ' ')}</span>
                        </div>
                      </td>

                      {/* Current Stage */}
                      <td className="py-3 px-4">
                        <div className="text-slate-900 font-medium">
                          {getStageLabel(c.currentStage)}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Stage {c.currentStage} of 6
                          {c.missingDocumentTypes.length > 0 && (
                            <span className="text-amber-600 font-medium ml-1">
                              (Deficiency Hold: {c.missingDocumentTypes.join(', ')})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Workbasket & Priority */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium truncate max-w-[150px]">
                          {c.assignedWorkbasket.replace('_', ' ')}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Priority:{' '}
                          <span
                            className={`font-semibold ${
                              c.priority === 'URGENT'
                                ? 'text-rose-600'
                                : c.priority === 'HIGH'
                                ? 'text-amber-600'
                                : 'text-slate-600'
                            }`}
                          >
                            {c.priority}
                          </span>
                        </div>
                      </td>

                      {/* Billed / Reserve */}
                      <td className="py-3 px-4 text-right font-mono">
                        <div className="font-semibold text-slate-900">
                          ${c.financials.totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Reserve: ${c.financials.preliminaryReserve.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusStyle(
                            c.status
                          )}`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {(() => {
                            const pendingTask = tasks.find(
                              (t) => t.caseId === c._id && t.status !== 'COMPLETED' && t.status !== 'RESOLVED'
                            );
                            if (pendingTask && onOpenTask) {
                              return (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenTask(pendingTask._id);
                                  }}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
                                  title={`Execute task ${pendingTask.taskId}`}
                                >
                                  Work on Task
                                </button>
                              );
                            }
                            return null;
                          })()}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCase(c._id);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Open Case Full Screen"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
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
