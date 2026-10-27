/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { UserRole } from '../types';
import { USER_PERSONAS } from '../data/mockData';
import {
  FolderKanban,
  Inbox,
  FilePlus2,
  Stethoscope,
  BarChart3,
  Database,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewCase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCase,
}) => {
  const { currentRole, setRole, resetToSeeds } = useClaimsStore();
  const currentPersona = USER_PERSONAS[currentRole];

  const navItems = [
    { id: 'cases', label: 'Cases Cockpit', icon: FolderKanban },
    { id: 'workbaskets', label: 'Workbaskets', icon: Inbox },
    { id: 'intake', label: 'Policy & Intake', icon: FilePlus2 },
    { id: 'doctor', label: 'Clinical Desk', icon: Stethoscope },
    { id: 'analytics', label: 'Audit & Metrics', icon: BarChart3 },
    { id: 'mongo', label: 'MongoDB Explorer', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Banner: Persona Context & System Bar */}
      <div className="bg-slate-900 text-slate-200 px-6 py-2 flex flex-wrap items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OmniClaim Enterprise</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Event-Sourced Claims Adjudication</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 font-medium">BSON Event Store Active</span>
        </div>

        {/* Persona Switcher Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Active Persona:</span>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-slate-800 text-white font-medium px-2.5 py-1 rounded border border-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="PROCESS_OWNER">Amanda Vance (Process Owner - Intake & Triage)</option>
              <option value="BUSINESS_REQUESTER">David Miller (Requester - Provider Billing)</option>
              <option value="DOCTOR_APPROVER">Dr. Sarah Chen, MD (Doctor Approver - Clinical Review)</option>
              <option value="OPERATIONS_ANALYST">Marcus Brody (Fraud & QA Analyst - SIU)</option>
              <option value="SYSTEM_ADMIN">Elena Rostova (System Administrator - Mongo Architect)</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset application state to initial seed cases, policies, and events?')) {
                resetToSeeds();
              }
            }}
            title="Reset to default seed state"
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main 3-Zone Navigation Header */}
      <div className="px-6 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            OC
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
              OmniClaim Health
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">Family Health Claims & Case Engine</p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="truncate max-w-[140px] font-medium text-slate-700">{currentPersona.name}</span>
          </div>

          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Intake New Claim</span>
          </button>
        </div>
      </div>
    </header>
  );
};
