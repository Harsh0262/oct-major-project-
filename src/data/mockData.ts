import { Patient, ScanAnalysis, AIModel, SystemAlert, DiagnosticReport, PACSIntegration } from '../types';

// SVG Data URL generator for medical X-Ray/CT/MRI scans with realistic anatomical structures, DICOM watermarks, and Grad-CAM heatmaps
export const generateMedicalScanSvg = (
  type: 'chest_xray' | 'ct_scan' | 'brain_mri',
  withGradCam = false,
  gradCamOpacity = 0.75
): string => {
  let svg = '';

  if (type === 'chest_xray') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <defs>
        <radialGradient id="heartGrad" cx="40%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#d1d5db" stop-opacity="0.85"/>
          <stop offset="70%" stop-color="#6b7280" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#1f2937" stop-opacity="0.2"/>
        </radialGradient>

        <radialGradient id="leftLungTissue" cx="45%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.98"/>
          <stop offset="70%" stop-color="#0a0f1d" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#1e293b" stop-opacity="0.5"/>
        </radialGradient>

        <radialGradient id="rightLungTissue" cx="55%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.98"/>
          <stop offset="70%" stop-color="#0a0f1d" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#1e293b" stop-opacity="0.5"/>
        </radialGradient>

        <radialGradient id="gradCamHotspot">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="25%" stop-color="#ef4444" stop-opacity="0.95"/>
          <stop offset="55%" stop-color="#f97316" stop-opacity="0.8"/>
          <stop offset="80%" stop-color="#eab308" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
        </radialGradient>
        
        <radialGradient id="gradCamSecondary">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#eab308" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Black Radiography Canvas -->
      <rect width="800" height="800" fill="#020408"/>

      <!-- DICOM Header Overlay Watermark Text -->
      <g font-family="monospace" font-size="11" fill="#94a3b8" opacity="0.85">
        <text x="25" y="35" font-weight="bold">ID: 123456 | DOB: 31/01/1980 | 14 OCT 2024 | PA CHEST RADIOGRAPH</text>
        <text x="25" y="52">120 kVp • 3.2 mAs • EXP: PA • AEC: ACTIVE • MEDVISION PACS</text>
        <text x="760" y="35" font-weight="bold" font-size="18" fill="#ffffff" text-anchor="end">L</text>
        <text x="760" y="55" font-size="10" fill="#64748b" text-anchor="end">R</text>
      </g>

      <!-- Soft Tissue Silhouette (Neck, Shoulders & Thoracic Outline) -->
      <path d="M 330 60 C 370 60 430 60 470 60 L 510 110 Q 640 140 730 260 L 760 760 L 40 760 L 70 260 Q 160 140 290 110 Z" fill="#0f172a" opacity="0.45"/>
      <path d="M 340 70 L 460 70 L 490 120 Q 620 150 700 270 L 720 740 L 80 740 L 100 270 Q 180 150 310 120 Z" fill="#1e293b" opacity="0.3"/>

      <!-- Thoracic Spine (Vertebrae Body & Intervertebral Discs) -->
      <g stroke="#94a3b8" opacity="0.45">
        <line x1="400" y1="60" x2="400" y2="700" stroke-width="26" stroke-dasharray="16,4" stroke-linecap="round"/>
        <line x1="400" y1="60" x2="400" y2="700" stroke="#cbd5e1" stroke-width="12" stroke-dasharray="16,4" opacity="0.6"/>
      </g>

      <!-- Trachea & Airway Branching (Carina) -->
      <path d="M 400 70 L 400 220 M 400 220 Q 370 250 340 280 M 400 220 Q 430 250 460 280" stroke="#000000" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.9"/>
      <path d="M 400 70 L 400 220 M 400 220 Q 370 250 340 280 M 400 220 Q 430 250 460 280" stroke="#1e293b" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.5"/>

      <!-- Right Lung Field (Anatomical Left) -->
      <path d="M 210 160 Q 360 160 375 300 Q 380 480 360 620 Q 200 640 160 420 Q 150 250 210 160 Z" fill="url(#rightLungTissue)" stroke="#334155" stroke-width="2.5"/>

      <!-- Left Lung Field (Anatomical Right, accommodating Cardiac Notch) -->
      <path d="M 590 160 Q 440 160 425 300 Q 420 420 460 540 Q 510 630 640 620 Q 650 250 590 160 Z" fill="url(#leftLungTissue)" stroke="#334155" stroke-width="2.5"/>

      <!-- Bronchovascular Tree Markings (Vascular Markings in Lungs) -->
      <g stroke="#64748b" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.35">
        <path d="M 350 280 Q 280 260 220 280 M 350 280 Q 290 320 230 360 M 350 320 Q 270 390 220 460 M 350 350 Q 300 450 260 540"/>
        <path d="M 280 260 Q 240 220 200 220 M 290 320 Q 230 310 190 330 M 270 390 Q 210 400 180 440"/>

        <path d="M 450 280 Q 520 260 580 280 M 450 280 Q 510 320 570 360 M 450 320 Q 530 390 580 460 M 450 350 Q 500 450 540 540"/>
        <path d="M 520 260 Q 560 220 600 220 M 510 320 Q 570 310 610 330 M 530 390 Q 590 400 620 440"/>
      </g>

      <!-- Cardiac Silhouette (Heart Shadow) & Aortic Arch -->
      <path d="M 390 210 Q 440 210 440 250 Q 420 280 390 280 Z" fill="#94a3b8" opacity="0.5"/>
      <path d="M 380 310 C 510 360 480 560 370 610 C 330 580 340 450 380 310 Z" fill="url(#heartGrad)"/>

      <!-- Clavicles (Collar Bones) -->
      <path d="M 400 135 Q 260 100 150 135 Q 120 145 140 160 Q 250 125 400 150" fill="#cbd5e1" opacity="0.75"/>
      <path d="M 400 135 Q 540 100 650 135 Q 680 145 660 160 Q 550 125 400 150" fill="#cbd5e1" opacity="0.75"/>

      <!-- Rib Cage (Anterior & Posterior Rib Arches) -->
      <g stroke="#cbd5e1" stroke-linecap="round" fill="none" opacity="0.45">
        <path d="M 400 170 Q 220 185 170 240" stroke-width="10"/>
        <path d="M 400 170 Q 580 185 630 240" stroke-width="10"/>

        <path d="M 400 220 Q 200 240 155 310" stroke-width="11"/>
        <path d="M 400 220 Q 600 240 645 310" stroke-width="11"/>

        <path d="M 400 280 Q 190 305 150 380" stroke-width="12"/>
        <path d="M 400 280 Q 610 305 650 380" stroke-width="12"/>

        <path d="M 400 340 Q 185 370 152 450" stroke-width="12"/>
        <path d="M 400 340 Q 615 370 648 450" stroke-width="12"/>

        <path d="M 400 410 Q 195 440 160 520" stroke-width="12"/>
        <path d="M 400 410 Q 605 440 640 520" stroke-width="12"/>

        <path d="M 400 480 Q 210 510 175 590" stroke-width="11"/>
        <path d="M 400 480 Q 590 510 625 590" stroke-width="11"/>

        <path d="M 230 220 Q 320 290 390 340" stroke-width="7" opacity="0.6"/>
        <path d="M 570 220 Q 480 290 410 340" stroke-width="7" opacity="0.6"/>

        <path d="M 200 300 Q 310 380 385 430" stroke-width="8" opacity="0.6"/>
        <path d="M 600 300 Q 490 380 415 430" stroke-width="8" opacity="0.6"/>

        <path d="M 180 390 Q 300 470 380 520" stroke-width="8" opacity="0.6"/>
        <path d="M 620 390 Q 500 470 420 520" stroke-width="8" opacity="0.6"/>
      </g>

      <!-- Diaphragm Domes & Costophrenic Angles -->
      <path d="M 130 650 Q 260 560 400 610 Q 540 550 670 650 L 670 760 L 130 760 Z" fill="#475569" opacity="0.75"/>
      <path d="M 140 640 Q 260 570 390 620" stroke="#f1f5f9" stroke-width="6" fill="none" opacity="0.8"/>
      <path d="M 410 620 Q 540 560 660 640" stroke="#f1f5f9" stroke-width="6" fill="none" opacity="0.8"/>

      <!-- Gastric Air Bubble under Left Hemidiaphragm -->
      <ellipse cx="560" cy="635" rx="30" ry="15" fill="#000000" stroke="#64748b" stroke-width="2" opacity="0.8"/>

      ${
        withGradCam
          ? `<!-- Grad-CAM Neural Attention Heatmap Layer -->
      <g opacity="${gradCamOpacity}" style="mix-blend-mode: screen;">
        <circle cx="530" cy="450" r="130" fill="url(#gradCamHotspot)"/>
        <circle cx="270" cy="380" r="80" fill="url(#gradCamSecondary)"/>
      </g>`
          : ''
      }
    </svg>`;
  } else if (type === 'ct_scan') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <rect width="800" height="800" fill="#030712"/>
      <g font-family="monospace" font-size="11" fill="#94a3b8" opacity="0.85">
        <text x="25" y="35" font-weight="bold">CT CHEST HRCT | AXIAL SLICE 48/120 | 1.25mm</text>
        <text x="760" y="35" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="end">A</text>
      </g>
      <circle cx="400" cy="400" r="340" fill="#111827" stroke="#374151" stroke-width="5"/>
      <ellipse cx="400" cy="400" rx="270" ry="240" fill="#080e1a"/>
      <path d="M 370 580 C 370 540 430 540 430 580 C 440 610 360 610 370 580 Z" fill="#f8fafc" opacity="0.9"/>
      <ellipse cx="280" cy="380" rx="90" ry="140" fill="#000000" stroke="#475569" stroke-width="3"/>
      <ellipse cx="520" cy="380" rx="90" ry="140" fill="#000000" stroke="#475569" stroke-width="3"/>
      <path d="M 360 260 C 440 260 440 500 360 500 Z" fill="#1e293b"/>
      <g fill="#f8fafc" opacity="0.85">
        <circle cx="160" cy="320" r="10"/>
        <circle cx="150" cy="420" r="10"/>
        <circle cx="170" cy="520" r="10"/>
        <circle cx="640" cy="320" r="10"/>
        <circle cx="650" cy="420" r="10"/>
        <circle cx="630" cy="520" r="10"/>
      </g>
      ${
        withGradCam
          ? `<circle cx="280" cy="360" r="70" fill="url(#ctGradCamHotspot)" opacity="${gradCamOpacity}" style="mix-blend-mode: screen;"/>
      <defs>
        <radialGradient id="ctGradCamHotspot">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="30%" stop-color="#ef4444" stop-opacity="0.95"/>
          <stop offset="65%" stop-color="#f97316" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
        </radialGradient>
      </defs>`
          : ''
      }
    </svg>`;
  } else {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <rect width="800" height="800" fill="#020617"/>
      <g font-family="monospace" font-size="11" fill="#94a3b8" opacity="0.85">
        <text x="25" y="35" font-weight="bold">BRAIN MRI T2-FLAIR | AXIAL SLICE 18/32</text>
        <text x="760" y="35" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="end">L</text>
      </g>
      <path d="M 400 110 C 200 110 160 300 160 460 C 160 650 260 700 400 700 C 540 700 640 650 640 460 C 640 300 600 110 400 110 Z" fill="#0f172a" stroke="#334155" stroke-width="5"/>
      <path d="M 270 240 Q 340 200 400 270 T 530 240" stroke="#94a3b8" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.65"/>
      <path d="M 240 350 Q 350 290 400 370 T 560 350" stroke="#94a3b8" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.65"/>
      <path d="M 250 480 Q 340 420 400 490 T 550 480" stroke="#94a3b8" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.65"/>
      ${
        withGradCam
          ? `<circle cx="340" cy="330" r="75" fill="url(#mriGradCamHotspot)" opacity="${gradCamOpacity}" style="mix-blend-mode: screen;"/>
      <defs>
        <radialGradient id="mriGradCamHotspot">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="35%" stop-color="#a3e635" stop-opacity="0.9"/>
          <stop offset="70%" stop-color="#3b82f6" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>`
          : ''
      }
    </svg>`;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-001247',
    name: 'Michael Turner',
    age: 56,
    gender: 'Male',
    dob: 'May 14, 1968',
    mrn: 'MRN-884920',
    phone: '+1 (555) 234-5678',
    email: 'm.turner@example.com',
    lastScanDate: 'May 31, 2024',
    lastScanType: 'XR Chest',
    primaryFinding: 'Pneumonia',
    status: 'Critical',
    assignedDoctor: 'Dr. Rohan',
    totalScans: 4,
  },
  {
    id: 'P-001246',
    name: 'Angela Smith',
    age: 63,
    gender: 'Female',
    dob: 'Aug 22, 1961',
    mrn: 'MRN-991204',
    phone: '+1 (555) 345-6789',
    email: 'a.smith@example.com',
    lastScanDate: 'May 31, 2024',
    lastScanType: 'CT Chest',
    primaryFinding: 'Lung Nodule',
    status: 'Active',
    assignedDoctor: 'Dr. Meera',
    totalScans: 6,
  },
  {
    id: 'P-001245',
    name: 'James Brown',
    age: 49,
    gender: 'Male',
    dob: 'Nov 03, 1975',
    mrn: 'MRN-102938',
    phone: '+1 (555) 456-7890',
    email: 'j.brown@example.com',
    lastScanDate: 'May 30, 2024',
    lastScanType: 'XR Chest',
    primaryFinding: 'No Abnormality',
    status: 'Cleared',
    assignedDoctor: 'Dr. Rohan',
    totalScans: 2,
  },
  {
    id: 'P-001244',
    name: 'Sarah Lee',
    age: 52,
    gender: 'Female',
    dob: 'Jan 19, 1972',
    mrn: 'MRN-483920',
    phone: '+1 (555) 567-8901',
    email: 's.lee@example.com',
    lastScanDate: 'May 30, 2024',
    lastScanType: 'CT Chest',
    primaryFinding: 'Pleural Effusion',
    status: 'Follow-up',
    assignedDoctor: 'Dr. Amit',
    totalScans: 3,
  },
  {
    id: 'P-001243',
    name: 'David Wilson',
    age: 60,
    gender: 'Male',
    dob: 'Mar 30, 1964',
    mrn: 'MRN-773921',
    phone: '+1 (555) 678-9012',
    email: 'd.wilson@example.com',
    lastScanDate: 'May 29, 2024',
    lastScanType: 'XR Chest',
    primaryFinding: 'Cardiomegaly',
    status: 'Active',
    assignedDoctor: 'Dr. Rohan',
    totalScans: 5,
  },
];

export const INITIAL_SCANS: ScanAnalysis[] = [
  {
    id: 'MV-2024-001247',
    patientName: 'Michael Turner',
    patientId: 'P-001247',
    patientDob: 'May 14, 1968',
    patientAge: 56,
    patientGender: 'Male',
    study: 'XR Chest',
    modality: 'XR',
    finding: 'Pneumonia',
    confidence: 96.4,
    severity: 'Moderate',
    status: 'Critical',
    dateTime: 'May 31, 2024 10:24 AM',
    doctor: 'Dr. Rohan',
    doctorId: 'DOC-101',
    gradCamOn: true,
    aiModel: 'CNN-V4',
    acquiredTime: 'May 31, 2024 10:24 AM',
    clinicalNotes: 'Patient present with acute dyspnea, fever (38.8°C), and productive cough for 4 days.',
    thumbnailUrl: generateMedicalScanSvg('chest_xray', true),
    fullImageUrl: generateMedicalScanSvg('chest_xray', true),
    heatmapUrl: generateMedicalScanSvg('chest_xray', true),
    affectedRegion: 'Right Lower Lobe (Consolidation)',
    topPredictions: [
      { condition: 'Pneumonia', confidence: 96.4 },
      { condition: 'Lung Opacity', confidence: 87.1 },
      { condition: 'Infiltration', confidence: 72.3 },
      { condition: 'Atelectasis', confidence: 21.4 },
    ],
    summary: 'Airspace opacity and lobar consolidation identified in the right lower lung field consistent with bacterial pneumonia.',
    recommendedAction: 'Start empirical antibiotic therapy, obtain blood cultures, and order follow-up AP view post-treatment.',
  },
  {
    id: 'MV-2024-001246',
    patientName: 'Angela Smith',
    patientId: 'P-001246',
    patientDob: 'Aug 22, 1961',
    patientAge: 63,
    patientGender: 'Female',
    study: 'CT Chest',
    modality: 'CT',
    finding: 'Lung Nodule',
    confidence: 87.1,
    severity: 'High',
    status: 'Reviewed',
    dateTime: 'May 31, 2024 09:11 AM',
    doctor: 'Dr. Meera',
    gradCamOn: true,
    aiModel: 'ResNet-Medical 3D',
    acquiredTime: 'May 31, 2024 09:11 AM',
    thumbnailUrl: generateMedicalScanSvg('ct_scan', true),
    fullImageUrl: generateMedicalScanSvg('ct_scan', true),
    affectedRegion: 'Left Upper Lobe (Peripheral)',
    topPredictions: [
      { condition: 'Lung Nodule', confidence: 87.1 },
      { condition: 'Granuloma', confidence: 61.2 },
      { condition: 'Infiltration', confidence: 32.0 },
      { condition: 'Hamartoma', confidence: 15.5 },
    ],
  },
  {
    id: 'MV-2024-001245',
    patientName: 'James Brown',
    patientId: 'P-001245',
    patientDob: 'Nov 03, 1975',
    patientAge: 49,
    patientGender: 'Male',
    study: 'XR Chest',
    modality: 'XR',
    finding: 'No Abnormality',
    confidence: 98.2,
    severity: 'Normal',
    status: 'Reviewed',
    dateTime: 'May 30, 2024 06:42 PM',
    doctor: 'Dr. Rohan',
    gradCamOn: false,
    aiModel: 'CNN-V4',
    acquiredTime: 'May 30, 2024 06:42 PM',
    thumbnailUrl: generateMedicalScanSvg('chest_xray', false),
    fullImageUrl: generateMedicalScanSvg('chest_xray', false),
    affectedRegion: 'Lungs Clear / Normal Cardiothoracic Ratio',
    topPredictions: [
      { condition: 'No Abnormality', confidence: 98.2 },
      { condition: 'Normal Variant', confidence: 12.0 },
    ],
  },
  {
    id: 'MV-2024-001244',
    patientName: 'Sarah Lee',
    patientId: 'P-001244',
    patientDob: 'Jan 19, 1972',
    patientAge: 52,
    patientGender: 'Female',
    study: 'CT Chest',
    modality: 'CT',
    finding: 'Pleural Effusion',
    confidence: 78.5,
    severity: 'Moderate',
    status: 'Pending',
    dateTime: 'May 30, 2024 03:21 PM',
    doctor: 'Dr. Amit',
    gradCamOn: true,
    aiModel: 'ResNet-Medical 3D',
    acquiredTime: 'May 30, 2024 03:21 PM',
    thumbnailUrl: generateMedicalScanSvg('ct_scan', true),
    fullImageUrl: generateMedicalScanSvg('ct_scan', true),
    affectedRegion: 'Left Costophrenic Sulcus',
    topPredictions: [
      { condition: 'Pleural Effusion', confidence: 78.5 },
      { condition: 'Atelectasis', confidence: 62.1 },
      { condition: 'Thickening', confidence: 33.4 },
    ],
  },
  {
    id: 'MV-2024-001243',
    patientName: 'David Wilson',
    patientId: 'P-001243',
    patientDob: 'Mar 30, 1964',
    patientAge: 60,
    patientGender: 'Male',
    study: 'XR Chest',
    modality: 'XR',
    finding: 'Cardiomegaly',
    confidence: 65.3,
    severity: 'Mild',
    status: 'Pending',
    dateTime: 'May 29, 2024 11:03 AM',
    doctor: 'Dr. Rohan',
    gradCamOn: false,
    aiModel: 'CNN-V4',
    acquiredTime: 'May 29, 2024 11:03 AM',
    thumbnailUrl: generateMedicalScanSvg('chest_xray', false),
    fullImageUrl: generateMedicalScanSvg('chest_xray', false),
    affectedRegion: 'Cardiac Silhouette Enlarged (>0.55 CTR)',
    topPredictions: [
      { condition: 'Cardiomegaly', confidence: 65.3 },
      { condition: 'Pericardial Fat Pad', confidence: 42.0 },
    ],
  },
];

export const INITIAL_AI_MODELS: AIModel[] = [
  {
    id: 'M-01',
    name: 'CNN-V4',
    architecture: 'DenseNet-201 + Grad-CAM Heatmap Head',
    targetModality: 'XR Chest & Bone Radiography',
    accuracy: 96.4,
    latencyMs: 1200,
    status: 'Online',
    uptimePercentage: 99.97,
    lastTrained: 'Today, 09:00 AM',
    datasetSize: '1.2M Scans (NIH ChestX-ray14 & MIMIC-CXR)',
    version: '4.2.0-prod',
  },
  {
    id: 'M-02',
    name: 'ResNet-Medical 3D',
    architecture: '3D ResNet-101 Volumetric Encoder',
    targetModality: 'CT Chest & Abdominal Slices',
    accuracy: 94.8,
    latencyMs: 2100,
    status: 'Online',
    uptimePercentage: 99.91,
    lastTrained: 'Yesterday, 11:30 PM',
    datasetSize: '450k CT Volumes',
    version: '2.8.1-prod',
  },
  {
    id: 'M-03',
    name: 'DenseNet-121 Fracture',
    architecture: 'DenseNet-121 Multi-label Classifier',
    targetModality: 'Extremity Musculoskeletal XR',
    accuracy: 92.3,
    latencyMs: 850,
    status: 'Online',
    uptimePercentage: 99.85,
    lastTrained: 'May 28, 2024',
    datasetSize: '320k MURA Bone XR',
    version: '1.4.0',
  },
  {
    id: 'M-04',
    name: 'VisionTransformer-Rad',
    architecture: 'ViT-Base/16 Multi-modal Transformer',
    targetModality: 'Brain MRI & Neurovascular Imaging',
    accuracy: 95.1,
    latencyMs: 1800,
    status: 'Retraining',
    uptimePercentage: 99.70,
    lastTrained: 'In Progress (88%)',
    datasetSize: '680k Brain MRIs',
    version: '3.0.0-rc1',
  },
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'ALT-101',
    patientName: 'Michael Turner',
    patientId: 'P-001247',
    scanId: 'MV-2024-001247',
    finding: 'Acute Lobar Pneumonia with High Opacity',
    severity: 'Critical',
    timestamp: '22 min ago',
    acknowledged: false,
    doctor: 'Dr. Rohan',
    notes: 'Urgent radiologist review required. Oxygen saturation monitoring initiated.',
  },
  {
    id: 'ALT-102',
    patientName: 'Angela Smith',
    patientId: 'P-001246',
    scanId: 'MV-2024-001246',
    finding: '12mm Solitary Pulm Nodule (LUL)',
    severity: 'High',
    timestamp: '1 hour ago',
    acknowledged: true,
    doctor: 'Dr. Meera',
    notes: 'Follow-up high-res CT scheduled with pulmonary specialist.',
  },
  {
    id: 'ALT-103',
    patientName: 'Sarah Lee',
    patientId: 'P-001244',
    scanId: 'MV-2024-001244',
    finding: 'Left Pleural Effusion Blunting',
    severity: 'Moderate',
    timestamp: '3 hours ago',
    acknowledged: false,
    doctor: 'Dr. Amit',
    notes: 'Evaluate for diagnostic thoracentesis if dyspnea worsens.',
  },
];

export const INITIAL_REPORTS: DiagnosticReport[] = [
  {
    id: 'REP-2024-881',
    reportNumber: 'RAD-SR-99201',
    patientName: 'Michael Turner',
    patientId: 'P-001247',
    scanId: 'MV-2024-001247',
    modality: 'XR Chest AP View',
    studyDate: 'May 31, 2024',
    reportDate: 'May 31, 2024 10:45 AM',
    radiologist: 'Dr. Rohan Patel, MD (Board Certified)',
    findings: 'Single view AP chest radiograph demonstrates confluent airspace opacification in the right lower lung zone. Trachea is midline. Cardiothoracic ratio is normal. No evidence of pneumothorax or pleural effusion.',
    impression: 'Right lower lobe acute alveolar pneumonia. Clinical correlation and follow-up after antibiotic treatment recommended.',
    icd10: 'J18.9 - Pneumonia, unspecified organism',
    status: 'Final',
    aiConfidence: 96.4,
  },
  {
    id: 'REP-2024-880',
    reportNumber: 'RAD-SR-99200',
    patientName: 'Angela Smith',
    patientId: 'P-001246',
    scanId: 'MV-2024-001246',
    modality: 'CT Chest High-Resolution',
    studyDate: 'May 31, 2024',
    reportDate: 'May 31, 2024 09:30 AM',
    radiologist: 'Dr. Meera Sharma, MD',
    findings: 'Non-contrast chest CT reveals a smooth 12mm nodular density in the peripheral left upper lobe. No enlarged mediastinal lymph nodes. No pleural effusion.',
    impression: 'Solitary pulmonary nodule left upper lobe. Recommend follow-up CT in 3 months per Fleischner Society guidelines.',
    icd10: 'R91.1 - Solitary pulmonary nodule',
    status: 'Final',
    aiConfidence: 87.1,
  },
];

export const INITIAL_PACS: PACSIntegration[] = [
  {
    id: 'PACS-01',
    name: 'Main Hospital PACS (DCM4CHEE)',
    protocol: 'DICOM C-STORE / C-FIND',
    host: 'pacs.hospital.internal',
    port: 11112,
    status: 'Connected',
    lastPingMs: 14,
    scansSyncedToday: 184,
  },
  {
    id: 'PACS-02',
    name: 'Epic Hyperspace EHR Gateway',
    protocol: 'FHIR R4 / HL7 v2.8',
    host: 'ehr.epic.mednet.org',
    port: 443,
    status: 'Connected',
    lastPingMs: 28,
    scansSyncedToday: 247,
  },
  {
    id: 'PACS-03',
    name: 'Outpatient CT Router',
    protocol: 'DICOM Web (STOW-RS / QIDO-RS)',
    host: 'router.outpatient-rad.com',
    port: 8042,
    status: 'Syncing',
    lastPingMs: 42,
    scansSyncedToday: 63,
  },
];
