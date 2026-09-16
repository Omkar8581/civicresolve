import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await resetPassword(email);
      setMessage(res.message || 'Password reset link has been dispatched to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0F172A] to-[#1E3A8A] p-6 text-white text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur mx-auto flex items-center justify-center mb-2 border border-sky-400/20 shadow-sm">
            <KeyRound className="w-6 h-6 text-sky-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Reset Password</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            We will send you a secure Firebase link to reset your account password
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {message && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Reset Email Dispatched</div>
                <div className="mt-0.5">{message}</div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!message ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block mb-1.5 font-bold text-slate-800">Your Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? 'Sending Reset Link...' : 'Send Password Reset Email'}
              </button>
            </form>
          ) : (
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Citizen Login</span>
              </Link>
            </div>
          )}

          {!message && (
            <div className="text-center pt-2 text-xs">
              <Link to="/login" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
