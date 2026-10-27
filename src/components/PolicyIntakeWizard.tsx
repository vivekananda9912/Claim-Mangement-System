/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { CareCategory, ClaimType, DcnDocumentType, FamilyMember, Customer, Policy } from '../types';
import {
  Search,
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
  ShieldCheck,
  FileText,
  User,
  HeartPulse,
  Sparkles,
  ExternalLink,
  CreditCard,
  Layers,
  ChevronRight,
  Activity,
  FileCheck2,
} from 'lucide-react';

interface PolicyIntakeWizardProps {
  onCaseCreated: (caseId: string) => void;
  onCancel: () => void;
}

export const PolicyIntakeWizard: React.FC<PolicyIntakeWizardProps> = ({
  onCaseCreated,
  onCancel,
}) => {
  const { policies, customers, submitClaimCase, claims, searchMembersByHcid } = useClaimsStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Member HCID Service Search
  const [searchQuery, setSearchQuery] = useState<string>('HCID-8492-1001-A');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [serviceStatus, setServiceStatus] = useState<string>('Connected · Master Eligibility Directory (EDI 270/271)');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  // Step 2: Case Needed Details
  const [claimType, setClaimType] = useState<ClaimType>('POST_SERVICE');
  const [category, setCategory] = useState<CareCategory>('MEDICAL');
  const [claimId, setClaimId] = useState<string>(`CLM-${Math.floor(10000 + Math.random() * 90000)}`);
  const [providerNpi, setProviderNpi] = useState<string>('1982736450');
  const [providerName, setProviderName] = useState<string>('Metropolitan Surgical & Medical Center');
  const [serviceDate, setServiceDate] = useState<string>('2026-03-16');
  const [items, setItems] = useState<
    Array<{ code: string; description: string; billedAmount: number }>
  >([
    {
      code: 'CPT-29881',
      description: 'Knee Arthroscopy with meniscectomy (medial/lateral)',
      billedAmount: 4200.0,
    },
    {
      code: 'CPT-99223',
      description: 'Initial inpatient hospital facility care, high complexity',
      billedAmount: 1050.0,
    },
  ]);
  const [evidenceDocType, setEvidenceDocType] = useState<DcnDocumentType>('SUPERBILL');
  const [evidenceFileName, setEvidenceFileName] = useState<string>('superbill_invoice_metropolitan.pdf');

  // Created Case receipt
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
  const [createdCaseNumber, setCreatedCaseNumber] = useState<string | null>(null);

  // Execute Simulated Service Lookup
  // Execute Real / Simulated Service Lookup
  const executeServiceSearch = async (query: string) => {
    setIsSearching(true);
    setServiceStatus('Querying National Healthcare Eligibility Service (GET /v2/eligibility/subscribers)...');

    try {
      const res = await fetch(`/v2/eligibility/subscribers?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const payload = await res.json();
        if (payload?.data && payload.data.length > 0) {
          const match = payload.data[0];
          const household = match.household;
          const mappedCust: Customer = {
            _id: `cust-${household.familyHcid}`,
            familyPolicyNumber: household.familyPolicyNumber,
            familyHcid: household.familyHcid,
            primarySubscriber: {
              memberId: household.headOfHousehold.memberId,
              hcid: household.headOfHousehold.hcid,
              firstName: household.headOfHousehold.fullName.split(' ')[0],
              lastName: household.headOfHousehold.fullName.split(' ').slice(1).join(' ') || 'Subscriber',
              dob: match.dob,
              relationship: 'PRIMARY_SUBSCRIBER',
              gender: match.gender as any,
              coverageStatus: 'ACTIVE',
            },
            dependents: household.subscribers
              .filter((s: any) => s.relationship !== 'PRIMARY_SUBSCRIBER')
              .map((s: any) => ({
                memberId: s.memberId,
                hcid: s.hcid,
                firstName: s.firstName,
                lastName: s.lastName,
                dob: s.dob,
                relationship: s.relationship,
                gender: s.gender as any,
                coverageStatus: s.coverageStatus,
              })),
            contact: {
              email: 'verified@clearinghouse.nhic.gov',
              phone: '+1 (555) 234-8901',
              address: 'Verified Clearinghouse Registry Record',
            },
            createdAt: new Date().toISOString(),
          };

          setSelectedCustomer(mappedCust);
          const targetMem =
            mappedCust.primarySubscriber.hcid === match.hcid
              ? mappedCust.primarySubscriber
              : mappedCust.dependents.find((d) => d.hcid === match.hcid) ||
                (mappedCust.dependents.length > 0 ? mappedCust.dependents[0] : mappedCust.primarySubscriber);

          setSelectedMember(targetMem);
          const pol = policies.find((p) => p.policyNumber === household.familyPolicyNumber) || null;
          setSelectedPolicy(pol);
          setServiceStatus(
            `200 OK · NHIC Verified: Master Unit ${household.familyHcid} (${household.subscribers.length} covered subscribers)`
          );
          setIsSearching(false);
          return;
        }
      }
    } catch {
      // In case of network error, proceed to local memory fallback
    }

    // Local fallback
    const results = searchMembersByHcid(query);
    if (results.length > 0) {
      const cust = results[0];
      setSelectedCustomer(cust);
      const mem = cust.dependents.length > 0 ? cust.dependents[0] : cust.primarySubscriber;
      setSelectedMember(mem);
      const pol = policies.find((p) => p.policyNumber === cust.familyPolicyNumber) || null;
      setSelectedPolicy(pol);
      setServiceStatus(`200 OK · Found Master Unit ${cust.familyHcid} with ${cust.dependents.length + 1} subscribers`);
    } else {
      setSelectedCustomer(null);
      setSelectedMember(null);
      setSelectedPolicy(null);
      setServiceStatus('404 Not Found · No subscriber matched the HCID / Query');
    }
    setIsSearching(false);
  };

  // Initial lookup on mount
  useEffect(() => {
    executeServiceSearch('HCID-8492-1001-A');
  }, []);

  const handleMemberSelect = (cust: Customer, member: FamilyMember) => {
    setSelectedCustomer(cust);
    setSelectedMember(member);
    const pol = policies.find((p) => p.policyNumber === cust.familyPolicyNumber) || null;
    setSelectedPolicy(pol);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { code: 'CPT-99213', description: 'Office outpatient visit, moderate complexity', billedAmount: 350.0 },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedMember) return;

    const result = submitClaimCase({
      familyPolicyNumber: selectedCustomer.familyPolicyNumber,
      patientMemberId: selectedMember.memberId,
      patientHcid: selectedMember.hcid,
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
      setCreatedCaseId(result.caseId);
      setCreatedCaseNumber(result.caseNumber);
      setStep(4);
    }
  };

  const totalBilled = items.reduce((acc, i) => acc + i.billedAmount, 0);

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col font-sans">
      {/* Wizard Header Bar */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Stage 01 · Capture Request
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">Service Gateway v2.4</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Capture New Case Request & Member Eligibility
          </h2>
          <p className="text-xs text-slate-500">
            Realtime directory search by unique Healthcare ID (HCID), subscriber selection, case intake, and review.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Stepper Indicator */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between text-xs overflow-x-auto">
        {[
          { num: 1, title: 'Member & Policy Service' },
          { num: 2, title: 'Case Details & Billing' },
          { num: 3, title: 'Review Captured Request' },
          { num: 4, title: 'Confirmation Receipt' },
        ].map((s, idx) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : s.num}
                </div>
                <span
                  className={`font-semibold ${
                    isCurrent ? 'text-blue-900 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < 3 && <div className={`flex-1 h-0.5 mx-3 ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Contents */}
      <div className="p-6 md:p-8 flex-1">
        {/* ========================================================= */}
        {/* STEP 1: MEMBER ELIGIBILITY & HCID DIRECTORY SERVICE SEARCH */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Live Search Service Call Box */}
            <div className="p-5 bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/60 rounded-xl border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  National Healthcare ID (HCID) Eligibility Service Lookup
                </label>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                  API: GET /v2/eligibility/subscribers
                </span>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') executeServiceSearch(searchQuery);
                    }}
                    placeholder="Search by unique HCID (e.g. HCID-8492-1001-A), Member Name, or Policy Number..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => executeServiceSearch(searchQuery)}
                  disabled={isSearching}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {isSearching ? <span className="animate-spin">⟳</span> : <Search className="w-3.5 h-3.5" />}
                  <span>Call Lookup Service</span>
                </button>
              </div>

              {/* Quick Sample HCID Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="text-slate-500 font-medium">Sample Directory HCIDs:</span>
                {[
                  { label: 'HCID-8492-1001-A', note: 'Vance Family (4 members: Child, Spouse, Parent)' },
                  { label: 'HCID-4410-2001-A', note: 'Pendleton Family (4 members)' },
                  { label: 'HCID-7721-3001-A', note: 'Chen Family (4 members)' },
                ].map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      setSearchQuery(sample.label);
                      executeServiceSearch(sample.label);
                    }}
                    className="px-2.5 py-1 rounded bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 font-mono text-[10px] font-semibold transition-colors cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              {/* Service Status Indicator */}
              <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                <span className={`w-2 h-2 rounded-full ${isSearching ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                <span>{serviceStatus}</span>
              </div>
            </div>

            {/* SEARCH RESULTS: SUBSCRIBER GROUP TREE */}
            {selectedCustomer && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    Household Unit: <span className="font-mono">{selectedCustomer.familyHcid}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-600 font-semibold">
                    Policy: {selectedCustomer.familyPolicyNumber}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  Select the family member receiving treatment for this claim. Under this household:
                </div>

                {/* Grid of Subscribers (Primary, Spouse, Child, Parent) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Primary Subscriber */}
                  {[selectedCustomer.primarySubscriber, ...selectedCustomer.dependents].map((mem) => {
                    const isSelected = selectedMember?.memberId === mem.memberId;
                    return (
                      <button
                        key={mem.memberId}
                        type="button"
                        onClick={() => handleMemberSelect(selectedCustomer, mem)}
                        className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/30 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {mem.firstName[0]}
                              {mem.lastName[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {mem.firstName} {mem.lastName}
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${
                                  mem.relationship === 'PRIMARY_SUBSCRIBER'
                                    ? 'bg-blue-100 text-blue-800'
                                    : mem.relationship === 'SPOUSE'
                                    ? 'bg-purple-100 text-purple-800'
                                    : mem.relationship === 'CHILD'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {mem.relationship.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 space-y-1 text-xs font-mono">
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Unique HCID:</span>
                            <span className="font-bold text-slate-800">{mem.hcid}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Member ID:</span>
                            <span>{mem.memberId}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>DOB / Gender:</span>
                            <span>{mem.dob} ({mem.gender})</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* POLICY DETAILS PANEL OF SELECTED MEMBER */}
                {selectedPolicy && selectedMember && (
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Policy Details for Patient: {selectedMember.firstName} ({selectedMember.hcid})
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                          {selectedPolicy.planName}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {selectedPolicy.networkType} · ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <span className="text-slate-400 block text-[11px]">Annual Deductible:</span>
                        <span className="font-mono text-sm font-bold text-slate-900">
                          ${selectedPolicy.financials.familyDeductible.toFixed(2)}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Met: ${selectedPolicy.financials.familyDeductibleMet.toFixed(2)}
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <span className="text-slate-400 block text-[11px]">Out-of-Pocket Max:</span>
                        <span className="font-mono text-sm font-bold text-slate-900">
                          ${selectedPolicy.financials.outOfPocketMax.toFixed(2)}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Met: ${selectedPolicy.financials.outOfPocketMet.toFixed(2)}
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <span className="text-slate-400 block text-[11px]">Medical Copay / Coinsurance:</span>
                        <span className="font-mono text-sm font-bold text-slate-900">$35.00 / 20%</span>
                        <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">In-Network Tier 1</div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <span className="text-slate-400 block text-[11px]">Effective Term:</span>
                        <span className="font-mono text-xs font-bold text-slate-700">2026-01-01 to 2026-12-31</span>
                        <div className="text-[10px] text-slate-500 mt-0.5">Annual Calendar</div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span>Select Policy & Enter Case Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: CASE NEEDED DETAILS & ITEM PROCEDURE CODES        */}
        {/* ========================================================= */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className="space-y-6"
          >
            {/* Patient & Policy Banner */}
            {selectedMember && selectedPolicy && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-blue-700 font-semibold">Patient:</span>{' '}
                  <strong className="text-slate-900">{selectedMember.firstName} {selectedMember.lastName}</strong>{' '}
                  (<span className="font-mono text-blue-800">{selectedMember.hcid}</span>) · {selectedMember.relationship}
                </div>
                <div>
                  <span className="text-blue-700 font-semibold">Policy:</span>{' '}
                  <strong className="text-slate-900">{selectedPolicy.planName}</strong>
                </div>
              </div>
            )}

            {/* Case Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Claim Identifier</label>
                <input
                  type="text"
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Claim Type</label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value as ClaimType)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium"
                >
                  <option value="POST_SERVICE">Post-Service Standard Adjudication</option>
                  <option value="PRE_SERVICE">Pre-Service Prior Authorization Request</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Care Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CareCategory)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium"
                >
                  <option value="MEDICAL">Medical (Inpatient / Outpatient)</option>
                  <option value="PHARMACY">Pharmacy / Hospital Dispensed</option>
                  <option value="PRESCRIPTION">Prescription Drug (Retail/Mail)</option>
                  <option value="BEHAVIORAL_HEALTH">Behavioral Health & Therapy</option>
                </select>
              </div>
            </div>

            {/* Provider Information */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> Billing Facility & Provider NPI
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Provider NPI</label>
                  <input
                    type="text"
                    value={providerNpi}
                    onChange={(e) => setProviderNpi(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1">Facility Name</label>
                  <input
                    type="text"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Itemized Procedure Lines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Itemized CPT Procedure & Billing Lines
                </label>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Line Code
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
                  >
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Code (CPT / HCPCS)</label>
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].code = e.target.value;
                          setItems(updated);
                        }}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded font-mono text-xs font-bold"
                        required
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].description = e.target.value;
                          setItems(updated);
                        }}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Billed Amount ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.billedAmount}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].billedAmount = parseFloat(e.target.value) || 0;
                          setItems(updated);
                        }}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded font-mono text-xs text-right"
                        required
                      />
                    </div>
                    <div className="sm:col-span-1 text-right pt-4 sm:pt-0">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right text-xs font-semibold text-slate-700">
                Total Billed: <span className="font-mono font-bold text-sm text-slate-900">${totalBilled.toFixed(2)}</span>
              </div>
            </div>

            {/* Evidence Document */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <label className="block font-bold text-slate-800">Initial Documentary Evidence Attachment</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={evidenceDocType}
                  onChange={(e) => setEvidenceDocType(e.target.value as DcnDocumentType)}
                  className="p-2 bg-white border border-slate-300 rounded text-xs"
                >
                  <option value="SUPERBILL">Superbill / Inpatient Itemized Invoice</option>
                  <option value="CHART_NOTES">Operative Clinical Chart Notes</option>
                  <option value="PRIOR_AUTH_FORM">Prior Authorization Approval Form</option>
                  <option value="LAB_REPORT">Diagnostic Pathology / Lab Report</option>
                </select>
                <input
                  type="text"
                  value={evidenceFileName}
                  onChange={(e) => setEvidenceFileName(e.target.value)}
                  className="p-2 bg-white border border-slate-300 rounded text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Member Selection
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Request Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 3: REVIEW REQUEST MADE (PRE-SUBMISSION DOSSIER)     */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Review Capture Request Details
                </h3>
                <p className="text-xs text-slate-500">
                  Confirm all member, policy, provider, and billing lines prior to locking into Stage 02 Initial Review.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                Claim {claimId}
              </span>
            </div>

            {/* Dossier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Member & Policy Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Patient & Member Dossier
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <strong className="text-slate-900">{selectedMember?.firstName} {selectedMember?.lastName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unique Healthcare ID (HCID):</span>
                  <span className="font-mono font-bold text-blue-800">{selectedMember?.hcid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Household Relationship:</span>
                  <span className="font-semibold text-slate-700">{selectedMember?.relationship}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Policy Plan:</span>
                  <span className="font-semibold text-slate-900">{selectedPolicy?.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Policy Number:</span>
                  <span className="font-mono text-slate-800">{selectedCustomer?.familyPolicyNumber}</span>
                </div>
              </div>

              {/* Provider & Service Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Provider & Service Metadata
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider Name:</span>
                  <strong className="text-slate-900">{providerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider NPI:</span>
                  <span className="font-mono font-bold text-slate-800">{providerNpi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Date:</span>
                  <span className="font-mono text-slate-800">{serviceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Claim Category:</span>
                  <span className="font-semibold text-slate-800">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Initial Evidence Document:</span>
                  <span className="font-mono text-slate-700 truncate max-w-xs">{evidenceFileName}</span>
                </div>
              </div>
            </div>

            {/* Itemized Lines Review Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-slate-100 font-bold text-slate-800 flex justify-between items-center">
                <span>Itemized Billing Lines ({items.length} items)</span>
                <span className="font-mono text-sm">${totalBilled.toFixed(2)}</span>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-4">CPT Code</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4 text-right">Billed Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{item.code}</td>
                      <td className="py-2.5 px-4 text-slate-600">{item.description}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                        ${item.billedAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submission Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Edit Details
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Request & Advance to Stage 02 (Initial Review)</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: CONFIRMATION RECEIPT RECEIPT                      */}
        {/* ========================================================= */}
        {step === 4 && (
          <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stage 01 Completed · Captured
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Case Request Captured Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                The case has been ingested into the append-only event store and routed to{' '}
                <strong className="text-slate-800">Stage 02: Initial Review</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Case Number:</span>
                <span className="font-bold text-blue-700">{createdCaseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient HCID:</span>
                <span className="font-bold text-slate-800">{selectedMember?.hcid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Queue:</span>
                <span className="font-semibold text-slate-700">Intake & Triage Workbasket</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Next Action:</span>
                <span className="text-amber-700 font-bold">Open Review Screen (Stage 02)</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
              {createdCaseId && (
                <button
                  type="button"
                  onClick={() => onCaseCreated(createdCaseId)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Open Case in Stage 02 Initial Review
                </button>
              )}
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
