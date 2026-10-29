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
  const [showIntakeModal, setShowIntakeModal] = useState<boolean>(false);

  const { currentRole, setRole } = useClaimsStore();

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

  const handleCaseCreated = (caseId: string) => {
    setShowIntakeModal(false);
    setSelectedCaseId(caseId);
    setActiveTab('cases');
  };

  // If not authenticated, render requested Login Screen with Analyst and Doctor roles
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // When working on task, open it in a dedicated new full page
  if (activeTaskId) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <TaskWorkspaceView
          taskId={activeTaskId}
          onBack={() => setActiveTaskId(null)}
          onOpenCase={(caseId) => {
            setActiveTaskId(null);
            setSelectedCaseId(caseId);
          }}
        />
        <StageFeedbackModal
          onOpenTask={(tid) => {
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

  // When working on stages screen, take the FULL SCREEN instead of modal or popup
  if (selectedCaseId) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <CaseDetailView
          caseId={selectedCaseId}
          onClose={() => setSelectedCaseId(null)}
          onOpenTask={(taskId) => {
            setSelectedCaseId(null);
            setActiveTaskId(taskId);
          }}
        />
        <StageFeedbackModal
          onOpenTask={(tid) => {
            setSelectedCaseId(null);
            setActiveTaskId(tid);
          }}
          onOpenCase={(cid) => {
            setSelectedCaseId(cid);
          }}
          onCloseAll={() => {
            setSelectedCaseId(null);
            setActiveTaskId(null);
          }}
        />
      </div>
    );
  }

  // Clean Default App Viewport
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Clean Top Navigation Bar with Global Search, Member Search, Profile & Logout */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCase={() => setShowIntakeModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Viewport Content - Clean, Uncluttered Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Tab 1: Global Search & Workbasket Table */}
        {(activeTab === 'cases' || activeTab === 'global_search') && (
          <CasesCockpit
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenNewCase={() => setShowIntakeModal(true)}
            onOpenTask={(tid) => setActiveTaskId(tid)}
          />
        )}

        {/* Tab 2: Member & Household Directory Search */}
        {activeTab === 'member_search' && (
          <MemberSearchView
            onStartIntake={() => setShowIntakeModal(true)}
            onSelectCase={(id) => setSelectedCaseId(id)}
          />
        )}

        {/* Tab 3: Doctor Clinical Desk (Accessible for Doctor role) */}
        {activeTab === 'doctor' && (
          <DoctorReviewWorkbench onSelectCase={(id) => setSelectedCaseId(id)} />
        )}

        {/* Tab 4: Direct Intake Wizard (if triggered via tab) */}
        {activeTab === 'intake' && (
          <PolicyIntakeWizard
            onCaseCreated={handleCaseCreated}
            onCancel={() => setActiveTab('cases')}
          />
        )}
      </main>

      {/* Standalone Intake Wizard Modal */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto">
            <PolicyIntakeWizard
              onCaseCreated={handleCaseCreated}
              onCancel={() => setShowIntakeModal(false)}
            />
          </div>
        </div>
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

      {/* Clean Enterprise Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Claim Management</span>
          <span>·</span>
          <span>Operations & Clinical Adjudication</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Role-Governed Workflow
        </div>
      </footer>
    </div>
  );
}
