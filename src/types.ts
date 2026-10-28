export type TabType =
  | 'dashboard'
  | 'new-scan'
  | 'patients'
  | 'studies'
  | 'analytics'
  | 'ai-models'
  | 'alerts'
  | 'reports'
  | 'integrations'
  | 'settings';

export type ModalityType = 'XR' | 'CT' | 'MRI' | 'US' | 'PET';
export type SeverityType = 'Critical' | 'High' | 'Moderate' | 'Mild' | 'Normal';
export type StatusType = 'Critical' | 'Reviewed' | 'Pending' | 'Draft' | 'Archived';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  mrn: string;
  phone: string;
  email: string;
  doctorEmail?: string;
  lastScanDate: string;
  lastScanType: string;
  primaryFinding: string;
  status: 'Active' | 'Follow-up' | 'Cleared' | 'Critical';
  assignedDoctor: string;
  totalScans: number;
}

export interface ScanAnalysis {
  id: string;
  patientName: string;
  patientId: string;
  patientEmail?: string;
  doctorEmail?: string;
  patientDob: string;
  patientAge: number;
  patientGender: string;
  study: string; // e.g. "XR Chest", "CT Chest", "MRI Brain"
  modality: ModalityType;
  finding: string;
  confidence: number;
  severity: SeverityType;
  status: StatusType;
  dateTime: string;
  doctor: string;
  doctorId?: string;
  gradCamOn: boolean;
  aiModel: string;
  acquiredTime: string;
  clinicalNotes?: string;
  thumbnailUrl: string;
  fullImageUrl: string;
  heatmapUrl?: string;
  affectedRegion: string;
  topPredictions: { condition: string; confidence: number }[];
  summary?: string;
  recommendedAction?: string;
}

export interface AIModel {
  id: string;
  name: string;
  architecture: string;
  targetModality: string;
  accuracy: number;
  latencyMs: number;
  status: 'Online' | 'Retraining' | 'Evaluating' | 'Offline';
  uptimePercentage: number;
  lastTrained: string;
  datasetSize: string;
  version: string;
}

export interface SystemAlert {
  id: string;
  patientName: string;
  patientId: string;
  scanId: string;
  finding: string;
  severity: SeverityType;
  timestamp: string;
  acknowledged: boolean;
  doctor: string;
  notes: string;
}

export interface DiagnosticReport {
  id: string;
  reportNumber: string;
  patientName: string;
  patientId: string;
  patientEmail?: string;
  doctorEmail?: string;
  scanId: string;
  modality: string;
  studyDate: string;
  reportDate: string;
  radiologist: string;
  findings: string;
  impression: string;
  icd10: string;
  status: 'Final' | 'Draft' | 'Pending Review';
  aiConfidence: number;
}

export interface PACSIntegration {
  id: string;
  name: string;
  protocol: string;
  host: string;
  port: number;
  status: 'Connected' | 'Syncing' | 'Offline' | 'Error';
  lastPingMs: number;
  scansSyncedToday: number;
}
