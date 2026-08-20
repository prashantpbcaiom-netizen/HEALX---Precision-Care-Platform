/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActiveView,
  PatientQueueItem,
  Appointment,
  ClinicalTimelineItem,
  Prescription,
  VitalMetric,
  UserRole,
  UserProfile,
  ConsultationNote
} from './types';
import {
  initialQueue,
  specialistsData,
  upcomingAppointmentsData,
  vitalsData,
  clinicalTimelineData,
  prescriptionsData,
  consultationNotesData,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { TelemedicineConsultation } from './components/TelemedicineConsultation';
import { AIDiagnosticsModal } from './components/AIDiagnosticsModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { ExportEMRModal } from './components/ExportEMRModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { LoginPage } from './components/LoginPage';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';

// Standard User Profiles for Doctor and Patient
const doctorProfile: UserProfile = {
  id: 'DOC-8821',
  name: 'Dr. Sarah Jenkins',
  role: 'doctor',
  email: 'dr.sarah@healx.health',
  department: 'Cardiology & Acute Medicine',
  phone: '+1 (555) 345-6789',
  avatar: 'https://images.unsplash.com/photo-1594824813581-2292f72a441e?w=120&auto=format&fit=crop&q=80',
};

const patientProfile: UserProfile = {
  id: 'PX-4902',
  name: 'Alex Vance',
  role: 'patient',
  email: 'alex.vance@healx.health',
  department: 'Cardio-Metabolic Care',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  dob: 'Jan 14, 1986',
  bloodType: 'A+',
  allergies: ['Penicillin', 'Sulfa'],
  insurance: 'BlueCross Platinum #BC-9921',
  emergencyContact: 'Elena Vance (Spouse) - +1 (555) 987-6543',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(doctorProfile);
  const [activeView, setActiveView] = useState<ActiveView>('doctor-dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Core Data State Collections
  const [queue, setQueue] = useState<PatientQueueItem[]>(initialQueue);
  const [appointments, setAppointments] = useState<Appointment[]>(upcomingAppointmentsData);
  const [vitals] = useState<VitalMetric[]>(vitalsData);
  const [timeline, setTimeline] = useState<ClinicalTimelineItem[]>(clinicalTimelineData);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(prescriptionsData);
  const [consultationNotes, setConsultationNotes] = useState<ConsultationNote[]>(consultationNotesData);

  // Modals & Overlays State
  const [isAIDiagnosticsOpen, setIsAIDiagnosticsOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isExportEMROpen, setIsExportEMROpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Role-Based Login Handler
  const handleLogin = (role: UserRole, identifier?: string) => {
    if (role === 'patient') {
      setCurrentUser({
        ...patientProfile,
        email: identifier && identifier.includes('@') ? identifier : patientProfile.email,
      });
      setActiveView('patient-dashboard');
    } else {
      setCurrentUser({
        ...doctorProfile,
        email: identifier && identifier.includes('@') ? identifier : doctorProfile.email,
      });
      setActiveView('doctor-dashboard');
    }
    setIsAuthenticated(true);
  };

  // Logout Handlers
  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
  };

  // Add new appointment handler
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  // Patient profile update handler
  const handleUpdatePatientProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isDoctor = currentUser.role === 'doctor';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans antialiased selection:bg-cyan-200 selection:text-cyan-900">
      {/* Role-Specific Persistent Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onLogout={handleOpenLogoutModal}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Sticky Top Header */}
        <TopHeader
          activeView={activeView}
          setActiveView={setActiveView}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          currentUser={currentUser}
          onLogout={handleOpenLogoutModal}
        />

        {/* View Routing Based On Role and Active View */}
        <main className="flex-1 pb-16">
          {/* ================= DOCTOR VIEWS ================= */}
          {isDoctor && (
            <>
              {activeView === 'doctor-dashboard' && (
                <DoctorDashboard
                  queue={queue}
                  setQueue={setQueue}
                  appointments={appointments}
                  setAppointments={setAppointments}
                  timeline={timeline}
                  setTimeline={setTimeline}
                  prescriptions={prescriptions}
                  setPrescriptions={setPrescriptions}
                  consultationNotes={consultationNotes}
                  setConsultationNotes={setConsultationNotes}
                  currentUser={currentUser}
                  onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onOpenExportModal={() => setIsExportEMROpen(true)}
                  setActiveView={setActiveView}
                  activeTab="dashboard"
                />
              )}

              {activeView === 'doctor-patients' && (
                <DoctorDashboard
                  queue={queue}
                  setQueue={setQueue}
                  appointments={appointments}
                  setAppointments={setAppointments}
                  timeline={timeline}
                  setTimeline={setTimeline}
                  prescriptions={prescriptions}
                  setPrescriptions={setPrescriptions}
                  consultationNotes={consultationNotes}
                  setConsultationNotes={setConsultationNotes}
                  currentUser={currentUser}
                  onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onOpenExportModal={() => setIsExportEMROpen(true)}
                  setActiveView={setActiveView}
                  activeTab="patients"
                />
              )}

              {activeView === 'doctor-appointments' && (
                <DoctorDashboard
                  queue={queue}
                  setQueue={setQueue}
                  appointments={appointments}
                  setAppointments={setAppointments}
                  timeline={timeline}
                  setTimeline={setTimeline}
                  prescriptions={prescriptions}
                  setPrescriptions={setPrescriptions}
                  consultationNotes={consultationNotes}
                  setConsultationNotes={setConsultationNotes}
                  currentUser={currentUser}
                  onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onOpenExportModal={() => setIsExportEMROpen(true)}
                  setActiveView={setActiveView}
                  activeTab="appointments"
                />
              )}

              {activeView === 'doctor-queue' && (
                <DoctorDashboard
                  queue={queue}
                  setQueue={setQueue}
                  appointments={appointments}
                  setAppointments={setAppointments}
                  timeline={timeline}
                  setTimeline={setTimeline}
                  prescriptions={prescriptions}
                  setPrescriptions={setPrescriptions}
                  consultationNotes={consultationNotes}
                  setConsultationNotes={setConsultationNotes}
                  currentUser={currentUser}
                  onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onOpenExportModal={() => setIsExportEMROpen(true)}
                  setActiveView={setActiveView}
                  activeTab="queue"
                />
              )}

              {activeView === 'doctor-records' && (
                <DoctorDashboard
                  queue={queue}
                  setQueue={setQueue}
                  appointments={appointments}
                  setAppointments={setAppointments}
                  timeline={timeline}
                  setTimeline={setTimeline}
                  prescriptions={prescriptions}
                  setPrescriptions={setPrescriptions}
                  consultationNotes={consultationNotes}
                  setConsultationNotes={setConsultationNotes}
                  currentUser={currentUser}
                  onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onOpenExportModal={() => setIsExportEMROpen(true)}
                  setActiveView={setActiveView}
                  activeTab="records"
                />
              )}

              {activeView === 'doctor-profile' && (
                <DoctorDashboard
                  queue={queue}
                  setQueue={setQueue}
                  appointments={appointments}
                  setAppointments={setAppointments}
                  timeline={timeline}
                  setTimeline={setTimeline}
                  prescriptions={prescriptions}
                  setPrescriptions={setPrescriptions}
                  consultationNotes={consultationNotes}
                  setConsultationNotes={setConsultationNotes}
                  currentUser={currentUser}
                  onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onOpenExportModal={() => setIsExportEMROpen(true)}
                  setActiveView={setActiveView}
                  activeTab="profile"
                />
              )}
            </>
          )}

          {/* ================= PATIENT VIEWS ================= */}
          {!isDoctor && (
            <>
              {activeView === 'patient-dashboard' && (
                <PatientDashboard
                  currentUser={currentUser}
                  vitals={vitals}
                  appointments={appointments}
                  timeline={timeline}
                  prescriptions={prescriptions}
                  consultationNotes={consultationNotes}
                  setActiveView={setActiveView}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onAddAppointment={handleAddAppointment}
                  activeTab="overview"
                  onUpdateProfile={handleUpdatePatientProfile}
                />
              )}

              {activeView === 'patient-appointments' && (
                <PatientDashboard
                  currentUser={currentUser}
                  vitals={vitals}
                  appointments={appointments}
                  timeline={timeline}
                  prescriptions={prescriptions}
                  consultationNotes={consultationNotes}
                  setActiveView={setActiveView}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onAddAppointment={handleAddAppointment}
                  activeTab="appointments"
                  onUpdateProfile={handleUpdatePatientProfile}
                />
              )}

              {activeView === 'patient-queue' && (
                <PatientDashboard
                  currentUser={currentUser}
                  vitals={vitals}
                  appointments={appointments}
                  timeline={timeline}
                  prescriptions={prescriptions}
                  consultationNotes={consultationNotes}
                  setActiveView={setActiveView}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onAddAppointment={handleAddAppointment}
                  activeTab="queue"
                  onUpdateProfile={handleUpdatePatientProfile}
                />
              )}

              {activeView === 'patient-records' && (
                <PatientDashboard
                  currentUser={currentUser}
                  vitals={vitals}
                  appointments={appointments}
                  timeline={timeline}
                  prescriptions={prescriptions}
                  consultationNotes={consultationNotes}
                  setActiveView={setActiveView}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onAddAppointment={handleAddAppointment}
                  activeTab="records"
                  onUpdateProfile={handleUpdatePatientProfile}
                />
              )}

              {activeView === 'patient-profile' && (
                <PatientDashboard
                  currentUser={currentUser}
                  vitals={vitals}
                  appointments={appointments}
                  timeline={timeline}
                  prescriptions={prescriptions}
                  consultationNotes={consultationNotes}
                  setActiveView={setActiveView}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onAddAppointment={handleAddAppointment}
                  activeTab="profile"
                  onUpdateProfile={handleUpdatePatientProfile}
                />
              )}
            </>
          )}

          {/* Shared Consultations Telehealth View */}
          {activeView === 'consultations' && (
            <TelemedicineConsultation
              onEndCall={() => {
                setActiveView(isDoctor ? 'doctor-dashboard' : 'patient-dashboard');
              }}
              setActiveView={setActiveView}
            />
          )}
        </main>
      </div>

      {/* Global Clinical AI Diagnostics Modal */}
      <AIDiagnosticsModal
        isOpen={isAIDiagnosticsOpen}
        onClose={() => setIsAIDiagnosticsOpen(false)}
      />

      {/* Global AIAssistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        activeView={activeView}
      />

      {/* Global EMR Export Modal */}
      <ExportEMRModal
        isOpen={isExportEMROpen}
        onClose={() => setIsExportEMROpen(false)}
        timeline={timeline}
        prescriptions={prescriptions}
      />

      {/* Enterprise Architecture Blueprint Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        userName={currentUser.name}
        role={currentUser.role}
      />
    </div>
  );
}
