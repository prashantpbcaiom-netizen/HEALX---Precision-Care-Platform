import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Heart,
  FileText,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { AIDiagnosticReport } from '../types';
import { initialAIDiagnosticReport } from '../data/mockData';

interface AIDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

export const AIDiagnosticsModal: React.FC<AIDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  patientName = 'Marcus Reynolds',
}) => {
  const [report, setReport] = useState<AIDiagnosticReport>(initialAIDiagnosticReport);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customClinicalNote, setCustomClinicalNote] = useState('');

  if (!isOpen) return null;

  const handleRunFreshAIAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          age: '48y Male',
          condition: 'Cardiology Follow-up & Lab Review',
          labData: 'Lipid Panel: Total Chol 198, LDL 112, HDL 48, Triglycerides 150. BP: 128/82. ECG: Normal sinus rhythm with rare PACs. Echo: LVEF 60%, mild mitral regurgitation.',
          clinicalNotes: customClinicalNote || 'Patient reports mild intermittent palpitations after caffeine intake, no syncope or chest tightness.',
        }),
      });
      const data = await res.json();
      if (data && data.summary) {
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to run AI diagnostics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = `HEALX AI Diagnostic Report - ${patientName}
Summary: ${report.summary}
Risk Stratification: ${report.riskStratification}
Key Findings:
${report.keyFindings.map((f) => `- ${f}`).join('\n')}
Recommendations:
${report.recommendations.map((r) => `- ${r}`).join('\n')}
AI Confidence: ${report.aiConfidence}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0B132B] text-slate-100 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-cyan-500/30 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-cyan-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  AI Diagnostics Synthesis
                </h3>
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-800">
                  {report.model || 'Gemini 3.7 Flash'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Patient: <strong className="text-cyan-300">{patientName}</strong> • EMR Document ID #RX-7890-EM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono uppercase text-cyan-400 tracking-wider">
              Diagnostic Synthesis
            </span>
            <span className="text-xs font-bold font-mono text-emerald-400">
              Confidence: {report.aiConfidence}
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {report.summary}
          </p>
        </div>

        {/* 2-Column: Key Findings & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Key Findings */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Activity className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider">
                Key Findings & Biomarkers
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {report.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
              Risk: <span className="font-bold text-white">{report.riskStratification}</span>
            </div>
          </div>

          {/* Clinical Recommendations */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider">
                Clinical Recommendations
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {report.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Guideline aligned: ACC / AHA Primary Prevention Protocol
            </div>
          </div>
        </div>

        {/* Custom Clinical Note Input for Re-analysis */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-300 font-mono">
            Add Doctor Clinical Notes for Deep Analysis:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Patient had mild dizziness after morning workout; check for orthostasis..."
              value={customClinicalNote}
              onChange={(e) => setCustomClinicalNote(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={handleRunFreshAIAnalysis}
              disabled={loading}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing...' : 'Re-Analyze'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-cyan-900/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-300 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Synthesis to EMR'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
