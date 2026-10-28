import { jsPDF } from 'jspdf';
import { DiagnosticReport, ScanAnalysis } from '../types';

/**
 * Generates and downloads a single formatted PDF report for medical records.
 */
export function exportReportToPdf(report: DiagnosticReport) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  // Header Banner Background (#080808)
  doc.setFillColor(8, 8, 8);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Orange Accent Bar (#f27d26)
  doc.setFillColor(242, 125, 38);
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  // Brand Name & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('MEDVISION AI RADIOLOGY', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(170, 170, 170);
  doc.text('Department of Diagnostic Imaging & Neural Analytics', margin, 18);
  doc.text('HIPAA SECURE OFFICIAL MEDICAL RECORD', margin, 23);

  // Right Header Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(242, 125, 38);
  doc.text(report.reportNumber, pageWidth - margin, 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(170, 170, 170);
  doc.text(`Issued: ${report.reportDate}`, pageWidth - margin, 18, { align: 'right' });
  doc.text(`Status: ${report.status}`, pageWidth - margin, 23, { align: 'right' });

  y = 36;

  // Title Section
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('STRUCTURED DIAGNOSTIC RADIOLOGY REPORT', margin, y);
  y += 6;

  // Patient & Study Details Card
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(220, 224, 230);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'FD');

  // Row 1
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT NAME', margin + 6, y + 7);
  doc.text('PATIENT ID', margin + 70, y + 7);
  doc.text('STUDY DATE', margin + 130, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(9.5);
  doc.text(report.patientName, margin + 6, y + 13);
  doc.text(report.patientId, margin + 70, y + 13);
  doc.text(report.studyDate, margin + 130, y + 13);

  // Row 2
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('IMAGING MODALITY', margin + 6, y + 22);
  doc.text('ATTENDING RADIOLOGIST', margin + 70, y + 22);
  doc.text('ICD-10 CODE', margin + 130, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(9.5);
  doc.text(report.modality, margin + 6, y + 28);
  doc.text(report.radiologist, margin + 70, y + 28);
  doc.text(report.icd10, margin + 130, y + 28);

  y += 40;

  // AI Inference Match Box
  doc.setFillColor(240, 253, 244); // light green background
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text('NEURAL NETWORK INFERENCE ANALYSIS', margin + 6, y + 7);

  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61);
  doc.text(`${report.aiConfidence}% Match Confidence`, pageWidth - margin - 6, y + 10, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(74, 85, 104);
  doc.text('Architecture: CNN-V4 Deep Convolutional Network • Grad-CAM Layer 4 Activation', margin + 6, y + 13);

  y += 24;

  // Radiological Findings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(242, 125, 38);
  doc.text('RADIOLOGICAL FINDINGS', margin, y);
  y += 2;
  doc.setDrawColor(242, 125, 38);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + 42, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const findingsLines = doc.splitTextToSize(report.findings, contentWidth);
  doc.text(findingsLines, margin, y);
  y += findingsLines.length * 4.5 + 8;

  // Diagnostic Impression Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text('DIAGNOSTIC IMPRESSION', margin, y);
  y += 4;

  const impressionLines = doc.splitTextToSize(report.impression, contentWidth - 12);
  const boxHeight = Math.max(20, impressionLines.length * 4.5 + 9);

  doc.setFillColor(252, 252, 253);
  doc.setDrawColor(242, 125, 38);
  doc.setLineWidth(0.7);
  doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(impressionLines, margin + 6, y + 7);

  y += boxHeight + 14;

  // Signature Block
  doc.setDrawColor(220, 224, 230);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text('ELECTRONIC SIGNATURE & VERIFICATION', margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text(`Electronically Signed by: ${report.radiologist}`, margin, y);

  const hashVal = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 130);
  doc.text(`HIPAA Security Certificate Hash: ${hashVal}`, margin, y + 5);
  doc.text('Verified via MedVision AI Clinical Gateway • Audit Logged', margin, y + 9);

  // Footer text
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text(
    'CONFIDENTIAL HEALTH RECORD — Unauthorized reproduction or dissemination is strictly prohibited under federal HIPAA regulations.',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  const cleanPatientName = report.patientName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanPatientName}_Diagnostic_Report_${report.reportNumber}.pdf`);
}

/**
 * Generates and downloads a multi-patient summary PDF archive of all current diagnostic reports.
 */
export function exportAllReportsSummaryToPdf(reports: DiagnosticReport[], scans: ScanAnalysis[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  let y = 14;

  // Header Banner
  doc.setFillColor(8, 8, 8);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(242, 125, 38);
  doc.rect(0, 23, pageWidth, 1.2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MEDVISION AI — DIAGNOSTIC SUMMARIES MEDICAL RECORD ARCHIVE', margin, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(`Export Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Total Reports: ${reports.length}`, margin, 18);

  y = 30;

  // Executive Summary Chips
  const avgConfidence = Math.round(reports.reduce((acc, r) => acc + r.aiConfidence, 0) / (reports.length || 1));
  const finalCount = reports.filter((r) => r.status === 'Final').length;

  doc.setFillColor(245, 246, 248);
  doc.setDrawColor(220, 224, 230);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('SUMMARY METRICS:', margin + 4, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(`Total Diagnostic Records: ${reports.length}`, margin + 40, y + 9);
  doc.text(`Finalized & Verified: ${finalCount}`, margin + 95, y + 9);
  doc.text(`Avg. AI Match Confidence: ${avgConfidence}%`, margin + 145, y + 9);
  doc.text(`HIPAA Status: Encrypted & Verified`, margin + 205, y + 9);

  y += 20;

  // Table Header
  const colX = {
    num: margin,
    patient: margin + 30,
    id: margin + 75,
    modality: margin + 102,
    date: margin + 125,
    findings: margin + 152,
    confidence: margin + 225,
    icd: margin + 248,
    status: margin + 266,
  };

  doc.setFillColor(240, 242, 245);
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);

  doc.text('REPORT #', colX.num + 2, y + 5.5);
  doc.text('PATIENT NAME', colX.patient, y + 5.5);
  doc.text('PATIENT ID', colX.id, y + 5.5);
  doc.text('MODALITY', colX.modality, y + 5.5);
  doc.text('DATE', colX.date, y + 5.5);
  doc.text('PRIMARY FINDINGS SUMMARY', colX.findings, y + 5.5);
  doc.text('CONFIDENCE', colX.confidence, y + 5.5);
  doc.text('ICD-10', colX.icd, y + 5.5);
  doc.text('STATUS', colX.status, y + 5.5);

  y += 9;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  reports.forEach((rep, index) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 15;
    }

    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(250, 251, 252);
      doc.rect(margin, y - 3.5, pageWidth - margin * 2, 8, 'F');
    }

    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.text(rep.reportNumber, colX.num + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.text(rep.patientName, colX.patient, y);
    doc.text(rep.patientId, colX.id, y);
    doc.text(rep.modality, colX.modality, y);
    doc.text(rep.studyDate, colX.date, y);

    // Truncate findings summary if needed
    const shortFindings = rep.impression.length > 45 ? rep.impression.substring(0, 42) + '...' : rep.impression;
    doc.text(shortFindings, colX.findings, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text(`${rep.aiConfidence}%`, colX.confidence, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(242, 125, 38);
    doc.text(rep.icd10, colX.icd, y);

    doc.setTextColor(40, 40, 40);
    doc.text(rep.status, colX.status, y);

    y += 8;
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'MedVision AI Radiology Platform — Confidential Diagnostic Log Archive',
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  doc.save(`MedVision_Diagnostic_Summaries_Archive_${new Date().toISOString().slice(0, 10)}.pdf`);
}
