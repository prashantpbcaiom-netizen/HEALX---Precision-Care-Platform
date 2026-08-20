import React, { useState } from 'react';
import {
  Activity,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  KeyRound,
  X,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole, usernameOrEmail: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [identifier, setIdentifier] = useState('dr.sarah@healx.health');
  const [password, setPassword] = useState('HEALX•Precision•2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Forgot Password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Handle switching between Doctor and Patient login options
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'doctor') {
      setIdentifier('dr.sarah@healx.health');
      setPassword('HEALX•Precision•2026');
    } else {
      setIdentifier('alex.vance@healx.health');
      setPassword('PatientPass•4902');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or username');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate swift professional auth verification and redirect to Common Dashboard
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole, identifier);
    }, 500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B132B] to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Ambient background medical glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Container Card */}
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 p-7 sm:p-9 shadow-2xl text-slate-800">
          
          {/* HEALX Logo & App Name */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-100/80">
                <Activity className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl tracking-tight text-slate-900 font-mono">
                    HEALX
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 font-mono">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-cyan-700">
                  Precision Care Platform
                </p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mt-5 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome to HEALX
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Sign in to access your unified healthcare dashboard
              </p>
            </div>
          </div>

          {/* Two Login Options: Doctor & Patient Selector */}
          <div className="mb-5 p-1 bg-slate-100 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1">
            <button
              type="button"
              id="btn-login-role-doctor"
              onClick={() => handleRoleChange('doctor')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'doctor'
                  ? 'bg-white text-cyan-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Stethoscope className={`w-4 h-4 ${selectedRole === 'doctor' ? 'text-cyan-600' : 'text-slate-400'}`} />
              <span>Doctor Login</span>
            </button>

            <button
              type="button"
              id="btn-login-role-patient"
              onClick={() => handleRoleChange('patient')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'patient'
                  ? 'bg-white text-cyan-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className={`w-4 h-4 ${selectedRole === 'patient' ? 'text-cyan-600' : 'text-slate-400'}`} />
              <span>Patient Login</span>
            </button>
          </div>

          {/* Error Message banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Username input */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-identifier"
                className="block text-xs font-bold text-slate-700 tracking-wide uppercase font-mono"
              >
                {selectedRole === 'doctor' ? 'Doctor Email or Staff ID' : 'Patient Email or Patient ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {selectedRole === 'doctor' ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <input
                  id="input-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRole === 'doctor'
                      ? 'dr.sarah@healx.health or DOC-8821'
                      : 'alex.vance@healx.health or PX-4902'
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-400"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password input with Show/Hide option */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-password"
                  className="block text-xs font-bold text-slate-700 tracking-wide uppercase font-mono"
                >
                  Password
                </label>

                {/* Forget Password link */}
                <button
                  type="button"
                  id="btn-forgot-password-link"
                  onClick={() => {
                    setResetEmail(identifier.includes('@') ? identifier : '');
                    setResetSuccess(false);
                    setShowForgotPassword(true);
                  }}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors cursor-pointer"
                >
                  Forget Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-400"
                  autoComplete="current-password"
                  required
                />
                
                {/* Show/Hide password toggle button */}
                <button
                  type="button"
                  id="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 bg-slate-100 border-slate-300 rounded focus:ring-cyan-500"
                />
                <span className="text-xs font-medium text-slate-600">Remember this workstation</span>
              </label>

              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>HIPAA 256-bit</span>
              </span>
            </div>

            {/* Login button */}
            <button
              type="submit"
              id="btn-login-submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    Login as {selectedRole === 'doctor' ? 'Doctor' : 'Patient'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center font-mono mb-2.5">
              1-Click Demo Auto-Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-demo-doctor"
                onClick={() => handleRoleChange('doctor')}
                className={`py-2 px-2.5 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'doctor'
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-900'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span className="truncate">Dr. Sarah (MD)</span>
              </button>

              <button
                type="button"
                id="btn-demo-patient"
                onClick={() => handleRoleChange('patient')}
                className={`py-2 px-2.5 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'patient'
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-900'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span className="truncate">Alex Vance (Pt)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
          <p>© 2026 HEALX Precision Care • Enterprise Healthcare Infrastructure</p>
          <p className="text-[11px] text-slate-500">
            Need institutional access? Contact <span className="text-cyan-400 font-medium">admin@healx.health</span>
          </p>
        </div>
      </div>

      {/* Forget Password Modal Dialog */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-slate-800 space-y-4 relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Reset Credentials</h3>
                <p className="text-xs text-slate-500">HEALX Single-Sign-On Recovery</p>
              </div>
            </div>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Recovery link sent!</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  We have dispatched a temporary 6-digit recovery code and authorization link to{' '}
                  <strong className="font-mono">{resetEmail || 'your email'}</strong>. Please verify within 15 minutes.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered institutional email or patient ID. We will transmit an encrypted verification token to restore your session.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-mono">
                    Institutional Email / Patient ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="e.g. dr.sarah@healx.health"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {resetLoading ? 'Transmitting...' : 'Send Recovery Token'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
