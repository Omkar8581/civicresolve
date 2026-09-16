import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  RefreshCw,
  Mail,
  Smartphone,
  ShieldCheck,
  Check,
  ExternalLink,
  X,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const NotificationBell = ({ onSelectComplaint }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userId = currentUser?.uid || currentUser?.id || 'citizen_demo_1';
  const userEmail = currentUser?.email || 'aarav.sharma@example.com';

  // Fetch notifications from API
  const fetchNotifications = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await api.getNotifications(userId, userEmail);
      if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial fetch and auto-polling every 15 seconds
  useEffect(() => {
    fetchNotifications(true);
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [userId, userEmail]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Mark single notification read
  const handleMarkAsRead = async (notificationId, e) => {
    if (e) e.stopPropagation();
    try {
      await api.markNotificationRead(notificationId, userId);
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Mark all notifications read
  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead(userId, userEmail);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Click on notification to navigate to related complaint
  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await handleMarkAsRead(notif.notificationId);
    }
    setIsOpen(false);
    if (onSelectComplaint) {
      onSelectComplaint(notif.complaintId);
    }
    navigate(`/track/${encodeURIComponent(notif.complaintId)}`);
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const diff = Math.floor((new Date() - new Date(isoString)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'resolved':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'status_changed':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
        );
      case 'assigned':
        return (
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
      case 'submitted':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className={`relative p-2 rounded-xl border transition-all ${
          isOpen
            ? 'bg-sky-50 border-sky-300 text-blue-900 shadow-sm'
            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-rose-600 rounded-full shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  title="Mark all as read"
                  className="text-[11px] text-sky-300 hover:text-white transition-colors flex items-center gap-1 font-medium hover:underline"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-3 py-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>

            <button
              onClick={() => fetchNotifications(true)}
              title="Refresh notifications"
              className="ml-auto p-1 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-700' : ''}`} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Inbox className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-500" />
                <p className="text-xs font-semibold text-slate-600">No notifications found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {filter === 'unread' ? 'All caught up! No unread messages.' : 'Status changes and grievance updates will appear here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.notificationId}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 flex gap-3 transition-colors cursor-pointer hover:bg-slate-50 relative ${
                    !n.read ? 'bg-sky-50/40' : 'bg-white'
                  }`}
                >
                  {/* Left Icon */}
                  {getEventIcon(n.type)}

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'} line-clamp-1`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap flex-shrink-0">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>

                    {/* Meta bar: Complaint ID + Channel badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                        {n.complaintId}
                      </span>

                      {/* Channels Sent */}
                      {n.channels?.includes('email') && (
                        <span
                          title={`Email Notification: ${n.deliveryStatus?.email || 'sent'}`}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold"
                        >
                          <Mail className="w-2.5 h-2.5" /> Email
                        </span>
                      )}

                      {n.channels?.includes('sms') && (
                        <span
                          title={`SMS Notification: ${n.deliveryStatus?.sms || 'sent'}`}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold"
                        >
                          <Smartphone className="w-2.5 h-2.5" /> SMS
                        </span>
                      )}

                      {n.channels?.includes('in_app') && (
                        <span
                          title="In-App Notification: Stored in Firestore"
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold"
                        >
                          <Bell className="w-2.5 h-2.5" /> In-App
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Status Dot & Mark as Read */}
                  {!n.read && (
                    <div className="flex flex-col items-center justify-between pl-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <button
                        onClick={(e) => handleMarkAsRead(n.notificationId, e)}
                        title="Mark as read"
                        className="text-[10px] text-slate-400 hover:text-blue-800 p-1"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/citizen/dashboard');
              }}
              className="text-[11px] font-bold text-blue-900 hover:text-blue-950 inline-flex items-center gap-1"
            >
              <span>View Activity Log in Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
