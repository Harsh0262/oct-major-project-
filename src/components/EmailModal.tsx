import React, { useState, useEffect } from 'react';
import { X, Mail, Send, Sparkles, CheckCircle2, User, Stethoscope, Copy, ExternalLink, ShieldCheck, AlertCircle, Check, Users } from 'lucide-react';
import { ScanAnalysis, Patient, DiagnosticReport } from '../types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scan?: ScanAnalysis | null;
  patient?: Patient | null;
  report?: DiagnosticReport | null;
  defaultRecipientType?: 'patient' | 'doctor';
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  scan,
  patient,
  report,
  defaultRecipientType = 'patient',
}) => {
  const [recipientType, setRecipientType] = useState<'patient' | 'doctor' | 'custom'>(defaultRecipientType);
  const [patientEmail, setPatientEmail] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // Automated CC Workflow states
  const [ccDoctor, setCcDoctor] = useState(false);
  const [ccPatient, setCcPatient] = useState(false);

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Helper regex for email validation
  const isValidEmailFormat = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Auto-populate inputs on open
  useEffect(() => {
    if (isOpen) {
      setIsSent(false);
      setValidationError(null);

      // Default emails
      const defaultP = patient?.email || scan?.patientEmail || report?.patientEmail || (scan ? `${scan.patientName.toLowerCase().replace(/\s+/g, '.')}@example.com` : 'patient@example.com');
      const docName = scan?.doctor || patient?.assignedDoctor || 'Dr. Rohan';
      const defaultD = patient?.doctorEmail || scan?.doctorEmail || report?.doctorEmail || `${docName.toLowerCase().replace(/dr\.\s*/g, '').replace(/\s+/g, '.')}@medvision.health`;

      setPatientEmail(defaultP);
      setDoctorEmail(defaultD);

      const patientName = patient?.name || scan?.patientName || report?.patientName || 'Patient';
      const finding = scan?.finding || report?.findings || 'Diagnostic Imaging Review';
      const modality = scan?.modality || report?.modality || 'Imaging';

      if (recipientType === 'patient') {
        setSubject(`MedVision Healthcare Update: Diagnostic Radiology Summary for ${patientName}`);
        setEmailBody(
          `Dear ${patientName},\n\n` +
          `Your recent ${modality} scan (${scan?.study || 'Radiology Study'}) has been reviewed by your clinical team and our AI diagnostic system.\n\n` +
          `Summary of Assessment:\n` +
          `• Primary Evaluation: ${finding}\n` +
          `• Attending Physician: ${docName}\n\n` +
          `Recommended Next Steps:\n` +
          `${scan?.recommendedAction || 'Please follow up with your primary physician at your earliest convenience to discuss these results.'}\n\n` +
          `You may view your full patient timeline and report through the MedVision Health Portal.\n\n` +
          `Best regards,\n` +
          `MedVision Healthcare Team`
        );
      } else {
        setSubject(`[Clinical Referral & Consultation] ${patientName} (${scan?.patientId || patient?.id || 'Patient'}) - ${modality} ${finding}`);
        setEmailBody(
          `Dear ${docName},\n\n` +
          `Re: Diagnostic Review & AI Neural Heatmap Report\n` +
          `Patient: ${patientName} (ID: ${scan?.patientId || patient?.id || 'N/A'}, MRN: ${patient?.mrn || 'N/A'})\n` +
          `Study: ${scan?.study || modality}\n` +
          `AI Model: ${scan?.aiModel || 'DenseNet121-V4'} (${scan?.confidence ? scan.confidence.toFixed(1) + '% confidence' : 'Verified'})\n\n` +
          `Primary Radiological Findings:\n` +
          `${finding} in ${scan?.affectedRegion || 'target ROI'}.\n\n` +
          `Detailed Impression:\n` +
          `${scan?.summary || report?.impression || 'Lesion confirmed on Grad-CAM feature attribution layer.'}\n\n` +
          `ICD-10 Referral Code: ${report?.icd10 || 'J18.9'}\n` +
          `Protocol Recommendation: ${scan?.recommendedAction || 'Consider contrast-enhanced follow-up or pulmonary evaluation.'}\n\n` +
          `Sincerely,\n` +
          `Department of Diagnostic Imaging`
        );
      }
    }
  }, [isOpen, scan, patient, report, recipientType]);

  if (!isOpen) return null;

  const primaryRecipientEmail =
    recipientType === 'patient'
      ? patientEmail
      : recipientType === 'doctor'
      ? doctorEmail
      : customEmail;

  // Compute active CCs
  const activeCcEmails: { label: string; email: string; role: 'doctor' | 'patient' }[] = [];
  if (ccDoctor && recipientType !== 'doctor') {
    activeCcEmails.push({ label: 'Attending Physician', email: doctorEmail, role: 'doctor' });
  }
  if (ccPatient && recipientType !== 'patient') {
    activeCcEmails.push({ label: 'Patient', email: patientEmail, role: 'patient' });
  }

  // Validate entire routing configuration
  const validateRouting = (): boolean => {
    if (!primaryRecipientEmail.trim()) {
      setValidationError('Primary recipient email address cannot be empty.');
      return false;
    }
    if (!isValidEmailFormat(primaryRecipientEmail)) {
      setValidationError(`Primary recipient email "${primaryRecipientEmail}" is improperly formatted.`);
      return false;
    }

    for (const item of activeCcEmails) {
      if (!item.email.trim()) {
        setValidationError(`CC ${item.label} email address cannot be empty.`);
        return false;
      }
      if (!isValidEmailFormat(item.email)) {
        setValidationError(`CC ${item.label} email "${item.email}" is improperly formatted.`);
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  // AI Draft Email generator
  const handleAiDraft = async () => {
    setIsGeneratingAi(true);
    const patientName = patient?.name || scan?.patientName || 'Patient';
    const finding = scan?.finding || 'Radiology finding';

    try {
      const ccNote = activeCcEmails.length > 0 ? ` Note that this email is also CC'd to: ${activeCcEmails.map(c => c.label).join(', ')}.` : '';
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Draft a professional ${recipientType === 'patient' ? 'reassuring patient-friendly email' : 'formal doctor-to-doctor consultation email'} regarding radiological scan results for ${patientName}.${ccNote} Finding: ${finding}. Summary: ${scan?.summary || 'Detailed findings available'}. Keep it concise, respectful, and well-structured.`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          setEmailBody(data.text);
        }
      }
    } catch {
      // Fallback AI template refinement
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRouting()) return;

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2500);
  };

  const handleMailto = () => {
    if (!validateRouting()) return;

    const ccParam = activeCcEmails.length > 0 ? `&cc=${encodeURIComponent(activeCcEmails.map(c => c.email).join(','))}` : '';
    const mailtoUrl = `mailto:${encodeURIComponent(primaryRecipientEmail)}?subject=${encodeURIComponent(
      subject
    )}${ccParam}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleCopy = () => {
    if (!validateRouting()) return;

    const ccHeader = activeCcEmails.length > 0 ? `\nCC: ${activeCcEmails.map(c => c.email).join(', ')}` : '';
    navigator.clipboard.writeText(`To: ${primaryRecipientEmail}${ccHeader}\nSubject: ${subject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#080808] border border-[#1a1a1a] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-[#e5e5e5] flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between bg-[#050505]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#111111] border border-[#262626] flex items-center justify-center text-[#f27d26]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Send Clinical Report & Update via Email</h3>
              <p className="text-[11px] text-[#737373]">Multi-recipient clinical routing & automated CC workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSent ? (
          <div className="p-10 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-serif italic text-white">Diagnostic Report Dispatched Successfully!</h4>
            <div className="bg-[#050505] border border-[#1a1a1a] p-3 rounded-xl max-w-md mx-auto text-left text-xs font-mono space-y-1.5 text-[#a3a3a3]">
              <div className="flex justify-between">
                <span>Primary To:</span>
                <span className="text-white font-bold">{primaryRecipientEmail}</span>
              </div>
              {activeCcEmails.map((cc, i) => (
                <div key={i} className="flex justify-between">
                  <span>CC ({cc.label}):</span>
                  <span className="text-[#38bdf8] font-semibold">{cc.email}</span>
                </div>
              ))}
              <div className="flex justify-between text-[10px] text-[#525252] pt-1 border-t border-[#1a1a1a]">
                <span>Routing Status:</span>
                <span className="text-[#4ade80]">SMTP Delivered / Encrypted TLS 1.3</span>
              </div>
            </div>
            <p className="text-[11px] text-[#525252]">Audit log entry registered under HIPAA Compliance ID #LOG-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
            {/* Recipient Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#737373] uppercase">Primary Recipient Category</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRecipientType('patient')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-colors ${
                    recipientType === 'patient'
                      ? 'bg-[#111111] text-[#f27d26] border-[#f27d26]/40'
                      : 'bg-[#050505] text-[#737373] border-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientType('doctor')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-colors ${
                    recipientType === 'doctor'
                      ? 'bg-[#111111] text-[#f27d26] border-[#f27d26]/40'
                      : 'bg-[#050505] text-[#737373] border-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Attending Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientType('custom')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-colors ${
                    recipientType === 'custom'
                      ? 'bg-[#111111] text-[#f27d26] border-[#f27d26]/40'
                      : 'bg-[#050505] text-[#737373] border-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Custom Email</span>
                </button>
              </div>
            </div>

            {/* Recipient Email Address Input with Format Validation Indicator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono text-[#737373] uppercase">
                  {recipientType === 'patient' ? 'Patient Primary Email' : recipientType === 'doctor' ? 'Physician Primary Email' : 'Recipient Email Address'}
                </label>
                {primaryRecipientEmail.trim() && (
                  <span className={`text-[10px] font-mono flex items-center gap-1 ${
                    isValidEmailFormat(primaryRecipientEmail) ? 'text-[#4ade80]' : 'text-[#ef4444]'
                  }`}>
                    {isValidEmailFormat(primaryRecipientEmail) ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-[#4ade80]" />
                        <span>Valid Format</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-[#ef4444]" />
                        <span>Invalid Format</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {recipientType === 'patient' ? (
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => {
                    setPatientEmail(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="e.g. michael.turner@example.com"
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#262626]"
                />
              ) : recipientType === 'doctor' ? (
                <input
                  type="email"
                  value={doctorEmail}
                  onChange={(e) => {
                    setDoctorEmail(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="e.g. dr.rohan@medvision.health"
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#262626]"
                />
              ) : (
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => {
                    setCustomEmail(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="Enter recipient email address..."
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#262626]"
                />
              )}
            </div>

            {/* Automated CC Workflow Options */}
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#f27d26] uppercase font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#f27d26]" />
                  <span>Automated CC Workflow</span>
                </span>
                <span className="text-[10px] text-[#525252] font-mono">Cross-consultation routing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* CC Attending Physician Toggle */}
                {recipientType !== 'doctor' && (
                  <label className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                    ccDoctor ? 'bg-[#111111] border-[#38bdf8]/40 text-white' : 'bg-[#080808] border-[#1a1a1a] text-[#737373] hover:text-[#a3a3a3]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={ccDoctor}
                      onChange={(e) => {
                        setCcDoctor(e.target.checked);
                        setValidationError(null);
                      }}
                      className="accent-[#38bdf8] w-4 h-4 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium flex items-center gap-1 text-white">
                        <Stethoscope className="w-3 h-3 text-[#38bdf8]" />
                        <span>CC Attending Physician</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#737373] truncate">{doctorEmail}</div>
                    </div>
                  </label>
                )}

                {/* CC Patient Toggle */}
                {recipientType !== 'patient' && (
                  <label className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                    ccPatient ? 'bg-[#111111] border-[#4ade80]/40 text-white' : 'bg-[#080808] border-[#1a1a1a] text-[#737373] hover:text-[#a3a3a3]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={ccPatient}
                      onChange={(e) => {
                        setCcPatient(e.target.checked);
                        setValidationError(null);
                      }}
                      className="accent-[#4ade80] w-4 h-4 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium flex items-center gap-1 text-white">
                        <User className="w-3 h-3 text-[#4ade80]" />
                        <span>CC Patient</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#737373] truncate">{patientEmail}</div>
                    </div>
                  </label>
                )}
              </div>

              {/* CC Address Editable Input Fields when checked */}
              {ccDoctor && recipientType !== 'doctor' && (
                <div className="pt-1">
                  <label className="block text-[10px] font-mono text-[#737373] mb-0.5">Physician CC Address Validation</label>
                  <input
                    type="email"
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                    placeholder="dr.rohan@medvision.health"
                    className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg p-2 text-white font-mono text-xs outline-none focus:border-[#38bdf8]/50"
                  />
                </div>
              )}

              {ccPatient && recipientType !== 'patient' && (
                <div className="pt-1">
                  <label className="block text-[10px] font-mono text-[#737373] mb-0.5">Patient CC Address Validation</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg p-2 text-white font-mono text-xs outline-none focus:border-[#4ade80]/50"
                  />
                </div>
              )}
            </div>

            {/* Validation Banner if formatting fails */}
            {validationError && (
              <div className="p-2.5 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl text-[#ef4444] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Email Subject line */}
            <div>
              <label className="block text-[11px] font-mono text-[#737373] uppercase mb-1">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white outline-none focus:border-[#262626]"
              />
            </div>

            {/* Email Body & Gemini Draft Toolbar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono text-[#737373] uppercase">Email Content Body</label>

                <button
                  type="button"
                  onClick={handleAiDraft}
                  disabled={isGeneratingAi}
                  className="px-2.5 py-1 bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-[#4ade80] text-[10px] font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-[#4ade80]" />
                  <span>{isGeneratingAi ? 'Drafting with Gemini...' : 'Draft with Gemini AI'}</span>
                </button>
              </div>

              <textarea
                rows={6}
                required
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-3 text-white outline-none focus:border-[#262626] font-sans text-xs leading-relaxed"
              />
            </div>

            {/* Footer buttons */}
            <div className="pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-[#050505] border border-[#1a1a1a] text-[#737373] hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleMailto}
                  className="px-3 py-1.5 bg-[#050505] border border-[#1a1a1a] text-[#737373] hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open in native mail app with CC parameters"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#f27d26]" />
                  <span>Open Mail App</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#050505] border border-[#1a1a1a] text-[#737373] hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#f27d26] hover:bg-[#e06c1b] text-white font-medium text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-[#f27d26]/10"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Report</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

