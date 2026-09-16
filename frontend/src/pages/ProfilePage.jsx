import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Navigation,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Save,
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateProfile, role } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCitizen = role === 'citizen';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      await updateProfile(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-700">
              Account Management
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {isCitizen ? 'Citizen Profile' : `${role === 'admin' ? 'System Administrator' : 'Department Officer'} Profile`}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isCitizen
              ? 'Update your personal contact details and residential jurisdiction'
              : 'Verified government official record and municipal department clearance'}
          </p>
        </div>

        <Link
          to={role === 'admin' ? '/admin/dashboard' : role === 'officer' ? '/officer/dashboard' : '/citizen/dashboard'}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile changes successfully saved to your Firestore account!</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F172A] to-[#1E3A8A] text-white flex items-center justify-center font-extrabold text-2xl shadow-md border border-slate-700/20">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-50 text-[#1E3A8A] border border-sky-200 font-semibold">
                {role}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">{currentUser?.email}</div>
            {!isCitizen && currentUser?.department && (
              <div className="text-xs font-bold text-[#1E3A8A] mt-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>{currentUser.department}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block mb-1.5 font-bold text-slate-800">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  disabled={!isCitizen}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-50 disabled:text-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email (Read Only as required) */}
            <div>
              <label className="block mb-1.5 font-bold text-slate-800">
                Email Address <span className="text-[10px] text-slate-400 font-normal">(Cannot be changed directly)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-mono cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1.5 font-bold text-slate-800">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  disabled={!isCitizen}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-50 disabled:text-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Role / Dept */}
            <div>
              <label className="block mb-1.5 font-bold text-slate-800">System Role & Department</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  disabled
                  value={`${role?.toUpperCase()} • ${currentUser?.department || 'Citizen Registry'}`}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-semibold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Citizen Residential Info */}
          {isCitizen && (
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Residential & Jurisdiction Location
              </h3>

              <div>
                <label className="block mb-1.5 font-bold text-slate-800">Street / Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold text-slate-800">City</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-slate-800">State / Region</label>
                  <div className="relative">
                    <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md shadow-slate-900/10 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5 text-sky-400" />
                  <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
