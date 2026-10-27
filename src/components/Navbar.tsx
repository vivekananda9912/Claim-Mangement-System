/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useClaimsStore } from '../store/claimsStore';
import { USER_PERSONAS } from '../data/mockData';
import {
  Search,
  Users,
  Stethoscope,
  Plus,
  LogOut,
  UserCheck,
  ShieldCheck,
  RotateCcw,
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
  const { currentRole, resetToSeeds } = useClaimsStore();
  const currentPersona = USER_PERSONAS[currentRole] || USER_PERSONAS.OPERATIONS_ANALYST;

  const isDoctor = currentRole === 'DOCTOR_APPROVER';

  // Navigation Items: 1st Global Search, 2nd Member Search, (and Clinical Desk if Doctor)
  const navItems = [
    {
      id: 'cases',
      label: 'Global Search',
      icon: Search,
      description: 'Workbasket & Case Search',
    },
    {
      id: 'member_search',
      label: 'Member Search',
      icon: Users,
      description: 'HCID & Household Lookup',
    },
    ...(isDoctor
      ? [
          {
            id: 'doctor',
            label: 'Clinical Desk',
            icon: Stethoscope,
            badge: 'Physician Queue',
            description: 'Medical Review Tasks',
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Clean Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            OC
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
              OmniClaim Health
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Claims Operations & Eligibility</p>
          </div>
        </div>

        {/* Center: Clean 2-3 Option Navigation Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Intake Action, Logged-in Profile, and Logout */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Intake New Case CTA */}
          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer hover:shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Intake Case</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                isDoctor
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}
            >
              {isDoctor ? 'SC' : 'MB'}
            </div>

            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {isDoctor ? 'Dr. Sarah Chen, MD' : 'Marcus Brody'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight">
                {isDoctor ? 'Doctor Approver' : 'Operations Analyst'}
              </div>
            </div>

            {/* Log Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Log Out to Switch Role"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer font-medium ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
