import React, { useState } from 'react';
import {
  UserPlus,
  Heart,
  Activity,
  AlertCircle,
  Thermometer,
  Shield,
  X,
  Check,
  Building,
  Sparkles
} from 'lucide-react';
import { PatientQueueItem } from '../types';

interface QuickTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: PatientQueueItem) => void;
}

export const QuickTriageModal: React.FC<QuickTriageModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState('Male');
  const [bloodType, setBloodType] = useState('O+');
  const [reason, setReason] = useState('Chest Discomfort & Palpitations');
  const [priority, setPriority] = useState<'Critical' | 'Urgent' | 'Routine'>('Urgent');
  const [triageLevel, setTriageLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [roomNumber, setRoomNumber] = useState('Exam 4B');
  const [bp, setBp] = useState('130/84');
  const [hr, setHr] = useState<number>(76);
  const [spO2, setSpO2] = useState<number>(98);
  const [temp, setTemp] = useState<number>(98.6);
  const [allergies, setAllergies] = useState('NKDA');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newPt: PatientQueueItem = {
      id: `pt-${Date.now()}`,
      initials: initials || 'PT',
      name: name.trim(),
      reason: reason.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Waiting',
      avatarBg:
        priority === 'Critical'
          ? 'bg-rose-100 text-rose-800'
          : priority === 'Urgent'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-cyan-100 text-cyan-800',
      age,
      gender,
      bloodType,
      dob: 'Jan 01, 1980',
      priority,
      triageLevel,
      roomNumber,
      vitalsQuick: {
        bp,
        hr: Number(hr),
        spO2: Number(spO2),
        temp: Number(temp),
      },
      allergies: allergies.split(',').map((a) => a.trim()),
    };

    onAddPatient(newPt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Clinical Triage & Admission Intake</h2>
              <p className="text-xs text-slate-500 font-mono">
                Rapid Bedside Intake • ESI Acuity Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Patient Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Robert Henderson"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white text-xs text-slate-900 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Age & Gender</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-bold"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Chief Complaint / Triage Reason</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Sudden Dyspnea on Exertion"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white text-xs text-slate-900 font-medium"
            />
          </div>

          {/* Triage Acuity Level Selection (ESI 1-5) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center justify-between">
              <span>ESI Acuity Level</span>
              <span className="text-[10px] text-cyan-700 font-mono font-bold">
                {triageLevel === 1
                  ? 'Level 1 (Resuscitation)'
                  : triageLevel === 2
                  ? 'Level 2 (Emergent / STAT)'
                  : triageLevel === 3
                  ? 'Level 3 (Urgent)'
                  : triageLevel === 4
                  ? 'Level 4 (Less Urgent)'
                  : 'Level 5 (Non-Urgent)'}
              </span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => {
                const isSelected = triageLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setTriageLevel(lvl as any);
                      if (lvl === 1 || lvl === 2) setPriority('Critical');
                      else if (lvl === 3) setPriority('Urgent');
                      else setPriority('Routine');
                    }}
                    className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer font-mono ${
                      isSelected
                        ? lvl <= 2
                          ? 'bg-rose-500 text-white border-rose-600 font-black shadow-xs'
                          : lvl === 3
                          ? 'bg-amber-500 text-white border-amber-600 font-black shadow-xs'
                          : 'bg-cyan-500 text-slate-950 border-cyan-600 font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">ESI {lvl}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bedside Vitals Grid */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              Bedside Triage Vitals
            </span>

            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">BP (mmHg)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">SpO2 (%)</label>
                <input
                  type="number"
                  value={spO2}
                  onChange={(e) => setSpO2(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Temp (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Assigned Room & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Assigned Exam Room / Bay</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. Exam Bay 3A"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Allergies (comma-separated)</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Sulfa"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Admit to Patient Queue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
