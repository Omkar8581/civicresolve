import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  MapPin,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { MapComponent } from '../components/MapComponent';
import { api } from '../services/api';

export const TrackingPage = ({ initialComplaintId, complaints = [] }) => {
  const params = useParams();
  const effectiveId = params?.id || initialComplaintId;
  const [searchId, setSearchId] = useState(effectiveId || (complaints[0]?.complaintId || ''));
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const TIMELINE_STEPS = [
    { title: 'Complaint Submitted', desc: 'Registered in civic grievance system' },
    { title: 'AI Analysis Completed', desc: 'NLP severity and category determined' },
    { title: 'Assigned to Department', desc: 'Routed to relevant division' },
    { title: 'Under Review', desc: 'Field inspection officer assigned' },
    { title: 'Work in Progress', desc: 'Active maintenance underway' },
    { title: 'Resolved', desc: 'Verified and signed off by supervisor' },
  ];

  const getStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') return 5;
    if (s === 'in progress') return 4;
    if (s === 'under review') return 3;
    if (s === 'assigned') return 2;
    if (s === 'pending') return 1;
    return 0;
  };

  const loadComplaint = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setNotFound(false);

    try {
      // First check in-memory list
      const local = complaints.find(c => c.complaintId.toLowerCase() === idToFetch.toLowerCase());
      if (local) {
        setComplaint(local);
        setLoading(false);
        return;
      }

      // Or fetch from API
      const data = await api.getComplaint(idToFetch);
      setComplaint(data);
    } catch (err) {
      setNotFound(true);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveId) {
      setSearchId(effectiveId);
      loadComplaint(effectiveId);
    } else if (complaints.length > 0) {
      loadComplaint(complaints[0].complaintId);
    }
  }, [effectiveId, complaints]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadComplaint(searchId.trim());
  };

  const currentStep = complaint ? getStepIndex(complaint.status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Your Grievance Status</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
          Enter your unique Grievance Reference ID to view live resolution milestones, field officer assignments, and inspection logs.
        </p>

        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Complaint ID (e.g. CR-2025-1001)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm bg-white shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
          >
            <span>{loading ? 'Searching...' : 'Track'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick sample chips */}
        {complaints.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-500">
            <span>Quick Samples:</span>
            {complaints.slice(0, 3).map(c => (
              <button
                key={c.complaintId}
                onClick={() => {
                  setSearchId(c.complaintId);
                  loadComplaint(c.complaintId);
                }}
                className="font-mono text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200"
              >
                {c.complaintId}
              </button>
            ))}
          </div>
        )}
      </div>

      {notFound && (
        <div className="p-6 text-center bg-white border border-slate-200 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">Complaint Record Not Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Please verify the Complaint ID &quot;{searchId}&quot; and try again.
          </p>
        </div>
      )}

      {/* Complaint Details Card */}
      {complaint && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden space-y-6">
          {/* Header Banner */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-base font-extrabold text-slate-900">{complaint.complaintId}</span>
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{complaint.title}</h2>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Filed on: <span className="font-semibold text-slate-700">{new Date(complaint.createdAt).toLocaleDateString()}</span></div>
              <div>Last update: <span className="font-semibold text-slate-700">{new Date(complaint.updatedAt).toLocaleString()}</span></div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Resolution Progress Timeline</h3>
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.title} className="flex md:flex-col items-center gap-3 md:text-center flex-1 relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                        isPassed
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isCurrent ? 'text-teal-700' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                        {step.title}
                      </div>
                      <div className="text-[10px] text-slate-500 hidden md:block mt-0.5 leading-tight">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Details Grid */}
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left: Metadata and AI Summary */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Complaint Information</h4>
                <div>
                  <span className="text-slate-500 block text-[11px]">Category</span>
                  <span className="font-bold text-slate-900 text-sm">{complaint.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Assigned Department</span>
                  <span className="font-bold text-teal-800 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{complaint.department}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Description</span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">{complaint.description}</p>
                </div>
              </div>

              {/* AI Summary Card */}
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-1">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">AI Classification Insight</span>
                <p className="text-xs text-teal-900 italic font-medium leading-relaxed">
                  &quot;{complaint.aiSummary}&quot;
                </p>
                <div className="text-[10px] text-teal-700 pt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified by CivicResolve NLP Engine</span>
                </div>
              </div>

              {/* Officer Remarks */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Department Officer Remarks</span>
                <p className="text-xs text-amber-950 font-medium">
                  {complaint.officerRemarks || 'Pending assignment to field team.'}
                </p>
              </div>
            </div>

            {/* Right: Location Map & Evidence Photo */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Location Map</span>
                  </span>
                  <span className="text-slate-500 text-[11px] truncate max-w-xs">{complaint.address}</span>
                </div>
                <MapComponent
                  complaints={[complaint]}
                  center={[complaint.latitude, complaint.longitude]}
                  zoom={14}
                  height="200px"
                />
              </div>

              {/* Uploaded Evidence Image */}
              {complaint.imageUrl && (
                <div>
                  <span className="block text-xs font-bold text-slate-800 mb-1.5">Submitted Evidence Photo</span>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 max-h-48">
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint Evidence"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
