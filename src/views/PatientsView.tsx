import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Activity,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Eye,
  Stethoscope,
  Maximize2,
  BrainCircuit,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Patient, ScanAnalysis, SeverityType, ModalityType, DiagnosticReport } from '../types';
import { generateMedicalScanSvg } from '../data/mockData';

interface PatientsViewProps {
  patients: Patient[];
  scans: ScanAnalysis[];
  onCreatePatient: () => void;
  onSelectScan: (scan: ScanAnalysis) => void;
  onNavigateToReport?: (scanId?: string) => void;
  onOpenEmailModal?: (config: { scan?: ScanAnalysis | null; patient?: Patient | null; report?: DiagnosticReport | null; recipientType?: 'patient' | 'doctor' }) => void;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  type: 'scan' | 'clinical_note' | 'ai_re-evaluation' | 'followup';
  title: string;
  modality?: ModalityType;
  study?: string;
  finding: string;
  confidence: number;
  severity: SeverityType;
  aiModel: string;
  affectedRegion: string;
  summary: string;
  recommendedAction?: string;
  doctor: string;
  thumbnailUrl?: string;
  scanRef?: ScanAnalysis;
  topPredictions?: { condition: string; confidence: number }[];
  isCurrentScan?: boolean;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  scans,
  onCreatePatient,
  onSelectScan,
  onNavigateToReport,
  onOpenEmailModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'trajectory' | 'bio'>('timeline');

