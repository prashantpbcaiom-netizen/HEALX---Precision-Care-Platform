import React, { useState } from 'react';
import {
  Calendar,
  MoreVertical,
  ArrowRight,
  Bot,
  Plus,
  FileText,
  Video,
  CheckCircle,
  Clock,
  Activity,
  Sparkles,
  PhoneCall,
  UserCheck,
  Search,
  Filter,
  ShieldAlert,
  Heart,
  Thermometer,
  Eye,
  CheckCircle2,
  Stethoscope,
  X,
  Users,
  Building2,
  FileDown,
  Pill,
  Droplet,
  Edit3,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import {
  PatientQueueItem,
  ConsultationNote,
  ActiveView,
  ClinicalAlert,
  ClinicalTaskItem,
  Appointment,
  ClinicalTimelineItem,
  Prescription,
  UserProfile
} from '../types';
import {
  clinicalAlertsData,
  clinicalTasksData,
  hourlyTriageFlowData
} from '../data/mockData';
import { ExecutiveMetricsBar } from './ExecutiveMetricsBar';
import { TriageFlowD3Chart } from './TriageFlowD3Chart';
import { QuickTriageModal } from './QuickTriageModal';
import { ClinicalHandoffModal } from './ClinicalHandoffModal';
import { ClinicalAlertsModal } from './ClinicalAlertsModal';
import { PatientVitalsQuickDrawer } from './PatientVitalsQuickDrawer';
import { ClinicalTasksPanel } from './ClinicalTasksPanel';

interface DoctorDashboardProps {
  queue: PatientQueueItem[];
  setQueue: React.Dispatch<React.SetStateAction<PatientQueueItem[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  timeline: ClinicalTimelineItem[];
  setTimeline: React.Dispatch<React.SetStateAction<ClinicalTimelineItem[]>>;
  prescriptions: Prescription[];
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
  consultationNotes: ConsultationNote[];
  setConsultationNotes?: React.Dispatch<React.SetStateAction<ConsultationNote[]>>;
  currentUser: UserProfile;
  onOpenAIDiagnostics: () => void;
  onOpenAIAssistant: () => void;
  onOpenExportModal: () => void;
  setActiveView: (view: ActiveView) => void;
  onSelectPatientForRecord?: (patientId: string) => void;
  activeTab?: 'dashboard' | 'patients' | 'appointments' | 'queue' | 'records' | 'profile';
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  queue,
  setQueue,
  appointments,
  setAppointments,
  timeline,
  setTimeline,
  prescriptions,
  setPrescriptions,
  consultationNotes,
  setConsultationNotes,
  currentUser,
  onOpenAIDiagnostics,
  onOpenAIAssistant,
  onOpenExportModal,
  setActiveView,
  onSelectPatientForRecord,
  activeTab = 'dashboard',
}) => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'patients' | 'appointments' | 'queue' | 'records' | 'profile'>(activeTab);
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Wed');
  const [activeMenuPatientId, setActiveMenuPatientId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<ConsultationNote | null>(null);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [selectedDrawerPatient, setSelectedDrawerPatient] = useState<PatientQueueItem | null>(null);

  // Patient Management State
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<PatientQueueItem | null>(null);
  const [showAddConsultationModal, setShowAddConsultationModal] = useState(false);
  const [newConsultationNoteText, setNewConsultationNoteText] = useState('');
  const [newConsultationPatientName, setNewConsultationPatientName] = useState('Alex Vance');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Queue Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Waiting' | 'Active' | 'Critical' | 'Completed'>('All');

  // Clinical Alerts & Tasks State
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(clinicalAlertsData);
  const [tasks, setTasks] = useState<ClinicalTaskItem[]>(clinicalTasksData);

  // Summary Metrics calculations
  const totalPatients = queue.length;
  const patientsWaiting = queue.filter((q) => q.status === 'Waiting').length;
  const todayAppointmentsCount = appointments.filter((a) => a.date.includes('Today') || a.date.includes('24')).length || appointments.length;
  const completedConsultations = queue.filter((q) => q.status === 'Completed').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (id: string, status: PatientQueueItem['status']) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setActiveMenuPatientId(null);
    showToast(`Patient status updated to ${status}`);
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast(`Appointment status updated to ${status}`);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  const handleAddTriagePatient = (newPatient: PatientQueueItem) => {
    setQueue((prev) => [newPatient, ...prev]);
    showToast(`Patient ${newPatient.name} admitted to queue`);
  };

  const handleAddConsultationNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConsultationNoteText.trim()) return;

    const newNote: ConsultationNote = {
      id: `note-${Date.now()}`,
      doctor: currentUser.name,
      department: currentUser.department || 'Cardiology & Internal Medicine',
      date: 'Today, Oct 24, 2023',
      snippet: `${newConsultationPatientName}: ${newConsultationNoteText}`,
      type: 'notes',
    };

    if (setConsultationNotes) {
      setConsultationNotes((prev) => [newNote, ...prev]);
    }

    const newTimelineEntry: ClinicalTimelineItem = {
      id: `tl-${Date.now()}`,
      dateTag: 'TODAY, CLINICAL NOTE',
      category: 'CARDIOLOGY',
      title: `Consultation Note: ${newConsultationPatientName}`,
      description: newConsultationNoteText,
      physician: currentUser.name,
      hasReport: true,
    };
    setTimeline((prev) => [newTimelineEntry, ...prev]);

    setShowAddConsultationModal(false);
    setNewConsultationNoteText('');
    showToast(`Consultation note recorded for ${newConsultationPatientName}`);
  };

  // Status counts for pills
  const counts = {
    All: queue.length,
    Waiting: queue.filter((q) => q.status === 'Waiting').length,
    Active: queue.filter((q) => q.status === 'Active' || q.status === 'In-Consultation').length,
    Critical: queue.filter((q) => q.priority === 'Critical' || (q.triageLevel && q.triageLevel <= 2)).length,
    Completed: queue.filter((q) => q.status === 'Completed').length,
  };

  // Filtered Queue computation
  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.roomNumber && item.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'All') return true;
    if (statusFilter === 'Waiting') return item.status === 'Waiting';
    if (statusFilter === 'Active') return item.status === 'Active' || item.status === 'In-Consultation';
    if (statusFilter === 'Critical') return item.priority === 'Critical' || (item.triageLevel && item.triageLevel <= 2);
    if (statusFilter === 'Completed') return item.status === 'Completed';
    return true;
  });

  const filteredPatients = queue.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.reason.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-cyan-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-xs font-bold text-slate-100">{toastMessage}</p>
        </div>
      )}

      {/* Top Greeting Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good Morning, {currentUser.name}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono">
              OCT 24 • CLINICAL COMMAND
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {currentUser.department || 'Precision Cardiology & Acute Internal Medicine'} • Clinical Command Center
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-admit-triage-top"
            onClick={() => setShowTriageModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Patient / Intake</span>
          </button>

          <button
            id="btn-quick-start-consult"
            onClick={() => setActiveView('consultations')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-slate-950" />
            <span>Telehealth Suite</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-cyan-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase font-mono">Total Patients</span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 font-mono">{totalPatients}</span>
            <p className="text-xs text-slate-500 mt-0.5">Active on clinical roster</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase font-mono">Patients Waiting</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600 font-mono">{patientsWaiting}</span>
            <p className="text-xs text-slate-500 mt-0.5">In triage & waiting lounge</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase font-mono">Today's Appointments</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 font-mono">{todayAppointmentsCount}</span>
            <p className="text-xs text-slate-500 mt-0.5">Scheduled consults today</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase font-mono">Completed Consultations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-600 font-mono">{completedConsultations}</span>
            <p className="text-xs text-slate-500 mt-0.5">Signed off & discharged</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Doctor Dashboard */}
      <div className="flex items-center border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          id="doc-tab-dashboard"
          onClick={() => setCurrentTab('dashboard')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'dashboard'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          id="doc-tab-patients"
          onClick={() => setCurrentTab('patients')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'patients'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Patients ({queue.length})</span>
        </button>

        <button
          id="doc-tab-appointments"
          onClick={() => setCurrentTab('appointments')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'appointments'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          id="doc-tab-queue"
          onClick={() => setCurrentTab('queue')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'queue'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Patient Queue ({queue.filter((q) => q.status !== 'Completed').length})</span>
        </button>

        <button
          id="doc-tab-records"
          onClick={() => setCurrentTab('records')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'records'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Medical Records (EMR)</span>
        </button>

        <button
          id="doc-tab-profile"
          onClick={() => setCurrentTab('profile')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
            currentTab === 'profile'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* ======================= TAB 1: DASHBOARD OVERVIEW ======================= */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          <ExecutiveMetricsBar
            queue={queue}
            alerts={alerts}
            onOpenAlertsModal={() => setShowAlertsModal(true)}
            onOpenHandoffModal={() => setShowHandoffModal(true)}
            onLaunchTelehealth={() => setActiveView('consultations')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col (7 cols): Active Patient Queue Table */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-slate-900">Active Patient Queue</h2>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700 font-mono">
                      {queue.filter((q) => q.status !== 'Completed').length} active
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTriageModal(true)}
                      className="text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Patient</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('queue')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Queue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Queue list rows */}
                <div className="divide-y divide-slate-100">
                  {queue.slice(0, 5).map((patient, idx) => (
                    <div
                      key={patient.id}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-1 rounded-md">
                          #PX-0{idx + 1}
                        </span>
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedDrawerPatient(patient)}
                        >
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-cyan-600 transition-colors">
                            {patient.name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {patient.reason} • <span className="font-mono text-slate-600">{patient.time}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                            patient.status === 'Active' || patient.status === 'In-Consultation'
                              ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                              : patient.status === 'Waiting'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {patient.status}
                        </span>

                        <button
                          onClick={() => {
                            if (patient.status === 'Waiting') {
                              handleUpdateStatus(patient.id, 'Active');
                            } else if (patient.status === 'Active' || patient.status === 'In-Consultation') {
                              handleUpdateStatus(patient.id, 'Completed');
                            } else {
                              handleUpdateStatus(patient.id, 'Waiting');
                            }
                          }}
                          className="text-[11px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          {patient.status === 'Waiting' ? 'Start' : patient.status === 'Active' ? 'Complete' : 'Re-open'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triage Flow D3 Visualizer */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Hospital Throughput & Census</h3>
                    <p className="text-xs text-slate-500">Hourly patient intake vs discharged census</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Avg Wait: 14m
                  </span>
                </div>
                <TriageFlowD3Chart data={hourlyTriageFlowData} />
              </div>
            </div>

            {/* Right Col (5 cols): Tasks & Alerts Panel */}
            <div className="lg:col-span-5 space-y-6">
              <ClinicalTasksPanel
                tasks={tasks}
                setTasks={setTasks}
              />

              {/* Clinical Consultation Notes Quick Review */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Recent Shared Notes</h3>
                  <button
                    onClick={() => setShowAddConsultationModal(true)}
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Note</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {consultationNotes.slice(0, 3).map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{note.doctor}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{note.date}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2">{note.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: PATIENTS MANAGEMENT ======================= */}
      {currentTab === 'patients' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Patient Management</h2>
              <p className="text-xs text-slate-500">
                View all registered patients, search medical records, admit new intakes, and update clinical histories.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTriageModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add New Patient</span>
              </button>

              <button
                onClick={() => setShowAddConsultationModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-slate-950" />
                <span>Add Consultation Notes</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Search patients by name, ID, diagnosis, or triage level..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
            />
          </div>

          {/* Patients Table Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Age / Gender</th>
                    <th className="py-3.5 px-4">Blood Group</th>
                    <th className="py-3.5 px-4">Chief Complaint / Condition</th>
                    <th className="py-3.5 px-4">Triage Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient, idx) => (
                    <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${patient.avatarBg || 'bg-cyan-100 text-cyan-800'}`}>
                            {patient.initials}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">{patient.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">ID: {patient.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {patient.age} yrs / {patient.gender}
                      </td>
                      <td className="py-3.5 px-4 font-bold font-mono text-rose-600">
                        {patient.bloodType}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {patient.reason}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                          patient.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : patient.priority === 'Urgent'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {patient.priority || 'Routine'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                          patient.status === 'Active' || patient.status === 'In-Consultation'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : patient.status === 'Waiting'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDrawerPatient(patient)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer text-xs"
                          >
                            Details & Vitals
                          </button>
                          <button
                            onClick={() => {
                              setNewConsultationPatientName(patient.name);
                              setShowAddConsultationModal(true);
                            }}
                            className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold rounded-lg border border-cyan-200 transition-colors cursor-pointer text-xs"
                          >
                            + Note
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 3: APPOINTMENTS MANAGEMENT ======================= */}
      {currentTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Appointment Management</h2>
              <p className="text-xs text-slate-500">
                Manage today's consultations, launch live telehealth sessions, and update appointment completion statuses.
              </p>
            </div>

            <button
              onClick={() => setActiveView('consultations')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Video className="w-4 h-4 text-slate-950" />
              <span>Start Active Video Consult</span>
            </button>
          </div>

          {/* Appointments List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-cyan-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono">
                      {apt.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={apt.status}
                        onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value as Appointment['status'])}
                        className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <img
                      src={apt.providerAvatar}
                      alt={apt.providerName}
                      className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{apt.patientName}</h3>
                      <p className="text-xs text-slate-500 font-medium">{apt.department} • Specialist: {apt.providerName}</p>
                      <p className="text-xs text-slate-800 font-bold mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{apt.date} • {apt.time}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-mono">ID: {apt.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveView('consultations')}
                      className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5 text-slate-950" />
                      <span>Start Consultation</span>
                    </button>

                    <button
                      onClick={() => handleUpdateAppointmentStatus(apt.id, 'Completed')}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Complete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= TAB 4: PATIENT QUEUE MANAGEMENT ======================= */}
      {currentTab === 'queue' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Clinical Patient Queue Management</h2>
              <p className="text-xs text-slate-500">
                Live triage waitlist with token identifiers, appointment timestamps, and consultation stage transitions.
              </p>
            </div>

            <button
              onClick={() => setShowTriageModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Admit to Queue</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(['All', 'Waiting', 'Active', 'Critical', 'Completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === filter
                        ? 'bg-white text-slate-900 font-bold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {filter} ({counts[filter]})
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono text-slate-500">
                Real-Time Clinic Triage Status
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Token #</th>
                    <th className="py-3.5 px-4">Patient Name</th>
                    <th className="py-3.5 px-4">Appointment Time</th>
                    <th className="py-3.5 px-4">Wait Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Manage Queue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQueue.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-800">
                        <span className="bg-cyan-50 px-2 py-1 rounded-md border border-cyan-200">
                          #PX-0{idx + 1}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">{item.name}</span>
                        <span className="text-[11px] text-slate-500">{item.reason}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {item.time}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {idx === 0 ? '0 min (Active)' : `${idx * 6 + 4} min`}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value as PatientQueueItem['status'])}
                          className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-xs text-slate-800"
                        >
                          <option value="Waiting">Waiting</option>
                          <option value="In-Consultation">In Consultation</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'In-Consultation')}
                            className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Call Next
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Completed')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs border border-emerald-200 transition-colors cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 5: MEDICAL RECORDS (EMR) ======================= */}
      {currentTab === 'records' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Electronic Medical Records (EMR)</h2>
              <p className="text-xs text-slate-500">
                Full clinical documentation, diagnostic findings, prescriptions, and cryptographic EMR exporting.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-cyan-400" />
                <span>Export Signed EMR</span>
              </button>

              <button
                onClick={onOpenAIDiagnostics}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>AI Diagnostics</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Clinical Timeline (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900">Clinical Timeline & Encounters</h3>
                <span className="text-xs text-slate-500 font-mono">{timeline.length} records</span>
              </div>

              <div className="space-y-3">
                {timeline.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{item.dateTag}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600">{item.description}</p>
                    <p className="text-[11px] text-slate-400 pt-1 font-mono">Signed by: {item.physician}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptions & Laboratory Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900">Active Prescriptions</h3>
                  <Pill className="w-4 h-4 text-indigo-600" />
                </div>

                <div className="space-y-3">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rx.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          {rx.dosage}
                        </span>
                      </div>
                      <p className="text-slate-600">{rx.instructions}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Refills: {rx.refillsRemaining} remaining</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 6: DOCTOR PROFILE ======================= */}
      {currentTab === 'profile' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Doctor Profile & Institutional Credentials</h2>
              <p className="text-xs text-slate-500">
                Staff clinician credentials, medical licenses, active department allocations, and clinic hours.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1594824813581-2292f72a441e?w=120&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{currentUser.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Staff ID: {currentUser.id}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 mt-1 inline-block">
                    Lead Attending Cardiologist
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-slate-900">{currentUser.email}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-slate-900">{currentUser.department}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Clinical Wing:</span>
                  <span className="font-semibold text-slate-900">Wing 4B • Suite 12</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Licensure:</span>
                  <span className="font-bold text-emerald-600 font-mono">MD-CARD-2026-ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Clinical Office Hours & Coverage</h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between">
                  <span className="font-bold text-slate-800">Monday – Wednesday</span>
                  <span className="font-mono text-slate-600">08:00 AM – 04:00 PM (Inpatient Rounds)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between">
                  <span className="font-bold text-slate-800">Thursday – Friday</span>
                  <span className="font-mono text-slate-600">09:00 AM – 05:00 PM (Telehealth / EMR)</span>
                </div>
                <div className="p-3 bg-cyan-50/70 rounded-2xl border border-cyan-200 flex justify-between text-cyan-900">
                  <span className="font-bold">On-Call Cardiac Interventions</span>
                  <span className="font-mono font-bold">Rotational 24/7 Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Consultation Note Modal */}
      {showAddConsultationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Add Clinical Consultation Note</h3>
                  <p className="text-xs text-slate-500 font-mono">Attending: {currentUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddConsultationModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddConsultationNoteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={newConsultationPatientName}
                  onChange={(e) => setNewConsultationPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Findings & Assessment</label>
                <textarea
                  value={newConsultationNoteText}
                  onChange={(e) => setNewConsultationNoteText(e.target.value)}
                  rows={4}
                  placeholder="Enter medical observations, treatment modifications, or follow-up instructions..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddConsultationModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Sign & Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Triage Modal */}
      <QuickTriageModal
        isOpen={showTriageModal}
        onClose={() => setShowTriageModal(false)}
        onAddPatient={handleAddTriagePatient}
      />

      {/* Clinical Handoff Modal */}
      <ClinicalHandoffModal
        isOpen={showHandoffModal}
        onClose={() => setShowHandoffModal(false)}
        queue={queue}
        alerts={alerts}
      />

      {/* Clinical Alerts Modal */}
      <ClinicalAlertsModal
        isOpen={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
        alerts={alerts}
        onResolveAlert={handleResolveAlert}
        setActiveView={setActiveView}
      />

      {/* Patient Bedside Vitals Quick Drawer */}
      <PatientVitalsQuickDrawer
        patient={selectedDrawerPatient}
        onClose={() => setSelectedDrawerPatient(null)}
        onLaunchTelemedicine={() => setActiveView('consultations')}
        onOpenEMRRecord={() => setCurrentTab('records')}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
