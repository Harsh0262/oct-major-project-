import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck } from 'lucide-react';
import { Patient } from '../types';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
}

export const CreatePatientModal: React.FC<CreatePatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1979-05-12');
  const [mrn, setMrn] = useState(`MRN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [email, setEmail] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Rohan');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPatient: Patient = {
      id: `P-${Math.floor(100000 + Math.random() * 900000)}`,
      name,
      age: Number(age),
      gender,
      dob: new Date(dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      mrn,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      doctorEmail: doctorEmail || `${assignedDoctor.toLowerCase().replace(/dr\.\s*/g, '').replace(/\s+/g, '.')}@medvision.health`,
      lastScanDate: 'Today',
      lastScanType: 'Pending Imaging',
      primaryFinding: 'Awaiting Radiology',
      status: 'Active',
      assignedDoctor,
      totalScans: 0,
    };

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Create New Patient Record</h3>
              <p className="text-[11px] text-slate-400">Add patient details to the HIPAA compliant EHR database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Full Legal Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Robert Vance"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-lime-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-lime-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-lime-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-lime-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Medical Record Number (MRN)</label>
              <input
                type="text"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none font-mono focus:border-lime-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Patient Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. patient@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-lime-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Doctor Email (Optional)</label>
              <input
                type="email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                placeholder="e.g. dr.rohan@medvision.health"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-lime-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-lime-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Assigned Radiologist</label>
              <select
                value={assignedDoctor}
                onChange={(e) => setAssignedDoctor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-lime-500"
              >
                <option value="Dr. Rohan">Dr. Rohan</option>
                <option value="Dr. Meera">Dr. Meera</option>
                <option value="Dr. Amit">Dr. Amit</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-lime-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AES-256 Encrypted Record</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-lime-400 text-slate-950 font-bold hover:bg-lime-300 transition-colors cursor-pointer"
              >
                Save Patient
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
