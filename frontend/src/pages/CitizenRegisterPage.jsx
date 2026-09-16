import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building,
  Navigation,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const CitizenRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const validate = () => {
    const { name, email, phone, password, confirmPassword } = formData;

    // 1. Missing fields check
    if (!name.trim()) return 'Full Name is required';
    if (!email.trim()) return 'Email Address is required';
    if (!phone.trim()) return 'Mobile Number is required';
    if (!password) return 'Password is required';
    if (!confirmPassword) return 'Please confirm your password';

    // 2. Email format check
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'Please enter a valid email address';
    }

    // 3. Phone format check (flexible 7 to 15 digits)
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return 'Please enter a valid mobile number (at least 7 to 15 digits)';
    }

    // 4. Password length check (Firebase standard min 6 chars)
    if (password.length < 6) {
      return 'Password must contain at least 6 characters';
    }

    // 5. Password match check
    if (password !== confirmPassword) {
      return 'Password and Confirm Password do not match';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const userProfile = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setSuccessMessage(`Account created successfully for ${userProfile.name || 'Citizen'}! Redirecting to Citizen Dashboard...`);

      // Automatic redirect after brief delay to show success state
      setTimeout(() => {
        navigate('/citizen/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Citizen registration error:', err);
      setError(err.message || 'Unable to complete registration. Please check your details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0F172A] to-[#1E3A8A] p-6 text-white text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur mx-auto flex items-center justify-center mb-2 border border-sky-400/20 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-extrabold uppercase tracking-wider border border-sky-400/30">
            Official Citizen Registration
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-white">Create Citizen Account</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Join the municipal smart-city network to report and resolve public issues
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Success Message Banner */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <div className="font-bold text-sm text-emerald-900">Registration Successful</div>
                <div className="text-xs text-emerald-700 mt-0.5">{successMessage}</div>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="font-semibold">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
            {/* Full Name */}
            <div>
              <label className="block mb-1 font-bold text-slate-800">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  disabled={loading || !!successMessage}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block mb-1 font-bold text-slate-800">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  disabled={loading || !!successMessage}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 font-bold text-slate-800">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  disabled={loading || !!successMessage}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210 or +91 9876543210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-slate-800">Password (Min. 6 chars) *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    disabled={loading || !!successMessage}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-800">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    disabled={loading || !!successMessage}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all disabled:bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Account Role Badge (Fixed citizen role notice) */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between">
              <span className="font-semibold">Registered Public Role:</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-[#1E3A8A] border border-sky-200 font-extrabold uppercase text-[10px]">
                Citizen
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !!successMessage}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <span>Registering Citizen & Setting up Profile...</span>
              ) : successMessage ? (
                <span>Redirecting to Dashboard...</span>
              ) : (
                <>
                  <span>Create Citizen Account</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-blue-600 hover:text-blue-800 hover:underline">
              Citizen Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
