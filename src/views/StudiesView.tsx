import React, { useState } from 'react';
import { FolderKanban, Filter, Eye, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ScanAnalysis } from '../types';

interface StudiesViewProps {
  scans: ScanAnalysis[];
  onSelectScan: (scan: ScanAnalysis) => void;
}

export const StudiesView: React.FC<StudiesViewProps> = ({ scans, onSelectScan }) => {
  const [selectedModality, setSelectedModality] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScans = scans.filter((s) => {
    const matchesModality = selectedModality === 'All' || s.modality === selectedModality;
    const matchesQuery =
      s.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModality && matchesQuery;
  });

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-4 text-[#e5e5e5]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a] pb-3">
        <div>
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#f27d26]" />
            <span>Radiology Studies Catalog</span>
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">PACS archived studies filtered by imaging modality and AI findings</p>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter studies..."
          className="bg-[#080808] border border-[#1a1a1a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#737373] outline-none focus:border-[#262626] w-full sm:w-64"
        />
      </div>

      {/* Modality Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1a1a1a] pb-2 overflow-x-auto">
        {['All', 'XR', 'CT', 'MRI', 'US'].map((mod) => (
          <button
            key={mod}
            onClick={() => setSelectedModality(mod)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              selectedModality === mod
                ? 'bg-[#111111] text-[#f27d26] border border-[#f27d26]/40'
                : 'bg-[#080808] text-[#737373] border border-[#1a1a1a] hover:text-white'
            }`}
          >
            {mod === 'All' ? 'All Modalities' : `${mod} Scans`}
          </button>
        ))}
      </div>

      {/* Grid of Study Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScans.map((scan) => (
          <div
            key={scan.id}
            onClick={() => onSelectScan(scan)}
            className="bg-[#080808] border border-[#1a1a1a] hover:border-[#f27d26] rounded-2xl p-4 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#050505] text-[#f27d26] border border-[#1a1a1a]">
                  {scan.modality} • {scan.study}
                </span>
                <span className="font-mono text-[11px] text-[#737373]">{scan.id}</span>
              </div>

              {/* Scan Thumbnail Image */}
              <div className="w-full h-44 bg-[#050505] rounded-xl overflow-hidden border border-[#1a1a1a] relative group-hover:border-[#262626] mb-3 flex items-center justify-center">
                <img
                  src={scan.thumbnailUrl}
                  alt={scan.study}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-[#080808] text-[#f27d26] text-xs font-mono px-3 py-1.5 rounded-lg border border-[#f27d26]/40 flex items-center gap-1.5 transition-opacity">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Scan
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{scan.finding}</h4>
                  <span className="font-mono text-xs font-bold text-[#4ade80]">{scan.confidence}%</span>
                </div>
                <p className="text-xs text-[#737373]">
                  Patient: <strong className="text-[#e5e5e5]">{scan.patientName}</strong> ({scan.patientId})
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[11px] text-[#737373] font-mono">
              <span>{scan.dateTime}</span>
              <span className="text-[#a3a3a3] font-medium">{scan.doctor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
