import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Stethoscope,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ClinicalTaskItem } from '../types';

interface ClinicalTasksPanelProps {
  tasks: ClinicalTaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<ClinicalTaskItem[]>>;
  onOpenRecordForPatient?: (patientName: string) => void;
}

export const ClinicalTasksPanel: React.FC<ClinicalTasksPanelProps> = ({
  tasks,
  setTasks,
  onOpenRecordForPatient,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<ClinicalTaskItem['category']>('Review');
  const [newTaskDue, setNewTaskDue] = useState('12:30 PM');

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: ClinicalTaskItem = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      dueTime: newTaskDue,
      priority: 'medium',
      completed: false,
      category: newTaskCategory,
    };

    setTasks((prev) => [task, ...prev]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">Dr. Sarah's Clinical Tasks</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 font-mono">
                {pendingCount} remaining
              </span>
            </div>
            <p className="text-xs text-slate-500">Sign-offs, order approvals & rounds</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setFilter('pending')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              filter === 'pending' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              filter === 'completed' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'
            }`}
          >
            Completed ({tasks.filter((t) => t.completed).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <form
          onSubmit={handleAddTask}
          className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs animate-in fade-in"
        >
          <input
            type="text"
            required
            placeholder="e.g. Sign off on Marcus Reynolds Holter ECG report"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-700"
              >
                <option value="Sign-off">Sign-off</option>
                <option value="Prescription">Prescription</option>
                <option value="Review">Review</option>
                <option value="Referral">Referral</option>
              </select>

              <input
                type="text"
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
                className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-center"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List Items */}
      <div className="divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No clinical tasks in this view.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`py-2.5 flex items-center justify-between gap-3 group transition-colors ${
                task.completed ? 'opacity-50' : 'hover:bg-slate-50/80'
              } px-1 rounded-lg`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="text-slate-400 hover:text-cyan-600 cursor-pointer shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 group-hover:text-cyan-500" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    } truncate`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span className="px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-600 font-semibold font-sans">
                      {task.category}
                    </span>
                    <span>Due {task.dueTime}</span>
                  </div>
                </div>
              </div>

              {task.priority === 'high' && !task.completed && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-mono">
                  HIGH
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
