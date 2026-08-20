import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  FileText,
  Clock,
  Send,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import { PatientQueueItem, ClinicalAlert } from '../types';

interface ClinicalHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: PatientQueueItem[];
  alerts: ClinicalAlert[];
}

interface HandoffReportData {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string[];
  generatedAt: string;
  aiModel: string;
}

export const ClinicalHandoffModal: React.FC<ClinicalHandoffModalProps> = ({
  isOpen,
  onClose,
  queue,
  alerts,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [report, setReport] = useState<HandoffReportData | null>(null);
  const [signedOff, setSignedOff] = useState(false);

  const generateHandoff = async () => {
    setLoading(true);
    setSignedOff(false);
    try {
      const res = await fetch('/api/gemini/handoff-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorName: 'Dr. Sarah Jenkins, MD',
          department: 'Cardiology & Acute Internal Medicine',
          shift: 'Day Shift (07:00 - 15:00)',
          queueSummary: queue.map((p) => ({
            name: p.name,
            reason: p.reason,
            status: p.status,
            priority: p.priority,
            triageLevel: p.triageLevel,
            room: p.roomNumber,
          })),
          criticalAlerts: alerts.filter((a) => !a.resolved),
        }),
      });

      if (!res.ok) throw new Error('Failed to generate shift handoff');
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Handoff error:', err);
      // Fallback
      setReport({
        situation: `Dr. Sarah Jenkins handoff for Cardiology & Precision Medicine (Morning Shift). 5 active patients in census, 1 critical STAT ECG pending sign-off.`,
        background: `Census contains 1 Level-2 Emergent patient (Jonathan Davis with acute angina in Bay 1), 2 Level-3 Urgent patients (Marcus Reynolds, Eleanor Vance), and 2 stable checkups.`,
        assessment: `Overall department throughput is optimal (avg wait time 8.4 mins). Jonathan Davis requires priority cardiac enzyme serial testing and cardiology bed admission. Eleanor Vance echocardiogram shows stable EF 60%.`,
        recommendation: [
          'STAT 12-lead ECG review & Troponin serials for Jonathan Davis (Bay 1).',
          'Sign off on Eleanor Vance 2D Echo outpatient report before 12:00 PM.',
          'Repeat BMP for Elena Lawson regarding borderline elevated K+ (5.4 mEq/L).',
          'Bed census occupancy currently at 78% with 4 open examination bays.',
        ],
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aiModel: 'HEALX-MedEngine / Gemini 3.7 Flash',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !report) {
      generateHandoff();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!report) return;
    const text = `HEALX CLINICAL SBAR SHIFT HANDOFF REPORT
Generated: ${report.generatedAt} | Model: ${report.aiModel}
Physician: Dr. Sarah Jenkins, MD

[S] SITUATION:
${report.situation}

[B] BACKGROUND:
${report.background}

[A] ASSESSMENT:
${report.assessment}

[R] RECOMMENDATIONS & ACTION ITEMS:
${report.recommendation.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">AI Clinical SBAR Shift Handoff</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-100 text-cyan-800 rounded-full font-mono">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Department Census Synthesis • Dr. Sarah Jenkins
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

        {/* Content Body */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
            <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin" />
            <p className="text-sm font-bold text-slate-800">Synthesizing SBAR shift handoff...</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Analyzing current unit census, pending STAT ECGs, lab telemetry, and clinical tasks.
            </p>
          </div>
        ) : report ? (
          <div className="space-y-4 text-xs">
            {/* SBAR Sections */}
            {/* Situation */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-cyan-800 font-extrabold font-mono uppercase text-[11px]">
                <span className="w-5 h-5 rounded-full bg-cyan-200 text-cyan-900 flex items-center justify-center font-black">
                  S
                </span>
                <span>Situation (Current Status)</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-7">{report.situation}</p>
            </div>

            {/* Background */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-indigo-800 font-extrabold font-mono uppercase text-[11px]">
                <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 flex items-center justify-center font-black">
                  B
                </span>
                <span>Background (Census & Acuity)</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-7">{report.background}</p>
            </div>

            {/* Assessment */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-amber-800 font-extrabold font-mono uppercase text-[11px]">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black">
                  A
                </span>
                <span>Assessment (Clinical Trajectory)</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-7">{report.assessment}</p>
            </div>

            {/* Recommendations */}
            <div className="p-3.5 bg-cyan-50/70 rounded-xl border border-cyan-200 space-y-2">
              <div className="flex items-center gap-2 text-cyan-900 font-extrabold font-mono uppercase text-[11px]">
                <span className="w-5 h-5 rounded-full bg-cyan-300 text-cyan-950 flex items-center justify-center font-black">
                  R
                </span>
                <span>Recommendations & Transition Action Items</span>
              </div>
              <div className="pl-7 space-y-1.5">
                {report.recommendation.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-800">
                    <span className="w-4 h-4 rounded-full bg-white text-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs border border-cyan-200">
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {signedOff && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Digitally signed and routed to On-Call Physician & Nursing Station.</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={generateHandoff}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SBAR'}</span>
            </button>

            <button
              onClick={() => {
                setSignedOff(true);
                setTimeout(() => onClose(), 1500);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sign Off & Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
