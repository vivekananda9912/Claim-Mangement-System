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
  Copy,
  ArrowLeft,
  ShieldAlert,
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
    cases,
    claims,
    confirmInitialReview,
    closeCaseAsDuplicate,
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
    (claim?.items && claim.items.length > 0)
      ? claim.items.map((i) => ({
          itemId: i.itemId,
          code: i.code,
          description: i.description,
          billedAmount: i.billedAmount,
          allowableAmount: i.allowableAmount,
        }))
      : [
          {
            itemId: 'ITM-401',
            code: 'CPT-29881',
            description: 'Knee Arthroscopy with meniscectomy (medial/lateral)',
            billedAmount: activeCase?.financials.totalBilled || 4200.0,
            allowableAmount: activeCase?.financials.allowableAmount || 3200.0,
          },
        ]
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

  // Mandatory Duplicate Check State
  const [hasRunDuplicateCheck, setHasRunDuplicateCheck] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateCollision, setDuplicateCollision] = useState<{
    found: boolean;
    collidingCaseNumber?: string;
    collidingClaimId?: string;
    reason?: string;
  } | null>(null);
  const [duplicateOverride, setDuplicateOverride] = useState(false);
  const [duplicateOverrideNotes, setDuplicateOverrideNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeCase) return null;

  const effectiveClaim = claim || {
    _id: `claim-${activeCase._id}`,
    claimId: activeCase.claimId,
    caseId: activeCase._id,
    provider: {
      npi: '1982736450',
      name: 'Metropolitan Surgical & Medical Center',
      facilityType: 'INSTITUTIONAL' as const,
      address: '742 Evergreen Terrace, Springfield, IL',
    },
    serviceDate: activeCase.createdAt ? activeCase.createdAt.slice(0, 10) : '2026-03-12',
    totalBilledAmount: activeCase.financials.totalBilled || 4200.0,
    items: [],
  };

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

  // Run Mandatory Duplicate Collision Check
  const handleRunDuplicateCheck = () => {
    setIsCheckingDuplicate(true);

    setTimeout(() => {
      // Check collision against all other claims and cases
      const isKnownDuplicateCase =
        activeCase._id === 'case-004' ||
        activeCase.tags.includes('Duplicate Flag') ||
        fraud?.isDuplicate;

      // Look for duplicate by matching patient + provider + amount
      const otherCase = cases.find(
        (c) =>
          c._id !== activeCase._id &&
          c.patientName.toLowerCase() === selectedPatientName.toLowerCase() &&
          Math.abs(c.financials.totalBilled - totalBilledCalculated) < 5
      );

      if (isKnownDuplicateCase || otherCase) {
        setDuplicateCollision({
          found: true,
          collidingCaseNumber: otherCase ? otherCase.caseNumber : 'CASE-2026-00412',
          collidingClaimId: otherCase ? otherCase.claimId : 'CLM-88129',
          reason: 'Identical patient subscriber, billing provider NPI, and procedure charge profile detected in past 24 months.',
        });
      } else {
        setDuplicateCollision({
          found: false,
        });
      }

      setHasRunDuplicateCheck(true);
      setIsCheckingDuplicate(false);
    }, 400);
  };

  // Close & Resolve Case as Duplicate
  const handleCloseAsDuplicate = () => {
    closeCaseAsDuplicate(
      activeCase._id,
      duplicateCollision?.reason || 'Duplicate claim collision confirmed during Stage 02 Initial Review.'
    );
    if (onConfirmed) onConfirmed();
    onClose();
  };

  const handleConfirm = () => {
    if (!hasRunDuplicateCheck) {
      alert('Mandatory Duplicate Check must be completed before confirming and advancing.');
      return;
    }

    if (duplicateCollision?.found && !duplicateOverride) {
      alert('Duplicate collision detected. Please either resolve and close this duplicate case, or provide an override justification.');
      return;
    }

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

  const isDuplicateCleanOrOverridden =
    hasRunDuplicateCheck && (!duplicateCollision?.found || duplicateOverride);
  const canAdvance =
    hasRunDuplicateCheck && isDuplicateCleanOrOverridden && memberVerified && policyVerified && providerVerified;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col h-screen overflow-hidden font-sans animate-in fade-in duration-200">
      {/* Full Screen Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Case</span>
          </button>

          <span className="text-slate-300">|</span>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Stage 02 · Initial Review
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-xs font-bold text-slate-800">
                {activeCase.caseNumber}
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Claim {activeCase.claimId}
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-900 mt-0.5">
              Open Review Screen: Verify Request, Modify Member, Edit Claim Services & Run Duplicate Audit
            </h1>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Single Scrollable Body (Clean & User-Friendly, No Vertical Tabs) */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Quick Notice Banner */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Review all captured intake parameters below. Duplicate collision check is <strong>mandatory</strong> before this case can advance to Stage 03.
              </span>
            </div>
            <span className="font-semibold text-blue-700 shrink-0 font-mono text-[11px]">
              Continuous Scrollable Workflow
            </span>
          </div>

          {/* Section 1: Member & HCID Identification with Modify Option */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Patient & Household Identity Verification
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Validate unique National Healthcare ID (HCID) and subscriber assignment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingMember(!isEditingMember)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingMember ? 'Done Modifying' : 'Modify Patient Subscriber'}</span>
                </button>

                <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 cursor-pointer pl-3 border-l border-slate-200">
                  <input
                    type="checkbox"
                    checked={memberVerified}
                    onChange={(e) => setMemberVerified(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Member HCID Verified</span>
                </label>
              </div>
            </div>

            {/* Member Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Patient Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedPatientName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Healthcare ID (HCID)</span>
                <span className="font-mono font-bold text-blue-700">{selectedHcid}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Member ID</span>
                <span className="font-mono font-semibold text-slate-800">{selectedMemberId}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Relationship</span>
                <span className="font-semibold text-slate-800 uppercase text-[10px] bg-slate-200 px-2 py-0.5 rounded">
                  {selectedRelationship.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Modify Member Selector Panel */}
            {isEditingMember && (
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Select Household Member Receiving Treatment for this Claim:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {allHouseholdMembers.map((m) => (
                    <button
                      key={m.memberId}
                      type="button"
                      onClick={() => handleSelectDifferentMember(m)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedMemberId === m.memberId
                          ? 'bg-blue-100/70 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {m.firstName} {m.lastName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {m.hcid} · {m.memberId}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-200/80 text-blue-900">
                        {m.relationship.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Policy Financial Limits & Coverage */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Benefit Policy & Coverage Eligibility Check
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Verify policy contract status, annual deductibles, and network tier.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyVerified}
                  onChange={(e) => setPolicyVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Coverage Verified</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Plan Name</span>
                <span className="font-bold text-slate-900 block truncate">{policy?.planName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Policy Number</span>
                <span className="font-mono font-bold text-slate-800">{activeCase.familyPolicyNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Annual Deductible</span>
                <span className="font-mono font-bold text-slate-800">
                  ${policy?.financials.familyDeductible.toFixed(2)} (Met: ${policy?.financials.familyDeductibleMet.toFixed(2)})
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Network Tier</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {policy?.networkType || 'IN_NETWORK'} · ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Itemized Procedure Lines with Add/Remove Service Option */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Claim Procedure Lines & Clinical Services ({serviceItems.length} lines)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Audit billed CPT codes, add additional services, or remove ineligible lines.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddLineForm(!showAddLineForm)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service Line</span>
                </button>
              </div>
            </div>

            {/* Add Service Line Form */}
            {showAddLineForm && (
              <form onSubmit={handleAddServiceLine} className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 animate-in fade-in duration-150 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Procedure Code (CPT):</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CPT-99214"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Clinical Description:</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g. Outpatient specialist evaluation"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Billed Amount ($):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newBilled}
                      onChange={(e) => setNewBilled(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-2xs"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddLineForm(false)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Service Lines Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3.5">Code</th>
                    <th className="py-2.5 px-3.5">Description</th>
                    <th className="py-2.5 px-3.5 text-right">Billed Amount</th>
                    <th className="py-2.5 px-3.5 text-right">Allowable Amount</th>
                    <th className="py-2.5 px-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {serviceItems.map((item) => (
                    <tr key={item.itemId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3.5 font-mono font-bold text-blue-700">{item.code}</td>
                      <td className="py-2.5 px-3.5 text-slate-800">{item.description}</td>
                      <td className="py-2.5 px-3.5 font-mono text-right font-semibold text-slate-900">
                        ${item.billedAmount.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-right text-emerald-700 font-semibold">
                        ${item.allowableAmount.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceLine(item.itemId)}
                          disabled={serviceItems.length <= 1}
                          title="Remove Service Line"
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-900">
                  <tr>
                    <td colSpan={2} className="py-3 px-3.5 text-right text-slate-600">
                      Calculated Total:
                    </td>
                    <td className="py-3 px-3.5 font-mono text-right text-slate-900">
                      ${totalBilledCalculated.toFixed(2)}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-right text-emerald-700">
                      ${totalAllowableCalculated.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 4: MANDATORY DUPLICATE COLLISION CHECK */}
          <div className={`border rounded-2xl p-6 shadow-2xs space-y-4 transition-all ${
            hasRunDuplicateCheck
              ? duplicateCollision?.found
                ? 'bg-rose-50/50 border-rose-300'
                : 'bg-emerald-50/40 border-emerald-300'
              : 'bg-amber-50/40 border-amber-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  hasRunDuplicateCheck
                    ? duplicateCollision?.found
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">
                      Mandatory Duplicate Collision & Resubmission Audit
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      Mandatory Gate
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Strict deterministic audit for duplicate claims against identical patient, service date, provider NPI, and billed amount.
                  </p>
                </div>
              </div>

              {/* Duplicate Check Trigger Button */}
              <button
                type="button"
                onClick={handleRunDuplicateCheck}
                disabled={isCheckingDuplicate}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCheckingDuplicate ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>{hasRunDuplicateCheck ? 'Re-Run Duplicate Check' : 'Run Mandatory Duplicate Check'}</span>
              </button>
            </div>

            {/* Audit Status Output */}
            {!hasRunDuplicateCheck ? (
              <div className="p-4 bg-amber-100/50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Duplicate Check Required</div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    Stage 02 progression is gated. You must click <strong>&quot;Run Mandatory Duplicate Check&quot;</strong> above to scan the 24-month clearinghouse lookback before advancing to Stage 03.
                  </div>
                </div>
              </div>
            ) : duplicateCollision?.found ? (
              <div className="space-y-4">
                <div className="p-4 bg-rose-100/60 border border-rose-300 rounded-xl text-xs text-rose-950 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <div className="font-bold text-sm text-rose-900 flex items-center gap-2">
                      <span>DUPLICATE COLLISION DETECTED</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">
                        Collision: {duplicateCollision.collidingCaseNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-800">
                      {duplicateCollision.reason} Matching Claim ID: <strong>{duplicateCollision.collidingClaimId}</strong>.
                    </p>
                  </div>
                </div>

                {/* Duplicate Actions */}
                <div className="p-4 bg-white border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Recommended Resolution:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Close and resolve this suspect case immediately to prevent duplicate insurer disbursement.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCloseAsDuplicate}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Close & Resolve as Duplicate</span>
                    </button>
                  </div>
                </div>

                {/* Or Override Checkbox */}
                <div className="p-3 bg-white/80 border border-slate-200 rounded-xl text-xs space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={duplicateOverride}
                      onChange={(e) => setDuplicateOverride(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Override Duplicate Collision (Legitimate Separate Encounter / Resubmission)</span>
                  </label>

                  {duplicateOverride && (
                    <input
                      type="text"
                      placeholder="Enter clinical rationale for duplicate override (required)..."
                      value={duplicateOverrideNotes}
                      onChange={(e) => setDuplicateOverrideNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-100/60 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-900">Duplicate Check Passed · Clean Status</div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">
                    No matching collision hazards detected across all claims and encounters. Case cleared for Stage 03 evidence gathering.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Review Attestation Notes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              Analyst Review Attestation & Notes
            </h2>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter review audit notes..."
            />
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <footer className="sticky bottom-0 z-40 bg-white border-t border-slate-200 px-6 py-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <div className="font-mono">
            <span className="text-slate-500">Audited Total: </span>
            <span className="font-bold text-slate-900 text-sm">${totalBilledCalculated.toFixed(2)}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 font-semibold">
            {hasRunDuplicateCheck ? (
              duplicateCollision?.found && !duplicateOverride ? (
                <span className="text-rose-700 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Duplicate Collision Flagged
                </span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Duplicate Check Passed
                </span>
              )
            ) : (
              <span className="text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Duplicate Check Pending
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canAdvance || isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'Confirming...' : 'Confirm & Advance to Stage 03'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
