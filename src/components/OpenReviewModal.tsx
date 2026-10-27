/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { CareCategory, FamilyMember } from '../types';
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
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Users,
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

  const activeCase = getCaseById(caseId);
  const claim = getClaimForCase(caseId);
  const policy = activeCase ? policies.find((p) => p.policyNumber === activeCase.familyPolicyNumber) : null;
  const customer = activeCase ? customers.find((c) => c.familyPolicyNumber === activeCase.familyPolicyNumber) : null;
  const fraud = activeCase ? getFraudAssessmentForCase(activeCase._id) : null;

  // Editable Member State
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(activeCase?.patientMemberId || '');
  const [selectedHcid, setSelectedHcid] = useState<string>(activeCase?.patientHcid || '');
  const [selectedPatientName, setSelectedPatientName] = useState<string>(activeCase?.patientName || '');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('PRIMARY_SUBSCRIBER');

  // Editable Services / Claim Lines State
  const [serviceItems, setServiceItems] = useState<
    Array<{ itemId: string; code: string; description: string; billedAmount: number; allowableAmount: number }>
  >(
    claim?.items.map((i) => ({
      itemId: i.itemId,
      code: i.code,
      description: i.description,
      billedAmount: i.billedAmount,
      allowableAmount: i.allowableAmount,
    })) || []
  );

  // New Service Line Input State
  const [newCode, setNewCode] = useState('CPT-99214');
  const [newDesc, setNewDesc] = useState('Office outpatient visit, detailed complexity');
  const [newBilled, setNewBilled] = useState(450.0);
  const [showAddLineForm, setShowAddLineForm] = useState(false);

  // Verification checklist
  const [reviewNotes, setReviewNotes] = useState(
    'Member HCID eligibility confirmed in directory. Provider NPI active and in-network. Claim services reviewed and audited.'
  );
  const [memberVerified, setMemberVerified] = useState(true);
  const [policyVerified, setPolicyVerified] = useState(true);
  const [providerVerified, setProviderVerified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeCase || !claim) return null;

  // All household members eligible for patient assignment
  const allHouseholdMembers: FamilyMember[] = customer
    ? [customer.primarySubscriber, ...(customer.dependents || [])]
    : [];

  const handleSelectDifferentMember = (m: FamilyMember) => {
    setSelectedMemberId(m.memberId);
    setSelectedHcid(m.hcid);
    setSelectedPatientName(`${m.firstName} ${m.lastName}`);
    setSelectedRelationship(m.relationship);
    setIsEditingMember(false);
  };

  const handleAddServiceLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || newBilled <= 0) return;

    const allowable = Math.min(newBilled, Math.round(newBilled * 0.75));
    const newItem = {
      itemId: `ITM-${Date.now().toString().slice(-4)}`,
      code: newCode,
      description: newDesc,
      billedAmount: Number(newBilled),
      allowableAmount: allowable,
    };

    setServiceItems([...serviceItems, newItem]);
    setNewCode('CPT-99213');
    setNewDesc('Office outpatient visit, moderate complexity');
    setNewBilled(320.0);
    setShowAddLineForm(false);
  };

  const handleRemoveServiceLine = (itemId: string) => {
    if (serviceItems.length <= 1) {
      alert('A claim must have at least one service line item.');
      return;
    }
    setServiceItems(serviceItems.filter((i) => i.itemId !== itemId));
  };

  const totalBilledCalculated = serviceItems.reduce((acc, i) => acc + i.billedAmount, 0);
  const totalAllowableCalculated = serviceItems.reduce((acc, i) => acc + i.allowableAmount, 0);

  const handleConfirm = () => {
    setIsSubmitting(true);
    confirmInitialReview(activeCase._id, reviewNotes, {
      patientMemberId: selectedMemberId,
      patientHcid: selectedHcid,
      patientName: selectedPatientName,
      items: serviceItems.map((i) => ({
        code: i.code,
        description: i.description,
        billedAmount: i.billedAmount,
        category: activeCase.category,
      })),
    });
    setIsSubmitting(false);
    if (onConfirmed) onConfirmed();
    onClose();
  };

  const allChecklistPassed = memberVerified && policyVerified && providerVerified;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
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
              Open-Review Screen: Verify Request, Modify Member & Edit Claim Services
            </h2>
            <p className="text-xs text-slate-500">
              Confirm or modify patient subscriber, edit/add/remove service lines, audit policy benefits, and advance to Stage 03.
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
          {/* Section 1: Member & HCID Identification with Modify Option */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <User className="w-4 h-4 text-blue-600" />
                  Patient & Household Identity Verification
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingMember(!isEditingMember)}
                  className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{isEditingMember ? 'Done Modifying' : 'Modify Member'}</span>
                </button>
              </div>

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

            {/* Member Card Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Patient Name:</span>
                <span className="font-bold text-slate-900 font-sans text-xs">{selectedPatientName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Healthcare ID (HCID):</span>
                <span className="font-bold text-blue-700">{selectedHcid}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Member ID:</span>
                <span className="font-semibold text-slate-800">{selectedMemberId}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Relationship:</span>
                <span className="font-semibold text-slate-800 font-sans uppercase text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">
                  {selectedRelationship.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Modify Member Picker Panel */}
            {isEditingMember && (
              <div className="mt-3 p-3 bg-white border border-blue-200 rounded-lg space-y-2 animate-in fade-in duration-150">
                <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Household Member Receiving Treatment for this Claim:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allHouseholdMembers.map((m) => (
                    <button
                      key={m.memberId}
                      type="button"
                      onClick={() => handleSelectDifferentMember(m)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedMemberId === m.memberId
                          ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-500'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {m.firstName} {m.lastName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {m.hcid} · {m.memberId}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {m.relationship.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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

          {/* Section 4: Itemized Procedure Lines with Add/Remove Service Option */}
          <div className="border border-slate-200 rounded-xl overflow-hidden space-y-0">
            <div className="p-3 bg-slate-100 font-bold text-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>Claim Procedure & Service Lines ({serviceItems.length} lines)</span>
                <button
                  type="button"
                  onClick={() => setShowAddLineForm(!showAddLineForm)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service Line</span>
                </button>
              </div>
              <div className="font-mono">
                <span className="text-slate-500 text-[11px] mr-2">Total Billed:</span>
                <span className="text-sm font-bold text-slate-900">${totalBilledCalculated.toFixed(2)}</span>
              </div>
            </div>

            {/* Add Service Line Form */}
            {showAddLineForm && (
              <form onSubmit={handleAddServiceLine} className="p-3 bg-blue-50/70 border-b border-blue-200 grid grid-cols-1 sm:grid-cols-4 gap-2 animate-in fade-in duration-150">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Procedure Code (CPT):</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CPT-99214"
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Clinical Description:</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g. Outpatient specialist evaluation"
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    required
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Billed Amount ($):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newBilled}
                      onChange={(e) => setNewBilled(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddLineForm(false)}
                    className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Line Items Table */}
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2 px-3">Code</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Billed Amount</th>
                  <th className="py-2 px-3 text-right">Allowable Est.</th>
                  <th className="py-2 px-3 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {serviceItems.map((i) => (
                  <tr key={i.itemId} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-mono font-bold text-slate-800">{i.code}</td>
                    <td className="py-2 px-3 text-slate-600">{i.description}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">${i.billedAmount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-700 font-semibold">${i.allowableAmount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceLine(i.itemId)}
                        title="Remove service line"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
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
            <span>Confirming automatically advances case to Stage 03 (Claim & Auth Evidence).</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
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
              <span>Confirm & Advance to Stage 03</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
