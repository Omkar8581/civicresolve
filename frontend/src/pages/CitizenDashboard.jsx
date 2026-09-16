import React from 'react';
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
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

export const CitizenDashboard = ({ complaints, currentUser, setView, setSelectedComplaintId }) => {
  // Filter complaints for this citizen if logged in, or show active citizen complaints
  const userComplaints = currentUser
    ? complaints.filter(c => c.userId === currentUser.uid || c.userId === currentUser.id || (currentUser.email && c.citizenEmail && currentUser.email.toLowerCase() === c.citizenEmail.toLowerCase()))
    : complaints;

  const total = userComplaints.length;
  const pending = userComplaints.filter(c => c.status === 'Pending').length;
  const inProgress = userComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Under Review').length;
  const resolved = userComplaints.filter(c => c.status === 'Resolved').length;

  const handleViewDetails = (id) => {
    setSelectedComplaintId(id);
    setView('track');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white shadow-md">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            Citizen Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1.5 tracking-tight">
            Welcome back, {currentUser?.name || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            Track your ongoing public grievance filings, monitor department progress, and file new issues directly to civic authorities.
          </p>
        </div>
        <button
          onClick={() => setView('report')}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-teal-800 font-bold text-sm shadow-md hover:bg-teal-50 transition-all active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-teal-600" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Complaints</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Action</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{pending}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{inProgress}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
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
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
            <p className="text-xs text-slate-500">Overview of your submitted issues and current status</p>
          </div>
          <button
            onClick={() => setView('my-complaints')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
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
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold shadow hover:bg-teal-700 transition-colors"
            >
              Report Your First Issue
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 font-bold hover:bg-teal-100/80 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
    </div>
  );
};
