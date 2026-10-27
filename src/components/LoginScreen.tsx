/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Stethoscope,
  FileCheck2,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Database,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'ANALYST' | 'DOCTOR'>('ANALYST');
  const [username, setUsername] = useState('marcus.brody@omniclaim.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleSelect = (role: 'ANALYST' | 'DOCTOR') => {
    setSelectedRole(role);
    if (role === 'ANALYST') {
      setUsername('marcus.brody@omniclaim.com');
      setPassword('analyst2026');
    } else {
      setUsername('dr.chen@omniclaim.com');
      setPassword('doctor2026');
    }
    setErrorMsg('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'ANALYST') {
      onLogin('OPERATIONS_ANALYST');
    } else {
      onLogin('DOCTOR_APPROVER');
    }
  };

  const handleDirectLogin = (role: 'ANALYST' | 'DOCTOR') => {
    if (role === 'ANALYST') {
      onLogin('OPERATIONS_ANALYST');
    } else {
      onLogin('DOCTOR_APPROVER');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Enterprise Brand Bar */}
      <header className="px-6 py-5 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
            OC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">OmniClaim Health</h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Enterprise 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Deterministic 6-Stage Claims Adjudication & BSON Event Sourcing</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">BSON Store: Active</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Role Guardrails Enforced</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card & Role Selector */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Context: System Presentation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Role-Governed Adjudication Portal
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Secure Enterprise Authentication
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                OmniClaim separates operational claims triage from licensed physician adjudication. Select your designated role below to continue.
              </p>
            </div>

            {/* Role Capabilities Comparison Box */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Role 1: Claims & Operations Analyst</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Works on cases, eligibility checks, DCN evidence audits, duplicate collisions, and financial settlements. <strong className="text-amber-400 font-medium">Restricted from Doctor Reviews.</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Role 2: Licensed Medical Director / Doctor</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    <strong className="text-emerald-400 font-medium">Only role with authority</strong> to review medical necessity, adjust CPT codes, enter physician rationales, and authorize loss reserves.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box: Interactive Role Selection & Login Form */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Step 1: Select Active Role
            </div>

            {/* 2 Big Distinct Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {/* Analyst Role Card */}
              <button
                type="button"
                onClick={() => handleRoleSelect('ANALYST')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedRole === 'ANALYST'
                    ? 'bg-blue-950/40 border-blue-500/80 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    {selectedRole === 'ANALYST' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="font-bold text-white text-sm">Analyst Role</div>
                  <div className="text-[11px] text-blue-400 font-medium mt-0.5">Marcus Brody, CFE</div>
                  <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    Cases, eligibility, DCN audit, SIU investigations & settlements.
                  </div>
                </div>

                <div className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Doctor Review Excluded
                </div>
              </button>

              {/* Doctor Role Card */}
              <button
                type="button"
                onClick={() => handleRoleSelect('DOCTOR')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedRole === 'DOCTOR'
                    ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    {selectedRole === 'DOCTOR' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="font-bold text-white text-sm">Doctor Reviewer</div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-0.5">Dr. Sarah Chen, MD</div>
                  <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    Clinical Adjudication, CPT reclassifications & physician sign-off.
                  </div>
                </div>

                <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Only Role for Doctor Tasks
                </div>
              </button>
            </div>

            {/* Form Details */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  User Account
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    required
                  />
                  <div className="absolute right-3 top-2.5 text-slate-500 text-[11px]">
                    {selectedRole === 'ANALYST' ? 'Analyst' : 'Doctor (NPI: 1982736401)'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Access Key / Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  selectedRole === 'ANALYST'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                }`}
              >
                <span>
                  Sign In as {selectedRole === 'ANALYST' ? 'Claims & Operations Analyst' : 'Dr. Sarah Chen, MD (Doctor)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* One-Click Quick Launch Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">Fast Demo Bypass:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDirectLogin('ANALYST')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    1-Click Analyst
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDirectLogin('DOCTOR')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    1-Click Doctor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Enterprise Architecture Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2 text-[11px]">
          <span>OmniClaim Enterprise Health Adjudication Engine</span>
          <span>·</span>
          <span>Dual Role Guardrails</span>
          <span>·</span>
          <span>Version 2.4.0</span>
        </div>
        <div className="text-[11px] text-slate-500">
          MongoDB BSON 6-Stage Deterministic Workflow System
        </div>
      </footer>
    </div>
  );
};
