import React, { useState } from 'react';
import {
  FileText,
  Search,
  MapPin,
  Eye,
  Calendar,
  Filter,
  PlusCircle,
  Building2,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

export const MyComplaintsPage = ({ complaints, currentUser, setView, setSelectedComplaintId }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints for this citizen if logged in
  const userComplaints = currentUser
    ? complaints.filter(c => c.userId === currentUser.uid || c.userId === currentUser.id || (currentUser.email && c.citizenEmail && currentUser.email.toLowerCase() === c.citizenEmail.toLowerCase()))
    : complaints;

  const filtered = userComplaints.filter(c => {
    const matchesStatus = filterStatus === 'All' ? true : c.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = searchQuery === '' ? true : (
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesStatus && matchesSearch;
  });

  const handleSelectComplaint = (id) => {
    setSelectedComplaintId(id);
    setView('track');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Registered Complaints</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review status changes, department assignments, and resolution notes for your reported grievances.
          </p>
        </div>
        <button
          onClick={() => setView('report')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md shadow-slate-900/15 transition-colors flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-sky-400" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs font-semibold">
          {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === tab
                  ? 'bg-[#1E3A8A] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, keyword, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Complaints Grid/List */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No complaints found</h3>
          <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.complaintId}
              onClick={() => handleSelectComplaint(c.complaintId)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200 p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{c.complaintId}</span>
                  <StatusBadge status={c.status} />
                </div>

                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-900 transition-colors line-clamp-1 mb-1">
                  {c.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2 mb-3 leading-relaxed">
                  {c.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                    <span className="truncate">{c.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <PriorityBadge priority={c.priority} />
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                  <span>Track Details</span>
                  <Eye className="w-3.5 h-3.5 text-blue-700" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
