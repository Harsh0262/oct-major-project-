import React, { useState } from 'react';
import { Share2, Server, Activity, CheckCircle2, RefreshCw } from 'lucide-react';
import { INITIAL_PACS } from '../data/mockData';
import { PACSIntegration } from '../types';

export const IntegrationsView: React.FC = () => {
  const [pacsList] = useState<PACSIntegration[]>(INITIAL_PACS);

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-6 text-[#e5e5e5]">
      <div className="border-b border-[#1a1a1a] pb-3">
        <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#f27d26]" />
          <span>PACS, EHR & Network Gateways</span>
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">HL7 v2, FHIR R4, and DICOM C-STORE router status monitors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pacsList.map((pacs) => (
          <div
            key={pacs.id}
            className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-[#f27d26]">
                  <Server className="w-4 h-4" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#111111] text-[#4ade80] border border-[#4ade80]/40">
                  {pacs.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mt-3">{pacs.name}</h3>
              <p className="text-xs text-[#737373] font-mono mt-0.5">{pacs.protocol}</p>

              <div className="bg-[#050505] p-3 rounded-xl border border-[#1a1a1a] mt-4 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#737373]">
                  <span>Host:</span>
                  <span className="text-[#e5e5e5]">{pacs.host}:{pacs.port}</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <span>Ping Latency:</span>
                  <span className="text-[#4ade80] font-bold">{pacs.lastPingMs}ms</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <span>Synced Today:</span>
                  <span className="text-white font-bold">{pacs.scansSyncedToday} scans</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2 bg-[#111111] hover:bg-[#1a1a1a] text-[#e5e5e5] text-xs font-mono font-medium rounded-xl border border-[#262626] transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5 text-[#f27d26]" />
              <span>Test PACS Ping</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
