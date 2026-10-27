/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { CareCategory, ClaimType, DcnDocumentType } from '../types';
import {
  FilePlus2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Stethoscope,
  Upload,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

interface PolicyIntakeWizardProps {
  onCaseCreated: (caseId: string) => void;
  onCancel: () => void;
}

export const PolicyIntakeWizard: React.FC<PolicyIntakeWizardProps> = ({
  onCaseCreated,
  onCancel,
}) => {
  const { policies, customers, submitClaimCase, claims } = useClaimsStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Policy & Member Eligibility
  const [selectedPolicyNum, setSelectedPolicyNum] = useState<string>('FAM-98234-MED');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('MEM-002');
  const [claimType, setClaimType] = useState<ClaimType>('POST_SERVICE');
  const [category, setCategory] = useState<CareCategory>('MEDICAL');

  // Step 2: Claim Header & Procedure Items
  const [claimId, setClaimId] = useState<string>(`CLM-${Math.floor(10000 + Math.random() * 90000)}`);
  const [providerNpi, setProviderNpi] = useState<string>('1982736450');
  const [providerName, setProviderName] = useState<string>('Metropolitan Medical Center');
  const [serviceDate, setServiceDate] = useState<string>('2026-03-16');
  const [items, setItems] = useState<
    Array<{ code: string; description: string; billedAmount: number }>
  >([
    {
      code: 'CPT-29881',
      description: 'Knee Arthroscopy with meniscectomy',
      billedAmount: 4200.0,
    },
    {
      code: 'CPT-99223',
      description: 'Initial hospital facility care, high complexity',
      billedAmount: 1050.0,
    },
  ]);

  // Step 3: Evidence DCN
  const [evidenceDocType, setEvidenceDocType] = useState<DcnDocumentType>('SUPERBILL');
  const [evidenceFileName, setEvidenceFileName] = useState<string>('hospital_superbill_invoice.pdf');

  // Selected Policy & Family Data
  const policy = policies.find((p) => p.policyNumber === selectedPolicyNum);
  const customer = customers.find((c) => c.familyPolicyNumber === selectedPolicyNum);

  // Live duplicate check preview
  const isDuplicateId = claims.some((c) => c.claimId.toUpperCase() === claimId.toUpperCase());
  const isCompositeDuplicate = claims.some((c) => {
    const billedTotal = items.reduce((acc, i) => acc + i.billedAmount, 0);
    return (
      c.provider.npi === providerNpi &&
      c.serviceDate.slice(0, 10) === serviceDate.slice(0, 10) &&
      Math.abs(c.totalBilledAmount - billedTotal) < 1.0
    );
  });

  const addItemRow = () => {
    setItems([
      ...items,
      { code: 'CPT-99213', description: 'Office outpatient visit, moderate', billedAmount: 350.0 },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitClaimCase({
      familyPolicyNumber: selectedPolicyNum,
      patientMemberId: selectedMemberId,
      claimType,
      category,
      claimId,
      providerNpi,
      providerName,
      serviceDate,
      items,
      initialEvidenceDocType: evidenceDocType,
      initialEvidenceFileName: evidenceFileName,
    });

    if (result.success) {
      onCaseCreated(result.caseId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
      {/* Wizard Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FilePlus2 className="w-5 h-5 text-blue-600" />
            Claim Intake & Case Initialization Wizard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow the 3-step intake pipeline: Policy Eligibility, Itemized Procedure Intake, and DCN Evidence Minting.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === s
                  ? 'bg-blue-600 text-white font-bold'
                  : step > s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* STEP 1: POLICY & FAMILY ELIGIBILITY */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Family Master Policy
                </label>
                <select
                  value={selectedPolicyNum}
                  onChange={(e) => setSelectedPolicyNum(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  {policies.map((p) => (
                    <option key={p.policyNumber} value={p.policyNumber}>
                      {p.policyNumber} - {p.planName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enrolled Family Member (Patient)
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  {customer && (
                    <>
                      <option value={customer.primarySubscriber.memberId}>
                        {customer.primarySubscriber.firstName} {customer.primarySubscriber.lastName} (Primary) - {customer.primarySubscriber.memberId}
                      </option>
                      {customer.dependents.map((dep) => (
                        <option key={dep.memberId} value={dep.memberId}>
                          {dep.firstName} {dep.lastName} ({dep.relationship}) - {dep.memberId}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Claim Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClaimType('POST_SERVICE')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      claimType === 'POST_SERVICE'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Post-Service Reimbursement
                  </button>
                  <button
                    type="button"
                    onClick={() => setClaimType('PRE_SERVICE')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      claimType === 'PRE_SERVICE'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Pre-Service Prior Auth
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Care Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CareCategory)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <option value="MEDICAL">Medical (Inpatient / Outpatient)</option>
                  <option value="PHARMACY">Pharmacy (Retail / Specialty)</option>
                  <option value="PRESCRIPTION">Prescription Drug Benefit</option>
                  <option value="BEHAVIORAL_HEALTH">Behavioral Health & Psychiatry</option>
                </select>
              </div>
            </div>

            {/* Policy Verification Preview Banner */}
            {policy && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Policy Coverage Verified Active
                </div>
                <div className="text-emerald-800">
                  Plan: <strong>{policy.planName}</strong> · Valid:{' '}
                  {policy.effectiveDate.slice(0, 10)} to {policy.expirationDate.slice(0, 10)}
                </div>
                <div className="text-[11px] text-emerald-700 flex gap-4">
                  <span>
                    Family Deductible Met: <strong>${policy.financials.familyDeductibleMet}</strong> / ${policy.financials.familyDeductible}
                  </span>
                  <span>
                    Out-of-Pocket Met: <strong>${policy.financials.outOfPocketMet}</strong> / ${policy.financials.outOfPocketMax}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CLAIM ITEMS & DUPLICATE CHECK */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Claim ID</label>
                <input
                  type="text"
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Provider NPI
                </label>
                <input
                  type="text"
                  value={providerNpi}
                  onChange={(e) => setProviderNpi(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Date
                </label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institutional Provider Name
              </label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            {/* Live Duplicate Warning Preview */}
            {(isDuplicateId || isCompositeDuplicate) && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Duplicate Signature Detected</div>
                  <div>
                    {isDuplicateId
                      ? `Claim ID '${claimId}' already exists in active records. Ingestion will create an intake exception hold.`
                      : `Matching composite signature (Provider ${providerNpi} on ${serviceDate}). Will be routed to duplicate exception queue.`}
                  </div>
                </div>
              </div>
            )}

            {/* Procedure Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Itemized Service Procedure Lines
                </span>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Procedure Line
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
                  >
                    <div className="md:col-span-3">
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                        CPT / Procedure Code
                      </label>
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].code = e.target.value;
                          setItems(updated);
                        }}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded font-mono font-medium"
                      />
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                        Procedure Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].description = e.target.value;
                          setItems(updated);
                        }}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                        Billed Amount ($)
                      </label>
                      <input
                        type="number"
                        value={item.billedAmount}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].billedAmount = parseFloat(e.target.value) || 0;
                          setItems(updated);
                        }}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded font-mono font-medium"
                      />
                    </div>

                    <div className="md:col-span-1 text-right pt-4">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right text-xs text-slate-600 font-mono pt-2">
                Total Billed:{' '}
                <strong className="text-sm font-bold text-slate-900">
                  ${items.reduce((acc, i) => acc + i.billedAmount, 0).toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DCN EVIDENCE ATTACHMENT */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-800">
                Attach Initial Documentary Evidence & Mint DCN
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All attached clinical records receive an immutable Document Control Number (DCN) with legal traceability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Classification Type
                </label>
                <select
                  value={evidenceDocType}
                  onChange={(e) => setEvidenceDocType(e.target.value as DcnDocumentType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="SUPERBILL">Superbill / Inpatient Invoice</option>
                  <option value="CHART_NOTES">Operative Report / Clinical Chart</option>
                  <option value="PRIOR_AUTH_FORM">Prior Authorization Approval Form</option>
                  <option value="LAB_REPORT">Diagnostic Pathology / Lab Result</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document File Name
                </label>
                <input
                  type="text"
                  value={evidenceFileName}
                  onChange={(e) => setEvidenceFileName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200 text-xs space-y-1">
              <div className="font-bold text-blue-900">Automated Pipeline Actions on Submission:</div>
              <ul className="space-y-1 text-blue-800">
                <li>• Creates Case aggregate container at Stage 1 & 2</li>
                <li>• Executes exact Claim ID and composite fingerprint duplicate verification</li>
                <li>• Mints Document Control Number (DCN) with SHA-256 integrity hash</li>
                <li>• Spawns required deficiency tasks if high-cost items lack operative chart notes</li>
                <li>• Computes algorithmic Fraud Risk Score (0-100)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={step === 1 ? onCancel : () => setStep((s) => (s - 1) as any)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <span>Next: {step === 1 ? 'Procedure Lines' : 'Evidence DCN'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Claim & Initialize Case</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
