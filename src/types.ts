export type ActiveView = 
  | 'dashboard'
  | 'doctor-dashboard'
  | 'doctor-patients'
  | 'doctor-appointments'
  | 'doctor-queue'
  | 'doctor-records'
  | 'doctor-profile'
  | 'patient-dashboard'
  | 'patient-portal'
  | 'patient-appointments'
  | 'patient-queue'
  | 'patient-records'
  | 'patient-profile'
  | 'appointments' 
  | 'records' 
  | 'consultations';

export type UserRole = 'doctor' | 'patient';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department?: string;
  phone?: string;
  avatar?: string;
  dob?: string;
  bloodType?: string;
  allergies?: string[];
  insurance?: string;
  emergencyContact?: string;
}

export interface PatientQueueItem {
  id: string;
  initials: string;
  name: string;
  reason: string;
  time: string;
  status: 'Active' | 'Waiting' | 'Completed' | 'In-Consultation';
  avatarBg?: string;
  age: number;
  gender: string;
  bloodType: string;
  dob: string;
  priority?: 'Critical' | 'Urgent' | 'Routine';
  triageLevel?: 1 | 2 | 3 | 4 | 5; // 1 = Resuscitation, 2 = Emergent, 3 = Urgent, 4 = Less Urgent, 5 = Non-Urgent
  roomNumber?: string;
  vitalsQuick?: {
    bp: string;
    hr: number;
    spO2: number;
    temp?: number;
    painScale?: number;
  };
  insurance?: string;
  allergies?: string[];
}

export interface ClinicalAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  patientId: string;
  patientName: string;
  title: string;
  detail: string;
  timestamp: string;
  actionLabel?: string;
  resolved?: boolean;
}

export interface ClinicalTaskItem {
  id: string;
  title: string;
  patientName?: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'routine';
  completed: boolean;
  category: 'Review' | 'Prescription' | 'Sign-off' | 'Referral';
}

export interface HourlyTriageFlowData {
  hour: string;
  intake: number;
  discharged: number;
  activeCensus: number;
  avgWaitMin: number;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  department: string;
  rating: number;
  reviewCount: number;
  image: string;
  bio: string;
  nextAvail: string;
  location: string;
  mode: 'In-Person' | 'Telehealth' | 'Both';
  fee: number;
  availableTimes: string[];
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  providerName: string;
  department: string;
  providerAvatar: string;
  type: 'Telehealth' | 'In-Person';
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  location?: string;
  patientName: string;
}

export interface VitalMetric {
  id: string;
  title: string;
  value: string;
  unit: string;
  status: 'Normal' | 'Optimal' | 'Good' | 'Attention';
  color: 'rose' | 'teal' | 'indigo' | 'amber';
  trend: string;
  historical: { label: string; value: number }[];
}

export interface ClinicalTimelineItem {
  id: string;
  dateTag: string; // e.g. "TODAY, 10:30 AM"
  category: 'CARDIOLOGY' | 'GENERAL PRACTICE' | 'URGENT CARE' | 'LABORATORY' | 'SURGERY' | 'NEUROLOGY';
  title: string;
  description: string;
  physician: string;
  hasReport?: boolean;
  dotColor?: 'cyan' | 'slate' | 'rose' | 'teal';
  details?: {
    findings: string[];
    vitalsRecorded?: string;
    attachments?: string[];
  };
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  status: 'ACTIVE' | 'PAST' | 'PENDING_REFILL';
  refillsRemaining: number;
  expiration: string;
  prescribedBy: string;
}

export interface LabResultItem {
  id: string;
  name: string;
  date: string;
  department: string;
  status: 'Normal' | 'Flagged' | 'Pending';
  summary: string;
  parameters: { metric: string; value: string; range: string; flag?: boolean }[];
}

export interface ConsultationNote {
  id: string;
  doctor: string;
  department: string;
  date: string;
  snippet: string;
  type: 'notes' | 'file';
  fileUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tags?: string[];
}

export interface DailyVitalRecord {
  date: string;
  displayDate: string;
  dayIndex: number;
  heartRate: number; // resting bpm
  heartRatePeak: number; // active max bpm
  bpSystolic: number; // systolic mmHg
  bpDiastolic: number; // diastolic mmHg
  sleepHours: number; // hours
  sleepQuality: number; // percentage 0-100
  spO2: number; // percentage 90-100
  glucose: number; // mg/dL fasting
  steps: number; // step count
  notes?: string;
  eventTag?: string;
}

export type VitalMetricType = 'heartRate' | 'bloodPressure' | 'sleep' | 'spO2' | 'glucose' | 'overview';

export interface AIDiagnosticReport {
  summary: string;
  keyFindings: string[];
  riskStratification: string;
  recommendations: string[];
  aiConfidence: string;
  model: string;
}
