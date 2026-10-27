/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { WORKBASKETS } from '../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const OperationsAnalytics: React.FC = () => {
  const { cases, tasks, events, claims } = useClaimsStore();

  const totalCases = cases.length;
  const approvedCases = cases.filter((c) => c.status === 'APPROVED' || c.status === 'SETTLED').length;
  const autoAdjudicationRate = totalCases > 0 ? Math.round((approvedCases / totalCases) * 100) : 0;

  const totalBilled = cases.reduce((acc, c) => acc + c.financials.totalBilled, 0);
  const totalSettled = cases.reduce((acc, c) => acc + c.financials.netPayout, 0);
  const lossRatio = totalBilled > 0 ? Math.round((totalSettled / totalBilled) * 100) : 0;

  // Stages distribution
  const stageCounts = [1, 2, 3, 4, 5, 6].map((s) => ({
    stage: s,
    count: cases.filter((c) => c.currentStage === s).length,
  }));

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Executive Operations & Quality Assurance Dashboard
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time measurement of cycle times, auto-adjudication efficiency, and SIU fraud risk indicators.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Auto-Adjudication Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
            {autoAdjudicationRate}%
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Target benchmark: &gt;65%</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Average Cycle Time</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            14.2 hrs
          </div>
          <div className="text-xs text-emerald-600 mt-0.5">↓ 3.8 hrs vs last quarter</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Loss Ratio (Settled / Billed)</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-900 mt-2">
            {lossRatio}%
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Actuarial standard range (68-75%)</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>SLA Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            96.8%
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Across all 5 operational workbaskets</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stage Distribution Visualizer */}
        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Active Case Flow by Stage (Stages 1 - 6)
          </h3>

          <div className="space-y-3">
            {[
              { stage: 1, label: '01. Policy & Ingestion', count: stageCounts[0].count },
              { stage: 2, label: '02. Policy & Eligibility', count: stageCounts[1].count },
              { stage: 3, label: '03. Evidence & DCN Audit', count: stageCounts[2].count },
              { stage: 4, label: '04. Clinical & Fraud Adjudication', count: stageCounts[3].count },
              { stage: 5, label: '05. Settlement & Disbursement', count: stageCounts[4].count },
              { stage: 6, label: '06. Closed & Archived', count: stageCounts[5].count },
            ].map((s) => {
              const pct = totalCases > 0 ? (s.count / totalCases) * 100 : 0;
              return (
                <div key={s.stage} className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{s.label}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {s.count} cases ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        s.stage === 6
                          ? 'bg-slate-400'
                          : s.stage === 3
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workbasket Queue Depths */}
        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Workbasket Operational Backlog
          </h3>

          <div className="space-y-3">
            {WORKBASKETS.map((wb) => {
              const openCount = tasks.filter((t) => t.workbasket === wb.id && t.status !== 'COMPLETED').length;
              return (
                <div
                  key={wb.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{wb.name}</div>
                    <div className="text-[11px] text-slate-500">{wb.ownerRole}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono text-sm font-bold ${
                        openCount > 2 ? 'text-amber-700' : 'text-slate-800'
                      }`}
                    >
                      {openCount} active tasks
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
