/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { Case, CareCategory, CaseStatus, PriorityLevel, ClaimType, WorkbasketId } from '../types';
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
  Stethoscope,
  Lock,
  Copy,
  RotateCcw,
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
  const { cases, tasks, currentRole } = useClaimsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [patientFilter, setPatientFilter] = useState('');
  const [selectedStage, setSelectedStage] = useState<number | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<CareCategory | 'ALL'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | 'ALL'>('ALL');
  const [selectedWorkbasket, setSelectedWorkbasket] = useState<WorkbasketId | 'ALL'>('ALL');
  const [selectedClaimType, setSelectedClaimType] = useState<ClaimType | 'ALL'>('ALL');

  const isDoctor = currentRole === 'DOCTOR_APPROVER';

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (patientFilter.trim() ? 1 : 0) +
    (selectedStage !== 'ALL' ? 1 : 0) +
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (selectedPriority !== 'ALL' ? 1 : 0) +
    (selectedStatus !== 'ALL' ? 1 : 0) +
    (selectedWorkbasket !== 'ALL' ? 1 : 0) +
    (selectedClaimType !== 'ALL' ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setPatientFilter('');
    setSelectedStage('ALL');
    setSelectedCategory('ALL');
    setSelectedPriority('ALL');
    setSelectedStatus('ALL');
    setSelectedWorkbasket('ALL');
    setSelectedClaimType('ALL');
  };

  // Filtered clinical tasks for Doctor Global Search
  const filteredDoctorTasks = useMemo(() => {
    return tasks.filter((t) => {
      const isDocTask = t.taskType === 'DOCTOR_CLINICAL_REVIEW' || t.workbasket === 'CLINICAL_REVIEW';
      if (!isDocTask) return false;

      const q = searchQuery.toLowerCase().trim();
      const pq = patientFilter.toLowerCase().trim();
      const c = cases.find((cs) => cs._id === t.caseId);

      const matchesSearch =
        !q ||
        t.taskId.toLowerCase().includes(q) ||
        t.caseNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.status && t.status.toLowerCase().includes(q)) ||
        (c && (c.claimId.toLowerCase().includes(q) || c.familyPolicyNumber.toLowerCase().includes(q)));

      const matchesPatient =
        !pq ||
        (c && (
          c.patientName.toLowerCase().includes(pq) ||
          (c.patientHcid && c.patientHcid.toLowerCase().includes(pq)) ||
          c.patientMemberId.toLowerCase().includes(pq)
        ));

      const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;

      return matchesSearch && matchesPatient && matchesPriority && matchesStatus;
    });
  }, [tasks, cases, searchQuery, patientFilter, selectedPriority, selectedStatus]);

  // Comprehensive multi-field filtered cases for Analyst Workbasket Queue
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const pq = patientFilter.toLowerCase().trim();

      const matchesSearch =
        !q ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.claimId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.familyPolicyNumber.toLowerCase().includes(q);

      const matchesPatient =
        !pq ||
        c.patientName.toLowerCase().includes(pq) ||
        (c.patientHcid && c.patientHcid.toLowerCase().includes(pq)) ||
        c.patientMemberId.toLowerCase().includes(pq);

      const matchesStage = selectedStage === 'ALL' || c.currentStage === selectedStage;
      const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
      const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
      const matchesWorkbasket = selectedWorkbasket === 'ALL' || c.assignedWorkbasket === selectedWorkbasket;
      const matchesClaimType = selectedClaimType === 'ALL' || c.claimType === selectedClaimType;

      return (
        matchesSearch &&
        matchesPatient &&
        matchesStage &&
        matchesCat &&
        matchesPriority &&
        matchesStatus &&
        matchesWorkbasket &&
        matchesClaimType
      );
    });
  }, [
    cases,
    searchQuery,
    patientFilter,
    selectedStage,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    selectedWorkbasket,
    selectedClaimType,
  ]);

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
        return { label: '06. Resolved', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' };
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
      {/* Top Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isDoctor
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}
            >
              {isDoctor ? 'Physician Queue (Doctor Approver)' : 'Claims Workbasket (Analyst)'}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">
              Active Queue: {isDoctor ? filteredDoctorTasks.length : filteredCases.length} {isDoctor ? 'Tasks' : 'Cases'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {isDoctor ? 'Clinical Review Tasks' : 'Claims Operations & Triage Workbasket'}
          </h1>
          <p className="text-xs text-slate-500">
            {isDoctor
              ? 'Search and adjudicate pending clinical necessity tasks assigned for physician review.'
              : 'Search active claims portfolio, triage pending requests, or initiate intake for a new customer case.'}
          </p>
        </div>

        {/* Intake button: ONLY for Analyst, HIDDEN for Doctor */}
        {!isDoctor && (
          <button
            onClick={onOpenNewCase}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Intake New Case</span>
          </button>
        )}
      </div>

      {/* Comprehensive Multi-Field Filter Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        {/* Row 1: Global Keyword Search & Patient / HCID Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="filter-case-search"
              type="text"
              placeholder={
                isDoctor
                  ? 'Filter by Task ID, Case Number, Claim ID, or Title...'
                  : 'Filter by Case Number (e.g. CASE-2026-00412), Claim ID, or Title...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-200 font-sans transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="filter-patient-search"
              type="text"
              placeholder="Filter by Patient Name or Healthcare ID (e.g. HCID-8492-1001-A)..."
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-200 font-sans transition-all placeholder:text-slate-400"
            />
            {patientFilter && (
              <button
                type="button"
                onClick={() => setPatientFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Field Dropdowns & Reset Button */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Field Filters:</span>
          </div>

          {/* Stage Milestone Filter */}
          <select
            id="filter-stage"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Stage: All Stages</option>
            <option value="1">Stage 01: Capture Request</option>
            <option value="2">Stage 02: Initial Review</option>
            <option value="3">Stage 03: Claim & Auth Evidence</option>
            <option value="4">Stage 04: Decision Stage</option>
            <option value="5">Stage 05: Closeout & Settlement</option>
            <option value="6">Stage 06: Resolved</option>
          </select>

          {/* Care Category Filter */}
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Category: All</option>
            <option value="MEDICAL">Medical</option>
            <option value="PHARMACY">Pharmacy</option>
            <option value="PRESCRIPTION">Prescription</option>
            <option value="BEHAVIORAL_HEALTH">Behavioral Health</option>
          </select>

          {/* Priority Filter */}
          <select
            id="filter-priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Priority: All</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Case Status Filter */}
          <select
            id="filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="INTAKE_NEW">Intake New</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="PENDING_EVIDENCE">Pending Evidence</option>
            <option value="PENDING_CLINICAL">Pending Clinical</option>
            <option value="FRAUD_HOLD">Fraud Hold</option>
            <option value="APPROVED">Approved</option>
            <option value="SETTLED">Settled</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Workbasket Queue Filter */}
          {!isDoctor && (
            <select
              id="filter-workbasket"
              value={selectedWorkbasket}
              onChange={(e) => setSelectedWorkbasket(e.target.value as any)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Workbasket: All Queues</option>
              <option value="INTAKE_TRIAGE">Intake Triage</option>
              <option value="EVIDENCE_DEFICIENCY">Evidence Deficiency</option>
              <option value="CLINICAL_REVIEW">Clinical Review</option>
              <option value="FRAUD_SIU">Fraud SIU</option>
              <option value="SETTLEMENT_FINANCE">Settlement Finance</option>
            </select>
          )}

          {/* Claim Type Filter */}
          {!isDoctor && (
            <select
              id="filter-claim-type"
              value={selectedClaimType}
              onChange={(e) => setSelectedClaimType(e.target.value as any)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Type: All</option>
              <option value="POST_SERVICE">Post-Service</option>
              <option value="PRE_SERVICE">Pre-Service (Pre-Auth)</option>
            </select>
          )}

          {/* Reset Filters CTA if any filter is active */}
          {activeFilterCount > 0 && (
            <button
              id="filter-reset-all-btn"
              type="button"
              onClick={resetAllFilters}
              className="ml-auto py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reset Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {isDoctor ? (
        /* Doctor Global Search: ONLY Clinical Review Tasks */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Stethoscope className="w-4 h-4 text-purple-600" />
              <span>Assigned Clinical Tasks</span>
              <span className="text-[11px] font-normal text-slate-500">
                ({filteredDoctorTasks.length} tasks found)
              </span>
            </div>
            {searchQuery && (
              <span className="text-[11px] text-purple-700 font-mono">
                Filtered by: "{searchQuery}"
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-3 px-4">Task ID / Case #</th>
                  <th className="py-3 px-4">Patient & HCID</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-4">Priority & SLA</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDoctorTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <Stethoscope className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700 text-sm">No clinical tasks found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        There are no physician review tasks matching your search query.
                      </p>
                      {searchQuery && (
                        <div className="mt-4">
                          <button
                            onClick={() => setSearchQuery('')}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Clear Search
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredDoctorTasks.map((t) => {
                    const linkedCase = cases.find((c) => c._id === t.caseId);
                    const isResolvedTask =
                      t.status === 'COMPLETED' ||
                      t.status === 'RESOLVED' ||
                      linkedCase?.status === 'RESOLVED' ||
                      linkedCase?.status === 'CLOSED' ||
                      linkedCase?.currentStage === 6;
                    return (
                      <tr
                        key={t._id}
                        onClick={() => onOpenTask && onOpenTask(t._id)}
                        className="hover:bg-purple-50/40 cursor-pointer transition-colors"
                      >
                        {/* Task ID / Case # */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenTask) onOpenTask(t._id);
                            }}
                            className="font-bold text-purple-700 hover:underline font-mono text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>{t.taskId}</span>
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                          </button>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Case: <span className="font-semibold text-slate-700">{t.caseNumber}</span>
                            {linkedCase?.claimId && <span> · {linkedCase.claimId}</span>}
                          </div>
                        </td>

                        {/* Patient & HCID */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            {linkedCase?.patientName || 'Eleanor Vance'}
                          </div>
                          <div className="text-[11px] font-mono text-blue-700 font-semibold mt-0.5">
                            {linkedCase?.patientHcid || 'HCID-8492-1001-A'}
                          </div>
                        </td>

                        {/* Task Title */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{t.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {linkedCase?.category ? linkedCase.category.replace('_', ' ') : 'Clinical Review'} · Stage 0{t.stageNumber || 4}
                          </div>
                        </td>

                        {/* Priority & SLA */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              t.priority === 'URGENT'
                                ? 'bg-rose-100 text-rose-800'
                                : t.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {t.priority}
                          </span>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{t.slaHoursRemaining}h remaining</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              t.status === 'COMPLETED' || t.status === 'RESOLVED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : t.status === 'IN_PROGRESS'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-purple-50 text-purple-800 border-purple-200'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          {!isResolvedTask && onOpenTask ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenTask(t._id);
                              }}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ml-auto"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>Adjudicate</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Analyst Workbasket Table */
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
                    const isCaseResolved =
                      c.status === 'RESOLVED' ||
                      c.status === 'CLOSED' ||
                      c.currentStage === 6;
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
                          {c.tags.includes('Duplicate Checked & Resolved') && (
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs">
                                <Copy className="w-3 h-3 text-purple-700" />
                                <span>Duplicate Checked · Resolved</span>
                              </span>
                            </div>
                          )}
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
                          {!isCaseResolved ? (
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
                          ) : null}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
