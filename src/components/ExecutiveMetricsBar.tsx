import React from 'react';
import {
  Users,
  AlertTriangle,
  Clock,
  Video,
  Activity,
  Bed,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { PatientQueueItem, ClinicalAlert } from '../types';

interface ExecutiveMetricsBarProps {
  queue: PatientQueueItem[];
  alerts: ClinicalAlert[];
  onOpenAlertsModal: () => void;
  onOpenHandoffModal: () => void;
  onLaunchTelehealth: () => void;
}

export const ExecutiveMetricsBar: React.FC<ExecutiveMetricsBarProps> = ({
  queue,
  alerts,
  onOpenAlertsModal,
  onOpenHandoffModal,
  onLaunchTelehealth,
}) => {
  const activeCount = queue.filter((q) => q.status === 'Active' || q.status === 'In-Consultation').length;
  const waitingCount = queue.filter((q) => q.status === 'Waiting').length;
  const criticalCount = queue.filter((q) => q.priority === 'Critical').length;
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const criticalAlertsCount = unresolvedAlerts.filter((a) => a.severity === 'critical').length;

  // Occupancy rate calculation (e.g. 5 active out of 8 beds = 62.5% -> rounded to ~75%)
  const totalBeds = 8;
  const occupiedBeds = queue.filter((q) => q.status !== 'Completed').length;
  const occupancyPct = Math.min(100, Math.round((occupiedBeds / totalBeds) * 100));

  return (
    <div id="executive-clinical-metrics" className="space-y-4">
      {/* Top Shift Status & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:px-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-emerald-400 absolute inset-0 opacity-75 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">
                Cardiology & Precision Medicine Wing 4B
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                LIVE CENSUS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Attending: Dr. Sarah Jenkins, MD, FACC • Shift: 07:00 - 15:00 EST
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Shift Handoff Synthesis Button */}
          <button
            id="btn-ai-shift-handoff"
            onClick={onOpenHandoffModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-100 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Shift Handoff</span>
          </button>

          {/* Quick Telehealth Room launcher */}
          <button
            id="btn-quick-telehealth"
            onClick={onLaunchTelehealth}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Telehealth Suite</span>
          </button>
        </div>
      </div>

      {/* 4 Interactive Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Triage Census */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Unit Census
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-900 font-mono">
                {queue.filter((q) => q.status !== 'Completed').length}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1">in unit</span>
            </div>
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-50 text-rose-700 rounded-md border border-rose-200 flex items-center gap-1 animate-pulse font-mono">
                <ShieldAlert className="w-3 h-3" />
                {criticalCount} STAT
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-700">{activeCount} active</span>
            <span>•</span>
            <span>{waitingCount} in waiting pod</span>
          </div>
        </div>

        {/* Card 2: Critical Alerts & STAT Orders */}
        <div
          onClick={onOpenAlertsModal}
          className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all cursor-pointer ${
            criticalAlertsCount > 0
              ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Clinical Alerts
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                criticalAlertsCount > 0
                  ? 'bg-rose-100 text-rose-700 border-rose-200 animate-bounce'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div>
              <span
                className={`text-3xl font-black font-mono ${
                  criticalAlertsCount > 0 ? 'text-rose-700' : 'text-slate-900'
                }`}
              >
                {unresolvedAlerts.length}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1">pending review</span>
            </div>
            <span className="text-xs font-bold text-cyan-600 hover:underline">View All →</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            {criticalAlertsCount > 0 ? (
              <span className="text-rose-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {criticalAlertsCount} Critical (STAT ECG Bay 1)
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                No acute telemetry breaches
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Average Wait & Door-to-Doctor Time */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Door-to-Doctor
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-900 font-mono">8.4</span>
              <span className="text-xs text-slate-500 font-medium ml-1">mins avg</span>
            </div>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
              <TrendingDown className="w-3 h-3" />
              -2.1m vs benchmark
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Target: &lt; 15 mins</span>
            <span className="font-mono text-emerald-600 font-bold">96% on-time</span>
          </div>
        </div>

        {/* Card 4: Bed & Exam Room Capacity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Exam Bay Capacity
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-900 font-mono">{occupancyPct}%</span>
              <span className="text-xs text-slate-500 font-medium ml-1">occupied</span>
            </div>
            <span className="text-xs font-mono text-slate-600 font-semibold">
              {totalBeds - occupiedBeds} bays open
            </span>
          </div>
          {/* Progress bar */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  occupancyPct > 85
                    ? 'bg-rose-500'
                    : occupancyPct > 65
                    ? 'bg-amber-500'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
