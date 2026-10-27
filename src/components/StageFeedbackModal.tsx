/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useClaimsStore } from '../store/claimsStore';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  FileCheck2,
  CreditCard,
  Stethoscope,
  ShieldAlert,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface StageFeedbackModalProps {
  onOpenTask?: (taskId: string) => void;
  onOpenCase?: (caseId: string) => void;
}

export const StageFeedbackModal: React.FC<StageFeedbackModalProps> = ({
  onOpenTask,
  onOpenCase,
}) => {
  const { lastStageFeedback, clearStageFeedback } = useClaimsStore();

  if (!lastStageFeedback) return null;

  const getStageName = (stageNum: number) => {
    switch (stageNum) {
      case 1:
        return '01. Ingestion';
      case 2:
        return '02. Eligibility';
      case 3:
        return '03. Evidence DCN';
      case 4:
        return '04. Clinical & SIU';
      case 5:
        return '05. Settlement';
      case 6:
        return '06. Sealed & Archived';
      default:
        return `Stage 0${stageNum}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden relative">
        {/* Glowing Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-600" />

        {/* Dismiss Button */}
        <button
          onClick={clearStageFeedback}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Header with Celebration Badge */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Active Milestone Completed
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {lastStageFeedback.caseNumber}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {lastStageFeedback.title}
              </h3>
            </div>
          </div>

          {/* 2-Step Stage Transition Visual */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Deterministic Stage Progression:
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">
                  {lastStageFeedback.fromStage}
                </div>
                <span className="font-medium line-through">
                  {getStageName(lastStageFeedback.fromStage)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-emerald-600">
                <span className="h-0.5 w-8 bg-emerald-500/60" />
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-emerald-200 dark:ring-emerald-800">
                  {lastStageFeedback.toStage}
                </div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {getStageName(lastStageFeedback.toStage)} (ACTIVE)
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-blue-50/50 dark:bg-blue-950/20 p-3.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
            {lastStageFeedback.summary}
          </div>

          {/* Details Pill Strip */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {lastStageFeedback.details?.reserve !== undefined && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">Preliminary Reserve:</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  ${lastStageFeedback.details.reserve.toFixed(2)}
                </span>
              </div>
            )}

            {lastStageFeedback.details?.netPayout !== undefined && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block">Authorized Net Payout:</span>
                <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  ${lastStageFeedback.details.netPayout.toFixed(2)}
                </span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Actor Signature:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {lastStageFeedback.actor.name}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Timestamp:</span>
              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 block">
                {lastStageFeedback.timestamp.slice(11, 19)} UTC
              </span>
            </div>
          </div>

          {/* Spawned Task Notice & Immediate CTA */}
          {lastStageFeedback.details?.newTaskId && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-semibold text-amber-900 dark:text-amber-200">
                    Next Milestone Task Spawned
                  </div>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 font-mono truncate max-w-xs">
                    {lastStageFeedback.details.newTaskId}: {lastStageFeedback.details.newTaskTitle}
                  </div>
                </div>
              </div>

              {onOpenTask && (
                <button
                  onClick={() => {
                    const tid = lastStageFeedback.details?.newTaskId;
                    clearStageFeedback();
                    if (tid) onOpenTask(tid);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-xs transition-colors cursor-pointer"
                >
                  Work on Task Now
                </button>
              )}
            </div>
          )}

          {/* Modal Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            {onOpenCase && (
              <button
                type="button"
                onClick={() => {
                  const cid = lastStageFeedback.caseId;
                  clearStageFeedback();
                  onOpenCase(cid);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                View Case in Full Screen
              </button>
            )}

            <button
              type="button"
              onClick={clearStageFeedback}
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Continue Working</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
