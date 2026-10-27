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
  LogOut,
  ArrowRightLeft,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewCase: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCase,
  onLogout,
}) => {
  const { currentRole, setRole, resetToSeeds } = useClaimsStore();
  const currentPersona = USER_PERSONAS[currentRole];

  const isDoctor = currentRole === 'DOCTOR_APPROVER';
  const isAnalyst = currentRole === 'OPERATIONS_ANALYST' || currentRole === 'PROCESS_OWNER';

  const navItems = [
    { id: 'cases', label: 'Cases Cockpit', icon: FolderKanban },
    { id: 'workbaskets', label: 'Workbaskets & Tasks', icon: Inbox },
    { id: 'intake', label: 'Policy & Intake', icon: FilePlus2 },
    {
      id: 'doctor',
      label: 'Clinical Desk',
      icon: Stethoscope,
      badge: isDoctor ? 'Physician Queue' : 'Doctor Only',
    },
    { id: 'analytics', label: 'SIU & Audit Metrics', icon: BarChart3 },
    { id: 'mongo', label: 'MongoDB Explorer', icon: Database },
  ];

  const handleToggleRole = () => {
    if (isDoctor) {
      setRole('OPERATIONS_ANALYST');
    } else {
      setRole('DOCTOR_APPROVER');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Banner: Persona Context & Dual-Role Guardrails */}
      <div className="bg-slate-900 text-slate-200 px-6 py-2 flex flex-wrap items-center justify-between text-xs border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OmniClaim Enterprise</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">Event-Sourced Claims Adjudication</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-emerald-400 font-medium hidden sm:inline">Deterministic Rules Engine</span>
        </div>

        {/* Persona Switcher & Dual Role Indicator */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Role Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5 ${
                isDoctor
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {isDoctor ? <Stethoscope className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              <span>{isDoctor ? 'Doctor Approver (Dr. Sarah Chen, MD)' : 'Claims Analyst (Marcus Brody)'}</span>
            </div>

            {/* Quick Switch Button */}
            <button
              onClick={handleToggleRole}
              title={isDoctor ? 'Switch to Analyst Role' : 'Switch to Doctor Role'}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3 h-3 text-slate-400" />
              <span>{isDoctor ? 'Switch to Analyst' : 'Switch to Doctor'}</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Reset Demo */}
          <button
            onClick={() => {
              if (confirm('Reset application state to initial seed cases, policies, and events?')) {
                resetToSeeds();
              }
            }}
            title="Reset to default seed state"
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Log Out */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Return to Login Screen"
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded border border-rose-800/60 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3-Zone Navigation Header */}
      <div className="px-6 py-3 flex items-center justify-between gap-6">
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
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      isDoctor && item.id === 'doctor'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Intake New Claim</span>
          </button>
        </div>
      </div>
    </header>
  );
};
