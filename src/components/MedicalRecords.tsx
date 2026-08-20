import React, { useState } from 'react';
import {
  Search,
  Plus,
  FileDown,
  Filter,
  MoreVertical,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Pill,
  CheckCircle2,
  Calendar,
  Activity,
  Heart,
  FileText,
  Clock,
  Eye,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  ClinicalTimelineItem,
  Prescription,
  ActiveView
} from '../types';

interface MedicalRecordsProps {
  timeline: ClinicalTimelineItem[];
  prescriptions: Prescription[];
  onAddTimelineEntry: (entry: ClinicalTimelineItem) => void;
  onAddPrescription: (prescription: Prescription) => void;
  onOpenAIDiagnostics: () => void;
  onOpenAIAssistant: () => void;
  onOpenExportModal: () => void;
  onOpenNewEntryModal: () => void;
  setActiveView: (view: ActiveView) => void;
}

export const MedicalRecords: React.FC<MedicalRecordsProps> = ({
  timeline,
  prescriptions,
  onAddPrescription,
  onOpenAIDiagnostics,
  onOpenAIAssistant,
  onOpenExportModal,
  onOpenNewEntryModal,
  setActiveView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportItem, setSelectedReportItem] = useState<ClinicalTimelineItem | null>(null);
  const [labFilter, setLabFilter] = useState('');
  const [refillRequested, setRefillRequested] = useState<string | null>(null);
  const [showOlderRecords, setShowOlderRecords] = useState(false);
  const [showAddRxModal, setShowAddRxModal] = useState(false);
  const [newRxName, setNewRxName] = useState('');
  const [newRxDosage, setNewRxDosage] = useState('');
  const [newRxInstructions, setNewRxInstructions] = useState('');

  // Filtering timeline records
  const filteredTimeline = timeline.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const labResults = [
    {
      id: 'lab-1',
      test: 'Comprehensive Lipid Profile',
      date: 'Oct 14, 2023',
      status: 'Normal Range',
      result: 'Total: 194 mg/dL | LDL: 110 mg/dL | HDL: 52 mg/dL',
      flag: false,
    },
    {
      id: 'lab-2',
      test: 'Echocardiogram 2D / Color Doppler Scan',
      date: 'Oct 24, 2023',
      status: 'Mild MVP (Stable)',
      result: 'LVEF: 62% | Mild posterior prolapse without stenosis',
      flag: false,
    },
    {
      id: 'lab-3',
      test: 'Hemoglobin A1c (HbA1c)',
      date: 'Aug 10, 2023',
      status: 'Optimal (5.4%)',
      result: 'Estimated Avg Glucose: 108 mg/dL',
      flag: false,
    },
  ];

  const filteredLabs = labResults.filter((l) =>
    l.test.toLowerCase().includes(labFilter.toLowerCase())
  );

  const handleRequestRefill = (rxId: string) => {
    setRefillRequested(rxId);
    setTimeout(() => {
      alert('Prescription refill request sent to Dr. Marcus Chen & Central Pharmacy.');
    }, 300);
  };

  const handleSaveRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRxName.trim()) return;

    const newPrescription: Prescription = {
      id: `rx-${Date.now()}`,
      name: newRxName,
      dosage: newRxDosage || '10mg',
      instructions: newRxInstructions || 'Take 1 tablet daily',
      status: 'ACTIVE',
      refillsRemaining: 3,
      expiration: '10/2024',
      prescribedBy: 'Dr. Sarah Jenkins',
    };

    onAddPrescription(newPrescription);
    setNewRxName('');
    setNewRxDosage('');
    setNewRxInstructions('');
    setShowAddRxModal(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header matching screenshot 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Medical Records
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-500 font-semibold mt-1">
            EMR Document ID: <span className="text-cyan-700 font-bold">#RX-7890-EM</span>
          </p>
        </div>

        {/* Global Record Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-medical-records"
            placeholder="Search records, labs, condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Patient Header Card (matching screenshot 4) */}
      <div
        id="card-patient-emr-header"
        className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      >
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80"
            alt="Eleanor Vance"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Eleanor Vance
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-mono text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Identity</span>
              </span>
            </div>

            {/* Demographics row */}
            <p className="text-xs sm:text-sm text-slate-500 font-mono font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>DOB: Oct 12, 1982 (41y)</span>
              <span>•</span>
              <span>Blood: O+</span>
              <span>•</span>
              <span>Sex: F</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: + New Entry & Export EMR */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            id="btn-new-emr-entry"
            onClick={onOpenNewEntryModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>

          <button
            id="btn-export-emr"
            onClick={onOpenExportModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-slate-600" />
            <span>Export EMR</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid: Timeline (Left 7 cols) & Critical Alerts / Prescriptions (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Clinical Timeline & Labs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Clinical Timeline Card */}
          <div
            id="card-clinical-timeline"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-cyan-600" />
                <h2 className="text-xl font-bold text-slate-900">Clinical Timeline</h2>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <button
                  onClick={() => setSearchQuery(searchQuery ? '' : 'Cardiology')}
                  className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Filter by category"
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timeline items list */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {filteredTimeline.map((item) => {
                const isCyan = item.dotColor === 'cyan' || item.category === 'CARDIOLOGY';
                const isRose = item.dotColor === 'rose' || item.category === 'URGENT CARE';

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ${
                        isCyan
                          ? 'bg-cyan-500 ring-cyan-200'
                          : isRose
                          ? 'bg-rose-500 ring-rose-200'
                          : 'bg-slate-400 ring-slate-200'
                      }`}
                    />

                    {/* Timeline Entry Card */}
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all space-y-2">
                      {/* Date & Category Tag */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {item.dateTag}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md ${
                            item.category === 'CARDIOLOGY'
                              ? 'bg-cyan-100 text-cyan-800'
                              : item.category === 'URGENT CARE'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Doctor & Action link */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-500">
                          👤 {item.physician}
                        </span>

                        {item.hasReport && (
                          <button
                            onClick={() => setSelectedReportItem(item)}
                            className="text-cyan-600 hover:text-cyan-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Report</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {showOlderRecords && (
                <div className="relative group animate-in fade-in">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 bg-slate-400 ring-slate-200" />
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1 text-xs text-slate-600">
                    <div className="font-mono font-bold text-slate-700">NOV 18, 2022 • DERMATOLOGY</div>
                    <div className="font-bold text-slate-900">Routine Skin Screening</div>
                    <div>Full body nevus check. No dysplastic lesions observed.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Load Older Records Button */}
            <div className="pt-2 text-center">
              <button
                id="btn-load-older-records"
                onClick={() => setShowOlderRecords(!showOlderRecords)}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                {showOlderRecords ? 'Collapse Older Records' : 'Load Older Records'}
              </button>
            </div>
          </div>

          {/* Lab Results & Imaging Section (matching screenshot 4 bottom) */}
          <div
            id="card-lab-results-imaging"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                <h2 className="text-lg font-bold text-slate-900">Lab Results & Imaging</h2>
              </div>

              {/* Filter input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter labs..."
                  value={labFilter}
                  onChange={(e) => setLabFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Lab Items */}
            <div className="divide-y divide-slate-100">
              {filteredLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 px-2 rounded-lg transition-colors cursor-pointer"
                  onClick={onOpenAIDiagnostics}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{lab.test}</p>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {lab.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{lab.result}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">{lab.date}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAIDiagnostics();
                      }}
                      className="p-1 text-cyan-600 hover:text-cyan-700"
                      title="AI Lab Analysis"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Critical Alerts & Prescriptions (matching screenshot 4) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Critical Alerts Card */}
          <div
            id="card-critical-alerts"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2 text-rose-600 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-900">Critical Alerts</h2>
            </div>

            {/* Known Allergies */}
            <div>
              <p className="text-[11px] font-bold text-slate-600 uppercase font-mono tracking-wider mb-2">
                KNOWN ALLERGIES
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200/90 text-rose-700 font-bold text-xs">
                  <Pill className="w-3.5 h-3.5" />
                  <span>Penicillin</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200/90 text-rose-700 font-bold text-xs">
                  <span className="text-rose-500 font-bold">⊘</span>
                  <span>Latex</span>
                </span>
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-600 uppercase font-mono tracking-wider mb-2">
                CHRONIC CONDITIONS
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Hypertension, Essential</span>
                    <span className="text-slate-400 text-xs font-mono ml-2">Diagnosed: 2018</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Mitral Valve Prolapse</span>
                    <span className="text-slate-400 text-xs font-mono ml-2">Diagnosed: 2020</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Prescriptions Card (matching screenshot 4) */}
          <div
            id="card-prescriptions-list"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-900">Prescriptions</h2>
              </div>
              <button
                id="btn-add-prescription"
                onClick={() => setShowAddRxModal(true)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                title="Add New Medication"
              >
                +
              </button>
            </div>

            {/* Prescriptions list */}
            <div className="space-y-3">
              {prescriptions.map((rx) => {
                const isRefillRequested = refillRequested === rx.id;

                return (
                  <div
                    key={rx.id}
                    className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">{rx.name}</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                        {rx.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{rx.instructions}</p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>
                        Refills: <strong className="text-slate-700">{rx.refillsRemaining}</strong>
                      </span>
                      {rx.refillsRemaining > 0 ? (
                        <span>Exp: {rx.expiration}</span>
                      ) : (
                        <button
                          onClick={() => handleRequestRefill(rx.id)}
                          className={`font-bold font-sans cursor-pointer ${
                            isRefillRequested
                              ? 'text-emerald-600'
                              : 'text-cyan-600 hover:text-cyan-700'
                          }`}
                        >
                          {isRefillRequested ? 'Refill Requested ✓' : 'Request Refill'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Echocardiogram Report Modal */}
      {selectedReportItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono uppercase bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded">
                  {selectedReportItem.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedReportItem.title} - Official Diagnostic Report
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportItem(null)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs">
                Patient: Eleanor Vance | EMR #RX-7890-EM | Signer: {selectedReportItem.physician}
              </div>

              <h4 className="font-bold text-slate-900">Key Diagnostic Findings:</h4>
              <ul className="space-y-1.5 list-disc pl-5">
                {selectedReportItem.details?.findings?.map((f, i) => (
                  <li key={i}>{f}</li>
                )) || <li>Stable echocardiogram findings without hemodynamic compromise.</li>}
              </ul>

              {selectedReportItem.details?.vitalsRecorded && (
                <div className="p-3 bg-cyan-50 text-cyan-900 rounded-xl font-mono text-xs">
                  Vitals at time of review: {selectedReportItem.details.vitalsRecorded}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedReportItem(null);
                  onOpenAIDiagnostics();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Gemini AI Diagnostic Cross-Check</span>
              </button>
              <button
                onClick={() => setSelectedReportItem(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {showAddRxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Prescription</h3>
              <button
                onClick={() => setShowAddRxModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveRx} className="py-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metoprolol Tartrate"
                  value={newRxName}
                  onChange={(e) => setNewRxName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25mg"
                  value={newRxDosage}
                  onChange={(e) => setNewRxDosage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dosage Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 tablet twice daily with meals"
                  value={newRxInstructions}
                  onChange={(e) => setNewRxInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRxModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save to EMR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
