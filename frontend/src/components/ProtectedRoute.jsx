import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#1E3A8A] animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">Verifying security clearance & session...</p>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    const isTargetingAdmin = allowedRoles.includes('admin') || allowedRoles.includes('officer');
    return <Navigate to={isTargetingAdmin ? '/admin/login' : '/login'} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase tracking-wider">
            403 • Access Denied
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">Restricted Access</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your current account role is <span className="font-bold uppercase text-slate-800">&quot;{role}&quot;</span>. 
            You do not have the required permissions to access this administrative portal.
          </p>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to={role === 'admin' ? '/admin/dashboard' : role === 'officer' ? '/officer/dashboard' : '/citizen/dashboard'}
              className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span>Return to Your {role === 'admin' ? 'Admin' : role === 'officer' ? 'Officer' : 'Citizen'} Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
