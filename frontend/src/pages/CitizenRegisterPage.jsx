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
    address: '',
    city: '',
    state: '',
  });

  const [error, setError] = useState('');
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
    const { name, email, phone, password, confirmPassword, address, city, state } = formData;

    // Required fields check
    if (!name.trim()) return 'Full Name is required';
    if (!email.trim()) return 'Email Address is required';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email address';
    if (!phone.trim()) return 'Mobile Number is required';
    if (!phone.replace(/\D/g, '').match(/^\d{10}$/)) return 'Please enter a valid 10-digit mobile number';
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must contain at least 8 characters';
    if (password !== confirmPassword) return 'Password and Confirm Password do not match';
    if (!address.trim()) return 'Street Address is required';
    if (!city.trim()) return 'City is required';
    if (!state.trim()) return 'State is required';

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

    try {
      await register(formData);
      navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
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
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
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
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-slate-800">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-800">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-slate-800">Password (Min. 8 chars) *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
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
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 font-bold text-slate-800">Street / Residential Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat/House No., Street Name, Neighborhood"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-slate-800">City *</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. New Delhi"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-800">State / Region *</label>
                <div className="relative">
                  <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Delhi"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.99]"
            >
              {loading ? (
                <span>Registering Citizen & Setting up Profile...</span>
              ) : (
                <>
                  <span>Create Account & Open Dashboard</span>
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
