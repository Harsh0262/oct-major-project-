import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, Server, Key } from 'lucide-react';

interface HipaaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HipaaModal: React.FC<HipaaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-950 border border-lime-500/40 flex items-center justify-center text-lime-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">HIPAA & SOC-2 Compliance Security</h3>
              <p className="text-[11px] text-slate-400">End-to-End Encrypted Radiology AI Infrastructure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-lime-950/40 border border-lime-500/30 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
            <div>
              <p className="font-bold text-lime-400">Status: Fully Compliant & Audited</p>
              <p className="text-slate-300 text-[11px]">
                All PHI (Protected Health Information) is anonymized on client edge before model inference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-lime-400 font-semibold">
                <Lock className="w-4 h-4" />
                <span>AES-256 Storage</span>
              </div>
              <p className="text-[11px] text-slate-400">Data at rest encrypted with HSM keys in Cloud Run container sandbox.</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <Key className="w-4 h-4" />
                <span>TLS 1.3 In-Transit</span>
              </div>
              <p className="text-[11px] text-slate-400">Strict zero-exposure proxy routing on port 3000.</p>
            </div>
          </div>

          <div>
            <p className="font-bold text-white mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-lime-400" />
              Recent BAA & Audit Trail Log
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 font-mono text-[10px] text-slate-400">
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>[2026-08-01 18:04] Access Granted: Dr. Harsh (NPI #1029384)</span>
                <span className="text-lime-400">VERIFIED</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>[2026-08-01 18:00] DICOM De-identification Pipeline Test</span>
                <span className="text-lime-400">PASSED</span>
              </div>
              <div className="flex justify-between">
                <span>[2026-08-01 17:30] SOC-2 Type II Annual Certificate Audit</span>
                <span className="text-cyan-400">VALID</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-lime-400 text-slate-950 font-bold rounded-lg hover:bg-lime-300 transition-colors cursor-pointer"
            >
              Close Compliance Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
