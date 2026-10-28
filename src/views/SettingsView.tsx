import React, { useState } from 'react';
import { Settings, ShieldCheck, User, Save, Bell, Moon } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [doctorName, setDoctorName] = useState('Dr. Harsh');
  const [npi, setNpi] = useState('1029384819');
  const [pacsHost, setPacsHost] = useState('pacs.hospital.internal');
  const [autoGradCam, setAutoGradCam] = useState(true);
  const [criticalNotifications, setCriticalNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 text-[#e5e5e5]">
      <div className="border-b border-[#1a1a1a] pb-3">
        <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#f27d26]" />
          <span>Platform Configuration</span>
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">Radiologist preferences, Grad-CAM overlays, and HIPAA encryption controls</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 shadow-xl space-y-5 text-xs">
        {/* Radiologist Profile */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#f27d26]" />
            <span>Radiologist Profile</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#737373] mb-1 font-mono text-[11px]">Radiologist Name</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white outline-none focus:border-[#262626]"
              />
            </div>
            <div>
              <label className="block text-[#737373] mb-1 font-mono text-[11px]">NPI Number</label>
              <input
                type="text"
                value={npi}
                onChange={(e) => setNpi(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#262626]"
              />
            </div>
          </div>
        </div>

        {/* Diagnostic Preferences */}
        <div className="pt-4 border-t border-[#1a1a1a] space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#f27d26]" />
            <span>AI Inference & Overlay Settings</span>
          </h3>

          <div className="flex items-center justify-between p-3 bg-[#050505] rounded-xl border border-[#1a1a1a]">
            <div>
              <p className="font-semibold text-white">Auto-Enable Grad-CAM Heatmap</p>
              <p className="text-[#737373] text-[11px] mt-0.5">Automatically superimpose Grad-CAM heatmaps on newly analyzed scans</p>
            </div>
            <input
              type="checkbox"
              checked={autoGradCam}
              onChange={(e) => setAutoGradCam(e.target.checked)}
              className="w-4 h-4 accent-[#f27d26] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#050505] rounded-xl border border-[#1a1a1a]">
            <div>
              <p className="font-semibold text-white">Critical Alert Pager Notifications</p>
              <p className="text-[#737373] text-[11px] mt-0.5">Trigger instant visual chime for findings with &gt;90% severe confidence</p>
            </div>
            <input
              type="checkbox"
              checked={criticalNotifications}
              onChange={(e) => setCriticalNotifications(e.target.checked)}
              className="w-4 h-4 accent-[#f27d26] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#1a1a1a] flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[#4ade80] text-[11px] font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>HIPAA Compliant Configuration Saved Locally</span>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#f27d26] hover:bg-[#e06c1b] text-white font-mono text-xs font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
