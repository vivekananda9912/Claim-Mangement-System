/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { DcnDocumentType, DcnVerificationStatus } from '../types';
import {
  X,
  ShieldCheck,
  FileText,
  Stethoscope,
  ShieldAlert,
  History,
  CreditCard,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  User,
  Users,
  Check,
  AlertTriangle,
  Building2,
  FileCheck,
} from 'lucide-react';

interface CaseDetailViewProps {
  caseId: string;
  onClose: () => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseId, onClose }) => {
  const {
    getCaseById,
    getClaimForCase,
    getTasksForCase,
    getEvidencesForCase,
    getFraudAssessmentForCase,
    getEventsForCase,
    policies,
    customers,
    currentRole,
    uploadEvidence,
    verifyEvidence,
    updateTaskStatus,
    settleAndCloseCase,
    resolveDuplicateHold,
  } = useClaimsStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'claim_lines' | 'evidences' | 'tasks' | 'fraud' | 'events' | 'settlement'
  >('overview');

  // Form states
  const [newDocType, setNewDocType] = useState<DcnDocumentType>('CHART_NOTES');
  const [newFileName, setNewFileName] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [selectedEvidenceForVerify, setSelectedEvidenceForVerify] = useState<string | null>(null);

  const activeCase = getCaseById(caseId);
  const claim = getClaimForCase(caseId);
  const tasks = getTasksForCase(caseId);
  const evidences = getEvidencesForCase(caseId);
  const fraud = getFraudAssessmentForCase(caseId);
  const events = getEventsForCase(caseId);

  if (!activeCase) return null;

  const policy = policies.find((p) => p.policyNumber === activeCase.familyPolicyNumber);
  const customer = customers.find((c) => c.familyPolicyNumber === activeCase.familyPolicyNumber);

  const handleUploadDcn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;
    uploadEvidence({
      caseId: activeCase._id,
      documentType: newDocType,
      fileName: newFileName,
      fileSize: '1.8 MB',
      notes: 'Uploaded via enterprise case detail workspace.',
    });
    setNewFileName('');
    setShowUploadModal(false);
  };

  const handleVerifyDcn = (evidenceId: string, status: DcnVerificationStatus) => {
    verifyEvidence(evidenceId, status, verifyNotes || undefined);
    setSelectedEvidenceForVerify(null);
    setVerifyNotes('');
  };

  const stagesList = [
    { num: 1, label: '01. Ingestion' },
    { num: 2, label: '02. Eligibility' },
    { num: 3, label: '03. Evidence DCN' },
    { num: 4, label: '04. Clinical & SIU' },
    { num: 5, label: '05. Settlement' },
    { num: 6, label: '06. Archived' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-bold text-slate-900">
                {activeCase.caseNumber}
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Claim {activeCase.claimId}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-semibold border ${
                  activeCase.status === 'APPROVED' || activeCase.status === 'SETTLED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : activeCase.status === 'IN_REVIEW' || activeCase.status === 'FRAUD_HOLD'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {activeCase.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-800 mt-1">{activeCase.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6-Stage Progress Stepper Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs overflow-x-auto">
          {stagesList.map((st, idx) => {
            const isCompleted = activeCase.currentStage > st.num;
            const isCurrent = activeCase.currentStage === st.num;
            return (
              <React.Fragment key={st.num}>
                <div className="flex items-center gap-1.5 shrink-0 py-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : st.num}
                  </div>
                  <span
                    className={`font-medium ${
                      isCurrent
                        ? 'text-blue-900 font-semibold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
                {idx < stagesList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 min-w-4 ${
                      activeCase.currentStage > st.num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Policy', icon: Building2 },
            { id: 'claim_lines', label: `Claim Lines (${claim?.items.length || 0})`, icon: Stethoscope },
            { id: 'evidences', label: `Evidence Vault (${evidences.length})`, icon: FileText },
            { id: 'tasks', label: `Workbasket Tasks (${tasks.length})`, icon: Clock },
            { id: 'fraud', label: 'Duplicate & Fraud Risk', icon: ShieldAlert },
            { id: 'events', label: `Event Stream (${events.length})`, icon: History },
            { id: 'settlement', label: 'Settlement & Voucher', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-md shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: OVERVIEW & POLICY */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Family Subscriber & Patient Card */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" /> Family Subscriber Profile
                  </h3>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {activeCase.familyPolicyNumber}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400">Primary Policyholder:</span>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {customer?.primarySubscriber.firstName} {customer?.primarySubscriber.lastName}
                    </div>
                    <div className="text-slate-500">
                      Member ID: <span className="font-mono">{customer?.primarySubscriber.memberId}</span> · DOB: {customer?.primarySubscriber.dob}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-md border border-blue-100">
                    <span className="text-blue-800 font-semibold block mb-1">
                      Patient Receiving Service:
                    </span>
                    <div className="text-sm font-bold text-slate-900">
                      {activeCase.patientName}
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      Patient Member ID: <span className="font-mono font-semibold">{activeCase.patientMemberId}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Other Covered Dependents:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {customer?.dependents.map((dep) => (
                        <span
                          key={dep.memberId}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]"
                        >
                          {dep.firstName} ({dep.relationship}) - <span className="font-mono">{dep.memberId}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Financial Position */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Benefit Plan & Financial Limits
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {policy?.planName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <span className="text-slate-500">Annual Family Deductible:</span>
                    <div className="text-base font-bold font-mono text-slate-900 mt-1">
                      ${policy?.financials.familyDeductible.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Met to date: ${policy?.financials.familyDeductibleMet.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <span className="text-slate-500">Out-of-Pocket Maximum:</span>
                    <div className="text-base font-bold font-mono text-slate-900 mt-1">
                      ${policy?.financials.outOfPocketMax.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Met to date: ${policy?.financials.outOfPocketMet.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
                  <div className="font-semibold text-slate-700">Category Benefit Schedule:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {policy?.coverages.map((cov) => (
                      <div
                        key={cov.category}
                        className={`p-2 rounded border text-[11px] ${
                          cov.category === activeCase.category
                            ? 'bg-blue-50/70 border-blue-200 font-medium text-blue-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="font-semibold">{cov.category.replace('_', ' ')}</div>
                        <div className="mt-0.5">
                          Copay: ${cov.copay} · Coinsurance: {cov.coinsurancePct}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLAIM LINES & CLINICAL REVIEW */}
          {activeTab === 'claim_lines' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Itemized Clinical Billing Lines ({claim?.items.length} items)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Provider: {claim?.provider.name} (NPI: {claim?.provider.npi}) · Date of Service:{' '}
                    {claim?.serviceDate.slice(0, 10)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Total Billed:</span>
                  <div className="text-sm font-bold font-mono text-slate-900">
                    ${claim?.totalBilledAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-4">Line Code</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-right">Billed</th>
                    <th className="py-2.5 px-4 text-right">Allowable</th>
                    <th className="py-2.5 px-4 text-right">Copay / Coinsurance</th>
                    <th className="py-2.5 px-4 text-right">Est. Payout</th>
                    <th className="py-2.5 px-4 text-center">Clinical Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claim?.items.map((item) => (
                    <tr key={item.itemId} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {item.code}
                        {item.modifiedCode && (
                          <div className="text-[10px] text-amber-600 font-medium">
                            Modified from {item.code} to {item.modifiedCode}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.description}
                        {item.clinicalRationale && (
                          <div className="text-[11px] text-blue-700 mt-1 italic">
                            Dr. Rationale: "{item.clinicalRationale}"
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                        ${item.billedAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                        ${item.allowableAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${item.copay.toFixed(2)} / ${item.coinsurance.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        ${item.eligiblePayout.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            item.clinicalDecision === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.clinicalDecision === 'MODIFIED'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : item.clinicalDecision === 'DENIED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {item.clinicalDecision}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: DCN EVIDENCE VAULT */}
          {activeTab === 'evidences' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Document Control Numbers (DCN) Evidence Registry
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Legal documentary evidence attached to this case. Missing mandatory DCNs hold progression past Stage 3.
                  </p>
                </div>

                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" /> Mint New DCN
                </button>
              </div>

              {/* Upload Form Modal */}
              {showUploadModal && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg">
                  <form onSubmit={handleUploadDcn} className="space-y-3">
                    <div className="text-xs font-bold text-blue-900">Upload Evidence Document</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Document Type
                        </label>
                        <select
                          value={newDocType}
                          onChange={(e) => setNewDocType(e.target.value as DcnDocumentType)}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                        >
                          <option value="SUPERBILL">Superbill / Inpatient Invoice</option>
                          <option value="CHART_NOTES">Operative / Clinical Chart Notes</option>
                          <option value="PRIOR_AUTH_FORM">Prior Authorization Form</option>
                          <option value="LAB_REPORT">Pathology / Lab Results</option>
                          <option value="PRESCRIPTION_RECEIPT">Pharmacy Prescription Receipt</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-medium mb-1">File Name</label>
                        <input
                          type="text"
                          placeholder="e.g. operative_notes_dr_harris.pdf"
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                      >
                        Generate Legal DCN & Attach
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* DCN Evidence Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidences.map((evi) => (
                  <div
                    key={evi._id}
                    className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-blue-600" />
                          {evi.dcnId}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Type: <span className="font-semibold text-slate-700">{evi.documentType}</span> · {evi.fileSize}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          evi.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : evi.verificationStatus === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {evi.verificationStatus}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1">
                      <div>
                        File: <span className="font-medium text-slate-900">{evi.fileName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Channel: {evi.sourceChannel} · Uploaded by: {evi.uploadedBy}
                      </div>
                      {evi.notes && (
                        <div className="text-[11px] text-slate-700 italic border-t border-slate-200/60 pt-1 mt-1">
                          Auditor Notes: {evi.notes}
                        </div>
                      )}
                    </div>

                    {/* Verification Actions (For Process Owner) */}
                    {evi.verificationStatus === 'PENDING' && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Process Owner Review:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleVerifyDcn(evi._id || '', 'VERIFIED')}
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verify DCN
                          </button>
                          <button
                            onClick={() => handleVerifyDcn(evi._id || '', 'REJECTED')}
                            className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WORKBASKET TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Discrete operational tasks spawned under this Case aggregate. Completing milestone tasks updates the case stage.
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">{task.taskId}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-slate-900">{task.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            task.priority === 'URGENT'
                              ? 'bg-rose-100 text-rose-800'
                              : task.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                        <span>Workbasket: <strong className="text-slate-700">{task.workbasket}</strong></span>
                        <span>·</span>
                        <span>SLA Remaining: <strong>{task.slaHoursRemaining}h</strong></span>
                        {task.resolutionNotes && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 italic">Resolution: {task.resolutionNotes}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value as any)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded border cursor-pointer ${
                          task.status === 'COMPLETED' || task.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-slate-50 text-slate-700 border-slate-300'
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FRAUD & DUPLICATE RISK */}
          {activeTab === 'fraud' && (
            <div className="space-y-6">
              {/* Duplicate Check Warning Card if flagged */}
              {fraud?.isDuplicate && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 flex items-center gap-1.5 text-sm">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Duplicate Claim Collision Detected
                    </span>
                    <span className="font-mono text-rose-800 font-semibold">
                      Matching: {fraud.duplicateMatchCaseNumber}
                    </span>
                  </div>
                  <p className="text-rose-800">{fraud.duplicateMatchDetails}</p>

                  {/* Duplicate Override Action for Process Owner */}
                  <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                    <span className="text-rose-700">Triage Decision:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          resolveDuplicateHold(
                            activeCase._id,
                            true,
                            'Confirmed exact duplicate billing from hospital billing queue.'
                          )
                        }
                        className="px-3 py-1 bg-rose-700 text-white rounded text-xs font-semibold hover:bg-rose-800"
                      >
                        Confirm Duplicate & Reject Case
                      </button>
                      <button
                        onClick={() =>
                          resolveDuplicateHold(
                            activeCase._id,
                            false,
                            'Legitimate supplemental billing cleared by Process Owner.'
                          )
                        }
                        className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900"
                      >
                        Clear Duplicate Hold (Advance to DCN)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Heuristic Fraud Score Box */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Algorithmic Fraud & Anomaly Assessment
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Heuristic scoring based on unbundling, fee inflation, and frequency velocity.
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold font-mono ${
                        (fraud?.fraudScore || 0) >= 50
                          ? 'text-rose-600'
                          : (fraud?.fraudScore || 0) >= 25
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {fraud?.fraudScore || 0}/100
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Risk Level: {fraud?.riskLevel}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">
                      Evaluated Anomaly Indicators:
                    </span>
                    <ul className="space-y-1">
                      {fraud?.anomalyIndicators.map((ind, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-600">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {fraud?.flaggedRules && fraud.flaggedRules.length > 0 && (
                    <div className="p-3 bg-rose-50 rounded border border-rose-200">
                      <span className="font-bold text-rose-900 block mb-1">
                        Flagged Heuristic Rules:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {fraud.flaggedRules.map((rule) => (
                          <span
                            key={rule}
                            className="px-2 py-0.5 bg-rose-200 text-rose-900 rounded text-[10px] font-mono font-semibold"
                          >
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EVENT AUDIT STREAM */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Immutable, append-only event log. Zero in-place state overwrites; complete time-travel reconstruction.
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 my-4">
                {events.map((evt) => (
                  <div key={evt.sequence} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-[9px] font-bold text-blue-600">
                      {evt.sequence}
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-blue-800">{evt.eventType}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{evt.timestamp.slice(11, 19)} UTC</span>
                      </div>
                      <p className="text-xs text-slate-800">{evt.summary}</p>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span>Actor: <strong className="text-slate-700">{evt.actor.name}</strong> ({evt.actor.role})</span>
                        <span className="font-mono text-[10px] text-slate-400">{evt.eventId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SETTLEMENT & VOUCHER */}
          {activeTab === 'settlement' && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Financial Settlement & Loss Disbursement
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Stage 5 & 6 financial accounting based on documented allowable schedules and family deductible rules.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Net Insurer Disbursement:</span>
                  <div className="text-2xl font-bold font-mono text-emerald-700">
                    ${activeCase.financials.netPayout.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Settlement Mathematical Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500">Gross Billed Total:</span>
                  <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                    ${activeCase.financials.totalBilled.toFixed(2)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500">Preliminary Reserve:</span>
                  <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                    ${activeCase.financials.preliminaryReserve.toFixed(2)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500">Contracted Allowable:</span>
                  <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                    ${activeCase.financials.allowableAmount.toFixed(2)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500">Patient Responsibility:</span>
                  <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                    ${activeCase.financials.patientResponsibility.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Copay: ${activeCase.financials.copayApplied} + Coinsurance: ${activeCase.financials.coinsuranceApplied}
                  </div>
                </div>
              </div>

              {/* Final Settlement Action */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  {activeCase.currentStage === 6 ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Settlement Finalized & Voucher Disbursed. Case Sealed.
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Ready to execute electronic payment voucher to provider {claim?.provider.name}.
                    </span>
                  )}
                </div>

                {activeCase.currentStage < 6 && (
                  <button
                    onClick={() =>
                      settleAndCloseCase({
                        caseId: activeCase._id,
                        authorizedAmount: activeCase.financials.netPayout,
                        paymentMethod: 'ELECTRONIC_FUNDS_TRANSFER',
                        voucherNotes: 'Authorized in accordance with Gold PPO fee schedule.',
                      })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Authorize Voucher & Close Case (Stage 6)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
