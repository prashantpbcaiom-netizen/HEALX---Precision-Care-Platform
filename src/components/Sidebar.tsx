import React from 'react';
import {
  LayoutGrid,
  FileText,
  Calendar,
  Video,
  Bot,
  HelpCircle,
  LogOut,
  Layers,
  Sparkles,
  Activity,
  Users,
  Clock,
  User,
  UserCheck,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { ActiveView, UserRole, UserProfile } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentUser: UserProfile;
  onOpenAIAssistant: () => void;
  onOpenArchitecture: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onOpenAIAssistant,
  onOpenArchitecture,
  onLogout,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const isDoctor = currentUser.role === 'doctor';

  // Specific Doctor Navigation items
  const doctorNavItems = [
    {
      id: 'doctor-dashboard' as ActiveView,
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'doctor-patients' as ActiveView,
      label: 'Patients',
      icon: Users,
    },
    {
      id: 'doctor-appointments' as ActiveView,
      label: 'Appointments',
      icon: Calendar,
    },
    {
      id: 'doctor-queue' as ActiveView,
      label: 'Patient Queue',
      icon: Clock,
    },
    {
      id: 'doctor-records' as ActiveView,
      label: 'Medical Records',
      icon: FileText,
    },
    {
      id: 'doctor-profile' as ActiveView,
      label: 'Profile',
      icon: UserCheck,
    },
  ];

  // Specific Patient Navigation items
  const patientNavItems = [
    {
      id: 'patient-dashboard' as ActiveView,
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'patient-appointments' as ActiveView,
      label: 'My Appointments',
      icon: Calendar,
    },
    {
      id: 'patient-queue' as ActiveView,
      label: 'Queue Status',
      icon: Clock,
    },
    {
      id: 'patient-records' as ActiveView,
      label: 'My Medical Records',
      icon: FileText,
    },
    {
      id: 'patient-profile' as ActiveView,
      label: 'Profile',
      icon: User,
    },
  ];

  const currentNavItems = isDoctor ? doctorNavItems : patientNavItems;

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <aside
      id="healx-sidebar"
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#091120] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } border-r border-slate-800/80 shadow-2xl`}
    >
      {/* Top Brand Area */}
      <div>
        <div className="p-6 pb-5 flex items-center gap-3.5 border-b border-slate-800/60">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-md p-1.5 shrink-0">
            <div className="w-full h-full rounded-lg bg-[#091120] flex items-center justify-center text-cyan-400 font-black text-lg tracking-tighter">
              <Activity className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-cyan-400">
                HEALX
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
              Precision Care
            </p>
          </div>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-4 pt-4">
          <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2.5 ${
            isDoctor ? 'bg-cyan-950/40 border border-cyan-800/40 text-cyan-300' : 'bg-indigo-950/40 border border-indigo-800/40 text-indigo-300'
          }`}>
            {isDoctor ? (
              <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <User className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <div className="min-w-0">
              <span className="font-bold block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">
                {isDoctor ? 'Doctor Workstation' : 'Patient Portal'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items for Current Role */}
        <nav className="mt-4 px-3 space-y-1.5" id="main-navigation">
          {currentNavItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 relative cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/50 border-l-4 border-cyan-400 font-bold shadow-inner'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-2.5 border-t border-slate-800/60">
        {/* Architecture Blueprint Button */}
        <button
          id="btn-architecture-blueprint"
          onClick={onOpenArchitecture}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-all cursor-pointer group"
          title="View HEALX Enterprise Architecture"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>HEALX Architecture</span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono border border-cyan-800/50">
            v2.4
          </span>
        </button>

        {/* AI Assistant Pill Button */}
        <button
          id="btn-open-ai-assistant"
          onClick={onOpenAIAssistant}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Bot className="w-4 h-4 text-slate-950" />
          <span>AI Health Assistant</span>
          <Sparkles className="w-3 h-3 text-cyan-950 animate-pulse" />
        </button>

        {/* Logout Link */}
        <button
          id="btn-logout-sidebar"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
