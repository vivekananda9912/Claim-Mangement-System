/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CasesCockpit } from './components/CasesCockpit';
import { CaseDetailView } from './components/CaseDetailView';
import { WorkbasketsView } from './components/WorkbasketsView';
import { PolicyIntakeWizard } from './components/PolicyIntakeWizard';
import { DoctorReviewWorkbench } from './components/DoctorReviewWorkbench';
import { OperationsAnalytics } from './components/OperationsAnalytics';
import { MongoExplorer } from './components/MongoExplorer';
import { useClaimsStore } from './store/claimsStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showIntakeModal, setShowIntakeModal] = useState<boolean>(false);

  const { userPersona, currentRole } = useClaimsStore();

  const handleCaseCreated = (caseId: string) => {
    setShowIntakeModal(false);
    setSelectedCaseId(caseId);
    setActiveTab('cases');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar with Persona Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCase={() => setShowIntakeModal(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Contextual Role Banner */}
        <div className="bg-white border border-slate-200/80 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Current Actor Role:</span>
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {userPersona.title} ({userPersona.name})
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500">{userPersona.department}</span>
          </div>

          <div className="text-slate-500 text-[11px]">
            {userPersona.description}
          </div>
        </div>

        {/* Tab View Routing */}
        {activeTab === 'cases' && (
          <CasesCockpit
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenNewCase={() => setShowIntakeModal(true)}
          />
        )}

        {activeTab === 'workbaskets' && (
          <WorkbasketsView onSelectCase={(id) => setSelectedCaseId(id)} />
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

      {/* Case Detail 360° View Modal */}
      {selectedCaseId && (
        <CaseDetailView
          caseId={selectedCaseId}
          onClose={() => setSelectedCaseId(null)}
        />
      )}

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

      {/* Subtle enterprise footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">OmniClaim Health Enterprise</span>
          <span>·</span>
          <span>Case & Event-Sourcing Adjudication Platform</span>
        </div>
        <div className="text-[11px] text-slate-400">
          MongoDB BSON Event Sourcing Engine · 6-Stage Deterministic Rules
        </div>
      </footer>
    </div>
  );
}
