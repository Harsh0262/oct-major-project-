import React, { useState } from 'react';
import { FileText, Printer, Download, Sparkles, Search, FileDown, Check, ChevronDown, Archive, Eye, Users, Mail, ShieldCheck } from 'lucide-react';
import { INITIAL_REPORTS } from '../data/mockData';
import { DiagnosticReport, ScanAnalysis, Patient } from '../types';
import { exportReportToPdf, exportAllReportsSummaryToPdf } from '../utils/pdfExport';
import { PrintReportModal } from '../components/PrintReportModal';

interface ReportsViewProps {
  scans: ScanAnalysis[];
  onSelectScan?: (scan: ScanAnalysis) => void;
  onNavigateToPatient?: (patientId: string) => void;
  onOpenEmailModal?: (config: { scan?: ScanAnalysis | null; patient?: Patient | null; report?: DiagnosticReport | null; recipientType?: 'patient' | 'doctor' }) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  scans,
  onSelectScan,
  onNavigateToPatient,
  onOpenEmailModal,
}) => {
  const [reports] = useState<DiagnosticReport[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<DiagnosticReport>(reports[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const matchedScan = scans.find(
    (s) => s.id === selectedReport.scanId || s.patientId === selectedReport.patientId
  );

  const filteredReports = reports.filter(
    (rep) =>
      rep.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.icd10.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.modality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPrintModal = () => {
    setIsPrintModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleExportSinglePdf = (report: DiagnosticReport = selectedReport) => {
    exportReportToPdf(report);
    showToast(`High-quality PDF generated for ${report.patientName} (${report.reportNumber})`);
    setExportDropdownOpen(false);
  };

  const handleExportBatchPdf = () => {
    exportAllReportsSummaryToPdf(reports, scans);
    showToast(`Diagnostic Log Archive exported (${reports.length} records)`);
    setExportDropdownOpen(false);
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-6 text-[#e5e5e5] relative">
      {/* Export Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] border border-[#262626] text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 font-mono no-print">
          <div className="w-6 h-6 rounded-full bg-[#4ade80]/20 text-[#4ade80] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="border-b border-[#1a1a1a] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#f27d26]" />
            <span>Structured Diagnostic Reports</span>
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">Board-certified radiologist report signing, ICD-10 coding & high-res print service</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleOpenPrintModal}
            className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] text-[#e5e5e5] text-xs font-mono rounded-xl border border-[#262626] hover:border-[#f27d26]/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Open high-quality print studio"
          >
            <Printer className="w-4 h-4 text-[#f27d26]" />
            <span>Print Report Studio</span>
          </button>

          {/* Export PDF Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-3.5 py-1.5 bg-[#f27d26] hover:bg-[#e06c1b] text-white text-xs font-mono font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#f27d26]/10"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#080808] border border-[#262626] rounded-xl shadow-2xl py-1.5 z-30 space-y-0.5">
                <button
                  onClick={() => handleExportSinglePdf(selectedReport)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-[#111111] text-xs flex items-center gap-2.5 text-white transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-[#f27d26]" />
                  <div>
                    <p className="font-medium">Export Current High-Res PDF</p>
                    <p className="text-[10px] text-[#737373]">{selectedReport.reportNumber} ({selectedReport.patientName})</p>
                  </div>
                </button>
                <div className="border-t border-[#1a1a1a] my-1" />
                <button
                  onClick={handleExportBatchPdf}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-[#111111] text-xs flex items-center gap-2.5 text-white transition-colors cursor-pointer"
                >
                  <Archive className="w-4 h-4 text-[#4ade80]" />
                  <div>
                    <p className="font-medium">Export All Summaries Archive</p>
                    <p className="text-[10px] text-[#737373]">Multi-patient record summary PDF</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Index (4 cols) */}
        <div className="lg:col-span-4 space-y-3 no-print">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#737373] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, MRN, patient..."
              className="w-full bg-[#080808] border border-[#1a1a1a] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-[#737373] outline-none focus:border-[#262626]"
            />
          </div>

          <div className="space-y-2">
            {filteredReports.map((rep) => {
              const isSelected = selectedReport.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#111111] border-[#f27d26]'
                      : 'bg-[#080808] border-[#1a1a1a] hover:border-[#262626]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#f27d26]">{rep.reportNumber}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#050505] px-2 py-0.5 rounded text-[#737373] font-mono border border-[#1a1a1a]">
                        {rep.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportSinglePdf(rep);
                        }}
                        className="p-1 rounded hover:bg-[#262626] text-[#737373] hover:text-[#f27d26] transition-colors"
                        title="Quick Download PDF"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{rep.patientName}</h4>
                  <p className="text-xs text-[#737373] font-mono mt-0.5">{rep.modality} • {rep.studyDate}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Structured Report Preview Sheet (8 cols) */}
        <div className="lg:col-span-8 bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 shadow-2xl space-y-6 text-[#e5e5e5] text-xs font-sans printable-report-area">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#1a1a1a] pb-4 printable-report-header">
            <div>
              <h1 className="text-lg font-serif italic text-white tracking-wider">
                MedVision AI Radiology Report
              </h1>
              <p className="text-[#737373] text-[11px] font-mono mt-0.5">Department of Diagnostic Imaging & AI Diagnostics</p>
            </div>
            <div className="text-right font-mono">
              <p className="text-[#f27d26] font-bold">{selectedReport.reportNumber}</p>
              <p className="text-[#737373] text-[10px]">{selectedReport.reportDate}</p>
            </div>
          </div>

          {/* Metadata Block */}
          <div className="grid grid-cols-2 gap-4 bg-[#050505] p-4 rounded-xl border border-[#1a1a1a]">
            <div>
              <p className="text-[#737373] text-[10px] font-mono">Patient Name</p>
              <p className="font-semibold text-white text-sm">{selectedReport.patientName}</p>
              <p className="text-[#737373] font-mono text-[11px]">ID: {selectedReport.patientId}</p>
            </div>
            <div>
              <p className="text-[#737373] text-[10px] font-mono">Radiologist</p>
              <p className="font-semibold text-[#f27d26] text-sm">{selectedReport.radiologist}</p>
              <p className="text-[#737373] text-[11px] font-mono">Modality: {selectedReport.modality}</p>
            </div>
          </div>

          {/* AI Diagnostic Confidence Badge */}
          <div className="flex items-center justify-between p-3 bg-[#111111] border border-[#262626] rounded-xl font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4ade80]" />
              <span className="font-medium text-[#4ade80]">AI Confidence Score</span>
            </div>
            <span className="font-bold text-[#4ade80] text-sm">{selectedReport.aiConfidence}% Match</span>
          </div>

          {/* Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#737373] border-b border-[#1a1a1a] pb-1">
              Radiological Findings
            </h3>
            <p className="text-[#e5e5e5] leading-relaxed text-xs">{selectedReport.findings}</p>
          </div>

          {/* Impression */}
          <div className="space-y-2 bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] printable-accent-box">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f27d26]">
              Diagnostic Impression
            </h3>
            <p className="text-white font-medium text-xs leading-relaxed">{selectedReport.impression}</p>
          </div>

          {/* Signature & Verification Block for Printed Record */}
          <div className="pt-4 border-t border-[#1a1a1a] space-y-1.5 font-mono text-[10px] text-[#737373] page-break-inside-avoid">
            <div className="flex items-center justify-between">
              <span>Electronically Signed by: <strong className="text-white">{selectedReport.radiologist}</strong></span>
              <span className="text-[#4ade80] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Clinical Audit
              </span>
            </div>
            <p className="text-[9px]">HIPAA Verification Hash: SHA256-8F2B91A0-7C1D-4E90 • Issued {selectedReport.reportDate}</p>
          </div>

          {/* ICD-10 Coding & Interconnected Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-[#1a1a1a] text-[11px] font-mono no-print">
            <div>
              <span className="text-[#737373]">ICD-10 Code: </span>
              <span className="font-bold text-[#f27d26]">{selectedReport.icd10}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenPrintModal}
                className="px-3 py-1.5 bg-[#f27d26] hover:bg-[#e06c1b] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium shadow-md shadow-[#f27d26]/10"
                title="Print or export high-res PDF for patient record"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Record</span>
              </button>

              {matchedScan && (
                <button
                  onClick={() => {
                    if (onSelectScan) onSelectScan(matchedScan);
                  }}
                  className="px-2.5 py-1.5 bg-[#050505] hover:bg-[#111111] border border-[#1a1a1a] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Inspect Grad-CAM scan in Dashboard"
                >
                  <Eye className="w-3 h-3 text-[#f27d26]" />
                  <span>Grad-CAM Scan</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (onNavigateToPatient) onNavigateToPatient(selectedReport.patientId);
                }}
                className="px-2.5 py-1.5 bg-[#050505] hover:bg-[#111111] border border-[#1a1a1a] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Open patient history and clinical timeline"
              >
                <Users className="w-3 h-3 text-[#38bdf8]" />
                <span>Patient Timeline</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenEmailModal) {
                    onOpenEmailModal({ report: selectedReport, recipientType: 'patient' });
                  }
                }}
                className="px-2.5 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-[#4ade80] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Send report directly to patient or attending physician via email"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Report</span>
              </button>

              <button
                onClick={() => handleExportSinglePdf(selectedReport)}
                className="px-2.5 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-[#f27d26]" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        report={selectedReport}
        scan={matchedScan}
      />
    </div>
  );
};

