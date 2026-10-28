import React, { useState } from 'react';
import { Search, X, User, FileText, Activity, AlertTriangle } from 'lucide-react';
import { Patient, ScanAnalysis } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  scans: ScanAnalysis[];
  onSelectScan: (scan: ScanAnalysis) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  scans,
  onSelectScan,
  onSelectPatient,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase()) ||
      p.mrn.toLowerCase().includes(query.toLowerCase())
  );

  const filteredScans = scans.filter(
    (s) =>
      s.finding.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.patientName.toLowerCase().includes(query.toLowerCase()) ||
      s.study.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-lime-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, MRN, scan IDs, findings (e.g. Pneumonia)..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-6">
          {/* Scans */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-lime-400" />
              Radiology Scans ({filteredScans.length})
            </p>
            {filteredScans.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No matching scans found</p>
            ) : (
              <div className="space-y-1.5">
                {filteredScans.map((scan) => (
                  <button
                    key={scan.id}
                    onClick={() => {
                      onSelectScan(scan);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-black">
                        <img src={scan.thumbnailUrl} alt={scan.study} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{scan.finding}</span>
                          <span className="text-[10px] font-mono text-lime-400 bg-lime-950 px-1.5 py-0.2 rounded border border-lime-500/30">
                            {scan.confidence}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {scan.patientName} • {scan.study} • {scan.id}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">{scan.dateTime}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Patients */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Patients ({filteredPatients.length})
            </p>
            {filteredPatients.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No matching patients found</p>
            ) : (
              <div className="space-y-1.5">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      onSelectPatient(patient);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 transition-colors text-left cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{patient.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({patient.id})</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {patient.age} yrs • {patient.gender} • MRN: {patient.mrn} • Assigned: {patient.assignedDoctor}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-lime-400 bg-lime-950/60 px-2 py-0.5 rounded-md border border-lime-500/30">
                      {patient.primaryFinding}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tip: Press ESC to close search</span>
          <span className="text-lime-400 font-mono">MedVision AI Global Search</span>
        </div>
      </div>
    </div>
  );
};
