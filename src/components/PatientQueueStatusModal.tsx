import React from 'react';
import {
  Users,
  Clock,
  MapPin,
  Stethoscope,
  Activity,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PatientQueueItem } from '../types';

interface PatientQueueStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: PatientQueueItem[];
  patientName: string;
  onJoinTelehealth?: () => void;
}

export const PatientQueueStatusModal: React.FC<PatientQueueStatusModalProps> = ({
  isOpen,
  onClose,
  queue,
  patientName,
  onJoinTelehealth,
}) => {
  if (!isOpen) return null;

  // Find if patient is in queue
  const myQueueIndex = queue.findIndex(
    (q) => q.name.toLowerCase().includes('alex') || q.name.toLowerCase().includes(patientName.toLowerCase())
  );

  const tokenNumber = myQueueIndex >= 0 ? `#PX-${String(myQueueIndex + 1).padStart(2, '0')}` : '#PX-04';
  const queuePosition = myQueueIndex >= 0 ? myQueueIndex + 1 : 2;
  const estimatedWait = queuePosition * 6; // 6 mins per patient
  const activeServingToken = '#PX-01';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Clinical Queue Status</h2>
              <p className="text-xs text-slate-500 font-mono">
                Real-Time Triage Telemetry • Central Clinic
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

        {/* Live Token Status Card */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl border border-slate-700/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Activity className="w-28 h-28" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-cyan-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Consultation Queue
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-200">
              Station: Bay 3
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-700/60">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">Your Queue Token</p>
              <p className="text-3xl font-black text-white font-mono tracking-tight">{tokenNumber}</p>
              <p className="text-xs text-cyan-300 font-semibold mt-0.5">{patientName}</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Estimated Wait</p>
              <p className="text-3xl font-black text-cyan-400 font-mono">~{estimatedWait} min</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5">{queuePosition} patient(s) ahead</p>
            </div>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Current Token Serving</p>
                <p className="text-[11px] text-slate-500 font-mono">{activeServingToken} • In Consultation</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
              ACTIVE
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Attending Physician</p>
                <p className="text-[11px] text-slate-500">Dr. Sarah Jenkins (Cardiology & Neurology)</p>
              </div>
            </div>
            <span className="text-slate-600 font-mono font-semibold text-[11px]">Room 304</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Queue Position</p>
                <p className="text-[11px] text-slate-500">Next In Line for Intake Examination</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-100 text-cyan-800 font-bold font-mono text-xs">
              Position #{queuePosition}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            Dismiss
          </button>
          {onJoinTelehealth && (
            <button
              onClick={() => {
                onClose();
                onJoinTelehealth();
              }}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Join Telemedicine Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
