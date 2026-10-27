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
} from 'lucide-react';

interface WorkbasketsViewProps {
  onSelectCase: (caseId: string) => void;
}

export const WorkbasketsView: React.FC<WorkbasketsViewProps> = ({ onSelectCase }) => {
  const { tasks, updateTaskStatus } = useClaimsStore();
  const [activeBasket, setActiveBasket] = useState<WorkbasketId>('INTAKE_TRIAGE');
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
          filteredTasks.map((t) => (
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

                <button
                  onClick={() => onSelectCase(t.caseId)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                >
                  <span>Open Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
