import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  CheckCircle2,
  FileText,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment;
  onJoinTelehealth?: () => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onJoinTelehealth,
}) => {
  if (!isOpen) return null;

  const apt = appointment || {
    id: 'apt-1',
    date: 'Today, 10:00 AM',
    time: '10:00 AM - 10:30 AM',
    providerName: 'Dr. Sarah Jenkins',
    department: 'Cardiology & Neurology',
    providerAvatar: 'https://images.unsplash.com/photo-1594824813581-2292f72a441e?w=100&auto=format&fit=crop&q=80',
    type: 'Telehealth' as const,
    status: 'Confirmed' as const,
    location: 'Central Clinic • Cardio Suite B',
    patientName: 'Alex Vance',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Appointment Confirmation & Details</h2>
              <p className="text-xs text-slate-500 font-mono">
                Booking Reference #{apt.id.toUpperCase()}
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

        {/* Doctor Header Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center gap-4">
          <img
            src={apt.providerAvatar}
            alt={apt.providerName}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/30"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">{apt.providerName}</h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                {apt.status}
              </span>
            </div>
            <p className="text-xs text-cyan-700 font-semibold">{apt.department}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">HEALX Central Medical Center</p>
          </div>
        </div>

        {/* Appointment Key Parameters */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] uppercase font-bold mb-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
              <span>Date & Window</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">{apt.date}</p>
            <p className="text-slate-500 font-mono text-[11px] mt-0.5">{apt.time}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] uppercase font-bold mb-1">
              {apt.type === 'Telehealth' ? (
                <Video className="w-3.5 h-3.5 text-cyan-600" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-cyan-600" />
              )}
              <span>Consultation Mode</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">{apt.type}</p>
            <p className="text-slate-500 font-mono text-[11px] mt-0.5">
              {apt.location || 'Encrypted HD Video Room'}
            </p>
          </div>
        </div>

        {/* Pre-Consultation Checklist */}
        <div className="p-4 bg-cyan-50/70 border border-cyan-200/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-900 font-mono uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-cyan-700" />
            <span>Pre-Consultation Checklist</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>Have your previous Holter / ECG reports ready for physician review.</li>
            <li>Take your resting blood pressure reading 15 minutes prior to consult.</li>
            <li>Ensure a stable internet connection and quiet lighting for video feed.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
          {onJoinTelehealth && (
            <button
              onClick={() => {
                onClose();
                onJoinTelehealth();
              }}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>Launch Telemedicine Room</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
