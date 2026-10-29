/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  Stethoscope,
  FileCheck2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'ANALYST' | 'DOCTOR'>('ANALYST');
  const [username, setUsername] = useState('marcus.brody@claims.internal');
  const [password, setPassword] = useState('analyst2026');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role: 'ANALYST' | 'DOCTOR') => {
    setSelectedRole(role);
    if (role === 'ANALYST') {
      setUsername('marcus.brody@claims.internal');
      setPassword('analyst2026');
    } else {
      setUsername('dr.chen@claims.internal');
      setPassword('doctor2026');
    }
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Subtle clean ambient lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 shadow-2xs flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            CM
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
              Claim Management
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">Healthcare Operations & Clinical Adjudication</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-700 font-medium">System Online</span>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-7 sm:p-9 shadow-lg space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign In to Workspace
            </h2>
            <p className="text-xs text-slate-500">
              Select your role to access your dedicated workspace
            </p>
          </div>

          {/* 2 Clean Role Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Analyst Role */}
            <button
              type="button"
              onClick={() => handleRoleSelect('ANALYST')}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2.5 cursor-pointer ${
                selectedRole === 'ANALYST'
                  ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                {selectedRole === 'ANALYST' ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300" />
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Operations Analyst</div>
                <div className="text-xs text-blue-700 font-medium mt-0.5">Marcus Brody, CFE</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Claims triage, member lookup, eligibility & verification
                </div>
              </div>
            </button>

            {/* Doctor Approver Role */}
            <button
              type="button"
              onClick={() => handleRoleSelect('DOCTOR')}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2.5 cursor-pointer ${
                selectedRole === 'DOCTOR'
                  ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                {selectedRole === 'DOCTOR' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300" />
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Doctor Approver</div>
                <div className="text-xs text-emerald-700 font-medium mt-0.5">Dr. Sarah Chen, MD</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Clinical review, CPT reclassifications & physician sign-off
                </div>
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                selectedRole === 'ANALYST'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <span>
                Sign In as {selectedRole === 'ANALYST' ? 'Operations Analyst' : 'Doctor Approver'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Launch */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">Instant Access:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDirectLogin('ANALYST')}
                  className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Analyst Login
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectLogin('DOCTOR')}
                  className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Doctor Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="px-6 py-4 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Claim Management</span>
          <span>·</span>
          <span>Role-Governed Workflow</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Deterministic Adjudication System
        </div>
      </footer>
    </div>
  );
};
