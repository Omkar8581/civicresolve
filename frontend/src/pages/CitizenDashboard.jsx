import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Clock,
  RefreshCw,
  CheckCircle2,
  FileText,
  MapPin,
  ArrowRight,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Mail,
  Smartphone,
  Check,
  Inbox,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { NotificationBell } from '../components/NotificationBell';
import { api } from '../services/api';

export const CitizenDashboard = ({ complaints, currentUser, setView, setSelectedComplaintId }) => {
  // Filter complaints for this citizen if logged in, or show active citizen complaints
  const userComplaints = currentUser
    ? complaints.filter(c => c.userId === currentUser.uid || c.userId === currentUser.id || (currentUser.email && c.citizenEmail && currentUser.email.toLowerCase() === c.citizenEmail.toLowerCase()))
    : complaints;

  const total = userComplaints.length;
  const pending = userComplaints.filter(c => c.status === 'Pending').length;
  const inProgress = userComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Under Review').length;
  const resolved = userComplaints.filter(c => c.status === 'Resolved').length;

  // In-app Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeNotifFilter, setActiveNotifFilter] = useState('all'); // 'all' | 'unread'
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const userId = currentUser?.uid || currentUser?.id || 'citizen_demo_1';
  const userEmail = currentUser?.email || 'aarav.sharma@example.com';

  const fetchUserNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const res = await api.getNotifications(userId, userEmail);
      if (res && res.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Dashboard notification load note:', err.message);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
    const timer = setInterval(fetchUserNotifications, 20000);
    return () => clearInterval(timer);
  }, [userId, userEmail]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationRead(notificationId, userId);
      setNotifications(prev =>
        prev.map(n => n.notificationId === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead(userId, userEmail);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const handleViewDetails = (id) => {
    setSelectedComplaintId(id);
    setView('track');
  };

  const filteredNotifs = activeNotifFilter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F8FAFC]">
      {/* Top Banner with Action & Notification Bell */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0F172A] to-[#1E3A8A] text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-sky-300 text-xs font-bold uppercase tracking-wider border border-white/10">
              Citizen Dashboard
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-extrabold animate-pulse">
                {unreadCount} Unread Notifications
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Welcome back, {currentUser?.name || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Track your ongoing public grievance filings, monitor department progress, and receive live SMS, Email, and In-App resolution alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell in Dashboard */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-1 border border-white/20">
            <NotificationBell onSelectComplaint={(id) => handleViewDetails(id)} />
          </div>

          <button
            onClick={() => setView('report')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#0F172A] font-bold text-sm shadow-md hover:bg-slate-100 transition-all active:scale-95 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-sky-500" />
            <span>Report New Issue</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Complaints</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Action</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{pending}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{inProgress}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Resolved</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{resolved}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Recent Complaints</h2>
            <p className="text-xs text-[#64748B]">Overview of your submitted issues and current field status</p>
          </div>
          <button
            onClick={() => setView('my-complaints')}
            className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {userComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm">No complaints submitted yet.</p>
            <p className="text-xs text-slate-400 mt-1">Have you spotted an issue in your area? Report it to start tracking.</p>
            <button
              onClick={() => setView('report')}
              className="mt-4 px-4 py-2 bg-[#0F172A] hover:bg-[#1E3A8A] text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              Report Your First Issue
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[#0F172A] font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Complaint ID</th>
                  <th className="p-4">Category & Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userComplaints.slice(0, 6).map((c) => (
                  <tr key={c.complaintId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {c.complaintId}
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-slate-800">{c.category}</div>
                      <div className="text-slate-500 truncate">{c.title}</div>
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 max-w-[180px] truncate text-slate-600" title={c.address}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{c.address}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewDetails(c.complaintId)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 font-bold hover:bg-blue-100/80 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-700" />
                        <span>Track</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notification & Multi-Channel Dispatch History */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-800" />
              <h2 className="text-base font-bold text-[#0F172A]">Notification & Activity History</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live audit record of all automated Email, SMS, and In-App notifications sent to your registered contact points
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveNotifFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeNotifFilter === 'all' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveNotifFilter('unread')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeNotifFilter === 'unread' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-blue-900 flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        </div>

        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Inbox className="w-12 h-12 mx-auto mb-2 opacity-30 text-slate-500" />
            <p className="text-sm font-semibold text-slate-700">No notifications in this view</p>
            <p className="text-xs text-slate-400 mt-1">
              Whenever an officer reviews, assigns, or resolves your grievances, automated alerts will be logged here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifs.map((n) => (
              <div
                key={n.notificationId}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/80 ${
                  !n.read ? 'bg-sky-50/40' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-1">
                    {n.type === 'resolved' ? (
                      <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : n.type === 'status_changed' ? (
                      <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                    ) : n.type === 'assigned' ? (
                      <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0F172A]">{n.title}</span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" title="Unread"></span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>

                    {/* Channels & Delivery metadata */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Dispatched Via:
                      </span>

                      {n.channels?.includes('email') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                          <Mail className="w-3 h-3 text-blue-700" />
                          <span>Email ({n.deliveryStatus?.email || 'delivered'})</span>
                        </span>
                      )}

                      {n.channels?.includes('sms') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <Smartphone className="w-3 h-3 text-emerald-600" />
                          <span>SMS ({n.deliveryStatus?.sms || 'delivered'})</span>
                        </span>
                      )}

                      {n.channels?.includes('in_app') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                          <Bell className="w-3 h-3 text-amber-600" />
                          <span>In-App (Saved)</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => handleViewDetails(n.complaintId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs transition-colors"
                  >
                    <span>Track {n.complaintId}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </button>

                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.notificationId)}
                      title="Mark as read"
                      className="p-1.5 text-slate-400 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