  // Timeline Filters & Sorting
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'scans' | 'critical' | 'notes'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || p.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Generate enriched multi-visit clinical timeline for selected patient
  const patientTimeline = useMemo(() => {
    if (!selectedPatient) return [];

    const matchingScans = scans.filter(
      (s) => s.patientId === selectedPatient.id || s.patientName.toLowerCase() === selectedPatient.name.toLowerCase()
    );

    const events: TimelineEvent[] = [];

    // Add current real scans from state
    matchingScans.forEach((scan, index) => {
      events.push({
        id: `event-scan-${scan.id}`,
        date: scan.dateTime.split(' • ')[0] || scan.dateTime,
        time: scan.dateTime.split(' • ')[1] || '14:30',
        timestamp: new Date(scan.dateTime.split(' • ')[0] || Date.now()).getTime() || Date.now() - index * 86400000,
        type: 'scan',
        title: `${scan.modality} Scan & AI Diagnostic Analysis`,
        modality: scan.modality,
        study: scan.study,
        finding: scan.finding,
        confidence: scan.confidence,
        severity: scan.severity,
        aiModel: scan.aiModel,
        affectedRegion: scan.affectedRegion,
        summary: scan.summary || `Primary AI neural analysis identified ${scan.finding} in ${scan.affectedRegion}.`,
        recommendedAction: scan.recommendedAction || 'Schedule follow-up radiologist verification and monitor clinical vitals.',
        doctor: scan.doctor,
        thumbnailUrl: scan.thumbnailUrl,
        scanRef: scan,
        topPredictions: scan.topPredictions,
        isCurrentScan: true,
      });
    });

    // Generate historical baseline and previous clinical events for longitudinal timeline view
    if (selectedPatient.id === 'P-001247') {
      // Michael Turner Timeline
      events.push(
        {
          id: 'hist-mt-1',
          date: 'May 28, 2024',
          time: '09:15 EST',
          timestamp: new Date('May 28, 2024').getTime(),
          type: 'scan',
          title: 'High-Resolution Outpatient CT Chest',
          modality: 'CT',
          study: 'CT Chest HRCT',
          finding: 'Early Bilateral Infiltration',
          confidence: 88.4,
          severity: 'High',
          aiModel: 'ResNet50-CT-V2',
          affectedRegion: 'Lower Right & Left Lungs',
          summary: 'Increased interstitial markings with early basilar opacity. Grad-CAM indicates neural heat spots near posterior segment.',
          recommendedAction: 'Prescribe outpatient oral antibiotics; schedule repeat X-Ray if dyspnea worsens.',
          doctor: 'Dr. Rohan',
          thumbnailUrl: generateMedicalScanSvg('ct_scan', true),
          topPredictions: [
            { condition: 'Infiltration', confidence: 88.4 },
            { condition: 'Atelectasis', confidence: 64.2 },
            { condition: 'Effusion', confidence: 32.1 },
          ],
        },
        {
          id: 'hist-mt-2',
          date: 'Feb 12, 2024',
          time: '11:00 EST',
          timestamp: new Date('Feb 12, 2024').getTime(),
          type: 'scan',
          title: 'Routine Baseline PA Chest Radiograph',
          modality: 'XR',
          study: 'XR Chest',
          finding: 'Mild Bronchitic Markings',
          confidence: 76.5,
          severity: 'Mild',
          aiModel: 'DenseNet121-V4',
          affectedRegion: 'Perihilar Regions',
          summary: 'Clear cardiac silhouette. Mild bronchial wall thickening without focal consolidation.',
          recommendedAction: 'Routine annual follow-up; smoking cessation counseling advised.',
          doctor: 'Dr. Meera',
          thumbnailUrl: generateMedicalScanSvg('chest_xray', false),
          topPredictions: [
            { condition: 'Normal', confidence: 76.5 },
            { condition: 'Bronchitis', confidence: 42.0 },
          ],
        },
        {
          id: 'hist-mt-3',
          date: 'Nov 10, 2023',
          time: '14:20 EST',
          timestamp: new Date('Nov 10, 2023').getTime(),
          type: 'clinical_note',
          title: 'Pulmonary Consultation & Intake Note',
          finding: 'Intake Evaluation & Respiratory Baseline',
          confidence: 100,
          severity: 'Normal',
          aiModel: 'Clinical NLP-V1',
          affectedRegion: 'Systemic Pulmonary',
          summary: 'Patient presented with seasonal cough. SpO2 98% on room air. Vitals stable.',
          recommendedAction: 'Baseline imaging ordered.',
          doctor: 'Dr. Rohan',
        }
      );
    } else if (selectedPatient.id === 'P-001246') {
      // Angela Smith Timeline
      events.push(
        {
          id: 'hist-as-1',
          date: 'Apr 18, 2024',
          time: '10:45 EST',
          timestamp: new Date('Apr 18, 2024').getTime(),
          type: 'scan',
          title: 'Follow-up PA Chest Radiograph',
          modality: 'XR',
          study: 'XR Chest',
          finding: 'Stable Parenchymal Density',
          confidence: 84.1,
          severity: 'Moderate',
          aiModel: 'DenseNet121-V4',
          affectedRegion: 'Right Upper Lobe',
          summary: '6mm focal opacity noted in right upper zone. AI confidence stable compared to prior study.',
          recommendedAction: 'Order High-Resolution CT for volumetric characterization.',
          doctor: 'Dr. Meera',
          thumbnailUrl: generateMedicalScanSvg('chest_xray', true),
          topPredictions: [
            { condition: 'Nodule', confidence: 84.1 },
            { condition: 'Granuloma', confidence: 51.3 },
          ],
        },
        {
          id: 'hist-as-2',
          date: 'Dec 05, 2023',
          time: '15:30 EST',
          timestamp: new Date('Dec 05, 2023').getTime(),
          type: 'scan',
          title: 'Screening Chest Radiograph',
          modality: 'XR',
          study: 'XR Chest',
          finding: 'Sub-centimeter Calcification',
          confidence: 79.2,
          severity: 'Mild',
          aiModel: 'DenseNet121-V4',
          affectedRegion: 'Right Upper Lobe',
          summary: 'Calcified granulomatous lesion noted in RUL. No associated hilar adenopathy.',
          recommendedAction: 'Follow-up radiograph in 6 months.',
          doctor: 'Dr. Meera',
          thumbnailUrl: generateMedicalScanSvg('chest_xray', false),
          topPredictions: [
            { condition: 'Granuloma', confidence: 79.2 },
            { condition: 'Normal', confidence: 68.0 },
          ],
        }
      );
    } else if (selectedPatient.id === 'P-001245') {
      // James Brown Timeline
      events.push(
        {
          id: 'hist-jb-1',
          date: 'Mar 14, 2024',
          time: '13:10 EST',
          timestamp: new Date('Mar 14, 2024').getTime(),
          type: 'scan',
          title: 'Non-Contrast Brain CT',
          modality: 'CT',
          study: 'CT Head',
          finding: 'Hypodense Mass Region',
          confidence: 87.6,
          severity: 'High',
          aiModel: 'Brain3D-CNN-V2',
          affectedRegion: 'Left Temporal Lobe',
          summary: 'Subtle hypodensity in left temporal parenchyma with minimal mass effect.',
          recommendedAction: 'Urgent contrast-enhanced MRI Brain requested.',
          doctor: 'Dr. Sarah',
          thumbnailUrl: generateMedicalScanSvg('ct_scan', true),
          topPredictions: [
            { condition: 'Neoplasm', confidence: 87.6 },
            { condition: 'Ischemia', confidence: 45.2 },
          ],
        },
        {
          id: 'hist-jb-2',
          date: 'Jan 02, 2024',
          time: '09:00 EST',
          timestamp: new Date('Jan 02, 2024').getTime(),
          type: 'clinical_note',
          title: 'Neurology Consultation',
          finding: 'Persistent Cephalea & Focal Symptoms',
          confidence: 100,
          severity: 'Moderate',
          aiModel: 'Clinical NLP-V1',
          affectedRegion: 'Cranial / Neurological',
          summary: 'Patient reports progressive left temporal headaches over 3 weeks.',
          recommendedAction: 'Diagnostic Head CT scheduled.',
          doctor: 'Dr. Sarah',
        }
      );
    } else {
      // General fallback prior events for other patients
      events.push(
        {
          id: `hist-gen-1-${selectedPatient.id}`,
          date: 'Jan 10, 2024',
          time: '11:30 EST',
          timestamp: new Date('Jan 10, 2024').getTime(),
          type: 'scan',
          title: 'Historical Baseline Radiograph',
          modality: selectedPatient.lastScanType.includes('CT') ? 'CT' : selectedPatient.lastScanType.includes('MRI') ? 'MRI' : 'XR',
          study: selectedPatient.lastScanType,
          finding: 'Normal Baseline Scan',
          confidence: 96.0,
          severity: 'Normal',
          aiModel: 'DenseNet121-V4',
          affectedRegion: 'Unremarkable',
          summary: 'Baseline anatomical examination shows no focal acute abnormalities.',
          recommendedAction: 'Routine preventive monitoring.',
          doctor: selectedPatient.assignedDoctor,
          thumbnailUrl: generateMedicalScanSvg('chest_xray', false),
          topPredictions: [{ condition: 'Normal', confidence: 96.0 }],
        }
      );
    }

    // Apply Filter
    let filtered = events.filter((ev) => {
      if (timelineFilter === 'scans') return ev.type === 'scan';
      if (timelineFilter === 'critical') return ev.severity === 'Critical' || ev.severity === 'High';
      if (timelineFilter === 'notes') return ev.type === 'clinical_note';
      return true;
    });

    // Apply Sorting
    filtered.sort((a, b) => (sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp));

    return filtered;
  }, [selectedPatient, scans, timelineFilter, sortOrder]);

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-4 text-[#e5e5e5]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a] pb-3">
        <div>
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#f27d26]" />
            <span>Patient Registry & Longitudinal Clinical Timeline</span>
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            HIPAA compliant patient records with AI-driven historical diagnostic findings & Grad-CAM visual heatmaps
          </p>
        </div>

        <button
          onClick={onCreatePatient}
          className="px-4 py-2 bg-[#f27d26] text-white font-medium text-xs rounded-xl hover:bg-[#e06c1b] transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-lg shadow-[#f27d26]/10"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Filter & Search Controls for Directory */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#737373] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name, MRN, ID..."
            className="w-full bg-[#080808] border border-[#1a1a1a] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-[#737373] outline-none focus:border-[#262626]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-mono text-[#737373] uppercase mr-1 hidden md:inline">Status:</span>
          {['All', 'Critical', 'Active', 'Follow-up', 'Cleared'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                selectedFilter === status
                  ? 'bg-[#111111] text-[#f27d26] border border-[#f27d26]/40'
                  : 'bg-[#080808] text-[#737373] border border-[#1a1a1a] hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Directory Left (5 cols) & Extended Clinical Timeline Panel Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Patient Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#737373] px-1">
            <span>SHOWING {filteredPatients.length} PATIENTS</span>
            <span>SELECT TO INSPECT TIMELINE</span>
          </div>

          <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatient?.id === patient.id;
              return (
                <div
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setExpandedEventId(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] border-[#f27d26] shadow-xl shadow-[#f27d26]/5'
                      : 'bg-[#080808] border-[#1a1a1a] hover:border-[#262626]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#050505] border border-[#1a1a1a] flex items-center justify-center font-mono font-bold text-[#f27d26] text-sm">
                        {patient.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">{patient.name}</h3>
                          <span className="text-[10px] font-mono text-[#737373]">({patient.id})</span>
                        </div>
                        <p className="text-[11px] text-[#737373]">
                          {patient.age} yrs • {patient.gender} • MRN: <span className="font-mono text-[#a3a3a3]">{patient.mrn}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border ${
                        patient.status === 'Critical'
                          ? 'bg-[#1a0909] text-[#ef4444] border-[#ef4444]/40 animate-pulse'
                          : patient.status === 'Active'
                          ? 'bg-[#111111] text-[#4ade80] border-[#4ade80]/40'
                          : patient.status === 'Follow-up'
                          ? 'bg-[#1a1409] text-[#eab308] border-[#eab308]/40'
                          : 'bg-[#050505] text-[#737373] border-[#1a1a1a]'
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#1a1a1a] grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#404040] block text-[9px] font-mono uppercase">Primary Finding</span>
                      <span className="font-medium text-white truncate block">{patient.primaryFinding}</span>
                    </div>
                    <div>
                      <span className="text-[#404040] block text-[9px] font-mono uppercase">Last Scan</span>
                      <span className="text-[#a3a3a3] font-mono truncate block">{patient.lastScanType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#404040] block text-[9px] font-mono uppercase">Doctor</span>
                      <span className="text-[#f27d26] font-medium">{patient.assignedDoctor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Extended Clinical Timeline & Patient Detail Panel (7 cols) */}
        <div className="lg:col-span-7 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          {selectedPatient ? (
            <div className="space-y-4">
              {/* Header Profile Summary */}
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#262626] flex items-center justify-center font-serif text-lg text-white italic">
                    {selectedPatient.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-serif italic text-white">{selectedPatient.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111111] border border-[#262626] text-[#4ade80]">
                        {selectedPatient.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] font-mono mt-0.5">
                      MRN: {selectedPatient.mrn} • DOB: {selectedPatient.dob} ({selectedPatient.age}y/{selectedPatient.gender})
                    </p>
                    <p className="text-[11px] text-[#a3a3a3] font-mono flex items-center gap-2 mt-1">
                      <Mail className="w-3 h-3 text-[#f27d26]" />
                      <span>{selectedPatient.email || `${selectedPatient.name.toLowerCase().replace(/\s+/g, '.')}@example.com`}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t sm:border-t-0 border-[#1a1a1a] pt-2 sm:pt-0">
                  <div className="text-left sm:text-right mr-1">
                    <span className="text-[9px] font-mono uppercase text-[#737373] block">Attending Physician</span>
                    <span className="text-xs font-semibold text-[#f27d26]">{selectedPatient.assignedDoctor}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (onOpenEmailModal) {
                          onOpenEmailModal({ patient: selectedPatient, recipientType: 'patient' });
                        }
                      }}
                      className="px-2.5 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-[#4ade80] font-mono text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Send email report / update to patient or doctor"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Patient / Doctor</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onNavigateToReport) {
                          onNavigateToReport();
                        }
                      }}
                      className="px-2.5 py-1.5 bg-[#080808] hover:bg-[#111111] border border-[#1a1a1a] text-white font-mono text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="View all structured radiology reports"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#f27d26]" />
                      <span>Reports</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                      activeTab === 'timeline'
                        ? 'bg-[#111111] text-[#f27d26] border border-[#f27d26]/40'
                        : 'text-[#737373] hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Clinical Timeline</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('trajectory')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                      activeTab === 'trajectory'
                        ? 'bg-[#111111] text-[#f27d26] border border-[#f27d26]/40'
                        : 'text-[#737373] hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Disease Trajectory</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bio')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                      activeTab === 'bio'
                        ? 'bg-[#111111] text-[#f27d26] border border-[#f27d26]/40'
                        : 'text-[#737373] hover:text-white'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Demographics & Vitals</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: CLINICAL TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  {/* Timeline Filter Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-[#050505] p-2.5 rounded-xl border border-[#1a1a1a]">
                    <div className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#737373] ml-1" />
                      <span className="text-[10px] font-mono text-[#737373] mr-1">FILTER:</span>
                      {(
                        [
                          { id: 'all', label: 'All Events' },
                          { id: 'scans', label: 'Scans Only' },
                          { id: 'critical', label: 'Critical / High' },
                          { id: 'notes', label: 'Clinical Notes' },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setTimelineFilter(f.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                            timelineFilter === f.id
                              ? 'bg-[#111111] text-white border border-[#262626]'
                              : 'text-[#737373] hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                      className="px-2.5 py-1 bg-[#111111] border border-[#1a1a1a] rounded text-[10px] font-mono text-[#a3a3a3] hover:text-white transition-colors flex items-center gap-1 cursor-pointer ml-auto"
                    >
                      <ArrowUpDown className="w-3 h-3 text-[#f27d26]" />
                      <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                    </button>
                  </div>

                  {/* Vertical Chronological Stepper */}
                  {patientTimeline.length === 0 ? (
                    <div className="text-center py-12 text-[#737373] bg-[#050505] rounded-xl border border-[#1a1a1a]">
                      <Layers className="w-8 h-8 text-[#404040] mx-auto mb-2" />
                      <p className="text-xs font-mono">No timeline events match the selected filter</p>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1a1a1a]">
                      {patientTimeline.map((ev, idx) => {
                        const isExpanded = expandedEventId === ev.id;
                        const isCritical = ev.severity === 'Critical' || ev.severity === 'High';

                        return (
                          <div key={ev.id} className="relative group">
                            {/* Milestone Marker Dot */}
                            <div
                              className={`absolute -left-[23px] top-3.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                                ev.severity === 'Critical'
                                  ? 'bg-[#ef4444] border-black text-white shadow-lg shadow-[#ef4444]/40'
                                  : ev.severity === 'High'
                                  ? 'bg-[#f97316] border-black text-white'
                                  : ev.severity === 'Moderate'
                                  ? 'bg-[#eab308] border-black text-white'
                                  : 'bg-[#4ade80] border-black text-white'
                              }`}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>

                            {/* Event Card */}
                            <div
                              className={`bg-[#050505] border rounded-2xl p-4 transition-all ${
                                isCritical ? 'border-[#ef4444]/30 bg-[#0a0505]' : 'border-[#1a1a1a] hover:border-[#262626]'
                              }`}
                            >
                              {/* Top Bar of Event */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-white">{ev.title}</span>
                                    {ev.modality && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111111] border border-[#262626] text-[#f27d26]">
                                        {ev.modality}
                                      </span>
                                    )}
                                    {ev.isCurrentScan && (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]">
                                        LATEST DICOM
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-[#737373] font-mono mt-0.5">
                                    {ev.date} • {ev.time} • Attending: {ev.doctor}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                                      ev.severity === 'Critical'
                                        ? 'bg-[#1a0909] text-[#ef4444] border-[#ef4444]/40'
                                        : ev.severity === 'High'
                                        ? 'bg-[#1c1209] text-[#f97316] border-[#f97316]/40'
                                        : ev.severity === 'Moderate'
                                        ? 'bg-[#1c1909] text-[#eab308] border-[#eab308]/40'
                                        : 'bg-[#091a0e] text-[#4ade80] border-[#4ade80]/40'
                                    }`}
                                  >
                                    {ev.severity}
                                  </span>

                                  <button
                                    onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                                    className="p-1 rounded text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
                                  >
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>

                              {/* Primary Diagnosis & AI Metric Banner */}
                              <div className="mt-3 p-3 rounded-xl bg-[#080808] border border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <span className="text-[9px] font-mono uppercase text-[#737373]">Primary AI Finding</span>
                                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                                    <span>{ev.finding}</span>
                                    <span className="text-xs text-[#737373] font-mono">({ev.affectedRegion})</span>
                                  </p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div>
                                    <span className="text-[9px] font-mono uppercase text-[#737373] block">AI Confidence</span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${
                                            ev.confidence > 90 ? 'bg-[#ef4444]' : ev.confidence > 80 ? 'bg-[#f27d26]' : 'bg-[#4ade80]'
                                          }`}
                                          style={{ width: `${ev.confidence}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-mono font-bold text-white">{ev.confidence.toFixed(1)}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Grad-CAM & Detailed Findings (Always shown or Expanded) */}
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                {ev.thumbnailUrl && (
                                  <div className="md:col-span-4 bg-black rounded-xl border border-[#1a1a1a] p-1.5 flex flex-col items-center justify-center relative overflow-hidden group/img">
                                    <img src={ev.thumbnailUrl} alt={ev.title} className="max-h-24 w-auto object-contain" />
                                    <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-[#080808]/90 text-[#f27d26] px-1.5 py-0.5 rounded border border-[#1a1a1a]">
                                      GRAD-CAM HOTSPOT
                                    </span>
                                  </div>
                                )}

                                <div className={`${ev.thumbnailUrl ? 'md:col-span-8' : 'md:col-span-12'} space-y-1.5 text-xs`}>
                                  <p className="text-[#a3a3a3] leading-relaxed line-clamp-2">{ev.summary}</p>
                                  {ev.recommendedAction && (
                                    <div className="flex items-start gap-1.5 text-[11px] text-[#f27d26] bg-[#f27d26]/5 p-2 rounded-lg border border-[#f27d26]/20">
                                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#f27d26]" />
                                      <span>
                                        <strong>AI Protocol Rec:</strong> {ev.recommendedAction}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Expanded AI Predictions & Action Buttons */}
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-[#1a1a1a] space-y-3 text-xs">
                                  {/* Top Predictions Bar Chart */}
                                  {ev.topPredictions && ev.topPredictions.length > 0 && (
                                    <div>
                                      <span className="text-[10px] font-mono uppercase text-[#737373] block mb-1.5">
                                        Neural Network Classification Distribution
                                      </span>
                                      <div className="space-y-1.5 bg-[#080808] p-3 rounded-xl border border-[#1a1a1a]">
                                        {ev.topPredictions.map((pred, pIdx) => (
                                          <div key={pIdx} className="flex items-center justify-between text-[11px]">
                                            <span className="text-white font-medium w-36 truncate">{pred.condition}</span>
                                            <div className="flex-1 mx-3 bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                                              <div
                                                className="h-full bg-[#f27d26] rounded-full"
                                                style={{ width: `${pred.confidence}%` }}
                                              />
                                            </div>
                                            <span className="font-mono text-[#a3a3a3] w-12 text-right">{pred.confidence.toFixed(1)}%</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1a1a1a]/60">
                                    <span className="text-[10px] font-mono text-[#737373]">Model: {ev.aiModel}</span>

                                    <div className="flex items-center gap-2">
                                      {ev.scanRef && (
                                        <button
                                          onClick={() => onSelectScan(ev.scanRef!)}
                                          className="px-2.5 py-1.5 bg-[#f27d26] hover:bg-[#e06c1b] text-white font-medium text-[11px] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                          <span>Grad-CAM Viewer</span>
                                        </button>
                                      )}

                                      <button
                                        onClick={() => {
                                          if (onNavigateToReport) onNavigateToReport(ev.scanRef?.id);
                                        }}
                                        className="px-2.5 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-white font-mono text-[11px] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-[#f27d26]" />
                                        <span>Report</span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          if (onOpenEmailModal) {
                                            onOpenEmailModal({
                                              scan: ev.scanRef || null,
                                              patient: selectedPatient,
                                              recipientType: 'patient',
                                            });
                                          }
                                        }}
                                        className="px-2.5 py-1.5 bg-[#080808] hover:bg-[#111111] border border-[#1a1a1a] text-[#4ade80] font-mono text-[11px] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>Email</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DISEASE TRAJECTORY */}
              {activeTab === 'trajectory' && (
                <div className="space-y-4 bg-[#050505] p-5 rounded-2xl border border-[#1a1a1a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#f27d26]" />
                        <span>AI Neural Risk Trajectory & Progression</span>
                      </h4>
                      <p className="text-xs text-[#737373]">
                        Historical longitudinal AI confidence score progression across diagnostic imaging sessions
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#111111] border border-[#262626] text-[#4ade80] text-xs font-mono">
                      Active Trend
                    </span>
                  </div>

                  {/* Visual Confidence Chart simulation */}
                  <div className="bg-[#080808] p-4 rounded-xl border border-[#1a1a1a] space-y-3">
                    <span className="text-[10px] font-mono text-[#737373] uppercase">AI Confidence Score Evolution (%)</span>

                    <div className="h-40 flex items-end justify-between gap-3 pt-4 border-b border-[#1a1a1a] px-2">
                      {patientTimeline.map((ev, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-mono font-bold text-white group-hover:text-[#f27d26] transition-colors">
                            {ev.confidence.toFixed(1)}%
                          </span>
                          <div
                            className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                              ev.severity === 'Critical'
                                ? 'bg-[#ef4444]'
                                : ev.severity === 'High'
                                ? 'bg-[#f97316]'
                                : ev.severity === 'Moderate'
                                ? 'bg-[#eab308]'
                                : 'bg-[#4ade80]'
                            }`}
                            style={{ height: `${Math.max(ev.confidence, 15)}%` }}
                          />
                          <span className="text-[9px] font-mono text-[#737373] truncate max-w-[60px]">{ev.date.split(',')[0]}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2 text-xs">
                      <div className="p-2 rounded-lg bg-[#050505] border border-[#1a1a1a]">
                        <span className="text-[9px] font-mono text-[#737373] block">INITIAL RISK</span>
                        <span className="font-mono text-white font-bold">
                          {patientTimeline[patientTimeline.length - 1]?.confidence.toFixed(1) || '0'}%
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#050505] border border-[#1a1a1a]">
                        <span className="text-[9px] font-mono text-[#737373] block">PEAK RISK</span>
                        <span className="font-mono text-[#ef4444] font-bold">
                          {Math.max(...patientTimeline.map((e) => e.confidence), 0).toFixed(1)}%
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#050505] border border-[#1a1a1a]">
                        <span className="text-[9px] font-mono text-[#737373] block">PRIMARY DIAGNOSIS</span>
                        <span className="font-medium text-[#f27d26] truncate block">{selectedPatient.primaryFinding}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#050505] border border-[#1a1a1a]">
                        <span className="text-[9px] font-mono text-[#737373] block">TOTAL ASSESSMENTS</span>
                        <span className="font-mono text-white font-bold">{patientTimeline.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DEMOGRAPHICS & VITALS */}
              {activeTab === 'bio' && (
                <div className="space-y-4 bg-[#050505] p-5 rounded-2xl border border-[#1a1a1a] text-xs">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#1a1a1a] pb-2">
                    <Stethoscope className="w-4 h-4 text-[#f27d26]" />
                    <span>Patient Profile & Contact Information</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#080808] rounded-xl border border-[#1a1a1a]">
                      <span className="text-[10px] font-mono text-[#737373] uppercase block">Full Legal Name</span>
                      <span className="font-semibold text-white text-sm">{selectedPatient.name}</span>
                    </div>

                    <div className="p-3 bg-[#080808] rounded-xl border border-[#1a1a1a]">
                      <span className="text-[10px] font-mono text-[#737373] uppercase block">Medical Record Number (MRN)</span>
                      <span className="font-mono text-[#f27d26] text-sm">{selectedPatient.mrn}</span>
                    </div>

                    <div className="p-3 bg-[#080808] rounded-xl border border-[#1a1a1a]">
                      <span className="text-[10px] font-mono text-[#737373] uppercase block">Phone Contact</span>
                      <span className="font-medium text-white">{selectedPatient.phone}</span>
                    </div>

                    <div className="p-3 bg-[#080808] rounded-xl border border-[#1a1a1a]">
                      <span className="text-[10px] font-mono text-[#737373] uppercase block">Email Address</span>
                      <span className="font-medium text-white">{selectedPatient.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-[#737373] space-y-3">
              <Users className="w-10 h-10 text-[#404040] mx-auto" />
              <p className="text-sm font-mono text-[#737373]">Select a patient from the registry to view clinical timeline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

