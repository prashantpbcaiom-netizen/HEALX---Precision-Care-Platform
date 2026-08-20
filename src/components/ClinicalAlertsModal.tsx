import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  X,
  FileText,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ClinicalAlert, ActiveView } from '../types';

interface ClinicalAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: ClinicalAlert[];
  onResolveAlert: (id: string) => void;
  setActiveView: (view: ActiveView) => void;
  onSelectPatient?: (patientId: string) => void;
}

export const ClinicalAlertsModal: React.FC<ClinicalAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onResolveAlert,
  setActiveView,
  onSelectPatient,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Clinical Telemetry & Lab Alerts</h2>
              <p className="text-xs text-slate-500 font-mono">
                {alerts.filter((a) => !a.resolved).length} active notifications require clinical review
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

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.resolved
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isCritical
                    ? 'bg-rose-50/70 border-rose-200'
                    : isWarning
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-cyan-50/70 border-cyan-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono uppercase ${
                          isCritical
                            ? 'bg-rose-600 text-white'
                            : isWarning
                            ? 'bg-amber-600 text-white'
                            : 'bg-cyan-600 text-white'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{alert.title}</h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{alert.detail}</p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                      <span>Patient: <strong className="text-slate-800">{alert.patientName}</strong></span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (onSelectPatient) onSelectPatient(alert.patientId);
                      setActiveView('records');
                      onClose();
                    }}
                    className="text-xs font-bold text-slate-700 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Patient Chart</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {!alert.resolved ? (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Acknowledge & Clear</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
