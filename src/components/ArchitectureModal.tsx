import React, { useState } from 'react';
import {
  Layers,
  Server,
  Database,
  Shield,
  Radio,
  Cpu,
  Globe,
  Lock,
  Workflow,
  X,
  Sparkles,
  Bot
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string>('services');

  if (!isOpen) return null;

  const architectureLayers = [
    {
      id: 'channels',
      name: '1. User Channels & Ingress',
      icon: Globe,
      desc: 'Doctor Web Portal, Patient iOS/Android App, Diagnostic Lab Gateway, Pharmacy Kiosk',
      tech: 'React 19, Tailwind CSS, Vite, WebRTC, WebSocket',
    },
    {
      id: 'gateway',
      name: '2. Edge Security & API Gateway',
      icon: Shield,
      desc: 'Kong / Envoy API Gateway, OAuth2 OIDC Token Exchange, Rate Limiter, WAF DDoS Shield',
      tech: 'mTLS, JWT, Cloudflare Enterprise, HMAC Signatures',
    },
    {
      id: 'services',
      name: '3. Core Microservices (16 Clusters)',
      icon: Server,
      desc: 'Patient Management, Doctor Scheduling, EMR Vault, Telehealth WebRTC, Gemini AI Engine, Prescription Dispense, Billing/Claims, Analytics',
      tech: 'Express/Node.js, Go, Python FastAPI, gRPC & REST',
    },
    {
      id: 'eventbus',
      name: '4. Distributed Event Bus & Messaging',
      icon: Radio,
      desc: 'Real-time telemetry event streaming, lab status notifications, audit logs pipeline',
      tech: 'Apache Kafka, RabbitMQ, Redis Pub/Sub',
    },
    {
      id: 'storage',
      name: '5. Multi-Model Data & Storage Layer',
      icon: Database,
      desc: 'Relational clinical EMR database, NoSQL vital time-series, DICOM image blob storage, In-memory session cache',
      tech: 'PostgreSQL, MongoDB, AWS S3/GCS, Redis Cluster',
    },
    {
      id: 'compliance',
      name: '6. Governance & Compliance Hub',
      icon: Lock,
      desc: 'HIPAA, ABDM M1-M3, GDPR, AES-256 GCM at rest, Zero-Trust network policy',
      tech: 'HashiCorp Vault, Splunk SIEM, OpenTelemetry Tracing',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#091120] text-slate-100 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-cyan-500/30 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">HEALX by NEXORA Architecture</h3>
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-800">
                  Microservices + Gemini
                </span>
              </div>
              <p className="text-xs text-slate-400">
                High-availability, enterprise-grade healthcare infrastructure topology
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Architecture Layers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {architectureLayers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = selectedLayer === layer.id;

            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{layer.name}</h4>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{layer.desc}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                  <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{layer.tech}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Integration Highlight */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/60 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white">Gemini 3.7 Flash Integration Engine</p>
            <p className="leading-relaxed">
              All diagnostic queries, ECG biomarker parsing, and consultation SOAP notes are handled through secure server-side routes (/api/gemini/*) protecting clinical privacy with zero client-side key leakage.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
