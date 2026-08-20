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
  TrendingDown,
  Activity,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Appointment, VitalMetric, ActiveView } from '../types';
import { thirtyDayVitalsData } from '../data/mockData';
import { VitalsTrendsD3Chart } from './VitalsTrendsD3Chart';

interface PatientPortalProps {
  vitals: VitalMetric[];
  appointments: Appointment[];
  setActiveView: (view: ActiveView) => void;
  onOpenAIAssistant: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  vitals,
  appointments,
  setActiveView,
  onOpenAIAssistant,
}) => {
  const [selectedVitalModal, setSelectedVitalModal] = useState<VitalMetric | null>(null);

  const handleScrollToChart = () => {
    const el = document.getElementById('healx-d3-vitals-trends');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAskAIAboutTrends = (metricTitle: string, avgVal: string, changeVal: string) => {
    onOpenAIAssistant();
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-7">
      {/* Top Header with PATIENT PORTAL badge & action buttons (matching screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest font-mono">
            PATIENT PORTAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Good morning, Alex.
          </h1>
        </div>

        {/* Action Buttons: Book Visit & Records */}
        <div className="flex items-center gap-3">
          <button
            id="btn-patient-book-visit"
            onClick={() => setActiveView('appointments')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-600" />
            <span>Book Visit</span>
          </button>

          <button
            id="btn-patient-view-records"
            onClick={() => setActiveView('records')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>Records</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3 Vitals Cards + AI Insights Card (matching screenshot 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Resting Heart Rate (Red top border) */}
        <div
          id="card-vital-heart-rate"
          onClick={() => setSelectedVitalModal(vitals[0])}
          className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden cursor-pointer hover:border-rose-300 transition-all flex flex-col justify-between"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-rose-500" />

          <div>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                Normal
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-4">Resting Heart Rate</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                68
              </span>
              <span className="text-xs font-semibold text-slate-500 font-mono">bpm</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Range: 60 - 100 bpm</span>
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        {/* Card 2: Blood Pressure (Teal top border) */}
        <div
          id="card-vital-blood-pressure"
          onClick={() => setSelectedVitalModal(vitals[1])}
          className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden cursor-pointer hover:border-teal-300 transition-all flex flex-col justify-between"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-teal-500" />

          <div>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono">
                Optimal
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-4">Blood Pressure</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                118/75
              </span>
              <span className="text-xs font-semibold text-slate-500 font-mono">mmHg</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Target: &lt; 120/80</span>
            <span className="text-emerald-600 font-bold">Stable</span>
          </div>
        </div>

        {/* Card 3: Sleep Average (Purple top border) */}
        <div
          id="card-vital-sleep"
          onClick={() => setSelectedVitalModal(vitals[2])}
          className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden cursor-pointer hover:border-indigo-300 transition-all flex flex-col justify-between"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />

          <div>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Moon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                Good
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-4">Sleep Average</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                7.2
              </span>
              <span className="text-xs font-semibold text-slate-500 font-mono">hrs</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Quality Score: 88%</span>
            <span className="text-indigo-600 font-bold">Restorative</span>
          </div>
        </div>

        {/* Card 4: AI Insights Card (Right card in screenshot 3) */}
        <div
          id="card-patient-ai-insights"
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-cyan-600">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-extrabold text-base text-slate-900">AI Insights</h3>
            </div>

            <div className="space-y-3 mt-3">
              {/* Insight 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs text-slate-700 leading-relaxed">
                  Your resting heart rate has trended 5% lower this week. Great job maintaining your activity levels!
                </p>
                <button
                  onClick={() => setSelectedVitalModal(vitals[0])}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>View Trends</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Insight 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs text-slate-700 leading-relaxed">
                  Upcoming lab work required for your annual physical next month.
                </p>
                <button
                  onClick={() => setActiveView('appointments')}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Schedule Lab</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAIAssistant}
            className="w-full py-2 text-xs font-bold text-slate-700 hover:text-cyan-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
          >
            Ask HEALX Health Copilot →
          </button>
        </div>
      </div>

      {/* D3.js 30-Day Longitudinal Vitals Analytics Chart */}
      <VitalsTrendsD3Chart
        data={thirtyDayVitalsData}
        onAskAIAboutTrends={handleAskAIAboutTrends}
      />

      {/* Bottom Section: Upcoming Appointments (matching screenshot 3) */}
      <div
        id="section-upcoming-appointments"
        className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
          <button
            onClick={() => setActiveView('appointments')}
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table layout matching screenshot 3 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-600 uppercase font-mono tracking-wider border-b border-slate-100">
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold">Provider</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Date & Time */}
                  <td className="py-4 font-mono font-medium text-slate-800">
                    <div>{apt.date}</div>
                    <div className="text-xs text-slate-400 font-normal">{apt.time}</div>
                  </td>

                  {/* Provider */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.providerAvatar}
                        alt={apt.providerName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{apt.providerName}</div>
                        <div className="text-xs text-slate-500">{apt.department}</div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                      {apt.type === 'Telehealth' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Telehealth</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>In-Person</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 text-right">
                    {apt.type === 'Telehealth' ? (
                      <button
                        onClick={() => setActiveView('consultations')}
                        className="px-3.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-xs rounded-xl border border-cyan-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Room</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveView('appointments')}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vital Metric Trends Modal */}
      {selectedVitalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-base text-slate-900">{selectedVitalModal.title} Trends</h3>
              </div>
              <button
                onClick={() => setSelectedVitalModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold font-mono text-slate-900">
                  {selectedVitalModal.value} {selectedVitalModal.unit}
                </span>
                <span className="text-xs font-bold text-emerald-600">{selectedVitalModal.trend}</span>
              </div>

              {/* Mini visual bar chart */}
              <div className="pt-3 flex items-end justify-between gap-2 h-28">
                {selectedVitalModal.historical.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">{h.value}</span>
                    <div
                      className="w-full bg-cyan-400 rounded-t-md transition-all hover:bg-cyan-500"
                      style={{ height: `${Math.min(100, (h.value / (selectedVitalModal.title.includes('Blood') ? 130 : 80)) * 70)}px` }}
                    />
                    <span className="text-[11px] font-mono text-slate-400">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Data continuously synchronized with Apple Health, Google Fit & HEALX Smart Vitals Hub.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVitalModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
