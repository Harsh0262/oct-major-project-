import React, { useEffect, useState } from 'react';
import { X, Upload, FileUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { ScanAnalysis } from '../types';
import { generateMedicalScanSvg } from '../data/mockData';
import { readMedicalImage } from '../utils/imageUpload';

interface UploadDicomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanUploaded: (newScan: ScanAnalysis) => void;
  initialFile?: File | null;
}

export const UploadDicomModal: React.FC<UploadDicomModalProps> = ({
  isOpen,
  onClose,
  onScanUploaded,
  initialFile,
}) => {
  const [patientId, setPatientId] = useState('P-001247');
  const [patientName, setPatientName] = useState('Rajesh Kumar');
  const [patientEmail, setPatientEmail] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [modality, setModality] = useState<'XR' | 'CT' | 'MRI'>('XR');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !initialFile) return;

    let cancelled = false;
    setUploadedFileName(initialFile.name);
    setErrorMessage('');
    void readMedicalImage(initialFile)
      .then((imageData) => {
        if (!cancelled) setUploadedBase64(imageData);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setUploadedFileName(null);
          setUploadedBase64(null);
          setErrorMessage(error instanceof Error ? error.message : 'Unable to read this image.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initialFile, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    try {
      const imageData = await readMedicalImage(file);
      setUploadedFileName(file.name);
      setUploadedBase64(imageData);
      setErrorMessage('');
    } catch (error) {
      setUploadedFileName(null);
      setUploadedBase64(null);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to read this image.');
    }
  };

  const handleRunAnalysis = async () => {
    if (!patientName.trim() || !patientId.trim()) {
      setErrorMessage('Enter a patient name and patient ID before running an analysis.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/analyze-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedBase64 || '',
          modality: `${modality} Chest`,
          clinicalNotes,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || `Analysis failed (${response.status}). Please try again.`);
      }
      const aiData = resData?.data || {};

      const scanType = modality === 'CT' ? 'ct_scan' : modality === 'MRI' ? 'brain_mri' : 'chest_xray';
      const scanImage = uploadedBase64 || generateMedicalScanSvg(scanType, true);

      const newScan: ScanAnalysis = {
        id: `MV-2024-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName,
        patientId,
        patientEmail: patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        doctorEmail: doctorEmail || `dr.rohan@medvision.health`,
        patientDob: 'May 14, 1968',
        patientAge: 56,
        patientGender: 'Male',
        study: `${modality} ${modality === 'MRI' ? 'Brain' : 'Chest'}`,
        modality,
        finding: aiData.finding || 'Pneumonia',
        confidence: aiData.confidence || 96.4,
        severity: aiData.severity || 'Moderate',
        status: aiData.severity === 'Critical' || aiData.severity === 'High' ? 'Critical' : 'Pending',
        dateTime: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        doctor: 'Dr. Harsh',
        gradCamOn: true,
        aiModel: 'CNN-V4',
        acquiredTime: 'Just Now',
        clinicalNotes,
        thumbnailUrl: scanImage,
        fullImageUrl: scanImage,
        affectedRegion: aiData.affectedRegion || 'Right Lower Lobe Consolidation',
        topPredictions: aiData.topPredictions || [
          { condition: aiData.finding || 'Pneumonia', confidence: aiData.confidence || 96.4 },
          { condition: 'Lung Opacity', confidence: 87.1 },
          { condition: 'Infiltration', confidence: 72.3 },
        ],
        summary: aiData.radiologistSummary || 'High attenuation airspace consolidation identified in lower lung zone.',
        recommendedAction: aiData.recommendedAction || 'Administer high-flow oxygen and initiate broad-spectrum antibiotic protocol.',
      };

      onScanUploaded(newScan);
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#080808] border border-[#1a1a1a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-[#e5e5e5]">
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#262626] flex items-center justify-center text-[#f27d26]">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Upload DICOM / Medical Scan</h3>
              <p className="text-[11px] text-[#737373]">Process scan through CNN-V4 Grad-CAM AI Pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#737373] mb-1 font-mono text-[11px]">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white outline-none focus:border-[#262626]"
              />
            </div>
            <div>
              <label className="block text-[#737373] mb-1 font-mono text-[11px]">Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#262626]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#737373] mb-1 font-mono text-[11px]">Patient Email (Optional)</label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="e.g. rajesh.kumar@example.com"
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-[#262626]"
              />
            </div>
            <div>
              <label className="block text-[#737373] mb-1 font-mono text-[11px]">Doctor Email (Optional)</label>
              <input
                type="email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                placeholder="e.g. dr.rohan@medvision.health"
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-[#262626]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#737373] mb-1 font-mono text-[11px]">Modality</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as any)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white outline-none focus:border-[#262626]"
              >
                <option value="XR">XR - Digital Radiography</option>
                <option value="CT">CT - Computed Tomography</option>
                <option value="MRI">MRI - Magnetic Resonance</option>
              </select>
            </div>
            <div>
              <label className="block text-[#737373] mb-1 font-mono text-[11px]">Clinical Notes (Optional)</label>
              <input
                type="text"
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="fever, cough, dyspnea..."
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white outline-none focus:border-[#262626]"
              />
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) processFile(file);
            }}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative cursor-pointer ${
              dragOver
                ? 'border-[#f27d26] bg-[#f27d26]/10'
                : uploadedFileName
                ? 'border-[#4ade80]/50 bg-[#050505]'
                : 'border-[#1a1a1a] bg-[#050505] hover:border-[#262626]'
            }`}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                handleFileSelect(e);
                e.target.value = '';
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              {uploadedBase64 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#262626] bg-black">
                    <img src={uploadedBase64} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4ade80] text-xs font-mono font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{uploadedFileName}</span>
                  </div>
                </div>
              ) : (
                <>
                  <FileUp className="w-8 h-8 text-[#737373]" />
                  <p className="text-xs font-medium text-[#e5e5e5]">
                    Drop PNG, JPEG, or WebP scan here
                  </p>
                  <p className="text-[10px] text-[#737373]">
                    DICOM slice export required · PNG, JPEG, or WebP · 16 MB max
                  </p>
                </>
              )}
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {errorMessage}
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#050505] border border-[#1a1a1a] text-[#737373] hover:text-white hover:border-[#262626] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="px-5 py-2 rounded-xl bg-[#f27d26] hover:bg-[#e06c1b] text-white font-medium text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Diagnosis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
