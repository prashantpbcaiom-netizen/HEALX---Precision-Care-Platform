import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  X,
  RefreshCw,
  Copy,
  Check,
  Stethoscope,
  Pill,
  HeartPulse,
  FileCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, ActiveView } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content:
        '**Hello! I am your HEALX Clinical AI Assistant**.\n\nI can help you with:\n- **Clinical Diagnostic Insights** (ECG, Lipid, EMR evaluation)\n- **Drug-Drug Interaction Checks** (e.g. Lisinopril + Atorvastatin)\n- **Symptom Triage & SOAP Note Generation**\n- **Patient Education Summaries**\n\nHow can I assist your clinical workflow today?',
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    {
      label: 'Check Drug Interactions',
      icon: Pill,
      prompt: 'Check for drug-drug interactions between Lisinopril 10mg, Atorvastatin 20mg, and Azithromycin 500mg.',
    },
    {
      label: 'Interpret Mitral Valve Echo',
      icon: HeartPulse,
      prompt: 'Summarize clinical significance of mild mitral valve prolapse with LVEF 62% in a 41-year-old female.',
    },
    {
      label: 'Draft SOAP Note',
      icon: FileCheck,
      prompt: 'Draft a SOAP note for a follow-up visit on hypertension with blood pressure recorded at 118/75 mmHg.',
    },
    {
      label: 'Triage Patient Chest Flutter',
      icon: Stethoscope,
      prompt: 'What are the top differential diagnoses and recommended workup for isolated caffeine-induced palpitations?',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          role: activeView === 'patient-portal' ? 'patient' : 'doctor',
          context: `Current Screen: ${activeView}. Patient: Eleanor Vance / Marcus Reynolds. HEALX Precision Care Platform.`,
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || 'I could not generate an answer right now. Please try again.';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content:
          '**System Alert**: Connection to HEALX AI MedEngine was interrupted. Please ensure your network is connected.',
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div
        id="healx-ai-assistant-drawer"
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#091120] text-slate-100 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">HEALX AI Copilot</h3>
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 font-bold px-2 py-0.5 rounded-full border border-cyan-700/60">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Precision Clinical Intelligence by NEXORA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto text-xs no-scrollbar">
          {quickPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-slate-700 hover:text-cyan-800 rounded-full font-medium shrink-0 transition-colors cursor-pointer shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-cyan-600" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-100/40">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-full bg-[#091120] text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-cyan-800">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                    isAI
                      ? 'bg-white border border-slate-200/90 text-slate-800'
                      : 'bg-cyan-500 text-slate-950 font-medium'
                  }`}
                >
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60 text-[10px] text-slate-400 font-mono">
                    <span>{msg.timestamp}</span>

                    {isAI && (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-cyan-200">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-[#091120] text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-600" />
                <span>HEALX AI is analyzing medical knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask HEALX Copilot (e.g. Check contraindications, draft SOAP)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 rounded-xl font-bold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            AI recommendations support physician judgment. NEXORA HIPAA/ABDM Compliant.
          </p>
        </div>
      </div>
    </div>
  );
};
