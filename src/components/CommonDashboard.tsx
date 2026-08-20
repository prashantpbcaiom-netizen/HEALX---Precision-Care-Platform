import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  User,
  Users,
  FileText,
  Bell,
  Stethoscope,
  Plus,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Search,
  ChevronRight,
  Pill,
  ExternalLink,
  Sparkles,
  Phone,
  MapPin,
  Heart,
  Thermometer,
  ShieldAlert,
  LogOut,
  Edit3,
  UserCheck,
  Check,
  Eye,
  RefreshCw
} from 'lucide-react';
import {
  PatientQueueItem,
  Appointment,
  ClinicalTimelineItem,
  Prescription,
  ConsultationNote,
  ClinicalAlert,
  ActiveView,
  UserProfile,
  UserRole
} from '../types';
import { QuickTriageModal } from './QuickTriageModal';
import { ProfileUpdateModal } from './ProfileUpdateModal';
import { PatientQueueStatusModal } from './PatientQueueStatusModal';
import { AppointmentDetailModal } from './AppointmentDetailModal';
import { PatientVitalsQuickDrawer } from './PatientVitalsQuickDrawer';

interface CommonDashboardProps {
  user: UserProfile;
  queue: PatientQueueItem[];
  setQueue: React.Dispatch<React.SetStateAction<PatientQueueItem[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  timeline: ClinicalTimelineItem[];
  prescriptions: Prescription[];
  consultationNotes: ConsultationNote[];
  setActiveView: (view: ActiveView) => void;
  onLogout: () => void;
  onOpenAIAssistant: () => void;
  onOpenAIDiagnostics?: () => void;
  onSelectPatientForRecord?: (patientId: string) => void;
}

export const CommonDashboard: React.FC<CommonDashboardProps> = ({
  user,
  queue,
  setQueue,
  appointments,
  setAppointments,
  timeline,
  prescriptions,
  consultationNotes,
  setActiveView,
  onLogout,
  onOpenAIAssistant,
  onOpenAIDiagnostics,
  onSelectPatientForRecord,
}) => {
  const isDoctor = user.role === 'doctor';
  
  // State for modals
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQueueStatusModal, setShowQueueStatusModal] = useState(false);
  const [showAppointmentDetailModal, setShowAppointmentDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(appointments[0]);
  const [selectedDrawerPatient, setSelectedDrawerPatient] = useState<PatientQueueItem | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(user);

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick Action: Add Patient (Doctor)
  const handleAddTriagePatient = (newPt: PatientQueueItem) => {
    setQueue((prev) => [newPt, ...prev]);
    showToast(`Patient ${newPt.name} successfully admitted to the triage queue.`);
  };

  // Quick Action: Start Consultation (Doctor)
  const handleStartConsultation = (patientId?: string) => {
    if (patientId) {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === patientId ? { ...item, status: 'In-Consultation' as const } : item
        )
      );
      const targetPt = queue.find((p) => p.id === patientId);
      showToast(`Started consultation with ${targetPt?.name || 'patient'}.`);
    } else {
      // Find first waiting patient or start generic
      const firstWaiting = queue.find((p) => p.status === 'Waiting');
      if (firstWaiting) {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === firstWaiting.id ? { ...item, status: 'In-Consultation' as const } : item
          )
        );
        showToast(`Consultation started for ${firstWaiting.name}.`);
      }
    }
    setActiveView('consultations');
  };

  // Quick Action: Complete Consultation (Doctor)
  const handleCompleteConsultation = (patientId?: string) => {
    const activePatient = patientId
      ? queue.find((p) => p.id === patientId)
      : queue.find((p) => p.status === 'In-Consultation' || p.status === 'Active');

    if (activePatient) {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === activePatient.id ? { ...item, status: 'Completed' as const } : item
        )
      );
      showToast(`Consultation for ${activePatient.name} marked as Completed.`);
    } else {
      // Complete first non-completed
      const target = queue.find((p) => p.status !== 'Completed');
      if (target) {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === target.id ? { ...item, status: 'Completed' as const } : item
          )
        );
        showToast(`Consultation for ${target.name} marked as Completed.`);
      } else {
        showToast('All patient consultations are currently completed.');
      }
    }
  };

  // Patient live queue stats
  const patientQueueIndex = queue.findIndex(
    (q) => q.name.toLowerCase().includes('alex') || q.name.toLowerCase().includes(user.name.toLowerCase())
  );
  const patientToken = patientQueueIndex >= 0 ? `#PX-${String(patientQueueIndex + 1).padStart(2, '0')}` : '#PX-04';
  const patientPosition = patientQueueIndex >= 0 ? patientQueueIndex + 1 : 2;
  const estimatedWaitTime = patientPosition * 6;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-cyan-500/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="w-7 h-7 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome Banner & User Greeting */}
      <div
        id="dashboard-welcome-banner"
        className="bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-extrabold uppercase tracking-wider font-mono flex items-center gap-1.5">
              {isDoctor ? (
                <>
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Clinical Workstation • Doctor</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>Patient Health Portal</span>
                </>
              )}
            </span>

            <span className="text-xs text-slate-400 font-mono">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Welcome to HEALX, <span className="text-cyan-400">{currentUser.name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {isDoctor
              ? `You have ${queue.filter((q) => q.status === 'Waiting').length} patient(s) waiting in your triage queue and ${appointments.length} scheduled consultations today.`
              : `Your personalized clinical dashboard is connected. Your next appointment is with Dr. Sarah Jenkins with confirmed status.`}
          </p>
        </div>

        {/* User Identity & Logout Button */}
        <div className="relative z-10 flex items-center gap-3 self-start md:self-center bg-white/5 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shrink-0">
          <img
            src={
              currentUser.avatar ||
              (isDoctor
                ? 'https://images.unsplash.com/photo-1594824813581-2292f72a441e?w=120&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80')
            }
            alt={currentUser.name}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-cyan-400/50 shadow-md"
          />
          <div className="text-left pr-2">
            <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-cyan-300 font-mono mt-0.5">
              {isDoctor ? 'Cardiology & Neurology' : 'Patient ID #PX-4902'}
            </p>
          </div>

          <button
            id="btn-banner-logout"
            onClick={onLogout}
            className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Sign Out to Login Page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Role-Based Quick Actions Bar */}
      <div id="section-quick-actions" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Quick Actions</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isDoctor
                ? 'Physician tools to manage triage admission, telemedicine rooms, and patient records.'
                : 'Patient self-service options for appointments, queue tokens, medical charts, and profile.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Role: <span className="text-cyan-700 capitalize">{user.role}</span>
          </span>
        </div>

        {/* Role-specific Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {isDoctor ? (
            /* DOCTOR QUICK ACTIONS:
               1. Add Patient
               2. Start Consultation
               3. Complete Consultation
               4. View Patient Records
            */
            <>
              <button
                id="btn-action-add-patient"
                onClick={() => setShowTriageModal(true)}
                className="p-4 bg-white hover:bg-cyan-50/60 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-cyan-800">
                    Add Patient
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Admit to clinical queue
                  </p>
                </div>
              </button>

              <button
                id="btn-action-start-consultation"
                onClick={() => handleStartConsultation()}
                className="p-4 bg-white hover:bg-cyan-50/60 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-cyan-800">
                    Start Consultation
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Launch video/in-person
                  </p>
                </div>
              </button>

              <button
                id="btn-action-complete-consultation"
                onClick={() => handleCompleteConsultation()}
                className="p-4 bg-white hover:bg-cyan-50/60 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800">
                    Complete Consultation
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Sign off active consult
                  </p>
                </div>
              </button>

              <button
                id="btn-action-view-patient-records"
                onClick={() => setActiveView('records')}
                className="p-4 bg-white hover:bg-cyan-50/60 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-800">
                    View Patient Records
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Access EMR & lab reports
                  </p>
                </div>
              </button>
            </>
          ) : (
            /* PATIENT QUICK ACTIONS:
               1. View My Appointment
               2. Check Queue Status
               3. View My Medical Records
               4. Update Profile
            */
            <>
              <button
                id="btn-action-view-my-appointment"
                onClick={() => {
                  setSelectedAppointment(appointments[0]);
                  setShowAppointmentDetailModal(true);
                }}
                className="p-4 bg-white hover:bg-cyan-50/60 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-cyan-800">
                    View My Appointment
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Upcoming visit schedule
                  </p>
                </div>
              </button>

              <button
                id="btn-action-check-queue-status"
                onClick={() => setShowQueueStatusModal(true)}
                className="p-4 bg-white hover:bg-cyan-50/60 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-teal-800">
                    Check Queue Status
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Live token {patientToken} • ~{estimatedWaitTime} min
                  </p>
                </div>
              </button>

              <button
                id="btn-action-view-my-records"
                onClick={() => setActiveView('records')}
                className="p-4 bg-white hover:bg-cyan-50/60 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-800">
                    View My Medical Records
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Labs, reports & medications
                  </p>
                </div>
              </button>

              <button
                id="btn-action-update-profile"
                onClick={() => setShowProfileModal(true)}
                className="p-4 bg-white hover:bg-cyan-50/60 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Edit3 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-amber-800">
                    Update Profile
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Contact, insurance & allergies
                  </p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Appointments & Patient Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Today's Appointments & Appointment Status */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Today's Appointments Card */}
          <div
            id="section-todays-appointments"
            className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Today's Appointments</h2>
                  <p className="text-xs text-slate-500">
                    {isDoctor
                      ? 'Scheduled clinical patient appointments'
                      : 'Your upcoming healthcare appointments'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('appointments')}
                className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
              >
                <span>{isDoctor ? 'Full Schedule' : 'Book New'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-3">
              {appointments.map((apt) => {
                const isConfirmed = apt.status === 'Confirmed';
                const isScheduled = apt.status === 'Scheduled';
                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-cyan-50/40 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={apt.providerAvatar}
                        alt={apt.providerName}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">
                            {isDoctor ? apt.patientName : apt.providerName}
                          </h4>
                          {/* Appointment Status badge */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                              isConfirmed
                                ? 'bg-emerald-100 text-emerald-800'
                                : isScheduled
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {apt.department} •{' '}
                          <span className="font-medium text-slate-700">{apt.type}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-600" />
                          <span>{apt.date} • {apt.time}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons on appointment item */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setShowAppointmentDetailModal(true);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => setActiveView('consultations')}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{apt.type === 'Telehealth' ? 'Join Room' : 'Start'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Medical Records Section on Main Dashboard */}
          <div
            id="section-medical-records"
            className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Medical Records & Clinical History</h2>
                  <p className="text-xs text-slate-500">
                    {isDoctor ? 'Recent patient reports and diagnostic reviews' : 'Your clinical timeline & lab reports'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('records')}
                className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full EMR</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Records list items */}
            <div className="space-y-3">
              {timeline.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.dateTag}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">Physician: {item.physician}</p>
                  </div>

                  <button
                    onClick={() => setActiveView('records')}
                    className="self-start sm:self-center px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                  >
                    Open Report
                  </button>
                </div>
              ))}
            </div>

            {/* Prescriptions Quick Strip */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Active Prescriptions</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {prescriptions.length} Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {prescriptions.slice(0, 2).map((rx) => (
                  <div
                    key={rx.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{rx.name}</p>
                      <p className="text-[10px] text-slate-500">{rx.instructions}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      {rx.refillsRemaining} Refills
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Patient Queue & Live Notifications */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Patient Queue Section */}
          <div
            id="section-patient-queue"
            className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Patient Queue</h2>
                  <p className="text-xs text-slate-500">
                    {isDoctor ? 'Live triage intake & room status' : 'Real-time clinic waiting queue'}
                  </p>
                </div>
              </div>

              {isDoctor && (
                <button
                  onClick={() => setShowTriageModal(true)}
                  className="px-2.5 py-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Admit</span>
                </button>
              )}
            </div>

            {/* Doctor View: Queue List with Actions */}
            {isDoctor ? (
              <div className="space-y-3">
                {queue.slice(0, 4).map((pt) => {
                  const isUrgent = pt.priority === 'Critical' || pt.priority === 'Urgent';
                  return (
                    <div
                      key={pt.id}
                      className="p-3.5 bg-slate-50 hover:bg-cyan-50/30 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs font-mono shrink-0 ${
                            pt.avatarBg || 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {pt.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-slate-900 truncate">{pt.name}</h4>
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono ${
                                isUrgent ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              ESI {pt.triageLevel || 3}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{pt.reason}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                            <span>{pt.roomNumber || 'Waiting'}</span>
                            <span>•</span>
                            <span>{pt.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Action */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                            pt.status === 'Active' || pt.status === 'In-Consultation'
                              ? 'bg-emerald-100 text-emerald-800'
                              : pt.status === 'Waiting'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {pt.status}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedDrawerPatient(pt)}
                            className="p-1 rounded-md text-slate-500 hover:text-cyan-700 hover:bg-slate-200/60 cursor-pointer"
                            title="Bedside Vitals"
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                          {pt.status !== 'Completed' && (
                            <button
                              onClick={() => handleCompleteConsultation(pt.id)}
                              className="p-1 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-slate-200/60 cursor-pointer"
                              title="Mark Completed"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Patient View: Live Queue Tracker Card */
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl border border-slate-700 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Live Queue Station
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200">
                      Exam Bay 3
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-mono">Your Token</p>
                      <p className="text-2xl font-black text-white font-mono">{patientToken}</p>
                      <p className="text-xs text-cyan-300 font-medium">{currentUser.name}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-mono">Est. Wait Time</p>
                      <p className="text-2xl font-black text-cyan-400 font-mono">~{estimatedWaitTime} min</p>
                      <p className="text-xs text-slate-300">Position #{patientPosition}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-300">Currently in Room 304:</span>
                    <span className="font-mono font-bold text-emerald-400">Token #PX-01</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowQueueStatusModal(true)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Check Detailed Queue Timeline</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications & System Alerts Section */}
          <div
            id="section-notifications"
            className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Notifications</h2>
                  <p className="text-xs text-slate-500">Live clinical notices and reminders</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold font-mono">
                3 New
              </span>
            </div>

            {/* Notification items */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Telemedicine Encryption Verified</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    HIPAA 256-bit secure video link active for today's scheduled rounds.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">10 mins ago</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Lab Diagnostic Panel Synchronized</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Comprehensive metabolic panel reports are ready for clinical review.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">25 mins ago</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Appointment Reminder</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Dr. Sarah Jenkins consultation begins at 10:00 AM.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Triage Admission Modal (for Add Patient) */}
      <QuickTriageModal
        isOpen={showTriageModal}
        onClose={() => setShowTriageModal(false)}
        onAddPatient={handleAddTriagePatient}
      />

      {/* Patient Profile Update Modal (for Update Profile) */}
      <ProfileUpdateModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onSave={(updated) => {
          setCurrentUser(updated);
          showToast('Profile updated successfully.');
        }}
      />

      {/* Patient Live Queue Status Modal (for Check Queue Status) */}
      <PatientQueueStatusModal
        isOpen={showQueueStatusModal}
        onClose={() => setShowQueueStatusModal(false)}
        queue={queue}
        patientName={currentUser.name}
        onJoinTelehealth={() => setActiveView('consultations')}
      />

      {/* Appointment Detail Modal (for View My Appointment) */}
      <AppointmentDetailModal
        isOpen={showAppointmentDetailModal}
        onClose={() => setShowAppointmentDetailModal(false)}
        appointment={selectedAppointment}
        onJoinTelehealth={() => setActiveView('consultations')}
      />

      {/* Bedside Vitals Quick Drawer */}
      <PatientVitalsQuickDrawer
        patient={selectedDrawerPatient}
        onClose={() => setSelectedDrawerPatient(null)}
        onLaunchTelemedicine={(patientId) => {
          handleStartConsultation(patientId);
        }}
        onOpenEMRRecord={(patientId) => {
          if (onSelectPatientForRecord) onSelectPatientForRecord(patientId);
          setActiveView('records');
        }}
        onUpdateStatus={(patientId, newStatus) => {
          setQueue((prev) =>
            prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
          );
          showToast(`Updated status for patient.`);
        }}
      />
    </div>
  );
};
