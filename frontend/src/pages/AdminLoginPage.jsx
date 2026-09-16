import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  User,
  Zap,
  ShieldAlert,
} from 'lucide-react';

export const AdminLoginPage = () => {
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
        throw new Error('Please enter your authorized email and password');
      }

      const user = await login(email, password, 'admin');

      // Direct to appropriate portal based on verified role
      if (user.role === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid officer credentials or access denied');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail('admin@civicresolve.demo');
    setPassword('Admin@12345');
    setError('');
  };

  const fillOfficer = () => {
    setEmail('officer@civicresolve.demo');
    setPassword('Officer@12345');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-6 text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mx-auto flex items-center justify-center mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-extrabold uppercase tracking-widest text-sky-400 border border-slate-700">
            Official Municipal Operations
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1.5 text-white">Officer & Admin Login</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Authorized administrative gateway for department leads & supervisors
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Role Switcher Tab */}
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
            <Link
              to="/login"
              className="py-2.5 rounded-lg text-slate-500 hover:text-slate-900 text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen Portal</span>
            </Link>
            <button
              type="button"
              className="py-2.5 rounded-lg bg-[#0F172A] text-white shadow-sm text-center"
            >
              Officer Portal
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
            <div>
              <label className="block mb-1.5 font-bold text-slate-800">Government Email *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@civicresolve.demo"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-slate-800">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Verifying Department Clearance...</span>
              ) : (
                <>
                  <span>Authenticate & Access Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </>
              )}
            </button>
          </form>

          {/* Hackathon Demo Credentials Box */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Hackathon Demo Officer Accounts</span>
            </div>

            {/* Admin Demo Button */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">1. Central System Administrator</div>
                <div className="font-mono text-[11px] text-slate-500">admin@civicresolve.demo</div>
              </div>
              <button
                type="button"
                onClick={fillAdmin}
                className="px-2.5 py-1 rounded-lg bg-[#0F172A] hover:bg-[#1E3A8A] text-white text-[11px] font-bold shadow-sm transition-all"
              >
                Auto-Fill Admin
              </button>
            </div>

            {/* Officer Demo Button */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">2. Public Works Department Officer</div>
                <div className="font-mono text-[11px] text-slate-500">officer@civicresolve.demo</div>
              </div>
              <button
                type="button"
                onClick={fillOfficer}
                className="px-2.5 py-1 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white text-[11px] font-bold shadow-sm transition-all"
              >
                Auto-Fill Officer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
