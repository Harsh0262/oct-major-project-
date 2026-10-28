import React, { useState } from 'react';
import { Sparkles, Upload, FileUp, CheckCircle2, Sliders, Layers, RefreshCw, Cpu } from 'lucide-react';
import { ScanAnalysis } from '../types';
import { generateMedicalScanSvg } from '../data/mockData';
import { SpotlightCard } from '../components/SpotlightCard';
import { AiIngestionPipelineModal } from '../components/AiIngestionPipelineModal';
import { readMedicalImage } from '../utils/imageUpload';

interface NewScanViewProps {
  onAddScan: (scan: ScanAnalysis) => void;
}

export const NewScanView: React.FC<NewScanViewProps> = ({ onAddScan }) => {
  const [patientName, setPatientName] = useState('Rajesh Kumar');
  const [patientId, setPatientId] = useState('P-001247');
  const [modality, setModality] = useState<'XR' | 'CT' | 'MRI'>('XR');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [pendingScan, setPendingScan] = useState<ScanAnalysis | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [sampleType, setSampleType] = useState<'chest_xray' | 'ct_scan' | 'brain_mri'>('chest_xray');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (file: File) => {
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

  const handleRunAiAnalysis = async () => {
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
          modality: `${modality} ${modality === 'MRI' ? 'Brain' : 'Chest'}`,
          clinicalNotes,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || `Analysis failed (${response.status}). Please try again.`);
      }
      const aiData = resData.data;
      if (!aiData) {
        throw new Error('The analysis service returned no result. Please try again.');
      }

      const scanImage = uploadedBase64 || generateMedicalScanSvg(sampleType, true);

      const newScan: ScanAnalysis = {
        id: `MV-2024-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName,
        patientId,
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
        ],
        summary: aiData.radiologistSummary,
        recommendedAction: aiData.recommendedAction,
      };

      setPendingScan(newScan);
      setShowPipelineModal(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePipelineComplete = () => {
    if (pendingScan) {
      onAddScan(pendingScan);
      setPendingScan(null);
    }
    setShowPipelineModal(false);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6 text-[#e5e5e5]">
      <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
        <div>
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f27d26]" />
            <span>AI Diagnostic Workstation</span>
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Upload DICOM imaging or select a clinical dataset to trigger neural network inference
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Settings (5 cols) */}
        <div className="lg:col-span-5 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373] border-b border-[#1a1a1a] pb-2">
            1. Patient & Study Details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#737373] mb-1">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white outline-none focus:border-[#262626]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#737373] mb-1">Patient ID</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#262626]"
                />
              </div>
              <div>
                <label className="block text-[#737373] mb-1">Modality</label>
                <select
                  value={modality}
                  onChange={(e) => {
                    const m = e.target.value as any;
                    setModality(m);
                    setSampleType(m === 'CT' ? 'ct_scan' : m === 'MRI' ? 'brain_mri' : 'chest_xray');
                  }}
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white outline-none focus:border-[#262626]"
                >
                  <option value="XR">XR - Chest Radiography</option>
                  <option value="CT">CT - Computed Tomography</option>
                  <option value="MRI">MRI - Brain Neuro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#737373] mb-1">Clinical Indication / Symptoms</label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="e.g. Acute dyspnea, fever, crackles in right lower base..."
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white outline-none focus:border-[#262626] resize-none"
              />
            </div>
          </div>

          {/* Sample Selectors */}
          <div className="pt-3 border-t border-[#1a1a1a] space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#737373]">Select Sample Image:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setSampleType('chest_xray');
                  setModality('XR');
                  setUploadedFileName(null);
                  setUploadedBase64(null);
                  setErrorMessage('');
                }}
                className={`p-2 rounded-xl border text-[11px] font-mono text-center cursor-pointer transition-colors ${
                  sampleType === 'chest_xray' && !uploadedFileName
                    ? 'border-[#f27d26] bg-[#111111] text-[#f27d26]'
                    : 'border-[#1a1a1a] bg-[#050505] text-[#737373] hover:border-[#262626]'
                }`}
              >
                Chest XR
              </button>
              <button
                onClick={() => {
                  setSampleType('ct_scan');
                  setModality('CT');
                  setUploadedFileName(null);
                  setUploadedBase64(null);
                  setErrorMessage('');
                }}
                className={`p-2 rounded-xl border text-[11px] font-mono text-center cursor-pointer transition-colors ${
                  sampleType === 'ct_scan' && !uploadedFileName
                    ? 'border-[#f27d26] bg-[#111111] text-[#f27d26]'
                    : 'border-[#1a1a1a] bg-[#050505] text-[#737373] hover:border-[#262626]'
                }`}
              >
                Chest CT
              </button>
              <button
                onClick={() => {
                  setSampleType('brain_mri');
                  setModality('MRI');
                  setUploadedFileName(null);
                  setUploadedBase64(null);
                  setErrorMessage('');
                }}
                className={`p-2 rounded-xl border text-[11px] font-mono text-center cursor-pointer transition-colors ${
                  sampleType === 'brain_mri' && !uploadedFileName
                    ? 'border-[#f27d26] bg-[#111111] text-[#f27d26]'
                    : 'border-[#1a1a1a] bg-[#050505] text-[#737373] hover:border-[#262626]'
                }`}
              >
                Brain MRI
              </button>
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {errorMessage}
            </p>
          )}
          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 bg-[#f27d26] text-white font-medium text-xs rounded-xl hover:bg-[#e06c1b] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Inference...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Diagnostic Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Right Scan Preview Area (7 cols) */}
        <div className="lg:col-span-7 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373] border-b border-[#1a1a1a] pb-2 flex items-center justify-between">
            <span>2. Imaging Preview & Upload</span>
            <span className="text-[10px] font-mono text-[#4ade80]">CNN-V4 Ready</span>
          </h3>

          <div className="flex-1 bg-[#050505] rounded-xl border border-[#1a1a1a] p-4 my-4 relative flex items-center justify-center min-h-[350px]">
            <img
              src={uploadedBase64 || generateMedicalScanSvg(sampleType, true)}
              alt="Scan Preview"
              className="max-h-[350px] object-contain rounded-lg"
            />
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFileUpload(file);
            }}
            className="border border-dashed border-[#262626] hover:border-[#f27d26] bg-[#050505] rounded-xl p-4 text-center relative cursor-pointer transition-colors"
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileUpload(file);
                e.target.value = '';
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="flex items-center justify-center gap-3 text-xs text-[#737373]">
              <Upload className="w-5 h-5 text-[#f27d26]" />
              {uploadedFileName ? (
                <span className="text-[#4ade80] font-medium font-mono">{uploadedFileName} loaded</span>
              ) : (
                <span>Drop PNG, JPEG, or WebP scan to analyze</span>
              )}
            </div>
            <p className="mt-1 text-[10px] text-[#737373]">DICOM slice export required · 16 MB max</p>
          </div>
        </div>
      </div>

      <AiIngestionPipelineModal
        isOpen={showPipelineModal}
        onClose={() => setShowPipelineModal(false)}
        onComplete={handlePipelineComplete}
        patientName={patientName}
        modality={modality}
      />
    </div>
  );
};
