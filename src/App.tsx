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
import { WorkbasketsView } from './components/WorkbasketsView';
import { PolicyIntakeWizard } from './components/PolicyIntakeWizard';
import { DoctorReviewWorkbench } from './components/DoctorReviewWorkbench';
import { OperationsAnalytics } from './components/OperationsAnalytics';
import { MongoExplorer } from './components/MongoExplorer';
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

  const { userPersona, currentRole, setRole } = useClaimsStore();

  const handleLogin = (role: UserRole) => {
    setRole(role);
    setIsLoggedIn(true);
    localStorage.setItem('omniclaim_logged_in', 'true');
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
        />
      </div>
    );
  }

  // Default App Viewport
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar with Persona & Role Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCase={() => setShowIntakeModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Contextual Role Banner */}
        <div className="bg-white border border-slate-200/80 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Current Actor Role:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded border ${
                currentRole === 'DOCTOR_APPROVER'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-blue-700 bg-blue-50 border-blue-200'
              }`}
            >
              {userPersona.title} ({userPersona.name})
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500">{userPersona.department}</span>
          </div>

          <div className="text-slate-500 text-[11px] flex items-center gap-2">
            <span>{userPersona.description}</span>
          </div>
        </div>

        {/* Tab View Routing */}
        {activeTab === 'cases' && (
          <CasesCockpit
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenNewCase={() => setShowIntakeModal(true)}
            onOpenTask={(tid) => setActiveTaskId(tid)}
          />
        )}

        {activeTab === 'workbaskets' && (
          <WorkbasketsView
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenTask={(tid) => setActiveTaskId(tid)}
          />
        )}

        {activeTab === 'intake' && (
          <PolicyIntakeWizard
            onCaseCreated={handleCaseCreated}
            onCancel={() => setActiveTab('cases')}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorReviewWorkbench onSelectCase={(id) => setSelectedCaseId(id)} />
        )}

        {activeTab === 'analytics' && <OperationsAnalytics />}

        {activeTab === 'mongo' && <MongoExplorer />}
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
      />

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">OmniClaim Health Enterprise</span>
          <span>·</span>
          <span>Dual-Role Deterministic Claims Adjudication</span>
        </div>
        <div className="text-[11px] text-slate-400">
          MongoDB BSON Event Sourcing Engine · 6-Stage Deterministic Rules
        </div>
      </footer>
    </div>
  );
}
