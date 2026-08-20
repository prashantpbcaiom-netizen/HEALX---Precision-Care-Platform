import React, { useState } from 'react';
import {
  Bell,
  Menu,
  Stethoscope,
  User,
  CheckCircle2,
  AlertTriangle,
  CalendarCheck,
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ActiveView, UserProfile, UserRole } from '../types';

interface TopHeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onToggleMobileMenu: () => void;
  currentUser: UserProfile;
  onLogout: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeView,
  setActiveView,
  onToggleMobileMenu,
  currentUser,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const isDoctor = currentUser.role === 'doctor';

  const doctorNotifications = [
    {
      id: 'n1',
      title: 'Marcus Reynolds Lab Ready',
      desc: 'Comprehensive Lipid & Cardiac marker panel uploaded.',
      time: '10m ago',
    },
    {
      id: 'n2',
      title: 'Upcoming Telehealth at 10:30 AM',
      desc: 'Video session with Alex Vance (Cardiology follow-up).',
      time: '25m ago',
    },
  ];

  const patientNotifications = [
    {
      id: 'pn1',
      title: 'Prescription Refill Approved',
      desc: 'Atorvastatin 20mg sent to Central Care Pharmacy.',
      time: '15m ago',
    },
    {
      id: 'pn2',
      title: 'Appointment Reminder',
      desc: 'Telehealth consultation with Dr. Sarah Jenkins at 10:30 AM.',
      time: '1h ago',
    },
  ];

  const notifications = isDoctor ? doctorNotifications : patientNotifications;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger & Role Badge */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-sidebar-toggle"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Current Role Title Display */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
            isDoctor ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}>
            {isDoctor ? <Stethoscope className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
              {isDoctor ? 'Doctor Clinical Workstation' : 'Patient Portal Dashboard'}
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Logged in as <strong className="text-slate-800">{currentUser.name}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Systems Online status, Notifications, Profile Avatar & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Systems Online Badge */}
        <div
          id="system-status-indicator"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] tracking-tight text-slate-800 font-semibold">
            Systems Online
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-notifications-dropdown"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div
              id="notifications-flyout-panel"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900">Notifications</h3>
                <span className="text-[11px] font-mono text-cyan-600 font-semibold">
                  {notifications.length} updates
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile avatar chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-2xs"
          />
          <div className="hidden lg:block text-left">
            <span className="text-xs font-extrabold text-slate-900 block leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          id="btn-logout-header"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
