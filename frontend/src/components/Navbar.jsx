import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  PlusCircle,
  Search,
  ListFilter,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Building2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getProfilePath = () => {
    if (role === 'admin') return '/admin/profile';
    if (role === 'officer') return '/officer/profile';
    return '/citizen/profile';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Gov Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Official Public Grievance Redressal & Smart City AI Dispatch Portal</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>Emergency Services: 112</span>
          <span>Municipal Helpline: 1913</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">CivicResolve</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Citizen Grievance Resolution</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-teal-700 bg-teal-50/80 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/citizen/report"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isActive('/citizen/report')
                  ? 'text-teal-700 bg-teal-50/80 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              <span>Report Issue</span>
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isActive('/track')
                  ? 'text-teal-700 bg-teal-50/80 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Complaint</span>
            </Link>

            {/* Citizen Links */}
            {role === 'citizen' && (
              <>
                <Link
                  to="/citizen/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/citizen/dashboard')
                      ? 'text-teal-700 bg-teal-50/80 font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/citizen/complaints"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/citizen/complaints')
                      ? 'text-teal-700 bg-teal-50/80 font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  <span>My Complaints</span>
                </Link>
              </>
            )}

            {/* Officer Link */}
            {role === 'officer' && (
              <Link
                to="/officer/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-colors ${
                  isActive('/officer')
                    ? 'text-teal-800 bg-teal-50 border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Officer Queue</span>
              </Link>
            )}

            {/* Admin Link */}
            {role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-colors ${
                  isActive('/admin')
                    ? 'text-indigo-800 bg-indigo-50 border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Admin Command</span>
              </Link>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Citizen / User Notification Bell */}
            <NotificationBell />

            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getProfilePath()}
                  title="View Profile Settings"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-800 leading-tight">
                      {currentUser.name || 'User'}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        role === 'admin' ? 'bg-indigo-500' : role === 'officer' ? 'bg-teal-500' : 'bg-emerald-500'
                      }`} />
                      <span>{role}</span>
                      {role === 'officer' && currentUser.department && (
                        <span className="text-[9px] text-slate-400 font-mono truncate max-w-[90px]">
                          ({currentUser.department.split(' ')[0]})
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Citizen Login</span>
                </Link>
                <Link
                  to="/admin/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Officer Portal</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions (Bell + Menu Toggle) */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationBell />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Home
          </Link>
          <Link
            to="/citizen/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 rounded-lg"
          >
            Report an Issue
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Track Complaint
          </Link>

          {role === 'citizen' && (
            <>
              <Link
                to="/citizen/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Citizen Dashboard
              </Link>
              <Link
                to="/citizen/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                My Complaints
              </Link>
              <Link
                to="/citizen/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                My Profile
              </Link>
            </>
          )}

          {role === 'officer' && (
            <>
              <Link
                to="/officer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-bold text-teal-700 hover:bg-teal-50 rounded-lg"
              >
                Officer Queue ({currentUser?.department || 'Department'})
              </Link>
              <Link
                to="/officer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Officer Profile
              </Link>
            </>
          )}

          {role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-50 rounded-lg"
              >
                Admin Command Center
              </Link>
              <Link
                to="/admin/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Admin Profile
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated && currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out ({currentUser.name})</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold bg-slate-100 text-slate-800 rounded-lg"
                >
                  Citizen Login / Register
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold bg-slate-900 text-white rounded-lg"
                >
                  Department Officer Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
