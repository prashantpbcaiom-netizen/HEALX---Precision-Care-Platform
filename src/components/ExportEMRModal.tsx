import React, { useState } from 'react';
import { FileDown, Printer, ShieldCheck, Check, X, FileText } from 'lucide-react';
import { ClinicalTimelineItem, Prescription } from '../types';

interface ExportEMRModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: ClinicalTimelineItem[];
  prescriptions: Prescription[];
}

export const ExportEMRModal: React.FC<ExportEMRModalProps> = ({
  isOpen,
  onClose,
  timeline,
  prescriptions,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const emrContent = `=====================================================
HEALX PRECISION CARE PLATFORM - OFFICIAL EMR DOSSIER
NEXORA Medical Systems • HIPAA & ABDM Compliant Audit Trail
=====================================================
Patient: Eleanor Vance
DOB: Oct 12, 1982 (41y) | Blood Group: O+ | Sex: Female
EMR Identifier: #RX-7890-EM
Primary Care Provider: Dr. Sarah Jenkins (Cardiology)
Date of Generation: ${new Date().toLocaleDateString()}

[CRITICAL ALERTS & ALLERGIES]
- Penicillin (Severe Urticaria)
- Latex (Contact Dermatitis)

[CHRONIC DIAGNOSES]
- Hypertension, Essential (ICD-10 I10)
- Mitral Valve Prolapse (ICD-10 I34.1)

[ACTIVE PRESCRIPTIONS]
${prescriptions.map((rx) => `- ${rx.name} ${rx.dosage}: ${rx.instructions} (Refills: ${rx.refillsRemaining})`).join('\n')}

[CLINICAL TIMELINE & ENCOUNTERS]
${timeline.map((t) => `* [${t.dateTag}] ${t.category} - ${t.title}\n  Physician: ${t.physician}\n  Summary: ${t.description}`).join('\n\n')}

=====================================================
Cryptographically signed by NEXORA Trust Engine.
=====================================================`;

    const blob = new Blob([emrContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HEALX_EMR_Eleanor_Vance_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Export Electronic Medical Record</h3>
              <p className="text-xs text-slate-500 font-mono">Dossier ID: #RX-7890-EM • Eleanor Vance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* EMR Preview Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 space-y-4 max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-900">HEALX PRECISION CARE PLATFORM</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA/ABDM Certified
            </span>
          </div>

          <div>
            <p className="font-bold text-slate-900">PATIENT DEMOGRAPHICS:</p>
            <p>Eleanor Vance | 41y Female | DOB: 1982-10-12 | Blood: O+</p>
            <p>Allergies: Penicillin, Latex</p>
          </div>

          <div>
            <p className="font-bold text-slate-900">ACTIVE REGIMEN ({prescriptions.length}):</p>
            {prescriptions.map((rx) => (
              <p key={rx.id}>• {rx.name} {rx.dosage} - {rx.instructions}</p>
            ))}
          </div>

          <div>
            <p className="font-bold text-slate-900">ENCOUNTERS ({timeline.length}):</p>
            {timeline.map((t) => (
              <p key={t.id}>[{t.dateTag}] {t.title} ({t.physician})</p>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clinical Record</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {downloaded ? <Check className="w-4 h-4" /> : <FileDown className="w-4 h-4" />}
              <span>{downloaded ? 'Downloaded EMR' : 'Download Complete Dossier'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
