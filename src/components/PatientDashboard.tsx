import React, { useState } from 'react';
import {
  Heart,
  Droplet,
  Moon,
  Sparkles,
  Calendar,
  FileText,
  Video,
  MapPin,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Plus,
  AlertCircle,
  Pill,
  ChevronRight,
  Phone,
  Building2,
  Lock,
  Stethoscope,
  Share2,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  Appointment,
  VitalMetric,
  ActiveView,
  UserProfile,
  ClinicalTimelineItem,
  Prescription,
  ConsultationNote,
  Specialist
} from '../types';
import { specialistsData, thirtyDayVitalsData } from '../data/mockData';
import { VitalsTrendsD3Chart } from './VitalsTrendsD3Chart';

interface PatientDashboardProps {
  currentUser: UserProfile;
  vitals: VitalMetric[];
  appointments: Appointment[];
  timeline: ClinicalTimelineItem[];
  prescriptions: Prescription[];
  consultationNotes: ConsultationNote[];
  setActiveView: (view: ActiveView) => void;
  onOpenAIAssistant: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  activeTab?: 'overview' | 'appointments' | 'queue' | 'records' | 'profile';
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentUser,
  vitals,
  appointments,
  timeline,
  prescriptions,
  consultationNotes,
  setActiveView,
  onOpenAIAssistant,
  onAddAppointment,
  activeTab = 'overview',
  onUpdateProfile,
}) => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'appointments' | 'queue' | 'records' | 'profile'>(activeTab);
  const [selectedVitalModal, setSelectedVitalModal] = useState<VitalMetric | null>(null);
  
  // Appointment Booking Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(specialistsData[0]);
  const [bookingDate, setBookingDate] = useState('2026-08-22');
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [bookingType, setBookingType] = useState<'Telehealth' | 'In-Person'>('Telehealth');
  const [bookingReason, setBookingReason] = useState('Routine Cardiology Follow-up');
  const [bookingSuccessToast, setBookingSuccessToast] = useState(false);

  // Profile Edit State
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '+1 (555) 234-5678',
    dob: currentUser.dob || 'Jan 14, 1986',
    bloodType: currentUser.bloodType || 'A+',
    insurance: currentUser.insurance || 'BlueCross Platinum #BC-9921',
    emergencyContact: currentUser.emergencyContact || 'Elena Vance (Spouse) - +1 (555) 987-6543',
    allergies: currentUser.allergies?.join(', ') || 'Penicillin, Sulfa',
  });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Refill request toast state
  const [refillToast, setRefillToast] = useState<string | null>(null);

  // Filter ONLY Alex Vance's appointments (Strict Data Privacy)
  const patientAppointments = appointments.filter(
    (apt) => apt.patientName.toLowerCase() === currentUser.name.toLowerCase() || apt.patientName.includes('Alex')
  );

  const nextAppointment = patientAppointments[0] || {
    id: 'apt-next',
    date: 'Today, 10:30 AM',
    time: '10:30 AM - 11:00 AM',
    providerName: 'Dr. Sarah Jenkins',
    department: 'Cardiology & Neurology',
    providerAvatar: 'https://images.unsplash.com/photo-1594824813581-2292f72a441e?w=120&auto=format&fit=crop&q=80',
    type: 'Telehealth',
    status: 'Confirmed',
    patientName: currentUser.name,
  };

  // Queue Info for Alex Vance
  const patientQueueInfo = {
    tokenNumber: '#PX-04',
    patientsAhead: 3,
    estimatedWaitTime: '12 mins',
    status: 'In Queue • Priority Check-in Verified',
    assignedRoom: 'Exam Suite 3B',
    physician: 'Dr. Sarah Jenkins, MD',
    checkinTime: '09:45 AM',
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      date: bookingDate,
      time: bookingTime,
      providerName: selectedSpecialist.name,
      department: selectedSpecialist.department,
      providerAvatar: selectedSpecialist.image,
      type: bookingType,
      status: 'Confirmed',
      patientName: currentUser.name,
      location: bookingType === 'In-Person' ? 'HEALX Central Medical Wing' : 'HIPAA Telehealth Room',
    };
    onAddAppointment(newApt);
    setShowBookModal(false);
    setBookingSuccessToast(true);
    setTimeout(() => setBookingSuccessToast(false), 4000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        dob: profileForm.dob,
        bloodType: profileForm.bloodType,
        insurance: profileForm.insurance,
        emergencyContact: profileForm.emergencyContact,
        allergies: profileForm.allergies.split(',').map((s) => s.trim()).filter(Boolean),
      });
    }
    setShowProfileEdit(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleRequestRefill = (rxName: string) => {
    setRefillToast(`Refill request submitted to Dr. Sarah Jenkins for ${rxName}`);
    setTimeout(() => setRefillToast(null), 4000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-7 animate-in fade-in">
      
      {/* Toast Notifications */}
      {bookingSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-cyan-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-100">Appointment Confirmed!</p>
            <p className="text-slate-300">Added to your personal schedule.</p>
          </div>
        </div>
      )}

      {profileSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-100">Profile Updated</p>
            <p className="text-slate-300">Your demographics and clinical contacts were saved.</p>
          </div>
        </div>
      )}

      {refillToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Pill className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-100">Prescription Refill</p>
            <p className="text-slate-300">{refillToast}</p>
          </div>
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest font-mono bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
              PATIENT DASHBOARD
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {currentUser.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Personal Precision Health Record • Care Pathway Active
          </p>
        </div>

        {/* Action Buttons: Book Visit & AI Health Coach */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-patient-book-visit"
            onClick={() => setShowBookModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Book Appointment</span>
          </button>

          <button
            id="btn-patient-view-records"
            onClick={() => setCurrentTab('records')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>My Records</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Patient */}
      <div className="flex items-center border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          id="patient-tab-overview"
          onClick={() => setCurrentTab('overview')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'overview'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          id="patient-tab-appointments"
          onClick={() => setCurrentTab('appointments')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'appointments'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Appointments ({patientAppointments.length})</span>
        </button>

        <button
          id="patient-tab-queue"
          onClick={() => setCurrentTab('queue')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'queue'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Queue Status</span>
        </button>

        <button
          id="patient-tab-records"
          onClick={() => setCurrentTab('records')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'records'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Medical Records</span>
        </button>

        <button
          id="patient-tab-profile"
          onClick={() => setCurrentTab('profile')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'profile'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* ======================= TAB 1: OVERVIEW ======================= */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top 2 Highlight Cards: Next Appointment & Live Queue Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. Next Appointment Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-cyan-500" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                      NEXT APPOINTMENT
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {nextAppointment.status}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 pt-1">
                  <img
                    src={nextAppointment.providerAvatar}
                    alt={nextAppointment.providerName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {nextAppointment.providerName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {nextAppointment.department}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{nextAppointment.date} ({nextAppointment.time})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  {nextAppointment.type === 'Telehealth' ? (
                    <Video className="w-3.5 h-3.5 text-cyan-600" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <span>{nextAppointment.type} Consultation</span>
                </div>

                <button
                  id="btn-join-telehealth-patient"
                  onClick={() => setActiveView('consultations')}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-slate-950" />
                  <span>Join Session</span>
                </button>
              </div>
            </div>

            {/* 2. Current Queue Status Card */}
            <div className="bg-gradient-to-br from-[#091120] to-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden border border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono">
                      LIVE QUEUE TOKEN
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-mono">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-3xl sm:text-4xl font-black text-cyan-400 tracking-tight font-mono">
                      {patientQueueInfo.tokenNumber}
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Assigned to <span className="text-white font-semibold">{currentUser.name}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Estimated Wait</span>
                    <span className="text-xl font-extrabold text-white font-mono">
                      ~{patientQueueInfo.estimatedWaitTime}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Patients ahead of you:</span>
                    <span className="font-bold text-cyan-300 font-mono">{patientQueueInfo.patientsAhead} patients</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Attending Physician:</span>
                    <span className="font-bold text-white">{patientQueueInfo.physician}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Station: {patientQueueInfo.assignedRoom}
                </span>
                <button
                  id="btn-view-queue-details"
                  onClick={() => setCurrentTab('queue')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Queue Station</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Vitals Overview Cards (4 cards) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-slate-900">Your Health Metrics (Vitals)</h2>
              <span className="text-xs text-slate-500 font-mono">Synced with HEALX Smart Monitor</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Heart Rate */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-rose-500" />
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono">
                    Normal
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-black text-slate-900 font-mono">72</span>
                  <span className="text-xs text-slate-500 ml-1">bpm</span>
                  <p className="text-xs font-semibold text-slate-700 mt-1">Resting Heart Rate</p>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-teal-500" />
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-mono">
                    Optimal
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-black text-slate-900 font-mono">118/78</span>
                  <span className="text-xs text-slate-500 ml-1">mmHg</span>
                  <p className="text-xs font-semibold text-slate-700 mt-1">Blood Pressure</p>
                </div>
              </div>

              {/* Sleep */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Moon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono">
                    Good
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-black text-slate-900 font-mono">7h 45m</span>
                  <span className="text-xs text-slate-500 ml-1">avg</span>
                  <p className="text-xs font-semibold text-slate-700 mt-1">Sleep Architecture</p>
                </div>
              </div>

              {/* SpO2 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-cyan-500" />
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-mono">
                    98% Optimal
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-black text-slate-900 font-mono">98%</span>
                  <span className="text-xs text-slate-500 ml-1">SpO2</span>
                  <p className="text-xs font-semibold text-slate-700 mt-1">Blood Oxygenation</p>
                </div>
              </div>
            </div>
          </div>

          {/* D3 Longitudinal Vitals Chart */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">30-Day Physiological Biometrics</h3>
                <p className="text-xs text-slate-500">Historical trend mapping with clinical baseline thresholds</p>
              </div>
              <button
                onClick={onOpenAIAssistant}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-bold border border-cyan-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span>Ask AI About My Trends</span>
              </button>
            </div>
            <VitalsTrendsD3Chart
              data={thirtyDayVitalsData}
              onAskAIAboutTrends={onOpenAIAssistant}
            />
          </div>

        </div>
      )}

      {/* ======================= TAB 2: MY APPOINTMENTS ======================= */}
      {currentTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">My Scheduled Consultations</h2>
              <p className="text-xs text-slate-500">
                You can review your upcoming visits, past clinical encounters, or schedule a new specialist session.
              </p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Request / Book Appointment</span>
            </button>
          </div>

          {/* Appointments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between hover:border-cyan-300 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono">
                      {apt.type}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      apt.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : apt.status === 'Completed'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <img
                      src={apt.providerAvatar}
                      alt={apt.providerName}
                      className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{apt.providerName}</h3>
                      <p className="text-xs text-slate-500 font-medium">{apt.department}</p>
                      <p className="text-xs text-slate-700 font-bold mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{apt.date} • {apt.time}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.location || 'HEALX Medical Command Wing'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Patient: <strong className="text-slate-900">{apt.patientName}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {apt.type === 'Telehealth' ? (
                    <button
                      onClick={() => setActiveView('consultations')}
                      className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5 text-slate-950" />
                      <span>Open Video Suite</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600">In-Person Check-in Ready</span>
                  )}

                  <span className="text-xs text-slate-400 font-mono">ID: {apt.id}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Past Completed Consultations */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Previous Encounter History</h3>
            <div className="divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Electrocardiogram & Holter Review</h4>
                  <p className="text-[11px] text-slate-500">Dr. Sarah Jenkins • Sept 18, 2023 • Completed</p>
                </div>
                <button
                  onClick={() => setCurrentTab('records')}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Notes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Comprehensive Cardio-Metabolic Screening</h4>
                  <p className="text-[11px] text-slate-500">Dr. Marcus Chen • July 12, 2023 • Completed</p>
                </div>
                <button
                  onClick={() => setCurrentTab('records')}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Notes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 3: QUEUE STATUS ======================= */}
      {currentTab === 'queue' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#091120] via-slate-900 to-slate-950 text-white rounded-3xl p-7 sm:p-9 shadow-xl border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                  REAL-TIME CLINIC QUEUE
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Queue Token: <span className="text-cyan-400 font-mono">{patientQueueInfo.tokenNumber}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Live tracking system connected to HEALX Triage Station
                </p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center md:text-right">
                <span className="text-xs text-slate-400 font-mono block">Estimated Call Time</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  {patientQueueInfo.estimatedWaitTime}
                </span>
              </div>
            </div>

            {/* Live Progress Milestones */}
            <div className="py-7 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Check-In</span>
                </div>
                <p className="text-slate-300 text-[11px]">Completed at {patientQueueInfo.checkinTime}</p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. Triage & Vitals</span>
                </div>
                <p className="text-slate-300 text-[11px]">BP & SpO2 uploaded</p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs space-y-1 shadow-lg shadow-cyan-500/20">
                <div className="flex items-center gap-1.5 font-extrabold">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>3. Waiting for Call</span>
                </div>
                <p className="text-slate-900 text-[11px] font-semibold">{patientQueueInfo.patientsAhead} patients ahead</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs space-y-1 text-slate-400">
                <div className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Stethoscope className="w-4 h-4" />
                  <span>4. Consultation</span>
                </div>
                <p className="text-[11px]">{patientQueueInfo.assignedRoom}</p>
              </div>
            </div>

            {/* Clinic Bay Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 block">Attending Physician:</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{patientQueueInfo.physician}</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 block">Assigned Location:</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{patientQueueInfo.assignedRoom}</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 block">Current Status:</span>
                <span className="font-bold text-emerald-400 text-sm mt-0.5 block">Priority Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 4: MY MEDICAL RECORDS ======================= */}
      {currentTab === 'records' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">My Medical Records & History</h2>
              <p className="text-xs text-slate-500">
                Read-only patient copy of clinical encounters, diagnostic reports, and shared doctor consultation notes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                EMR ID: #EMR-PX-4902
              </span>
            </div>
          </div>

          {/* Active Prescriptions Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Pill className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Active Prescriptions & Refills</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Direct Pharmacy Link</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{rx.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {rx.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{rx.instructions}</p>
                    <p className="text-[11px] text-slate-400">
                      Prescribed by {rx.prescribedBy} • Expires {rx.expiration}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRequestRefill(rx.name)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
                  >
                    Request Refill
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor's Shared Consultation Notes */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Doctor Consultation Notes (Shared)</h3>
            </div>

            <div className="space-y-3">
              {consultationNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{note.doctor}</span>
                      <span className="text-xs text-slate-500 ml-2 font-mono">{note.department}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{note.snippet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Encounter Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Diagnostic Visit Timeline</h3>
            <div className="space-y-3">
              {timeline.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 font-mono">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{item.dateTag}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  <p className="text-[11px] text-slate-400 font-medium pt-1">
                    Attending Physician: {item.physician}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 5: PROFILE ======================= */}
      {currentTab === 'profile' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Patient Profile & Personal Info</h2>
              <p className="text-xs text-slate-500">
                Manage your demographic data, emergency contacts, insurance carrier, and clinical allergies.
              </p>
            </div>
            <button
              onClick={() => setShowProfileEdit(true)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Identity Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{currentUser.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Patient Record: {currentUser.id}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1 inline-block">
                    Active Patient
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-slate-900">{currentUser.email}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-slate-900">{currentUser.phone || '+1 (555) 234-5678'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Date of Birth:</span>
                  <span className="font-semibold text-slate-900">{currentUser.dob || 'Jan 14, 1986'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Blood Type:</span>
                  <span className="font-bold text-rose-600 font-mono">{currentUser.bloodType || 'A+'}</span>
                </div>
              </div>
            </div>

            {/* Insurance & Emergency Info */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Clinical & Insurance Details</h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block font-mono text-[11px]">Primary Insurance Carrier:</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {currentUser.insurance || 'BlueCross Platinum #BC-9921'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block font-mono text-[11px]">Emergency Contact:</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {currentUser.emergencyContact || 'Elena Vance (Spouse) - +1 (555) 987-6543'}
                  </span>
                </div>

                <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100">
                  <span className="text-rose-600 block font-mono text-[11px] font-bold">Documented Allergies:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {currentUser.allergies?.map((allergy) => (
                      <span
                        key={allergy}
                        className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-lg text-xs"
                      >
                        {allergy}
                      </span>
                    )) || <span className="text-slate-500">None reported</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= BOOK APPOINTMENT MODAL ======================= */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Request or Book Appointment</h3>
                  <p className="text-xs text-slate-500 font-mono">Patient: {currentUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowBookModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Specialist</label>
                <select
                  value={selectedSpecialist.id}
                  onChange={(e) => {
                    const spec = specialistsData.find((s) => s.id === e.target.value);
                    if (spec) setSelectedSpecialist(spec);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                >
                  {specialistsData.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.title} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Time</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:15 AM">11:15 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('Telehealth')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      bookingType === 'Telehealth'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Telehealth Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('In-Person')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      bookingType === 'In-Person'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>In-Person Clinic</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Concern / Reason</label>
                <input
                  type="text"
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="e.g. Heart palpitations, follow-up on medication"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= PROFILE EDIT MODAL ======================= */}
      {showProfileEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Edit Patient Profile</h3>
              <button
                onClick={() => setShowProfileEdit(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={profileForm.bloodType}
                    onChange={(e) => setProfileForm({ ...profileForm, bloodType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Insurance Carrier</label>
                <input
                  type="text"
                  value={profileForm.insurance}
                  onChange={(e) => setProfileForm({ ...profileForm, insurance: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={profileForm.emergencyContact}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Allergies (comma separated)</label>
                <input
                  type="text"
                  value={profileForm.allergies}
                  onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfileEdit(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
