/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import {
  CheckCircle2,
  X,
  FileCheck2,
  Building2,
  User,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  AlertTriangle,
  Clock,
  Check,
} from 'lucide-react';

interface OpenReviewModalProps {
  caseId: string;
  onClose: () => void;
  onConfirmed?: () => void;
}

export const OpenReviewModal: React.FC<OpenReviewModalProps> = ({
  caseId,
  onClose,
  onConfirmed,
}) => {
  const {
    getCaseById,
    getClaimForCase,
    policies,
    customers,
    confirmInitialReview,
    getFraudAssessmentForCase,
  } = useClaimsStore();

  const [reviewNotes, setReviewNotes] = useState(
    'Member HCID eligibility confirmed in directory. Provider NPI active and in-network. Duplicate collision check passed.'
  );
  const [memberVerified, setMemberVerified] = useState(true);
  const [policyVerified, setPolicyVerified] = useState(true);
  const [providerVerified, setProviderVerified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCase = getCaseById(caseId);
  const claim = getClaimForCase(caseId);
  const policy = activeCase ? policies.find((p) => p.policyNumber === activeCase.familyPolicyNumber) : null;
  const customer = activeCase ? customers.find((c) => c.familyPolicyNumber === activeCase.familyPolicyNumber) : null;
  const fraud = activeCase ? getFraudAssessmentForCase(activeCase._id) : null;

  if (!activeCase || !claim) return null;

  // Find target patient member
  let targetMember = customer?.primarySubscriber;
  if (customer && customer.primarySubscriber.memberId !== activeCase.patientMemberId) {
    const dep = customer.dependents.find((d) => d.memberId === activeCase.patientMemberId);
    if (dep) targetMember = dep;
  }

  const handleConfirm = () => {
    setIsSubmitting(true);
    confirmInitialReview(activeCase._id, reviewNotes);
    setIsSubmitting(false);
    if (onConfirmed) onConfirmed();
    onClose();
  };

  const allChecklistPassed = memberVerified && policyVerified && providerVerified;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Stage 02 · Initial Review
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-xs font-bold text-slate-700">
                {activeCase.caseNumber}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Open-Review Screen: Verify Captured Request Details
            </h2>
            <p className="text-xs text-slate-500">
              Confirm patient HCID, coverage limits, provider credentials, and duplicate checks before adding claim & auth evidence.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Review Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Section 1: Member & HCID Identification */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <User className="w-4 h-4 text-blue-600" />
                Patient & Household Identity Verification
              </h3>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={memberVerified}
                  onChange={(e) => setMemberVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Member HCID Verified</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Patient Name:</span>
                <span className="font-bold text-slate-900 font-sans">{activeCase.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Healthcare ID (HCID):</span>
                <span className="font-bold text-blue-700">{activeCase.patientHcid || targetMember?.hcid || 'HCID-8492-1003-C'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Member ID:</span>
                <span className="font-semibold text-slate-800">{activeCase.patientMemberId}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Relationship:</span>
                <span className="font-semibold text-slate-800 font-sans">{targetMember?.relationship || 'DEPENDENT'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Policy Financial Limits */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Benefit Policy & Financial Coverage Check
              </h3>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyVerified}
                  onChange={(e) => setPolicyVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Coverage Verified</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 text-[10px] block">Plan Name:</span>
                <span className="font-bold text-slate-900 truncate block">{policy?.planName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Policy Number:</span>
                <span className="font-mono font-bold text-slate-800">{activeCase.familyPolicyNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Annual Deductible:</span>
                <span className="font-mono font-bold text-slate-800">
                  ${policy?.financials.familyDeductible.toFixed(2)} (Met: ${policy?.financials.familyDeductibleMet.toFixed(2)})
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Network Status:</span>
                <span className="font-semibold text-emerald-700">{policy?.networkType} · ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Section 3: Provider & Duplicate Collision Check */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Billing Provider & Duplicate Triage Audit
              </h3>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={providerVerified}
                  onChange={(e) => setProviderVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Provider & Clean Status Verified</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 text-[10px] block">Provider Name:</span>
                <span className="font-semibold text-slate-900">{claim.provider.name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Provider NPI:</span>
                <span className="font-mono font-bold text-slate-800">{claim.provider.npi}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Service Date:</span>
                <span className="font-mono text-slate-800">{claim.serviceDate.slice(0, 10)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Duplicate Check Status:</span>
                <span className={`font-semibold ${fraud?.isDuplicate ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {fraud?.isDuplicate ? 'COLLISION FLAGGED' : 'CLEAN (PASSED)'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Itemized Procedure Lines Summary */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-3 bg-slate-100 font-bold text-slate-800 flex justify-between items-center">
              <span>Captured Procedure Lines ({claim.items.length} items)</span>
              <span className="font-mono font-bold">${claim.totalBilledAmount.toFixed(2)}</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2 px-3">Code</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Billed Amount</th>
                  <th className="py-2 px-3 text-right">Allowable Est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claim.items.map((i) => (
                  <tr key={i.itemId}>
                    <td className="py-2 px-3 font-mono font-bold text-slate-800">{i.code}</td>
                    <td className="py-2 px-3 text-slate-600">{i.description}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">${i.billedAmount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-700 font-semibold">${i.allowableAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Review Auditor Remarks */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Initial Review Auditor Sign-Off Remarks:
            </label>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 font-sans"
              required
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Confirming advances case from Stage 02 to Stage 03 Claim & Auth Evidence.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              disabled={!allChecklistPassed || isSubmitting}
              onClick={handleConfirm}
              className={`px-5 py-2 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                allChecklistPassed
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Advance to Stage 03 (Claim & Auth Evidence)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
