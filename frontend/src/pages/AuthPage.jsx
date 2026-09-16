import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const AuthPage = ({ setView, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');

        const res = await api.register(name, email, phone, password);
        onLoginSuccess(res.user);
        setView('dashboard');
      } else {
        if (!email.trim()) throw new Error('Please enter your email');
        if (!password) throw new Error('Please enter your password');

        const res = await api.login(email, password, 'citizen');
        onLoginSuccess(res.user);
        setView('dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCitizen = () => {
    setEmail('aarav.sharma@example.com');
    setPassword('demo123');
    setIsRegister(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0F172A] to-[#1E3A8A] p-6 text-white text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur mx-auto flex items-center justify-center mb-2 border border-sky-400/20 shadow-sm">
            <User className="w-6 h-6 text-sky-400" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Citizen Portal</h2>
          <p className="text-xs text-slate-300 mt-1">
            {isRegister ? 'Register your official citizen account' : 'Sign in to file and track your civic complaints'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Toggle tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-colors ${!isRegister ? 'bg-white text-[#0F172A] shadow-sm font-extrabold' : 'hover:text-slate-900'}`}
            >
              Citizen Login
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-colors ${isRegister ? 'bg-white text-[#0F172A] shadow-sm font-extrabold' : 'hover:text-slate-900'}`}
            >
              New Registration
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
            {isRegister && (
              <div>
                <label className="block mb-1.5 font-bold text-slate-800">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1.5 font-bold text-slate-800">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block mb-1.5 font-bold text-slate-800">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1.5 font-bold text-slate-800">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Complete Registration' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Citizen Login button */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={fillDemoCitizen}
              className="text-xs font-semibold text-[#1E3A8A] hover:text-blue-900 bg-sky-50 hover:bg-sky-100/70 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              ⚡ Fill Demo Citizen Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
