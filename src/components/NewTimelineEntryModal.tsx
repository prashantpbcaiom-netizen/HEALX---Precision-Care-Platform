import React, { useState } from 'react';
import { Plus, X, Stethoscope, FileText, Calendar } from 'lucide-react';
import { ClinicalTimelineItem } from '../types';

interface NewTimelineEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: ClinicalTimelineItem) => void;
}

export const NewTimelineEntryModal: React.FC<NewTimelineEntryModalProps> = ({
  isOpen,
  onClose,
  onAddEntry,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'CARDIOLOGY' | 'GENERAL PRACTICE' | 'URGENT CARE' | 'NEUROLOGY'>('CARDIOLOGY');
  const [physician, setPhysician] = useState('Dr. Sarah Jenkins');
  const [description, setDescription] = useState('');
  const [dateTag, setDateTag] = useState('TODAY, 02:00 PM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newEntry: ClinicalTimelineItem = {
      id: `time-${Date.now()}`,
      dateTag,
      category,
      title,
      description,
      physician,
      hasReport: true,
      dotColor: category === 'CARDIOLOGY' ? 'cyan' : category === 'URGENT CARE' ? 'rose' : 'slate',
      details: {
        findings: [description],
        vitalsRecorded: 'BP: 120/78 mmHg, HR: 70 bpm, SpO2: 99%',
      },
    };

    onAddEntry(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">New Clinical Timeline Entry</h3>
              <p className="text-xs text-slate-500 font-mono">Patient: Eleanor Vance • #RX-7890-EM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mb-1">
              Procedure / Consultation Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Holter Monitor 24h Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mb-1">
                Clinical Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="CARDIOLOGY">CARDIOLOGY</option>
                <option value="GENERAL PRACTICE">GENERAL PRACTICE</option>
                <option value="URGENT CARE">URGENT CARE</option>
                <option value="NEUROLOGY">NEUROLOGY</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mb-1">
                Attending Physician
              </label>
              <input
                type="text"
                required
                value={physician}
                onChange={(e) => setPhysician(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mb-1">
              Clinical Findings & Progress Summary
            </label>
            <textarea
              required
              rows={4}
              placeholder="Enter patient assessment, examination notes, and treatment plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
