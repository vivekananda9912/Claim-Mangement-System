/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { WORKBASKETS } from '../data/mockData';
import { WorkbasketId, TaskStatus } from '../types';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FileText,
  Stethoscope,
  CreditCard,
  User,
  Lock,
} from 'lucide-react';

interface WorkbasketsViewProps {
  onSelectCase: (caseId: string) => void;
  onOpenTask?: (taskId: string) => void;
}

export const WorkbasketsView: React.FC<WorkbasketsViewProps> = ({ onSelectCase, onOpenTask }) => {
  const { cases, tasks, updateTaskStatus, currentRole } = useClaimsStore();
  const [activeBasket, setActiveBasket] = useState<WorkbasketId>(
    currentRole === 'DOCTOR_APPROVER' ? 'CLINICAL_REVIEW' : 'INTAKE_TRIAGE'
  );
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');

  const filteredTasks = tasks.filter((t) => {
    const matchesBasket = t.workbasket === activeBasket;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesBasket && matchesStatus;
  });

  const getBasketIcon = (id: WorkbasketId) => {
    switch (id) {
      case 'INTAKE_TRIAGE':
        return <Inbox className="w-4 h-4 text-blue-600" />;
      case 'EVIDENCE_DEFICIENCY':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'CLINICAL_REVIEW':
        return <Stethoscope className="w-4 h-4 text-emerald-600" />;
      case 'FRAUD_SIU':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'SETTLEMENT_FINANCE':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Enterprise Workbaskets & Task Queues</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Role-governed task swimlanes coordinating the end-to-end claims lifecycle.
        </p>
      </div>

      {/* 5 Workbasket Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {WORKBASKETS.map((wb) => {
          const count = tasks.filter((t) => t.workbasket === wb.id && t.status !== 'COMPLETED').length;
          const isSelected = activeBasket === wb.id;

          return (
            <button
              key={wb.id}
              onClick={() => setActiveBasket(wb.id)}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                {getBasketIcon(wb.id)}
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                    count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count} open
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 mt-2 truncate">{wb.name}</div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">{wb.ownerRole}</div>
            </button>
          );
        })}
      </div>

      {/* Task Filter & Action Bar */}
      <div className="bg-white p-3.5 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Filter Status:</span>
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-slate-500 text-xs">
          Showing <strong>{filteredTasks.length}</strong> tasks in queue
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 border border-slate-200 rounded-lg text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold text-slate-800">Queue is clear</p>
            <p className="text-xs text-slate-400 mt-0.5">
              No tasks currently pending in the {activeBasket.replace('_', ' ')} basket.
            </p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const linkedCase = cases.find((c) => c._id === t.caseId);
            const isResolved =
              t.status === 'RESOLVED' ||
              t.status === 'COMPLETED' ||
              linkedCase?.status === 'RESOLVED' ||
              linkedCase?.status === 'CLOSED' ||
              linkedCase?.currentStage === 6;

            return (
              <div
                key={t._id}
                className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700">{t.taskId}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-xs font-semibold text-slate-900">
                    {t.caseNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${
                      t.priority === 'URGENT'
                        ? 'bg-rose-100 text-rose-800'
                        : t.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t.priority}
                  </span>
                  {t.taskType === 'DOCTOR_CLINICAL_REVIEW' && currentRole !== 'DOCTOR_APPROVER' && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-amber-700" /> Doctor Only (Analyst Read-Only)
                    </span>
                  )}
                </div>

                <div className="text-sm font-semibold text-slate-800">{t.title}</div>

                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    SLA: <strong className="text-slate-700">{t.slaHoursRemaining}h remaining</strong>
                  </span>
                  {t.requiredDocType && (
                    <>
                      <span>·</span>
                      <span className="text-amber-700 font-medium">
                        Target DCN: {t.requiredDocType}
                      </span>
                    </>
                  )}
                  {t.assignedTo && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        Assignee: {t.assignedTo.name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status & Case Routing Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!isResolved && (
                  t.taskType === 'DOCTOR_CLINICAL_REVIEW' && currentRole !== 'DOCTOR_APPROVER' ? (
                    <>
                      {onOpenTask && (
                        <button
                          onClick={() => onOpenTask(t._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                          title="Inspect Doctor Task in Read-Only Mode"
                        >
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>View Task (Read-Only)</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      )}
                      <div
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-500 cursor-not-allowed"
                        title="Only licensed physician can update Doctor Review status"
                      >
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>{t.status} (Doctor Only)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      {onOpenTask && (
                        <button
                          onClick={() => onOpenTask(t._id)}
                          className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          <span>Work on Task</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <select
                        value={t.status}
                        onChange={(e) => updateTaskStatus(t._id, e.target.value as any)}
                        className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded cursor-pointer"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="PENDING">PENDING</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="ESCALATED">ESCALATED</option>
                      </select>
                    </>
                  )
                )}

                <button
                  onClick={() => onSelectCase(t.caseId)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors cursor-pointer"
                >
                  <span>Case Details</span>
                </button>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
