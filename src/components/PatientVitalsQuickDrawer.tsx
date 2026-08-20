import React from 'react';
import {
  Activity,
  Heart,
  Thermometer,
  ShieldAlert,
  FileText,
  Video,
  X,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Building
} from 'lucide-react';
import { PatientQueueItem, ActiveView } from '../types';

interface PatientVitalsQuickDrawerProps {
  patient: PatientQueueItem | null;
  onClose: () => void;
  onLaunchTelemedicine: (patientId: string) => void;
  onOpenEMRRecord: (patientId: string) => void;
  onUpdateStatus: (patientId: string, status: PatientQueueItem['status']) => void;
}

export const PatientVitalsQuickDrawer: React.FC<PatientVitalsQuickDrawerProps> = ({
  patient,
  onClose,
  onLaunchTelemedicine,
  onOpenEMRRecord,
  onUpdateStatus,
}) => {
  if (!patient) return null;

  const vitals = patient.vitalsQuick || {
    bp: '124/80',
    hr: 72,
    spO2: 99,
    temp: 98.6,
    painScale: 1,
  };

  const isCritical = patient.priority === 'Critical' || (patient.triageLevel && patient.triageLevel <= 2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center sm:justify-end p-4 sm:p-0">
      <div className="bg-white w-full sm:max-w-md h-auto sm:h-full sm:rounded-l-2xl shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-base ${
                  patient.avatarBg || 'bg-cyan-100 text-cyan-800'
                }`}
              >
                {patient.initials}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{patient.name}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {patient.age}y {patient.gender} • Blood: {patient.bloodType}
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

          {/* Clinical Triage Status Banner */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                Triage Acuity & Bay
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-black font-mono ${
                    isCritical
                      ? 'bg-rose-600 text-white animate-pulse'
                      : patient.priority === 'Urgent'
                      ? 'bg-amber-500 text-white'
                      : 'bg-cyan-500 text-slate-950'
                  }`}
                >
                  ESI Level {patient.triageLevel || 3}
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {patient.roomNumber || 'Exam 3A'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                Queue Status
              </span>
              <span className="text-xs font-bold text-cyan-700 font-mono mt-0.5 block">
                {patient.status} ({patient.time})
              </span>
            </div>
          </div>

          {/* Reason for Visit */}
          <div className="mt-4 space-y-1">
            <span className="text-xs font-bold text-slate-700">Chief Complaint</span>
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed font-medium">
              {patient.reason}
            </p>
          </div>

          {/* Bedside Vitals Grid */}
          <div className="mt-5 space-y-2">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              Live Bedside Biometrics
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Blood Pressure */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Blood Pressure
                </span>
                <div className="text-lg font-black font-mono text-slate-900 mt-0.5">
                  {vitals.bp}{' '}
                  <span className="text-[10px] font-normal text-slate-500 font-sans">mmHg</span>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Heart Rate
                </span>
                <div className="text-lg font-black font-mono text-rose-700 mt-0.5 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{vitals.hr}</span>
                  <span className="text-[10px] font-normal text-slate-500 font-sans">bpm</span>
                </div>
              </div>

              {/* SpO2 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  SpO2 Saturation
                </span>
                <div className="text-lg font-black font-mono text-cyan-700 mt-0.5">
                  {vitals.spO2}%
                </div>
              </div>

              {/* Temperature */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Temperature
                </span>
                <div className="text-lg font-black font-mono text-slate-900 mt-0.5 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-slate-500" />
                  <span>{vitals.temp || 98.6}°F</span>
                </div>
              </div>
            </div>
          </div>

          {/* Allergies & Insurance */}
          <div className="mt-5 space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Allergies</span>
              <span className="font-bold text-rose-700">
                {patient.allergies?.join(', ') || 'No Known Drug Allergies'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Insurance Coverage</span>
              <span className="font-semibold text-slate-800 font-mono">
                {patient.insurance || 'Verified Primary PPO'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onLaunchTelemedicine(patient.id);
                onClose();
              }}
              className="py-2.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>Telehealth Room</span>
            </button>

            <button
              onClick={() => {
                onOpenEMRRecord(patient.id);
                onClose();
              }}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Full EMR Chart</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onUpdateStatus(patient.id, 'Active')}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Mark Active
            </button>
            <button
              onClick={() => onUpdateStatus(patient.id, 'Completed')}
              className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Mark Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
