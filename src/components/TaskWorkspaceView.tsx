/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { TaskStatus, DcnDocumentType, DcnVerificationStatus } from '../types';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Stethoscope,
  FileText,
  Upload,
  CreditCard,
  ShieldAlert,
  UserCheck,
  Building2,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  Info,
  Check,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { OpenReviewModal } from './OpenReviewModal';
import { CloseoutModal } from './CloseoutModal';

interface TaskWorkspaceViewProps {
  taskId: string;
  onBack: () => void;
  onOpenCase: (caseId: string) => void;
}

export const TaskWorkspaceView: React.FC<TaskWorkspaceViewProps> = ({
  taskId,
  onBack,
  onOpenCase,
}) => {
  const {
    tasks,
    cases,
    claims,
    policies,
    customers,
    evidences,
    getFraudAssessmentForCase,
    currentRole,
    setRole,
    updateTaskStatus,
    uploadEvidence,
    verifyEvidence,
    doctorAdjudicateClaim,
    settleAndCloseCase,
    resolveDuplicateHold,
  } = useClaimsStore();

  const task = tasks.find((t) => t._id === taskId || t.taskId === taskId);
  const activeCase = task ? cases.find((c) => c._id === task.caseId) : null;
  const claim = task ? claims.find((c) => c.caseId === task.caseId) : null;
  const caseEvidences = task ? evidences.filter((e) => e.caseId === task.caseId) : [];
  const fraud = task ? getFraudAssessmentForCase(task.caseId) : null;
  const policy = activeCase ? policies.find((p) => p.policyNumber === activeCase.familyPolicyNumber) : null;
  const customer = activeCase ? customers.find((c) => c.familyPolicyNumber === activeCase.familyPolicyNumber) : null;

  // General task resolution notes
  const [resolutionNotes, setResolutionNotes] = useState(task?.resolutionNotes || '');
  const [generalStatus, setGeneralStatus] = useState<TaskStatus>(task?.status || 'IN_PROGRESS');

  // Doctor Review form state
  const [overallDecision, setOverallDecision] = useState<'APPROVED' | 'PARTIALLY_APPROVED' | 'DENIED'>('APPROVED');
  const [doctorNotes, setDoctorNotes] = useState('Meets clinical coverage criteria and national medical necessity guidelines.');
  const [itemModifications, setItemModifications] = useState<
    Record<string, { decision: 'APPROVED' | 'MODIFIED' | 'DENIED'; modifiedCode: string; rationale: string }>
  >({});

  // Evidence DCN form state
  const [docTypeToUpload, setDocTypeToUpload] = useState<DcnDocumentType>(task?.requiredDocType || 'CHART_NOTES');
  const [docFileName, setDocFileName] = useState('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Settlement payment form state
  const [paymentMethod, setPaymentMethod] = useState('ELECTRONIC_FUNDS_TRANSFER');
  const [voucherNotes, setVoucherNotes] = useState('Authorized in accordance with Gold PPO allowable fee schedule.');

  // Modal triggers
  const [showOpenReviewModal, setShowOpenReviewModal] = useState(false);
  const [showCloseoutModal, setShowCloseoutModal] = useState(false);

  if (!task || !activeCase) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl border border-slate-200 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Task Not Found</h2>
          <p className="text-xs text-slate-500">The requested task could not be loaded or may have been deleted.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
          >
            Return to Workbaskets
          </button>
        </div>
      </div>
    );
  }

  const isDoctorTask = task.taskType === 'DOCTOR_CLINICAL_REVIEW';
  const isDoctorRole = currentRole === 'DOCTOR_APPROVER';
  const isAnalystRestrictedOnDoctor = isDoctorTask && !isDoctorRole;

  // Doctor clinical review submission
  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim) return;

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
  };

  // Upload DCN
  const handleUploadDcn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFileName) return;

    const res = uploadEvidence({
      caseId: activeCase._id,
      documentType: docTypeToUpload,
      fileName: docFileName,
      fileSize: '2.4 MB',
      notes: `Uploaded in response to task ${task.taskId}`,
    });

    if (res.success) {
      setUploadSuccessMsg(`Minted DCN ${res.dcnId} successfully.`);
      setDocFileName('');
    }
  };

  // Verify DCN
  const handleVerifyDcn = (eviId: string, status: DcnVerificationStatus) => {
    verifyEvidence(eviId, status, `Verified via Task Workspace for ${task.taskId}`);
  };

  // Settle Case
  const handleSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    settleAndCloseCase({
      caseId: activeCase._id,
      authorizedAmount: activeCase.financials.netPayout,
      paymentMethod,
      voucherNotes,
    });
  };

  // Save General Task Updates
  const handleSaveGeneralTask = () => {
    updateTaskStatus(task._id, generalStatus, resolutionNotes || undefined);
    alert(`Task ${task.taskId} updated to ${generalStatus}.`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workbaskets</span>
          </button>

          <span className="text-slate-300">|</span>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Workbaskets</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">{task.workbasket}</span>
            <span>/</span>
            <span className="font-mono font-bold text-blue-700">{task.taskId}</span>
          </div>
        </div>

        {/* Target Case Jump Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCase(activeCase._id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Open Case {activeCase.caseNumber}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Task Header Dossier */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {task.taskId}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-700">
                Case {task.caseNumber}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  task.priority === 'URGENT'
                    ? 'bg-rose-100 text-rose-800'
                    : task.priority === 'HIGH'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {task.priority} Priority
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  task.status === 'COMPLETED' || task.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {task.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-lg font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>SLA: {task.slaHoursRemaining} Hours Remaining</span>
              </div>
            </div>
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{task.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div>
              Patient: <strong className="text-slate-800">{activeCase.patientName}</strong> (ID: {activeCase.patientMemberId})
            </div>
            <span>·</span>
            <div>
              Policy: <strong className="text-slate-800 font-mono">{activeCase.familyPolicyNumber}</strong> ({policy?.planName})
            </div>
            <span>·</span>
            <div>
              Stage: <strong className="text-slate-800">Stage 0{task.stageNumber} ({activeCase.stageName})</strong>
            </div>
            <span>·</span>
            <div>
              Workbasket: <strong className="text-slate-800">{task.workbasket}</strong>
            </div>
          </div>
        </div>

        {/* Grid Layout: Left Column Action Center, Right Column Case Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 7-COL: TASK EXECUTION CENTER */}
          <div className="lg:col-span-7 space-y-6">
            {/* ROLE RESTRICTION NOTICE IF ANALYST ON DOCTOR TASK */}
            {isAnalystRestrictedOnDoctor && (
              <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-900">
                      Physician Credential Required: Doctor Review Restricted
                    </h3>
                    <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                      You are signed in as an <strong>Analyst</strong> (Marcus Brody, CFE). Per clinical utilization governance, only licensed physicians (<span className="font-semibold">DOCTOR_APPROVER</span>) can adjudicate medical necessity, reclassify CPT procedure codes, and authorize preliminary reserves.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-lg border border-rose-200 flex items-center gap-2 text-xs text-rose-900 font-medium">
                  <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Licensed Physician sign-off required to adjudicate. Log out and sign in with doctor credentials (Dr. Sarah Chen, MD) to submit clinical decisions.</span>
                </div>
              </div>
            )}

            {/* DOCTOR TASK VIEW (ACCESSIBLE TO BOTH, READ-ONLY FOR ANALYST) */}
            {isDoctorTask && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Physician Clinical Adjudication Desk</h2>
                      <p className="text-[11px] text-slate-500">
                        {isDoctorRole
                          ? 'Review itemized billing against operative notes.'
                          : 'Analyst Read-Only Inspection Mode'}
                      </p>
                    </div>
                  </div>
                  {isDoctorRole ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Dr. Sarah Chen, MD (Authorized)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" /> Read-Only for Analyst
                    </span>
                  )}
                </div>

                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  {/* Itemized CPT decisions */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Itemized CPT Procedure Codes
                    </label>

                    {claim?.items.map((item) => {
                      const mod = itemModifications[item.itemId] || {
                        decision: item.clinicalDecision === 'PENDING' ? 'APPROVED' : item.clinicalDecision,
                        modifiedCode: item.modifiedCode || '',
                        rationale: item.clinicalRationale || '',
                      };

                      return (
                        <div
                          key={item.itemId}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-mono font-bold text-slate-900">{item.code}</span>
                              <span className="text-slate-400 mx-1.5">·</span>
                              <span className="text-slate-700 font-medium">{item.description}</span>
                            </div>
                            <span className="font-mono font-semibold text-slate-900">
                              Billed: ${item.billedAmount.toFixed(2)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5">Clinical Decision</label>
                              <select
                                value={mod.decision}
                                onChange={(e) =>
                                  setItemModifications({
                                    ...itemModifications,
                                    [item.itemId]: {
                                      ...mod,
                                      decision: e.target.value as any,
                                    },
                                  })
                                }
                                disabled={isAnalystRestrictedOnDoctor}
                                className={`w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-semibold ${
                                  isAnalystRestrictedOnDoctor ? 'cursor-not-allowed bg-slate-100 text-slate-500' : 'cursor-pointer'
                                }`}
                              >
                                <option value="APPROVED">APPROVE (Full Allowable)</option>
                                <option value="MODIFIED">MODIFY / DOWNCODE</option>
                                <option value="DENIED">DENY (Not Medically Indicated)</option>
                              </select>
                            </div>

                            {mod.decision === 'MODIFIED' && (
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-0.5">Alternative CPT Code</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 99213"
                                  value={mod.modifiedCode}
                                  onChange={(e) =>
                                    setItemModifications({
                                      ...itemModifications,
                                      [item.itemId]: {
                                        ...mod,
                                        modifiedCode: e.target.value,
                                      },
                                    })
                                  }
                                  disabled={isAnalystRestrictedOnDoctor}
                                  className={`w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono ${
                                    isAnalystRestrictedOnDoctor ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''
                                  }`}
                                />
                              </div>
                            )}

                            <div className={mod.decision === 'MODIFIED' ? 'sm:col-span-1' : 'sm:col-span-2'}>
                              <label className="block text-[10px] text-slate-500 mb-0.5">Clinical Rationale</label>
                              <input
                                type="text"
                                placeholder="Enter physician medical necessity justification"
                                value={mod.rationale}
                                onChange={(e) =>
                                  setItemModifications({
                                    ...itemModifications,
                                    [item.itemId]: {
                                      ...mod,
                                      rationale: e.target.value,
                                    },
                                  })
                                }
                                disabled={isAnalystRestrictedOnDoctor}
                                className={`w-full p-1.5 bg-white border border-slate-300 rounded text-xs ${
                                  isAnalystRestrictedOnDoctor ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Overall Decision & Doctor Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Overall Case Disposition</label>
                      <select
                        value={overallDecision}
                        onChange={(e) => setOverallDecision(e.target.value as any)}
                        disabled={isAnalystRestrictedOnDoctor}
                        className={`w-full p-2 bg-white border border-slate-300 rounded font-semibold text-xs ${
                          isAnalystRestrictedOnDoctor ? 'cursor-not-allowed bg-slate-100 text-slate-500' : 'cursor-pointer'
                        }`}
                      >
                        <option value="APPROVED">APPROVED (Authorize Normal Loss Reserve)</option>
                        <option value="PARTIALLY_APPROVED">PARTIALLY APPROVED (Modified Codes)</option>
                        <option value="DENIED">DENIED (Non-Covered / Medically Unnecessary)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preliminary Reserve Authorized</label>
                      <div className="p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900">
                        ${activeCase.financials.allowableAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Physician Attestation & Notes
                    </label>
                    <textarea
                      rows={3}
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      disabled={isAnalystRestrictedOnDoctor}
                      className={`w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 ${
                        isAnalystRestrictedOnDoctor ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''
                      }`}
                      required
                    />
                  </div>

                  {isDoctorRole ? (
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Clinical Adjudication & Advance to Stage 05 (Settlement)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 bg-slate-100 border border-slate-300 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Analyst Read-Only · Cannot Adjudicate Doctor Task</span>
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* EVIDENCE DEFICIENCY DCN RESOLUTION TASK */}
            {task.taskType === 'MISSING_DCN_RESOLUTION' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">DCN Evidence Minting & Verification</h2>
                      <p className="text-[11px] text-slate-500">
                        Upload missing legal documentation to advance from Stage 03 to Stage 04.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Deficiency Audit
                  </span>
                </div>

                {uploadSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{uploadSuccessMsg}</span>
                  </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handleUploadDcn} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    Mint New Document Control Number (DCN)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Document Category</label>
                      <select
                        value={docTypeToUpload}
                        onChange={(e) => setDocTypeToUpload(e.target.value as DcnDocumentType)}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                      >
                        <option value="CHART_NOTES">Operative & Clinical Chart Notes</option>
                        <option value="SUPERBILL">Superbill / Inpatient Invoice</option>
                        <option value="PRIOR_AUTH_FORM">Prior Authorization Approval Form</option>
                        <option value="LAB_REPORT">Diagnostic Pathology / Lab Report</option>
                        <option value="PRESCRIPTION_RECEIPT">Prescription Receipt & NDC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">File Name</label>
                      <input
                        type="text"
                        placeholder="e.g. chart_notes_dr_chen.pdf"
                        value={docFileName}
                        onChange={(e) => setDocFileName(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition-colors cursor-pointer"
                  >
                    Mint Legal DCN & Attach to Case
                  </button>
                </form>

                {/* Existing DCNs Verification */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-700">DCNs Attached to this Case:</h3>
                  {caseEvidences.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      No documents currently attached. Upload above to mint first DCN.
                    </div>
                  ) : (
                    caseEvidences.map((evi) => (
                      <div
                        key={evi._id}
                        className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                            {evi.dcnId} ({evi.documentType})
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {evi.fileName} · Status: <strong className="text-slate-700">{evi.verificationStatus}</strong>
                          </div>
                        </div>

                        {evi.verificationStatus === 'PENDING' ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleVerifyDcn(evi._id || '', 'VERIFIED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" /> Verify
                            </button>
                            <button
                              onClick={() => handleVerifyDcn(evi._id || '', 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              evi.verificationStatus === 'VERIFIED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {evi.verificationStatus}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* STAGE 02 INITIAL REVIEW / ELIGIBILITY TASK */}
            {(task.taskType === 'FAMILY_ELIGIBILITY_CHECK' || activeCase.currentStage === 2) && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Stage 02 Initial Review: Verify Captured Request Details</h2>
                      <p className="text-[11px] text-slate-500">
                        Confirm patient unique HCID, coverage limits, provider NPI, and duplicate checks before adding claim & auth evidence.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    Stage 02 Review
                  </span>
                </div>

                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-blue-900 block text-xs">Patient HCID Verification</span>
                    <span className="text-blue-800 text-[11px]">
                      {activeCase.patientName} · HCID: <strong className="font-mono">{activeCase.patientHcid || 'HCID-8492-1003-C'}</strong> · Member ID: {activeCase.patientMemberId}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowOpenReviewModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Launch Open-Review Screen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* DUPLICATE CHECK RESOLUTION TASK */}
            {task.taskType === 'DUPLICATE_CLAIM_CHECK' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Duplicate Claim Collision Resolution</h2>
                      <p className="text-[11px] text-slate-500">Stage 02 Duplicate Exception Triage</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                    Collision Hold
                  </span>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2">
                  <div className="font-bold text-rose-900">Conflicting Claim Details:</div>
                  <p className="text-rose-800">
                    Matching Case: <strong className="font-mono">{fraud?.duplicateMatchCaseNumber || 'CASE-2026-90421'}</strong>. Same provider NPI, same service date, and identical billed line codes.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() =>
                      resolveDuplicateHold(activeCase._id, true, 'Confirmed exact duplicate submission. Claim rejected.')
                    }
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Confirm Duplicate & Reject Case
                  </button>

                  <button
                    onClick={() =>
                      resolveDuplicateHold(
                        activeCase._id,
                        false,
                        'Legitimate supplemental submission verified by Process Owner.'
                      )
                    }
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Clear Duplicate Exception & Advance (Stage 03)
                  </button>
                </div>
              </div>
            )}

            {/* SETTLEMENT PAYMENT VOUCHER TASK */}
            {task.taskType === 'SETTLEMENT_PAYMENT' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Loss Disbursement & Voucher Execution</h2>
                      <p className="text-[11px] text-slate-500">Stage 05 Final Settlement Disbursement</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    Stage 05 Finance
                  </span>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900">Net Insurer Payment:</span>
                  <span className="font-mono text-xl font-bold text-emerald-700">
                    ${activeCase.financials.netPayout.toFixed(2)}
                  </span>
                </div>

                <form onSubmit={handleSettlementSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Disbursement Channel</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-semibold"
                    >
                      <option value="ELECTRONIC_FUNDS_TRANSFER">EFT 835 (Direct Deposit to Provider NPI)</option>
                      <option value="PAPER_CHECK">Corporate Check (USPS Priority)</option>
                      <option value="WIRE_TRANSFER">Fedwire Electronic Settlement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Voucher Accounting Notes</label>
                    <textarea
                      rows={2}
                      value={voucherNotes}
                      onChange={(e) => setVoucherNotes(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Authorize Electronic Voucher & Close Case (Stage 06)</span>
                  </button>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 text-xs">Want to audit full ledger before disbursing?</span>
                    <button
                      type="button"
                      onClick={() => setShowCloseoutModal(true)}
                      className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Launch Full Closeout Screen</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* General Task Status & Resolution Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Task Status & SLA Management
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1">Task Status</label>
                  <select
                    value={generalStatus}
                    disabled={isAnalystRestrictedOnDoctor}
                    onChange={(e) => setGeneralStatus(e.target.value as TaskStatus)}
                    className={`w-full p-2 bg-white border border-slate-300 rounded font-semibold text-xs ${
                      isAnalystRestrictedOnDoctor ? 'cursor-not-allowed bg-slate-100 text-slate-500' : 'cursor-pointer'
                    }`}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="PENDING">PENDING</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ESCALATED">ESCALATED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Resolution Notes</label>
                  <input
                    type="text"
                    placeholder="Enter audit remarks or actions taken"
                    value={resolutionNotes}
                    disabled={isAnalystRestrictedOnDoctor}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className={`w-full p-2 bg-white border border-slate-300 rounded text-xs ${
                      isAnalystRestrictedOnDoctor ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                {isAnalystRestrictedOnDoctor ? (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 bg-slate-200 text-slate-500 border border-slate-300 rounded-lg text-xs font-semibold cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Doctor Sign-Off Required</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveGeneralTask}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Save Task Updates
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 5-COL: CONTEXTUAL CASE & CLINICAL DOSSIER */}
          <div className="lg:col-span-5 space-y-5">
            {/* Policy & Patient Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" /> Policy & Family Subscriber
                </h3>
                <span className="font-mono text-xs font-semibold text-slate-700">
                  {activeCase.familyPolicyNumber}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Primary Subscriber:</span>
                  <div className="font-semibold text-slate-900">
                    {customer?.primarySubscriber.firstName} {customer?.primarySubscriber.lastName}
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg">
                  <span className="text-[11px] font-semibold text-blue-800 block">Patient for this Claim:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{activeCase.patientName}</div>
                  <div className="text-[11px] text-slate-600 font-mono">Member ID: {activeCase.patientMemberId}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                    <span className="text-slate-400 block">Annual Deductible:</span>
                    <strong className="text-slate-800 font-mono">${policy?.financials.familyDeductible.toFixed(2)}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                    <span className="text-slate-400 block">Deductible Met:</span>
                    <strong className="text-slate-800 font-mono">${policy?.financials.familyDeductibleMet.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2 text-xs">
              <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                Billing Provider Information
              </div>
              <div>
                <span className="text-slate-400">Provider Name:</span>
                <div className="font-semibold text-slate-900">{claim?.provider.name}</div>
              </div>
              <div>
                <span className="text-slate-400">National Provider Identifier (NPI):</span>
                <div className="font-mono font-semibold text-slate-800">{claim?.provider.npi}</div>
              </div>
              <div>
                <span className="text-slate-400">Facility Type:</span>
                <div className="text-slate-700">{claim?.provider.facilityType}</div>
              </div>
            </div>

            {/* Claim Financial Position */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Financial Accounting</span>
                <span className="font-mono text-emerald-700 font-bold">${claim?.totalBilledAmount.toFixed(2)}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Billed:</span>
                  <span className="font-mono font-semibold">${activeCase.financials.totalBilled.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Contracted Allowable:</span>
                  <span className="font-mono font-semibold">${activeCase.financials.allowableAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Copay Applied:</span>
                  <span className="font-mono">${activeCase.financials.copayApplied.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Coinsurance Applied:</span>
                  <span className="font-mono">${activeCase.financials.coinsuranceApplied.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold pt-2 border-t border-slate-100">
                  <span>Net Insurer Payout:</span>
                  <span className="font-mono text-sm">${activeCase.financials.netPayout.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showOpenReviewModal && (
        <OpenReviewModal
          caseId={activeCase._id}
          onClose={() => setShowOpenReviewModal(false)}
        />
      )}

      {showCloseoutModal && (
        <CloseoutModal
          caseId={activeCase._id}
          onClose={() => setShowCloseoutModal(false)}
        />
      )}
    </div>
  );
};
