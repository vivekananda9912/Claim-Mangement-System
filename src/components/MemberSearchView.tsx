/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { Customer, FamilyMember, Policy } from '../types';
import {
  Search,
  User,
  Users,
  ShieldCheck,
  FileCheck2,
  Calendar,
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  AlertCircle,
  Plus,
  HeartPulse,
  Sparkles,
  ArrowRight,
  RotateCcw,
  X,
} from 'lucide-react';

interface MemberSearchViewProps {
  onStartIntake?: (customer: Customer, member?: FamilyMember) => void;
  onSelectCase?: (caseId: string) => void;
}

export const MemberSearchView: React.FC<MemberSearchViewProps> = ({
  onStartIntake,
  onSelectCase,
}) => {
  const { customers, policies, cases, claims, currentRole } = useClaimsStore();
  const isDoctor = currentRole === 'DOCTOR_APPROVER';

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedCustomer, setMatchedCustomer] = useState<Customer | null>(null);
  const [matchedPolicy, setMatchedPolicy] = useState<Policy | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string>('');

  const executeSearch = async (targetQuery?: string) => {
    const q = (targetQuery !== undefined ? targetQuery : query).trim();
    if (!q) {
      setSearchFeedback('Please enter an HCID, Member Name, or Family Policy Number to search.');
      setHasSearched(true);
      setMatchedCustomer(null);
      setMatchedPolicy(null);
      return;
    }

    setIsSearching(true);
    setSearchFeedback('');

    // Try service API first
    try {
      const res = await fetch(`/v2/eligibility/subscribers?q=${encodeURIComponent(q)}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const payload = await res.json();
        if (payload?.data && payload.data.length > 0) {
          const match = payload.data[0];
          const household = match.household;
          // Locate customer in store or map from API
          const found = customers.find(
            (c) =>
              c.familyHcid === household.familyHcid ||
              c.familyPolicyNumber === household.familyPolicyNumber ||
              c.primarySubscriber.hcid.toLowerCase() === match.hcid.toLowerCase()
          );

          if (found) {
            setMatchedCustomer(found);
            setSelectedMember(found.primarySubscriber);
            const pol = policies.find((p) => p.policyNumber === found.familyPolicyNumber) || policies[0];
            setMatchedPolicy(pol);
            setHasSearched(true);
            setIsSearching(false);
            return;
          }
        }
      }
    } catch {
      // Fallback to local store search below
    }

    // In-memory store fallback search
    const lowerQ = q.toLowerCase();
    const foundCust = customers.find((c) => {
      const inPrimaryHcid = c.primarySubscriber.hcid.toLowerCase().includes(lowerQ);
      const inPrimaryName = `${c.primarySubscriber.firstName} ${c.primarySubscriber.lastName}`
        .toLowerCase()
        .includes(lowerQ);
      const inHouseholdHcid = c.familyHcid.toLowerCase().includes(lowerQ);
      const inPolicyNum = c.familyPolicyNumber.toLowerCase().includes(lowerQ);
      const inDependents = c.dependents.some(
        (d) =>
          d.hcid.toLowerCase().includes(lowerQ) ||
          `${d.firstName} ${d.lastName}`.toLowerCase().includes(lowerQ)
      );

      return inPrimaryHcid || inPrimaryName || inHouseholdHcid || inPolicyNum || inDependents;
    });

    if (foundCust) {
      setMatchedCustomer(foundCust);
      // Check if query matched a specific dependent
      const matchedDep = foundCust.dependents.find(
        (d) =>
          d.hcid.toLowerCase().includes(lowerQ) ||
          `${d.firstName} ${d.lastName}`.toLowerCase().includes(lowerQ)
      );
      setSelectedMember(matchedDep || foundCust.primarySubscriber);

      const pol = policies.find((p) => p.policyNumber === foundCust.familyPolicyNumber) || policies[0];
      setMatchedPolicy(pol);
    } else {
      setMatchedCustomer(null);
      setMatchedPolicy(null);
      setSelectedMember(null);
      setSearchFeedback(`No member or household found matching "${q}". Please check the HCID or select a preset.`);
    }

    setHasSearched(true);
    setIsSearching(false);
  };

  const handlePresetSelect = (presetHcid: string) => {
    setQuery(presetHcid);
    executeSearch(presetHcid);
  };

  const handleClearSearch = () => {
    setQuery('');
    setHasSearched(false);
    setMatchedCustomer(null);
    setMatchedPolicy(null);
    setSelectedMember(null);
    setSearchFeedback('');
  };

  // Find cases for the matched customer
  const relatedCases = matchedCustomer
    ? cases.filter((c) => c.familyPolicyNumber === matchedCustomer.familyPolicyNumber)
    : [];

  // Find claims for the matched customer & household
  const matchedMemberClaims = matchedCustomer
    ? claims.filter((cl) => {
        const inCustomerPolicy =
          cl.caseId.includes(matchedCustomer.familyPolicyNumber) ||
          cl.caseId.includes(matchedCustomer._id) ||
          cl.caseId.includes(matchedCustomer.familyHcid);
        const inRelatedCases = relatedCases.some(
          (rc) => rc.claimId === cl.claimId || rc._id === cl.caseId
        );
        return inCustomerPolicy || inRelatedCases;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header & Search Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                Eligibility Service
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">GET /v2/eligibility/subscribers</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Member & Household Directory Search
            </h1>
            <p className="text-xs text-slate-500">
              Query National Healthcare ID (HCID), primary subscriber profile, household dependents, and active coverage limits.
            </p>
          </div>
        </div>

        {/* Search Input Bar with explicit Search CTA and Clear CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="member-search-input"
              type="text"
              placeholder="Search by Member HCID (e.g. HCID-8492-1001-A), Full Name (e.g. Eleanor Vance), or Policy Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  executeSearch();
                }
              }}
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 font-sans transition-all placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer transition-colors"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="member-search-submit-btn"
            onClick={() => executeSearch()}
            disabled={isSearching}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isSearching ? 'Searching...' : 'Search Member'}</span>
          </button>

          {(query || hasSearched) && (
            <button
              id="member-search-clear-btn"
              type="button"
              onClick={handleClearSearch}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:border-slate-400"
              title="Clear search and start over"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* State 1: User hasn't clicked search yet */}
      {!hasSearched && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Search for Member Records</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Enter a Member Healthcare ID (HCID), subscriber name, or family policy number above and click{' '}
            <strong className="text-blue-700">"Search Member"</strong> to retrieve profile, household dependents, and benefits coverage.
          </p>
        </div>
      )}

      {/* State 2: Searched but no match */}
      {hasSearched && !matchedCustomer && (
        <div className="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Member Matched</h2>
          <p className="text-xs text-rose-600 max-w-md mx-auto mt-1">
            {searchFeedback || 'No subscriber or dependent was found matching your query.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setQuery('HCID-8492-1001-A');
                executeSearch('HCID-8492-1001-A');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              Try Default Test Member (Eleanor Vance)
            </button>
          </div>
        </div>
      )}

      {/* State 3: Searched & Match Found */}
      {hasSearched && matchedCustomer && (
        <div className="space-y-6">
          {/* Top Banner: Member Matched Success with Quick Action */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-emerald-950 text-sm">
                  Verified Active Household: {matchedCustomer.primarySubscriber.firstName}{' '}
                  {matchedCustomer.primarySubscriber.lastName}
                </div>
                <div className="text-emerald-700 text-[11px] font-mono mt-0.5">
                  Household HCID: {matchedCustomer.familyHcid} · Policy: {matchedCustomer.familyPolicyNumber}
                </div>
              </div>
            </div>

            {!isDoctor && onStartIntake && (
              <button
                onClick={() => onStartIntake(matchedCustomer, selectedMember || matchedCustomer.primarySubscriber)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Intake Case for this Member</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Member Profile & Household Dependents */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary Subscriber Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Primary Subscriber Profile</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {matchedCustomer.primarySubscriber.coverageStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Full Legal Name</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {matchedCustomer.primarySubscriber.firstName} {matchedCustomer.primarySubscriber.lastName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Healthcare ID (HCID)</span>
                    <span className="font-bold text-blue-700 font-mono">
                      {matchedCustomer.primarySubscriber.hcid}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date of Birth / Gender</span>
                    <span className="font-medium text-slate-700">
                      {matchedCustomer.primarySubscriber.dob} ({matchedCustomer.primarySubscriber.gender})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Relationship</span>
                    <span className="font-medium text-slate-700">Primary Head of Household</span>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{matchedCustomer.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{matchedCustomer.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{matchedCustomer.contact.address}</span>
                  </div>
                </div>
              </div>

              {/* Household Unit Dependents */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Covered Household Dependents ({matchedCustomer.dependents.length})</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Click member to target intake</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Primary subscriber chip */}
                  <div
                    onClick={() => setSelectedMember(matchedCustomer.primarySubscriber)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedMember?.memberId === matchedCustomer.primarySubscriber.memberId
                        ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-100'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                        Primary
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">Active</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-2 text-xs">
                      {matchedCustomer.primarySubscriber.firstName} {matchedCustomer.primarySubscriber.lastName}
                    </div>
                    <div className="text-[11px] font-mono text-blue-700 mt-0.5">
                      {matchedCustomer.primarySubscriber.hcid}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      DOB: {matchedCustomer.primarySubscriber.dob}
                    </div>
                  </div>

                  {/* Dependents chips */}
                  {matchedCustomer.dependents.map((dep) => {
                    const isSelected = selectedMember?.memberId === dep.memberId;
                    return (
                      <div
                        key={dep.memberId}
                        onClick={() => setSelectedMember(dep)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-100'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              dep.relationship === 'SPOUSE'
                                ? 'bg-purple-100 text-purple-800'
                                : dep.relationship === 'CHILD'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {dep.relationship}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">Active</span>
                        </div>
                        <div className="font-bold text-slate-900 mt-2 text-xs">
                          {dep.firstName} {dep.lastName}
                        </div>
                        <div className="text-[11px] font-mono text-indigo-700 mt-0.5">
                          {dep.hcid}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          DOB: {dep.dob} ({dep.gender})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Policy Benefits & Existing Cases */}
            <div className="lg:col-span-5 space-y-6">
              {/* Policy Benefits Details */}
              {matchedPolicy && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Policy Benefits Plan</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {matchedPolicy.status}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 text-sm">{matchedPolicy.planName}</div>
                    <div className="text-xs font-mono text-slate-500 mt-0.5">
                      Policy #{matchedPolicy.policyNumber} · {matchedPolicy.networkType}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Effective: {matchedPolicy.effectiveDate.slice(0, 10)} to {matchedPolicy.expirationDate.slice(0, 10)}
                    </div>
                  </div>

                  {/* Financial Limits */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Annual Family Deductible:</span>
                        <span className="font-bold text-slate-900 font-mono">
                          ${matchedPolicy.financials.familyDeductibleMet} / ${matchedPolicy.financials.familyDeductible}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (matchedPolicy.financials.familyDeductibleMet /
                                matchedPolicy.financials.familyDeductible) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 text-right">
                        Remaining: ${matchedPolicy.financials.familyDeductible - matchedPolicy.financials.familyDeductibleMet}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Out-of-Pocket Maximum:</span>
                        <span className="font-bold text-slate-900 font-mono">
                          ${matchedPolicy.financials.outOfPocketMet} / ${matchedPolicy.financials.outOfPocketMax}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (matchedPolicy.financials.outOfPocketMet /
                                matchedPolicy.financials.outOfPocketMax) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Copays & Coinsurance */}
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Benefit Copay Schedule
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {matchedPolicy.coverages.map((cov) => (
                        <div key={cov.category} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="font-semibold text-slate-700 block text-[10px]">
                            {cov.category.replace('_', ' ')}
                          </span>
                          <span className="font-bold text-slate-900 font-mono">
                            ${cov.copay} Copay ({cov.coinsurancePct * 100}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Active Cases */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                    <span>Existing Cases on Policy ({relatedCases.length})</span>
                  </div>
                </div>

                {relatedCases.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No previous cases found for this policy.</p>
                ) : (
                  <div className="space-y-2">
                    {relatedCases.map((rc) => (
                      <div
                        key={rc._id}
                        onClick={() => onSelectCase && onSelectCase(rc._id)}
                        className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold font-mono text-slate-900">{rc.caseNumber}</div>
                          <div className="text-[11px] text-slate-500">
                            {rc.patientName} · Stage 0{rc.currentStage}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold font-mono text-slate-900 block">
                            ${rc.financials.totalBilled}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-700">Open Case →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Claims & Procedure Line Items */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Claims & Procedure Line Items ({matchedMemberClaims.length})</span>
                  </div>
                </div>

                {matchedMemberClaims.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No previous claims on file for this subscriber.</p>
                ) : (
                  <div className="space-y-3">
                    {matchedMemberClaims.map((cl) => (
                      <div key={cl._id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{cl.claimId}</span>
                            <span className="text-slate-400 mx-1.5">·</span>
                            <span className="text-slate-700 font-medium">{cl.provider.name}</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-700">
                            ${cl.totalBilledAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Date of Service: {cl.serviceDate.slice(0, 10)} · Provider NPI: <span className="font-mono">{cl.provider.npi}</span>
                        </div>
                        {cl.items && cl.items.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                              Claim Procedure Lines ({cl.items.length})
                            </span>
                            {cl.items.map((itm) => (
                              <div key={itm.itemId} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-slate-200">
                                <div>
                                  <span className="font-mono font-bold text-blue-700">{itm.code}</span>
                                  <span className="text-slate-700 ml-1.5">{itm.description}</span>
                                </div>
                                <span className="font-mono font-semibold text-slate-900">
                                  ${itm.billedAmount.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
