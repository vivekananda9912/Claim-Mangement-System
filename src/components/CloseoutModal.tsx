/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import {
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  FileCheck2,
  DollarSign,
  Receipt,
  Landmark,
  FileSpreadsheet,
} from 'lucide-react';

interface CloseoutModalProps {
  caseId: string;
  onClose: () => void;
  onCompleted?: () => void;
}

export const CloseoutModal: React.FC<CloseoutModalProps> = ({
  caseId,
  onClose,
  onCompleted,
}) => {
  const {
    getCaseById,
    getClaimForCase,
    policies,
    settleAndCloseCase,
    currentRole,
  } = useClaimsStore();

  const activeCase = getCaseById(caseId);
  const claim = getClaimForCase(caseId);
  const policy = activeCase ? policies.find((p) => p.policyNumber === activeCase.familyPolicyNumber) : null;

  const [paymentMethod, setPaymentMethod] = useState<'ELECTRONIC_FUNDS_TRANSFER' | 'CHECK_DISBURSEMENT' | 'VIRTUAL_CARD_SETTLEMENT' | 'EDI_835_REMITTANCE'>('ELECTRONIC_FUNDS_TRANSFER');
  const [authorizedAmount, setAuthorizedAmount] = useState<number>(activeCase?.financials.netPayout ?? 0);
  const [voucherNotes, setVoucherNotes] = useState(
    'Authorized in accordance with clinical necessity adjudication and fee schedule allowances.'
  );

  const [checkClinicalAffirmed, setCheckClinicalAffirmed] = useState(true);
  const [checkLedgerVerified, setCheckLedgerVerified] = useState(true);
  const [checkArchiveAgreed, setCheckArchiveAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeCase || !claim) return null;

  const allChecksAffirmed = checkClinicalAffirmed && checkLedgerVerified && checkArchiveAgreed;

  const handleExecuteCloseout = () => {
    setIsSubmitting(true);
    settleAndCloseCase({
      caseId: activeCase._id,
      authorizedAmount: Number(authorizedAmount),
      paymentMethod,
      voucherNotes,
    });
    setIsSubmitting(false);
    if (onCompleted) onCompleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col h-screen overflow-hidden font-sans animate-in fade-in duration-200">
      {/* Full Screen Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Stage 05 · Closeout & Settlement
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-xs font-bold text-slate-700">
              {activeCase.caseNumber}
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">
            Closeout Screen: Finalize Accounting & Authorize Case Resolution
          </h2>
          <p className="text-xs text-slate-500">
            Review adjudicated physician decisions, balance net financial allocations, and dispatch electronic payment voucher to transition this case to Stage 06: Resolved.
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Cancel and Return"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Scrollable Content Body */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6 text-xs">
          {/* Section 1: Adjudication Decision Recap */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Stethoscope className="w-4 h-4 text-purple-600" />
                Stage 04 Physician Adjudication Record
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  activeCase.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : activeCase.status === 'PARTIALLY_APPROVED'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                Decision: {activeCase.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Patient Name:</span>
                <span className="font-bold text-slate-900">{activeCase.patientName}</span>
                <div className="font-mono text-[10px] text-blue-700 font-semibold">
                  {activeCase.patientHcid || 'HCID-8492-1003-C'}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Provider / Facility:</span>
                <span className="font-bold text-slate-900">{claim.provider.name}</span>
                <div className="font-mono text-[10px] text-slate-500">NPI: {claim.provider.npi}</div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Service Category:</span>
                <span className="font-semibold text-slate-800">{activeCase.category.replace('_', ' ')}</span>
                <div className="text-[10px] text-slate-500">{claim.serviceDate}</div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Benefit Plan:</span>
                <span className="font-semibold text-slate-800">{policy?.planName}</span>
                <div className="font-mono text-[10px] text-slate-500">{activeCase.familyPolicyNumber}</div>
              </div>
            </div>

            {/* Itemized Line Ledger */}
            <div className="mt-2 border-t border-slate-200 pt-2">
              <span className="font-semibold text-slate-700 block mb-1.5 text-[11px]">
                Adjudicated Line Items ({claim.items.length} items):
              </span>
              <div className="space-y-1.5">
                {claim.items.map((it) => (
                  <div
                    key={it.itemId}
                    className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between gap-2 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-800">{it.code}</span>
                      <span className="text-slate-700 font-medium">{it.description}</span>
                      {it.clinicalDecision && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            it.clinicalDecision === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : it.clinicalDecision === 'MODIFIED'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {it.clinicalDecision}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400">Billed: ${it.billedAmount}</span>
                      <span className="text-slate-700 font-semibold">Allowable: ${it.allowableAmount}</span>
                      <span className="text-emerald-700 font-bold">Payout: ${it.eligiblePayout}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Financial Balance & Authorized Voucher Amount */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Receipt className="w-4 h-4 text-emerald-700" />
                Settlement Financial Accounting
              </h3>
              <span className="font-mono font-bold text-emerald-800 text-xs">
                Formula: Allowable - (Copay + Coinsurance)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                <span className="text-slate-500 block text-[11px]">Total Billed:</span>
                <span className="font-mono text-sm font-bold text-slate-800">
                  ${activeCase.financials.totalBilled.toFixed(2)}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                <span className="text-slate-500 block text-[11px]">Contracted Allowable:</span>
                <span className="font-mono text-sm font-bold text-slate-800">
                  ${activeCase.financials.allowableAmount.toFixed(2)}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                <span className="text-slate-500 block text-[11px]">Patient Responsibility:</span>
                <span className="font-mono text-sm font-bold text-amber-800">
                  ${activeCase.financials.patientResponsibility.toFixed(2)}
                </span>
                <div className="text-[10px] text-slate-500">
                  Copay: ${activeCase.financials.copayApplied} + Coins: ${activeCase.financials.coinsuranceApplied}
                </div>
              </div>

              <div className="p-2.5 bg-emerald-600 text-white rounded-lg shadow-2xs">
                <span className="text-emerald-100 block text-[11px] font-semibold">Net Insurer Payout:</span>
                <span className="font-mono text-base font-black">
                  ${activeCase.financials.netPayout.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="font-bold text-slate-800 block text-xs">
                  Authorized Settlement Voucher Payout ($):
                </label>
                <span className="text-slate-500 text-[11px]">
                  Confirm authorized electronic fund amount to release to payee.
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <input
                  type="number"
                  step="0.01"
                  value={authorizedAmount}
                  onChange={(e) => setAuthorizedAmount(parseFloat(e.target.value) || 0)}
                  className="font-mono font-bold text-sm px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-900 w-36 focus:outline-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Disbursement Rail & Memo */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Landmark className="w-4 h-4 text-blue-600" />
              Disbursement Clearinghouse Routing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: 'ELECTRONIC_FUNDS_TRANSFER',
                  title: 'Electronic Funds Transfer (EFT / ACH)',
                  desc: 'Direct clearinghouse ACH deposit to provider treasury routing.',
                },
                {
                  id: 'EDI_835_REMITTANCE',
                  title: 'EDI 835 Electronic Remittance Advice',
                  desc: 'HIPAA compliant electronic payment remittance batch delivery.',
                },
                {
                  id: 'VIRTUAL_CARD_SETTLEMENT',
                  title: 'Single-Use Virtual Card Rail',
                  desc: 'Immediate authorized virtual credit token for real-time merchant settlement.',
                },
                {
                  id: 'CHECK_DISBURSEMENT',
                  title: 'Automated Treasury Check Draft',
                  desc: 'Physical corporate draft printed and dispatched via secure mail.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                    paymentMethod === opt.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id as any)}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">{opt.title}</span>
                    <span className="text-[11px] text-slate-500">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                Remittance Advice Memo & Voucher Notes:
              </label>
              <textarea
                value={voucherNotes}
                onChange={(e) => setVoucherNotes(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500 focus:border-blue-500 bg-slate-50/50"
                placeholder="Enter final voucher audit notes..."
              />
            </div>
          </div>

          {/* Section 4: Process Owner Closeout Sign-off */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Stage 05 Process Owner Verification Checklist
            </span>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkClinicalAffirmed}
                  onChange={(e) => setCheckClinicalAffirmed(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 text-xs">
                  Physician adjudication review and CPT adjustments formally approved by Medical Director
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkLedgerVerified}
                  onChange={(e) => setCheckLedgerVerified(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 text-xs">
                  Deductible accumulations, coinsurance schedules, and provider allowances balanced against policy ledger
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkArchiveAgreed}
                  onChange={(e) => setCheckArchiveAgreed(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 text-xs">
                  Authorize payment voucher disbursement and transition case to <strong>Stage 06: Resolved</strong>
                </span>
              </label>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <footer className="sticky bottom-0 z-40 bg-white border-t border-slate-200 px-6 py-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          {allChecksAffirmed ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready to disburse voucher & resolve case.
            </span>
          ) : (
            <span className="text-amber-700 font-semibold">
              Please complete all 3 sign-off checkboxes to authorize resolution.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={!allChecksAffirmed || isSubmitting}
            onClick={handleExecuteCloseout}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer ${
              allChecksAffirmed && !isSubmitting
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-300 cursor-not-allowed opacity-60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Authorize Voucher & Resolve Case (Stage 06)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
