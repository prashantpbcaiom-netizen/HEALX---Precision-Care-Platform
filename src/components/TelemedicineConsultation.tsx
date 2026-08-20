import React, { useState, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Bot,
  FileText,
  Heart,
  Activity,
  User,
  Shield,
  Clock,
  MessageSquare,
  ChevronRight,
  Maximize2,
  Copy,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ActiveView } from '../types';

interface TelemedicineConsultationProps {
  onEndCall: () => void;
  setActiveView: (view: ActiveView) => void;
}

export const TelemedicineConsultation: React.FC<TelemedicineConsultationProps> = ({
  onEndCall,
  setActiveView,
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(145); // seconds
  const [activeTab, setActiveTab] = useState<'transcript' | 'soap' | 'vitals'>('transcript');
  
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);
  const [soapNote, setSoapNote] = useState<string | null>(null);
  const [copiedSoap, setCopiedSoap] = useState(false);

  const transcript = [
    { time: '00:05', speaker: 'Dr. Sarah Jenkins', text: 'Good morning, Alex. How are you feeling today following your last cardiac follow-up?' },
    { time: '00:15', speaker: 'Alex Vance', text: 'Good morning Dr. Sarah! Overall much better. The morning palpitations have decreased since reducing caffeine.' },
    { time: '00:30', speaker: 'Dr. Sarah Jenkins', text: 'That is great news. I reviewed your recent resting heart rate data from the smart sensor, and it averaged 68 bpm.' },
    { time: '00:45', speaker: 'Alex Vance', text: 'I also took the prescribed Lisinopril 10mg each morning with water as advised.' },
    { time: '01:10', speaker: 'Dr. Sarah Jenkins', text: 'Excellent compliance. Your blood pressure of 118/75 is in optimal therapeutic range. Let us keep this regimen for the next 6 months.' },
  ];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGenerateSoapNote = async () => {
    setIsGeneratingSoap(true);
    setActiveTab('soap');
    try {
      const fullTranscript = transcript.map((t) => `${t.speaker}: ${t.text}`).join('\n');
      const res = await fetch('/api/gemini/summarize-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: fullTranscript,
          patientName: 'Alex Vance',
          doctorName: 'Dr. Sarah Jenkins',
        }),
      });
      const data = await res.json();
      setSoapNote(data.soapNote || 'Failed to generate note.');
    } catch (err) {
      console.error('SOAP Generation failed:', err);
      setSoapNote(
        '### S (Subjective)\nPatient Alex Vance presents for 6-month cardiology follow-up. Reports significant reduction in morning palpitations.\n\n### O (Objective)\n- Resting Heart Rate: 68 bpm\n- Blood Pressure: 118/75 mmHg\n- Lisinopril 10mg compliance confirmed.\n\n### A (Assessment)\nEssential Hypertension, controlled. Palpitations, resolved with dietary modification.\n\n### P (Plan)\n1. Continue Lisinopril 10mg PO Daily.\n2. Routine lipid and metabolic panel in 6 months.'
      );
    } finally {
      setIsGeneratingSoap(false);
    }
  };

  const handleCopySoap = () => {
    if (soapNote) {
      navigator.clipboard.writeText(soapNote);
      setCopiedSoap(true);
      setTimeout(() => setCopiedSoap(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
              Telemedicine Room • HD WebRTC Encrypted
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Cardiology Consultation • Alex Vance
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-slate-900 text-cyan-400 rounded-xl font-mono text-sm font-bold shadow-xs">
            ⏱ {formatDuration(callDuration)}
          </span>
          <button
            onClick={onEndCall}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stage (Left 7 cols) & Clinical AI Sidebar (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Video Canvas Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div
            id="telehealth-video-stage"
            className="relative bg-slate-950 rounded-3xl overflow-hidden aspect-video border-2 border-slate-800 shadow-2xl flex items-center justify-center group"
          >
            {/* Patient Remote Video Feed */}
            {isVideoOn ? (
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80"
                alt="Patient Video"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <User className="w-16 h-16 text-slate-600" />
                <span className="text-sm font-mono">Camera Feed Muted</span>
              </div>
            )}

            {/* Overlaid Patient Name & Vitals HUD Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-white text-xs">
              <span className="font-bold">Alex Vance (Patient)</span>
              <span className="text-slate-400">•</span>
              <span className="text-rose-400 font-mono flex items-center gap-1 font-bold">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> 68 bpm
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-cyan-400 font-mono font-bold">118/75 mmHg</span>
            </div>

            {/* Doctor Self-View PiP (Picture in Picture) */}
            <div className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-video rounded-2xl overflow-hidden border-2 border-cyan-400/80 shadow-2xl bg-slate-900 z-10">
              <img
                src="https://images.unsplash.com/photo-1594824813581-2292f72a441e?w=300&auto=format&fit=crop&q=80"
                alt="Dr. Sarah"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] text-white font-mono">
                You (Dr. Sarah)
              </div>
            </div>

            {/* Controls Bar at bottom of video */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl z-20">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                }`}
                title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={handleGenerateSoapNote}
                className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                title="Generate AI Clinical SOAP Note"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">AI SOAP Note</span>
              </button>
            </div>
          </div>

          {/* Quick Doctor Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">AES-256 GCM Live Telehealth Session</span>
            </div>
            <button
              onClick={() => setActiveView('records')}
              className="font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Access Complete EMR File</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Consultation Assistant Tabs */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                activeTab === 'transcript' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Live Transcript
            </button>
            <button
              onClick={() => setActiveTab('soap')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                activeTab === 'soap' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI SOAP Note</span>
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                activeTab === 'vitals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Live Telemetry
            </button>
          </div>

          {/* Tab 1: Live Transcript */}
          {activeTab === 'transcript' && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {transcript.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.speaker}</span>
                    <span className="font-mono text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: AI SOAP Note */}
          {activeTab === 'soap' && (
            <div className="space-y-4">
              {isGeneratingSoap ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <Bot className="w-8 h-8 text-cyan-600 animate-bounce" />
                  <p className="text-xs font-bold text-slate-700">
                    Gemini 3.7 is synthesizing subjective/objective clinical findings...
                  </p>
                </div>
              ) : soapNote ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase font-mono text-cyan-700">
                      Generated Clinical Summary
                    </span>
                    <button
                      onClick={handleCopySoap}
                      className="text-xs font-bold text-slate-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSoap ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSoap ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-80 overflow-y-auto markdown-body">
                    <ReactMarkdown>{soapNote}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Click below to generate a real-time structured clinical SOAP summary from this dialogue.
                  </p>
                  <button
                    onClick={handleGenerateSoapNote}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Synthesize SOAP Note Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Live Telemetry */}
          {activeTab === 'vitals' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-rose-900">Photoplethysmogram (PPG)</p>
                  <p className="text-[11px] text-rose-700">Pulse variability: 42ms (Optimal)</p>
                </div>
                <span className="font-mono font-extrabold text-lg text-rose-700">68 bpm</span>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-teal-900">Arterial Pressure Wave</p>
                  <p className="text-[11px] text-teal-700">Mean Arterial Pressure (MAP): 89 mmHg</p>
                </div>
                <span className="font-mono font-extrabold text-lg text-teal-700">118/75</span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-indigo-900">SpO2 Oxygen Saturation</p>
                  <p className="text-[11px] text-indigo-700">Room air baseline</p>
                </div>
                <span className="font-mono font-extrabold text-lg text-indigo-700">99%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
