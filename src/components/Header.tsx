import React from 'react';
import { Search, Bell, HelpCircle, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  onOpenVideoModal?: () => void;
  alertCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAlerts,
  onOpenVideoModal,
  alertCount,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="h-16 border-b border-[#1a1a1a] bg-[#080808] px-4 sm:px-6 flex items-center gap-4 text-[#e5e5e5] z-20 sticky top-0">
      <div className="hidden md:block w-36 shrink-0 text-xs font-medium text-[#a3a3a3]">
        Clinical workspace
      </div>
      <div className="flex-1 min-w-0 max-w-2xl">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between bg-[#050505] border border-[#1a1a1a] hover:border-[#262626] text-[#737373] text-xs px-3.5 py-2.5 rounded-lg transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-[#737373] group-hover:text-white transition-colors" />
            <span className="truncate">Search patients, studies, and scans</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-[#111111] border border-[#262626] text-[#737373] px-1.5 py-0.5 rounded font-mono shrink-0 ml-2">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          title="Critical Alerts"
          aria-label={`Critical alerts: ${alertCount}`}
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#f27d26] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#050505]">
              {alertCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenVideoModal}
          className="p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          title="Help and walkthrough"
          aria-label="Help and walkthrough"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-1.5 text-xs text-[#e5e5e5] bg-[#0a0a0a] border border-[#1a1a1a] px-2.5 py-2 rounded-lg hover:border-[#262626] transition-colors cursor-pointer"
        >
          {darkMode ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#f27d26]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#737373]">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#737373]">Light</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
