import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  FolderKanban,
  BarChart3,
  Brain,
  Bell,
  FileText,
  Share2,
  Settings,
  Upload,
  UserPlus,
  ShieldCheck,
  ChevronDown,
  Activity
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  alertCount: number;
  onUploadDicom: () => void;
  onCreatePatient: () => void;
  onShowHipaaModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  alertCount,
  onUploadDicom,
  onCreatePatient,
  onShowHipaaModal,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'new-scan', label: 'New Scan', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" /> },
    { id: 'studies', label: 'Studies', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai-models', label: 'AI Models', icon: <Brain className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" />, badge: alertCount },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Share2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 h-screen bg-[#080808] border-r border-[#1a1a1a] flex flex-col justify-between select-none shrink-0 text-[#e5e5e5]">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-[#1a1a1a] flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#111111] border border-[#262626] flex items-center justify-center text-[#f27d26] font-bold">
            <Activity className="w-4 h-4 text-[#f27d26]" />
          </div>
          <div>
            <h1 className="text-lg font-serif italic tracking-tight text-[#f5f2ed] leading-none">
              MedVision.
            </h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#737373] mt-0.5">Radiology AI</p>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <div className="p-2 space-y-0.5">
          <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#404040] my-2 px-3">Navigation</p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white border border-[#262626] font-medium'
                      : 'text-[#737373] hover:text-white hover:bg-[#0d0d0d]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#f27d26]' : 'text-[#737373]'} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className={isActive ? 'text-white' : 'text-[#a3a3a3]'}>
                      {item.label}
                    </span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-[#f27d26] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="px-3 pt-3 border-t border-[#1a1a1a] mt-1">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#404040] mb-2 px-1">
            Actions
          </p>
          <div className="space-y-1.5">
            <button
              onClick={onUploadDicom}
              className="w-full flex items-center gap-2 px-3 py-1.5 bg-[#050505] border border-[#1a1a1a] hover:border-[#262626] text-[#e5e5e5] text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#f27d26]" />
              <span className="text-[11px]">Upload DICOM</span>
            </button>
            <button
              onClick={onCreatePatient}
              className="w-full flex items-center gap-2 px-3 py-1.5 bg-[#050505] border border-[#1a1a1a] hover:border-[#262626] text-[#e5e5e5] text-xs rounded-lg transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#4ade80]" />
              <span className="text-[11px]">Create Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-3 border-t border-[#1a1a1a] space-y-2">
        {/* HIPAA Compliance Badge */}
        <button
          onClick={onShowHipaaModal}
          className="w-full bg-[#050505] border border-[#1a1a1a] hover:border-[#262626] p-2.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-[#111111] border border-[#262626] flex items-center justify-center text-[#4ade80] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white">HIPAA Secure</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
            </div>
            <p className="text-[10px] text-[#737373] truncate">AES-256 Encrypted</p>
          </div>
        </button>

        {/* User Profile */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#050505] border border-[#1a1a1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#111111] border border-[#262626] flex items-center justify-center font-mono text-[10px] text-[#737373]">
              DR
            </div>
            <div>
              <p className="text-xs font-medium text-white">Dr. Rohan</p>
              <p className="text-[10px] text-[#737373]">Radiology Lead</p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
        </div>
      </div>
    </aside>
  );
};
