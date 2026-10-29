/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { CasesCockpit } from './components/CasesCockpit';
import { CaseDetailView } from './components/CaseDetailView';
import { TaskWorkspaceView } from './components/TaskWorkspaceView';
import { MemberSearchView } from './components/MemberSearchView';
import { PolicyIntakeWizard } from './components/PolicyIntakeWizard';
import { DoctorReviewWorkbench } from './components/DoctorReviewWorkbench';
import { StageFeedbackModal } from './components/StageFeedbackModal';
import { useClaimsStore } from './store/claimsStore';
import { UserRole } from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('omniclaim_logged_in') === 'true';
  });
  const [activeTab, setActiveTab] = useState<string>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const { currentRole, setRole, cases } = useClaimsStore();

  const handleLogin = (role: UserRole) => {
    setRole(role);
    setIsLoggedIn(true);
    localStorage.setItem('omniclaim_logged_in', 'true');
    // If doctor logs in, take them directly to Clinical Desk; if analyst, to Cases / Global Search
    if (role === 'DOCTOR_APPROVER') {
      setActiveTab('doctor');
    } else {
      setActiveTab('cases');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedCaseId(null);
    setActiveTaskId(null);
    localStorage.removeItem('omniclaim_logged_in');
  };

  const handleGoHome = () => {
    setSelectedCaseId(null);
    setActiveTaskId(null);
    if (currentRole === 'DOCTOR_APPROVER') {
      setActiveTab('doctor');
    } else {
      setActiveTab('cases');
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedCaseId(null);
    setActiveTaskId(null);
    setActiveTab(tab);
  };

  const handleOpenIntake = () => {
    setSelectedCaseId(null);
    setActiveTaskId(null);
    setActiveTab('intake');
  };

  const handleCaseCreated = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('cases');
  };

  // If not authenticated, render requested Login Screen with Analyst and Doctor roles
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Active viewing case (if any)
  const activeViewingCase = selectedCaseId ? cases.find((c) => c._id === selectedCaseId) : null;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Persistent Navigation Bar with Home Icon, Global Search, Member Search, Profile & Logout */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenNewCase={handleOpenIntake}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      />

      {/* Case Stages Sub-bar directly under navbar (shown when viewing a case) */}
      {activeViewingCase && (
        <div className="bg-slate-900 text-white px-6 py-2.5 border-b border-slate-800 shadow-xs flex items-center justify-between gap-4 overflow-x-auto text-xs z-30">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono font-bold text-blue-400">{activeViewingCase.caseNumber}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 font-medium">{activeViewingCase.patientName}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto shrink-0 py-0.5">
            {[
              { num: 1, label: '01. Capture Request' },
              { num: 2, label: '02. Initial Review' },
              { num: 3, label: '03. Claim & Auth Evidence' },
              { num: 4, label: '04. Decision Stage' },
              { num: 5, label: '05. Closeout & Settlement' },
              { num: 6, label: '06. Resolved' },
            ].map((st, idx) => {
              const isPast = activeViewingCase.currentStage > st.num;
              const isCurrent = activeViewingCase.currentStage === st.num;
              const isCaseClosed =
                activeViewingCase.currentStage === 6 ||
                activeViewingCase.status === 'RESOLVED' ||
                activeViewingCase.status === 'CLOSED';
              const isStep6Closed = st.num === 6 && isCaseClosed;

              let stageColor = 'text-slate-400 bg-slate-800/30';
              if (isStep6Closed) {
                stageColor = 'bg-emerald-600 text-white shadow-xs';
              } else if (isCurrent) {
                stageColor = 'bg-blue-600 text-white shadow-xs';
              } else if (isPast) {
                stageColor = 'text-emerald-400 bg-slate-800/80';
              }

              return (
                <React.Fragment key={st.num}>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${stageColor}`}
                  >
                    <span>{isPast || isStep6Closed ? '✓' : st.num}</span>
                    <span>{st.label}</span>
                  </div>
                  {idx < 5 && <span className="text-slate-700 text-[10px]">→</span>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Viewport Content */}
      {activeTaskId ? (
        <div className="flex-1 flex flex-col">
          <TaskWorkspaceView
            taskId={activeTaskId}
            onBack={() => setActiveTaskId(null)}
            onOpenCase={(caseId) => {
              setActiveTaskId(null);
              setSelectedCaseId(caseId);
            }}
          />
        </div>
      ) : selectedCaseId ? (
        <div className="flex-1 flex flex-col">
          <CaseDetailView
            caseId={selectedCaseId}
            onClose={() => setSelectedCaseId(null)}
            onOpenTask={(taskId) => {
              setSelectedCaseId(null);
              setActiveTaskId(taskId);
            }}
          />
        </div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
          {/* Tab 1: Global Search & Workbasket Table */}
          {(activeTab === 'cases' || activeTab === 'global_search') && (
            <CasesCockpit
              onSelectCase={(id) => setSelectedCaseId(id)}
              onOpenNewCase={handleOpenIntake}
              onOpenTask={(tid) => setActiveTaskId(tid)}
            />
          )}

          {/* Tab 2: Member & Household Directory Search */}
          {activeTab === 'member_search' && (
            <MemberSearchView
              onStartIntake={handleOpenIntake}
              onSelectCase={(id) => setSelectedCaseId(id)}
            />
          )}

          {/* Tab 3: Doctor Clinical Desk (Accessible for Doctor role) */}
          {activeTab === 'doctor' && (
            <DoctorReviewWorkbench
              onSelectCase={(id) => setSelectedCaseId(id)}
              onOpenTask={(tid) => setActiveTaskId(tid)}
            />
          )}

          {/* Tab 4: Direct Intake Wizard (always renders under persistent Navbar) */}
          {activeTab === 'intake' && (
            <PolicyIntakeWizard
              onCaseCreated={handleCaseCreated}
              onCancel={() => setActiveTab('cases')}
            />
          )}
        </main>
      )}

      {/* Global Active Milestone Feedback Modal */}
      <StageFeedbackModal
        onOpenTask={(tid) => {
          setSelectedCaseId(null);
          setActiveTaskId(tid);
        }}
        onOpenCase={(cid) => {
          setActiveTaskId(null);
          setSelectedCaseId(cid);
        }}
        onCloseAll={() => {
          setActiveTaskId(null);
          setSelectedCaseId(null);
        }}
      />
    </div>
  );
}
