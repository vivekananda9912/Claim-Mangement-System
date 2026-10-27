/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import {
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface DoctorReviewWorkbenchProps {
  onSelectCase: (caseId: string) => void;
}

export const DoctorReviewWorkbench: React.FC<DoctorReviewWorkbenchProps> = ({ onSelectCase }) => {
  const { cases, claims, doctors, evidences, doctorAdjudicateClaim } = useClaimsStore();
  const [selectedDoctorId, setSelectedDoctorId] = useState('DOC-DR-CHEN');

  // Find cases currently in Clinical Review (Stage 4)
  const clinicalCases = cases.filter((c) => c.currentStage === 4);
  const activeDoc = doctors.find((d) => d.doctorId === selectedDoctorId);

  // Active reviewing case
  const [reviewCaseId, setReviewCaseId] = useState<string>(clinicalCases[0]?._id || '');
  const activeCase = cases.find((c) => c._id === reviewCaseId);
  const claim = claims.find((c) => c.caseId === reviewCaseId);
  const caseEvidences = evidences.filter((e) => e.caseId === reviewCaseId);

  // Adjudication form state
  const [overallDecision, setOverallDecision] = useState<'APPROVED' | 'PARTIALLY_APPROVED' | 'DENIED'>('APPROVED');
  const [doctorNotes, setDoctorNotes] = useState('Meets clinical coverage criteria and national medical necessity guidelines.');
  const [itemModifications, setItemModifications] = useState<
    Record<string, { decision: 'APPROVED' | 'MODIFIED' | 'DENIED'; modifiedCode: string; rationale: string }>
  >({});

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !claim) return;

    const itemDecisions = claim.items.map((item) => {
      const mod = itemModifications[item.itemId] || {
        decision: 'APPROVED',
        modifiedCode: '',
        rationale: 'Medically indicated per operative notes.',
      };
      return {
        itemId: item.itemId,
        clinicalDecision: mod.decision,
        modifiedCode: mod.modifiedCode || undefined,
        clinicalRationale: mod.rationale,
      };
    });

    doctorAdjudicateClaim({
      caseId: activeCase._id,
      decision: overallDecision,
      itemDecisions,
      doctorNotes,
    });

    alert(`Clinical review completed for ${activeCase.caseNumber}. Case advanced to Stage 5 Settlement.`);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header Profile */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            {activeDoc?.avatarInitials || 'MD'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{activeDoc?.name}</h2>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active Licensed Reviewer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specialty: <strong className="text-slate-700">{activeDoc?.specialty}</strong> · NPI:{' '}
              <span className="font-mono">{activeDoc?.npi}</span>
            </p>
          </div>
        </div>

        {/* Doctor Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Switch Reviewer Profile:</span>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium cursor-pointer"
          >
            {doctors.map((d) => (
              <option key={d.doctorId} value={d.doctorId}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {clinicalCases.length === 0 ? (
        <div className="bg-white p-12 border border-slate-200 rounded-xl text-center text-slate-500 shadow-2xs">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-slate-800">All Clinical Cases Adjudicated</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            There are currently no cases awaiting Stage 4 Doctor Clinical Adjudication.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pending Cases Queue */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pending Clinical Adjudication ({clinicalCases.length})
            </h3>

            <div className="space-y-2">
              {clinicalCases.map((c) => {
                const isSelected = c._id === reviewCaseId;
                return (
                  <div
                    key={c._id}
                    onClick={() => setReviewCaseId(c._id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">{c.caseNumber}</span>
                      <span className="font-mono text-emerald-700 font-semibold">
                        ${c.financials.totalBilled.toFixed(2)}
                      </span>
                    </div>
                    <div className="font-medium text-slate-800 mt-1">{c.patientName}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Clinical Adjudication Form */}
          {activeCase && claim ? (
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-2xs p-6 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-900">
                      {activeCase.caseNumber}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-blue-700">{claim.claimId}</span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-600 mt-1">
                    Patient: <strong>{activeCase.patientName}</strong> · Provider:{' '}
                    <strong>{claim.provider.name}</strong> (NPI: {claim.provider.npi})
                  </h4>
                </div>

                <button
                  onClick={() => onSelectCase(activeCase._id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <span>Open 360° Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Attached DCN Evidence Quick Inspect */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Attached Verified DCN Documentation:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {caseEvidences.map((evi) => (
                    <span
                      key={evi.dcnId}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono text-[11px] text-slate-800"
                    >
                      {evi.dcnId} ({evi.documentType}) - {evi.fileName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form: Procedure Line Decisions */}
              <form onSubmit={handleDecisionSubmit} className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    Procedure Necessity & Code Classification:
                  </h4>

                  <div className="space-y-3">
                    {claim.items.map((item) => {
                      const mod = itemModifications[item.itemId] || {
                        decision: 'APPROVED',
                        modifiedCode: '',
                        rationale: '',
                      };

                      return (
                        <div
                          key={item.itemId}
                          className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-900">
                              {item.code} - {item.description}
                            </span>
                            <span className="font-mono font-medium text-slate-700">
                              Billed: ${item.billedAmount.toFixed(2)} · Allowable: $
                              {item.allowableAmount.toFixed(2)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                                Line Decision
                              </label>
                              <select
                                value={mod.decision}
                                onChange={(e) => {
                                  setItemModifications({
                                    ...itemModifications,
                                    [item.itemId]: {
                                      ...mod,
                                      decision: e.target.value as any,
                                    },
                                  });
                                }}
                                className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                              >
                                <option value="APPROVED">Clinically Approved</option>
                                <option value="MODIFIED">Modify / Downgrade Code</option>
                                <option value="DENIED">Clinically Denied</option>
                              </select>
                            </div>

                            {mod.decision === 'MODIFIED' && (
                              <div>
                                <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                                  Reclassified Procedure Code
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. CPT-99222"
                                  value={mod.modifiedCode}
                                  onChange={(e) => {
                                    setItemModifications({
                                      ...itemModifications,
                                      [item.itemId]: {
                                        ...mod,
                                        modifiedCode: e.target.value,
                                      },
                                    });
                                  }}
                                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                                />
                              </div>
                            )}

                            <div className={mod.decision === 'MODIFIED' ? 'md:col-span-1' : 'md:col-span-2'}>
                              <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                                Clinical Rationale
                              </label>
                              <input
                                type="text"
                                placeholder="Medical rationale for approval/modification..."
                                value={mod.rationale}
                                onChange={(e) => {
                                  setItemModifications({
                                    ...itemModifications,
                                    [item.itemId]: {
                                      ...mod,
                                      rationale: e.target.value,
                                    },
                                  });
                                }}
                                className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Overall Decision & Doctor Notes */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Overall Adjudication Outcome
                      </label>
                      <select
                        value={overallDecision}
                        onChange={(e) => setOverallDecision(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                      >
                        <option value="APPROVED">Clinically Approved (Full Coverage)</option>
                        <option value="PARTIALLY_APPROVED">Partially Approved (Adjusted Lines)</option>
                        <option value="DENIED">Clinically Denied</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Physician Summary Justification
                      </label>
                      <input
                        type="text"
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Clinical Sign-Off & Lock Reserve (Advance to Stage 5)</span>
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
