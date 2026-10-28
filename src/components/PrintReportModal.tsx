import React, { useState } from 'react';
import {
  X,
  Printer,
  FileDown,
  ShieldCheck,
  Building2,
  Check,
  Sparkles,
  FileText,
  Lock,
  Layers,
  Award,
} from 'lucide-react';
import { DiagnosticReport, ScanAnalysis } from '../types';
import { exportReportToPdf } from '../utils/pdfExport';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DiagnosticReport;
  scan?: ScanAnalysis;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  report,
  scan,
}) => {
  const [includeAiMetrics, setIncludeAiMetrics] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [includeIcd10, setIncludeIcd10] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handlePrintBrowser = () => {
    // Triggers browser print dialog with optimized @media print styling
    window.print();
  };

  const handleExportHighQualityPdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      exportReportToPdf(report);
      setIsGenerating(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 no-print">
      <div className="bg-[#080808] border border-[#1a1a1a] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-[#e5e5e5] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1a1a1a] bg-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f27d26]/10 border border-[#f27d26]/30 text-[#f27d26] flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Diagnostic Report Print & PDF Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-[#f27d26]/10 text-[#f27d26] text-[10px] font-mono font-bold border border-[#f27d26]/30">
                  300 DPI High-Res
                </span>
              </h3>
              <p className="text-[11px] text-[#737373]">
                Report <strong className="text-white">{report.reportNumber}</strong> • Patient: {report.patientName} ({report.patientId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5 text-xs">
          {/* Printable Document Preview Summary Box */}
          <div className="p-4 bg-[#050505] border border-[#1a1a1a] rounded-xl space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#1a1a1a] pb-2">
              <span className="text-[#a3a3a3] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#f27d26]" />
                Official Medical Record Header
              </span>
              <span className="text-[#4ade80] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                HIPAA Compliant Output
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] text-[#a3a3a3]">
              <div>
                <span className="text-[#737373] block text-[10px]">Attending Radiologist</span>
                <strong className="text-white">{report.radiologist}</strong>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">Imaging Modality & Date</span>
                <strong className="text-white">{report.modality} • {report.studyDate}</strong>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">ICD-10 Diagnostic Classification</span>
                <strong className="text-[#f27d26]">{report.icd10}</strong>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">AI Neural Inference Score</span>
                <strong className="text-[#4ade80]">{report.aiConfidence}% Match Confidence</strong>
              </div>
            </div>
          </div>

          {/* Report Elements Toggle Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-[#a3a3a3] uppercase tracking-wider block">
              Configure PDF & Print Layout Sections
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Hospital Letterhead */}
              <div
                onClick={() => setIncludeLetterhead(!includeLetterhead)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  includeLetterhead
                    ? 'bg-[#111111] border-[#f27d26]/50 text-white'
                    : 'bg-[#050505] border-[#1a1a1a] text-[#737373]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className={`w-4 h-4 ${includeLetterhead ? 'text-[#f27d26]' : 'text-[#525252]'}`} />
                  <div>
                    <p className="font-semibold text-xs">Hospital Letterhead</p>
                    <p className="text-[10px] text-[#737373]">MedVision Radiology Banner</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${includeLetterhead ? 'bg-[#f27d26] border-[#f27d26] text-white' : 'border-[#262626]'}`}>
                  {includeLetterhead && <Check className="w-3 h-3" />}
                </div>
              </div>

              {/* Option 2: AI Neural Metrics */}
              <div
                onClick={() => setIncludeAiMetrics(!includeAiMetrics)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  includeAiMetrics
                    ? 'bg-[#111111] border-[#4ade80]/50 text-white'
                    : 'bg-[#050505] border-[#1a1a1a] text-[#737373]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`w-4 h-4 ${includeAiMetrics ? 'text-[#4ade80]' : 'text-[#525252]'}`} />
                  <div>
                    <p className="font-semibold text-xs">Grad-CAM Inference</p>
                    <p className="text-[10px] text-[#737373]">Confidence & Activation maps</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${includeAiMetrics ? 'bg-[#4ade80] border-[#4ade80] text-black' : 'border-[#262626]'}`}>
                  {includeAiMetrics && <Check className="w-3 h-3 font-bold" />}
                </div>
              </div>

              {/* Option 3: ICD-10 Billing */}
              <div
                onClick={() => setIncludeIcd10(!includeIcd10)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  includeIcd10
                    ? 'bg-[#111111] border-[#38bdf8]/50 text-white'
                    : 'bg-[#050505] border-[#1a1a1a] text-[#737373]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className={`w-4 h-4 ${includeIcd10 ? 'text-[#38bdf8]' : 'text-[#525252]'}`} />
                  <div>
                    <p className="font-semibold text-xs">ICD-10 Diagnostic Coding</p>
                    <p className="text-[10px] text-[#737373]">Billing & pathology code</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${includeIcd10 ? 'bg-[#38bdf8] border-[#38bdf8] text-black' : 'border-[#262626]'}`}>
                  {includeIcd10 && <Check className="w-3 h-3 font-bold" />}
                </div>
              </div>

              {/* Option 4: Digital Signature */}
              <div
                onClick={() => setIncludeSignature(!includeSignature)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  includeSignature
                    ? 'bg-[#111111] border-[#a855f7]/50 text-white'
                    : 'bg-[#050505] border-[#1a1a1a] text-[#737373]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className={`w-4 h-4 ${includeSignature ? 'text-[#a855f7]' : 'text-[#525252]'}`} />
                  <div>
                    <p className="font-semibold text-xs">Digital Verification Stamp</p>
                    <p className="text-[10px] text-[#737373]">SHA-256 Electronic Signature</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${includeSignature ? 'bg-[#a855f7] border-[#a855f7] text-white' : 'border-[#262626]'}`}>
                  {includeSignature && <Check className="w-3 h-3" />}
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-[#f27d26]/5 border border-[#f27d26]/20 rounded-xl text-[10px] font-mono text-[#a3a3a3] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#f27d26] shrink-0" />
            <span>
              Generated PDFs contain embedded cryptographic hashes and de-identified headers complying with 45 CFR § 164.514 HIPAA Privacy Rules.
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-xs text-[#a3a3a3] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            {/* Direct Browser Print Button */}
            <button
              onClick={handlePrintBrowser}
              className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-white font-medium text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#f27d26]" />
              <span>Send to Printer</span>
            </button>

            {/* High-Res PDF Export Button */}
            <button
              onClick={handleExportHighQualityPdf}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl bg-[#f27d26] hover:bg-[#e06c1b] text-white font-medium text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-[#f27d26]/10 disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download High-Res PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
