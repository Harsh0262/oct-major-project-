import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Upload,
  FileUp,
  CheckCircle2,
  Clock,
  Eye,
  TrendingUp,
  MoreVertical,
  Activity,
  User,
  ShieldAlert,
  Users,
  FileText,
  Mail,
  Scan as ScanIcon,
  Cpu,
} from 'lucide-react';
import { Patient, ScanAnalysis, TabType, DiagnosticReport } from '../types';
import { NetworkTopology } from '../components/NetworkTopology';
import { GradCamViewer } from '../components/GradCamViewer';
import { AiIngestionPipelineModal } from '../components/AiIngestionPipelineModal';

interface DashboardViewProps {
  scans: ScanAnalysis[];
  patients: Patient[];
  activeScan: ScanAnalysis;
  setActiveScan: (scan: ScanAnalysis) => void;
  setActiveTab: (tab: TabType) => void;
  onOpenUploadModal: (file?: File) => void;
  onNavigateToPatient?: (patientId: string) => void;
  onNavigateToReport?: (scanId: string) => void;
  onOpenEmailModal?: (config: { scan?: ScanAnalysis; patient?: Patient; report?: DiagnosticReport; recipientType?: 'patient' | 'doctor' }) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scans,
  patients,
  activeScan,
  setActiveScan,
  setActiveTab,
  onOpenUploadModal,
  onNavigateToPatient,
  onNavigateToReport,
  onOpenEmailModal,
}) => {
  const [formPatientId, setFormPatientId] = useState(activeScan.patientId || 'P-001247');
  const [formDoctorId, setFormDoctorId] = useState('DOC-101');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isIngestionPipelineOpen, setIsIngestionPipelineOpen] = useState(false);
  const [reviewQueueOnly, setReviewQueueOnly] = useState(false);
  const reviewQueue = scans.filter((scan) => scan.status === 'Critical' || scan.status === 'Pending');
  const visibleScans = reviewQueueOnly ? reviewQueue : scans;
  const averageConfidence = scans.length
    ? (scans.reduce((total, scan) => total + scan.confidence, 0) / scans.length).toFixed(1)
    : '—';
  const criticalCount = scans.filter((scan) => scan.status === 'Critical').length;

  return (
    <div className="p-4 space-y-4 max-w-[1700px] mx-auto text-[#e5e5e5]">
      {/* Top Hero & Model Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hero Section & Quick Stats (8 cols) */}
        <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
          <div className="p-6 rounded-2xl bg-[#080808] border border-[#1a1a1a] relative overflow-hidden">
            {/* Background ambient light */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#f27d26]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#f27d26] font-mono font-bold block mb-1">
                Clinical Intelligence Platform
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif italic text-[#f5f2ed] tracking-tight leading-tight">
                Radiology diagnostics with{' '}
                <span className="text-[#f27d26] not-italic font-sans font-semibold">explainable AI.</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#737373] leading-relaxed font-normal">
                Real-time Grad-CAM neural attention heatmaps & multi-label pathology prediction for chest radiographs and CT scans.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('new-scan')}
                  className="px-5 py-2.5 rounded-xl bg-[#f27d26] text-white font-medium text-xs hover:bg-[#e06c1b] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#f27d26]/10"
                >
                  <span>Start Diagnosis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsIngestionPipelineOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#111111] border border-[#38bdf8]/40 hover:border-[#38bdf8] text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-2 group bg-[#38bdf8]/5 hover:bg-[#38bdf8]/10"
                >
                  <Cpu className="w-4 h-4 text-[#38bdf8] group-hover:scale-110 transition-transform" />
                  <span>AI Pipeline Simulation</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-5 py-2.5 rounded-xl bg-[#111111] border border-[#262626] hover:border-[#333333] text-[#e5e5e5] text-xs font-medium transition-all cursor-pointer"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar with Spotlight Cards & Animated SVG Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card 1: Scans Today */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="flex items-center justify-between text-[#737373] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <ScanIcon className="w-4 h-4 text-[#f27d26]" />
                  <span className="font-medium text-white">Total Scans</span>
                </div>
              </div>

              <div className="mt-3 flex items-baseline">
                <div>
                  <span className="text-2xl font-bold text-white font-mono">{scans.length}</span>
                  <span className="ml-2 text-[10px] text-[#737373] font-medium">studies</span>
                </div>
              </div>
            </div>

            {/* Card 2: Avg Confidence */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="flex items-center justify-between text-[#737373] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#4ade80]" />
                  <span className="font-medium text-white">Avg. Confidence</span>
                </div>
              </div>

              <div className="mt-3 flex items-baseline">
                <div>
                  <span className="text-2xl font-bold text-white font-mono">{averageConfidence}%</span>
                  <span className="ml-2 text-[10px] text-[#737373] font-medium">average</span>
                </div>
              </div>
            </div>

            {/* Card 3: Critical Alerts */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="flex items-center justify-between text-[#737373] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                  <span className="font-medium text-white">Critical Alerts</span>
                </div>
              </div>

              <div className="mt-3 flex items-baseline">
                <div>
                  <span className="text-2xl font-bold text-[#ef4444] font-mono">{criticalCount}</span>
                  <span className="ml-2 text-[10px] text-[#737373] font-medium">need review</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Status Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#737373]">
                  Model Status
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#111111] text-[#4ade80] border border-[#262626]">
                  ONLINE
                </span>
                <MoreVertical className="w-3.5 h-3.5 text-[#404040]" />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-medium text-white">CNN-V4 • Grad-CAM</span>
              <span className="text-[9px] font-mono uppercase text-[#737373]">Latency (24h)</span>
            </div>

            {/* Topology + Micro Sparkline */}
            <div className="grid grid-cols-2 gap-2 mt-2 items-center">
              <NetworkTopology />

              {/* Performance 24h mini line graph */}
              <div className="h-28 bg-[#050505] rounded-xl border border-[#1a1a1a] p-2 flex flex-col justify-between">
                <div className="flex justify-between text-[9px] text-[#737373] font-mono">
                  <span>100%</span>
                  <span>95%</span>
                </div>
                <svg className="w-full h-12" viewBox="0 0 100 40">
                  <path
                    d="M 0 25 Q 25 10 50 20 T 100 12"
                    fill="none"
                    stroke="#f27d26"
                    strokeWidth="2"
                  />
                  <circle cx="100" cy="12" r="3" fill="#f27d26" />
                </svg>
                <div className="flex justify-between text-[8px] text-[#404040] font-mono">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Bottom Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1a1a1a] text-center">
            <div>
              <p className="text-[10px] text-[#737373]">Accuracy</p>
              <p className="text-sm font-bold text-white font-mono mt-0.5">96.4%</p>
              <p className="text-[9px] text-[#4ade80] font-mono">↑ 2.4%</p>
            </div>
            <div>
              <p className="text-[10px] text-[#737373]">Latency</p>
              <p className="text-sm font-bold text-white font-mono mt-0.5">1.2s</p>
              <p className="text-[9px] text-[#4ade80] font-mono">↓ 0.3s</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] text-[#737373]">Uptime</p>
              <div className="relative w-7 h-7 mt-0.5 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="14" cy="14" r="11" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    stroke="#4ade80"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="69"
                    strokeDashoffset="2"
                  />
                </svg>
                <span className="absolute text-[8px] font-mono font-bold text-white">99%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Core Grid: Form (3 cols), GradCAM Viewer (5 cols), Findings Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* New Diagnosis Form Card (3 cols) */}
        <div className="lg:col-span-3 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#737373]">New Diagnosis</h3>
              <MoreVertical className="w-3.5 h-3.5 text-[#404040]" />
            </div>
            <p className="text-xs text-[#a3a3a3] mb-3">Upload scan for neural analysis</p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formPatientId}
                    onChange={(e) => setFormPatientId(e.target.value)}
                    placeholder="Patient ID"
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-[#525252] outline-none focus:border-[#f27d26]/50 font-mono text-xs transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <ScanIcon className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formDoctorId}
                    onChange={(e) => setFormDoctorId(e.target.value)}
                    placeholder="Doctor ID"
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-[#525252] outline-none focus:border-[#f27d26]/50 font-mono text-xs transition-colors"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Clinical Notes (optional)"
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-3 text-white placeholder-[#404040] outline-none focus:border-[#262626] text-xs resize-none"
                />
              </div>

              <button
                onClick={() => onOpenUploadModal()}
                className="w-full py-2.5 rounded-xl bg-[#f27d26] text-white font-medium text-xs hover:bg-[#e06c1b] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Run AI Diagnosis</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) onOpenUploadModal(file);
            }}
            className="mt-4 border border-dashed border-[#262626] hover:border-[#f27d26] bg-[#050505] rounded-xl p-5 text-center cursor-pointer transition-colors group relative"
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onOpenUploadModal(file);
                e.target.value = '';
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              aria-label="Choose a scan image"
            />
            <Upload className="w-5 h-5 text-[#737373] group-hover:text-[#f27d26] mx-auto transition-colors" />
            <p className="mt-2 text-xs font-medium text-[#e5e5e5]">
              Drop PNG, JPEG, or WebP scan
            </p>
            <p className="text-[10px] text-[#f27d26] mt-0.5">
              or click to browse · DICOM slice export required
            </p>
          </div>
        </div>

        {/* AI Analysis Result Scan Viewer (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <GradCamViewer
            scan={activeScan}
            allScans={scans}
            onSelectScan={(s) => setActiveScan(s)}
          />
        </div>

        {/* AI Findings Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#1a1a1a] pb-2">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373]">AI Findings</h3>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs text-[#f27d26] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View full report</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Top Primary Finding Highlight */}
            <div className="grid grid-cols-3 gap-2 bg-[#050505] border border-[#1a1a1a] rounded-xl p-3 items-center">
              <div>
                <p className="text-[10px] text-[#737373]">Finding</p>
                <p className="text-base font-bold text-white mt-0.5">{activeScan.finding}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-[#737373]">Confidence</p>
                <p className="text-lg font-bold text-[#4ade80] font-mono mt-0.5">
                  {activeScan.confidence}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#737373]">Severity</p>
                <span className="inline-flex items-center gap-1 text-[#f27d26] font-medium text-xs mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {activeScan.severity}
                </span>
              </div>
            </div>

            {/* Confidence Gauge Bar */}
            <div className="mt-2 w-full bg-[#050505] h-1.5 rounded-full overflow-hidden border border-[#1a1a1a]">
              <div
                className="bg-[#4ade80] h-full rounded-full transition-all duration-500"
                style={{ width: `${activeScan.confidence}%` }}
              />
            </div>

            {/* Affected Region Diagram & Heatmap Scale */}
            <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
              <div className="flex items-center justify-between text-xs font-medium text-[#e5e5e5] mb-2">
                <span>Affected Region</span>
                <span className="text-[10px] text-[#737373] font-mono">{activeScan.affectedRegion}</span>
              </div>

              {/* Heatmap intensity gradient bar */}
              <div className="flex items-center justify-between text-[9px] text-[#737373] mb-1">
                <span>Heatmap intensity</span>
                <div className="flex items-center gap-2">
                  <span>Low</span>
                  <div className="w-24 h-1 rounded-full bg-gradient-to-r from-[#4ade80] via-yellow-400 to-[#f27d26]" />
                  <span>High</span>
                </div>
              </div>

              {/* Vector Lung Anatomy Graphic */}
              <div className="h-28 bg-[#050505] rounded-xl border border-[#1a1a1a] p-2 flex items-center justify-center relative">
                <svg className="h-full w-auto" viewBox="0 0 160 120">
                  <rect x="75" y="10" width="10" height="25" fill="#262626" rx="2" />
                  <path d="M 70 35 C 30 35 20 70 30 110 C 65 110 75 90 70 35 Z" fill="#111111" stroke="#262626" />
                  <path d="M 90 35 C 130 35 140 70 130 110 C 95 110 85 90 90 35 Z" fill="#111111" stroke="#262626" />
                  <circle cx="115" cy="85" r="14" fill="#f27d26" opacity="0.8" className="animate-pulse" />
                  <circle cx="115" cy="85" r="6" fill="#facc15" />
                </svg>
              </div>
            </div>

            {/* Top Predictions */}
            <div className="mt-4 pt-3 border-t border-[#1a1a1a] space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#737373]">Top Predictions</p>
              <div className="space-y-1.5 text-xs">
                {activeScan.topPredictions.map((pred, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#e5e5e5]">{pred.condition}</span>
                      <span className="text-[#4ade80] font-mono font-bold">{pred.confidence}%</span>
                    </div>
                    <div className="w-full bg-[#050505] h-1 rounded-full overflow-hidden border border-[#1a1a1a]">
                      <div
                        className="bg-[#4ade80] h-full rounded-full"
                        style={{ width: `${pred.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-System Navigation & Email Integration */}
            <div className="mt-4 pt-3 border-t border-[#1a1a1a] space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#f27d26]">Interconnected Clinical Actions</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => {
                    if (onNavigateToPatient) onNavigateToPatient(activeScan.patientId);
                    else setActiveTab('patients');
                  }}
                  className="px-2.5 py-2 bg-[#050505] hover:bg-[#111111] border border-[#1a1a1a] hover:border-[#f27d26]/50 rounded-xl text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Open Patient Registry & Clinical Timeline"
                >
                  <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Patient Profile</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigateToReport) onNavigateToReport(activeScan.id);
                    else setActiveTab('reports');
                  }}
                  className="px-2.5 py-2 bg-[#050505] hover:bg-[#111111] border border-[#1a1a1a] hover:border-[#f27d26]/50 rounded-xl text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Open Structured Radiology PDF Report"
                >
                  <FileText className="w-3.5 h-3.5 text-[#f27d26]" />
                  <span>View Report</span>
                </button>

                <button
                  onClick={() => {
                    const matchP = patients.find((p) => p.id === activeScan.patientId || p.name === activeScan.patientName);
                    if (onOpenEmailModal) {
                      onOpenEmailModal({ scan: activeScan, patient: matchP || null, recipientType: 'patient' });
                    }
                  }}
                  className="px-2.5 py-2 bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] rounded-xl text-[#4ade80] text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Send scan summary or report to Doctor or Patient via Email"
                >
                  <Mail className="w-3.5 h-3.5 text-[#4ade80]" />
                  <span>Email Update</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Analyses Table (8 cols) & Recent Activity Timeline (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Analyses Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-[#1a1a1a] pb-2">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373]">Recent Analyses</h3>
              <p className="text-xs text-[#a3a3a3]">
                {reviewQueueOnly ? 'Critical and pending studies' : 'Latest diagnostic results across all patients'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('studies')}
              className="text-xs text-[#f27d26] hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <span />
            <button
              type="button"
              onClick={() => setReviewQueueOnly((current) => !current)}
              aria-pressed={reviewQueueOnly}
              className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                reviewQueueOnly
                  ? 'border-[#f27d26]/50 bg-[#f27d26]/10 text-[#f27d26]'
                  : 'border-[#262626] bg-[#050505] text-[#a3a3a3] hover:border-[#f27d26]/40 hover:text-white'
              }`}
            >
              Review queue · {reviewQueue.length}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#e5e5e5]">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-[#737373] font-mono text-[10px] uppercase">
                  <th className="py-2 px-2">Patient</th>
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Study</th>
                  <th className="py-2 px-2">Finding</th>
                  <th className="py-2 px-2">Confidence</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Date & Time</th>
                  <th className="py-2 px-2">Doctor</th>
                  <th className="py-2 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {visibleScans.slice(0, 5).map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setActiveScan(row)}
                    className={`hover:bg-[#0d0d0d] transition-colors cursor-pointer ${
                      row.id === activeScan.id ? 'bg-[#111111]' : ''
                    }`}
                  >
                    <td className="py-2.5 px-2 font-medium text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#111111] border border-[#262626] text-[10px] font-mono text-[#f27d26] flex items-center justify-center">
                        {row.patientName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <span>{row.patientName}</span>
                        <p className="text-[9px] text-[#737373]">{row.patientAge}M</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[#737373] text-[11px]">{row.id}</td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#050505] border border-[#1a1a1a] text-[10px] text-[#a3a3a3]">
                        {row.study}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-white">{row.finding}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-[#4ade80]">{row.confidence}%</span>
                        <div className="w-12 bg-[#050505] h-1 rounded-full overflow-hidden border border-[#1a1a1a]">
                          <div
                            className="bg-[#4ade80] h-full"
                            style={{ width: `${row.confidence}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                          row.status === 'Critical'
                            ? 'bg-[#1a0808] text-[#f27d26] border-[#f27d26]/40'
                            : row.status === 'Reviewed'
                            ? 'bg-[#081a0e] text-[#4ade80] border-[#4ade80]/40'
                            : 'bg-[#08121a] text-[#38bdf8] border-[#38bdf8]/40'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-[#737373] text-[11px]">{row.dateTime}</td>
                    <td className="py-2.5 px-2 text-[#a3a3a3]">{row.doctor}</td>
                    <td className="py-2.5 px-2 text-right">
                      <button className="p-1 rounded hover:bg-[#111111] text-[#737373] hover:text-white transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleScans.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs text-[#737373]">
                      {reviewQueueOnly ? 'No critical or pending studies to review.' : 'No studies yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Stream (4 cols) */}
        <div className="lg:col-span-4 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-[#1a1a1a] pb-2">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373]">Recent Activity</h3>
            <button className="text-xs text-[#737373] hover:text-white flex items-center gap-1">
              <span>View all</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-[#4ade80] shrink-0">
                <Upload className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">New scan uploaded</p>
                <p className="text-[11px] text-[#737373] font-mono">MV-2024-001248</p>
              </div>
              <span className="text-[10px] text-[#404040]">2 min ago</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-[#f27d26] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">AI analysis completed</p>
                <p className="text-[11px] text-[#737373] font-mono">MV-2024-001247</p>
              </div>
              <span className="text-[10px] text-[#404040]">4 min ago</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-[#e5e5e5] shrink-0">
                <FileUp className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Report generated</p>
                <p className="text-[11px] text-[#737373] font-mono">MV-2024-001246</p>
              </div>
              <span className="text-[10px] text-[#404040]">15 min ago</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-[#f27d26] shrink-0">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Critical alert triggered</p>
                <p className="text-[11px] text-[#f27d26]">High severity detected</p>
              </div>
              <span className="text-[10px] text-[#404040]">22 min ago</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-[#4ade80] shrink-0">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Model retrained</p>
                <p className="text-[11px] text-[#737373] font-mono">CNN-V4</p>
              </div>
              <span className="text-[10px] text-[#404040]">1 hr ago</span>
            </div>
          </div>
        </div>
      </div>

      <AiIngestionPipelineModal
        isOpen={isIngestionPipelineOpen}
        onClose={() => setIsIngestionPipelineOpen(false)}
      />
    </div>
  );
};
