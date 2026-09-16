import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Building2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const CitizenLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        throw new Error('Please enter both your email address and password');
      }

      await login(email, password, 'citizen');
      navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCitizen = () => {
    setEmail('citizen@civicresolve.demo');
    setPassword('Citizen@12345');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0F172A] to-[#1E3A8A] p-6 text-white text-center relative border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur mx-auto flex items-center justify-center mb-2 shadow-inner border border-white/10">
            <User className="w-6 h-6 text-sky-400" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-extrabold uppercase tracking-wider text-sky-300 border border-white/10">
            Citizen Grievance Redressal
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1.5">CivicResolve</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            AI-Powered Citizen Grievance Resolution
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Dual Role Switcher Tab */}
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
            <button
              type="button"
              className="py-2.5 rounded-lg bg-white text-blue-900 shadow-sm text-center"
            >
              Citizen Login
            </button>
            <Link
              to="/admin/login"
              className="py-2.5 rounded-lg text-slate-500 hover:text-slate-900 text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Officer Portal</span>
            </Link>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
            <div>
              <label className="block mb-1.5 font-bold text-slate-800">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-800">Password *</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-bold text-blue-900 hover:text-blue-950"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
            >
              {loading ? (
                <span>Authenticating with Firebase...</span>
              ) : (
                <>
                  <span>Login to Citizen Portal</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </>
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="text-center pt-2 text-xs text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-extrabold text-blue-900 hover:underline">
              Register as Citizen
            </Link>
          </div>

          {/* Hackathon Demo Credentials Section */}
          <div className="pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950 text-[11px] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-sky-500 fill-current" />
                  <span>DEMO CITIZEN CREDENTIALS</span>
                </span>
                <button
                  type="button"
                  onClick={fillDemoCitizen}
                  className="text-[10px] font-bold text-blue-900 bg-blue-100 hover:bg-blue-200/80 px-2 py-0.5 rounded transition-colors"
                >
                  ⚡ Auto-Fill
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-600">
                Email: <span className="font-bold text-slate-900">citizen@civicresolve.demo</span>
              </div>
              <div className="font-mono text-[11px] text-slate-600">
                Password: <span className="font-bold text-slate-900">Citizen@12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
