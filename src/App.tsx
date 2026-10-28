import React, { lazy, Suspense, useState, useEffect } from 'react';
import { TabType, ScanAnalysis, Patient, DiagnosticReport } from './types';
import { INITIAL_SCANS, INITIAL_PATIENTS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { CreatePatientModal } from './components/CreatePatientModal';
import { UploadDicomModal } from './components/UploadDicomModal';
import { HipaaModal } from './components/HipaaModal';
import { EmailModal } from './components/EmailModal';
import { AiVideoWalkthroughModal } from './components/AiVideoWalkthroughModal';

// Views
import { DashboardView } from './views/DashboardView';
const NewScanView = lazy(() => import('./views/NewScanView').then((module) => ({ default: module.NewScanView })));
const PatientsView = lazy(() => import('./views/PatientsView').then((module) => ({ default: module.PatientsView })));
const StudiesView = lazy(() => import('./views/StudiesView').then((module) => ({ default: module.StudiesView })));
const AnalyticsView = lazy(() => import('./views/AnalyticsView').then((module) => ({ default: module.AnalyticsView })));
const AIModelsView = lazy(() => import('./views/AIModelsView').then((module) => ({ default: module.AIModelsView })));
const AlertsView = lazy(() => import('./views/AlertsView').then((module) => ({ default: module.AlertsView })));
const ReportsView = lazy(() => import('./views/ReportsView').then((module) => ({ default: module.ReportsView })));
const IntegrationsView = lazy(() => import('./views/IntegrationsView').then((module) => ({ default: module.IntegrationsView })));
const SettingsView = lazy(() => import('./views/SettingsView').then((module) => ({ default: module.SettingsView })));

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [scans, setScans] = useState<ScanAnalysis[]>(INITIAL_SCANS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activeScan, setActiveScan] = useState<ScanAnalysis>(INITIAL_SCANS[0]);
  const [darkMode, setDarkMode] = useState<boolean>(() => window.localStorage.getItem('medvision-theme') === 'dark');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);
  const [isUploadDicomOpen, setIsUploadDicomOpen] = useState(false);
  const [initialUploadFile, setInitialUploadFile] = useState<File | null>(null);
  const [isHipaaOpen, setIsHipaaOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalConfig, setEmailModalConfig] = useState<{
    scan?: ScanAnalysis | null;
    patient?: Patient | null;
    report?: DiagnosticReport | null;
    recipientType?: 'patient' | 'doctor';
  }>({});

  const handleOpenEmailModal = (config: {
    scan?: ScanAnalysis | null;
    patient?: Patient | null;
    report?: DiagnosticReport | null;
    recipientType?: 'patient' | 'doctor';
  }) => {
    setEmailModalConfig(config);
    setIsEmailModalOpen(true);
  };

  const handleNavigateToPatient = (patientId?: string) => {
    if (patientId) {
      const matchP = patients.find((p) => p.id === patientId || p.mrn === patientId);
      if (matchP) {
        // If needed in future: set selected patient state
      }
    }
    setActiveTab('patients');
  };

  const handleNavigateToReport = (scanId?: string) => {
    setActiveTab('reports');
  };

  // Keyboard shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('medvision-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
  };

  const handleAddScan = (newScan: ScanAnalysis) => {
    setScans((prev) => [newScan, ...prev]);
    setActiveScan(newScan);
    setActiveTab('dashboard');
  };

  const openUploadModal = (file?: File) => {
    setInitialUploadFile(file ?? null);
    setIsUploadDicomOpen(true);
  };

  return (
    <div data-theme={darkMode ? 'dark' : 'light'} className="app-shell min-h-screen font-sans text-[#e5e5e5] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={scans.filter((s) => s.status === 'Critical').length}
        onUploadDicom={() => openUploadModal()}
        onCreatePatient={() => setIsCreatePatientOpen(true)}
        onShowHipaaModal={() => setIsHipaaOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAlerts={() => setActiveTab('alerts')}
          onOpenVideoModal={() => setIsVideoModalOpen(true)}
          alertCount={scans.filter((s) => s.status === 'Critical').length}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="app-content flex-1 pb-12">
          <Suspense fallback={<div className="p-8 text-sm text-[#737373]" role="status">Loading workspace…</div>}>
          {activeTab === 'dashboard' && (
            <DashboardView
              scans={scans}
              patients={patients}
              activeScan={activeScan}
              setActiveScan={setActiveScan}
              setActiveTab={setActiveTab}
              onOpenUploadModal={openUploadModal}
              onNavigateToPatient={handleNavigateToPatient}
              onNavigateToReport={handleNavigateToReport}
              onOpenEmailModal={handleOpenEmailModal}
            />
          )}

          {activeTab === 'new-scan' && (
            <NewScanView onAddScan={handleAddScan} />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              scans={scans}
              onCreatePatient={() => setIsCreatePatientOpen(true)}
              onSelectScan={(s) => {
                setActiveScan(s);
                setActiveTab('dashboard');
              }}
              onNavigateToReport={handleNavigateToReport}
              onOpenEmailModal={handleOpenEmailModal}
            />
          )}

          {activeTab === 'studies' && (
            <StudiesView
              scans={scans}
              onSelectScan={(s) => {
                setActiveScan(s);
                setActiveTab('dashboard');
              }}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'ai-models' && <AIModelsView />}

          {activeTab === 'alerts' && (
            <AlertsView
              scans={scans}
              onSelectScan={(s) => {
                setActiveScan(s);
                setActiveTab('dashboard');
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              scans={scans}
              onSelectScan={(s) => {
                setActiveScan(s);
                setActiveTab('dashboard');
              }}
              onNavigateToPatient={handleNavigateToPatient}
              onOpenEmailModal={handleOpenEmailModal}
            />
          )}

          {activeTab === 'integrations' && <IntegrationsView />}

          {activeTab === 'settings' && <SettingsView />}
          </Suspense>
        </main>
      </div>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        patients={patients}
        scans={scans}
        onSelectScan={(s) => {
          setActiveScan(s);
          setActiveTab('dashboard');
        }}
        onSelectPatient={() => {
          setActiveTab('patients');
        }}
      />

      <CreatePatientModal
        isOpen={isCreatePatientOpen}
        onClose={() => setIsCreatePatientOpen(false)}
        onAddPatient={handleAddPatient}
      />

      <UploadDicomModal
        isOpen={isUploadDicomOpen}
        onClose={() => {
          setIsUploadDicomOpen(false);
          setInitialUploadFile(null);
        }}
        onScanUploaded={handleAddScan}
        initialFile={initialUploadFile}
      />

      <HipaaModal
        isOpen={isHipaaOpen}
        onClose={() => setIsHipaaOpen(false)}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        scan={emailModalConfig.scan}
        patient={emailModalConfig.patient}
        report={emailModalConfig.report}
        recipientType={emailModalConfig.recipientType}
      />

      <AiVideoWalkthroughModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
