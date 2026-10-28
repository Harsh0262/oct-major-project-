import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Eye } from 'lucide-react';
import { INITIAL_ALERTS } from '../data/mockData';
import { SystemAlert, ScanAnalysis } from '../types';

interface AlertsViewProps {
  scans: ScanAnalysis[];
  onSelectScan: (scan: ScanAnalysis) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ scans, onSelectScan }) => {
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);

  const toggleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: !a.acknowledged } : a))
    );
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-6 text-[#e5e5e5]">
      <div className="border-b border-[#1a1a1a] pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#ef4444]" />
            <span>Critical Radiology Alerts</span>
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">High-priority AI findings requiring rapid radiologist acknowledgment</p>
        </div>

        <span className="px-3 py-1 bg-[#1a0909] text-[#ef4444] border border-[#ef4444]/40 text-xs font-mono font-medium rounded-full">
          {alerts.filter((a) => !a.acknowledged).length} Pending Review
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              alert.acknowledged
                ? 'bg-[#080808]/60 border-[#1a1a1a] opacity-70'
                : 'bg-[#1a0909]/40 border-[#ef4444]/40 shadow-xl'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                  alert.severity === 'Critical'
                    ? 'bg-[#1a0909] border-[#ef4444]/50 text-[#ef4444]'
                    : 'bg-[#111111] border-[#f27d26]/50 text-[#f27d26]'
                }`}
              >
                <ShieldAlert className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{alert.finding}</h3>
                  <span className="text-[10px] font-mono text-[#737373]">({alert.scanId})</span>
                </div>
                <p className="text-xs text-[#737373] mt-0.5">
                  Patient: <strong className="text-white">{alert.patientName}</strong> ({alert.patientId}) • Assigned: {alert.doctor}
                </p>
                <p className="text-xs text-[#737373] italic mt-1 bg-[#050505] p-2 rounded-lg border border-[#1a1a1a]">
                  "{alert.notes}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center font-mono text-xs">
              {scans.find((s) => s.id === alert.scanId) && (
                <button
                  onClick={() => onSelectScan(scans.find((s) => s.id === alert.scanId)!)}
                  className="px-3 py-1.5 bg-[#080808] hover:bg-[#111111] text-[#e5e5e5] font-mono text-xs rounded-lg transition-colors border border-[#1a1a1a] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Scan</span>
                </button>
              )}

              <button
                onClick={() => toggleAcknowledge(alert.id)}
                className={`px-4 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  alert.acknowledged
                    ? 'bg-[#111111] text-[#737373] hover:bg-[#1a1a1a] border border-[#262626]'
                    : 'bg-[#f27d26] text-white hover:bg-[#e06c1b]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{alert.acknowledged ? 'Acknowledged' : 'Acknowledge Finding'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
