import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Send,
  Eye,
  MapPin,
  Calendar,
  Sparkles,
  Map as MapIcon,
  List,
  CheckSquare,
  ShieldCheck,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { MapComponent } from '../components/MapComponent';
import { api } from '../services/api';

export const OfficerDashboardPage = ({ complaints = [], onRefreshComplaints, currentUser }) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Selected complaint modal for field actions
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatusVal, setUpdateStatusVal] = useState('');
  const [remarksVal, setRemarksVal] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Department of the current officer
  const departmentName = currentUser?.department || 'Public Works Department (PWD)';

  // Filter complaints strictly assigned to this officer's department
  // If complaint has no department assigned, or matches officer's department
  const deptComplaints = complaints.filter(
    (c) => (c.department || '').toLowerCase() === departmentName.toLowerCase() ||
           (!c.department && departmentName.includes('PWD'))
  );

  // Statistics specific to this department
  const totalAssigned = deptComplaints.length;
  const pendingCount = deptComplaints.filter((c) => (c.status || '').toLowerCase() === 'pending').length;
  const inProgressCount = deptComplaints.filter((c) => (c.status || '').toLowerCase() === 'in progress').length;
  const resolvedCount = deptComplaints.filter((c) => (c.status || '').toLowerCase() === 'resolved').length;
  const criticalCount = deptComplaints.filter(
    (c) => (c.priority || '').toLowerCase() === 'critical' && (c.status || '').toLowerCase() !== 'resolved'
  ).length;

  // Filtered by user search and filters
  const filteredComplaints = deptComplaints.filter((c) => {
    const matchesSearch = !searchQuery || (
      c.complaintId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesPri = filterPriority === 'All' || c.priority === filterPriority;
    const matchesStat = filterStatus === 'All' || c.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesPri && matchesStat;
  });

  const handleOpenDetails = (c) => {
    setSelectedComplaint(c);
    setUpdateStatusVal(c.status);
    setRemarksVal('');
    setFeedbackMsg('');
  };

  const handleUpdateStatus = async (forcedStatus = null) => {
    if (!selectedComplaint) return;
    setIsUpdating(true);
    setFeedbackMsg('');

    const targetStatus = forcedStatus || updateStatusVal;
    try {
      if (targetStatus && targetStatus !== selectedComplaint.status) {
        await api.updateStatus(selectedComplaint.complaintId, targetStatus, remarksVal || `Status changed to ${targetStatus} by Officer ${currentUser?.name || 'In-Charge'}`);
        if (targetStatus === 'Resolved') {
          setFeedbackMsg('✅ Grievance resolved! Automated notifications dispatched to citizen via Email, SMS, and In-App.');
        } else {
          setFeedbackMsg(`✅ Status changed to "${targetStatus}". Automated updates dispatched via Email, SMS & In-App.`);
        }
      } else if (remarksVal) {
        await api.addRemarks(selectedComplaint.complaintId, `[${currentUser?.name || 'Officer'} Remark]: ${remarksVal}`);
        setFeedbackMsg('✅ Field inspection remark saved successfully!');
      }

      if (onRefreshComplaints) onRefreshComplaints();

      setTimeout(() => {
        setSelectedComplaint(null);
      }, 1800);
    } catch (err) {
      setFeedbackMsg('❌ Failed to update status: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Officer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Department Field Portal
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Authorized Officer Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {departmentName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Logged in as <span className="text-white font-bold">{currentUser?.name || 'Department Officer'}</span> ({currentUser?.email}). Inspect complaints, assign field maintenance crews, and verify resolution.
          </p>
        </div>

        {/* View Switcher: List vs Map */}
        <div className="flex rounded-xl bg-slate-800/90 p-1 text-xs font-bold text-slate-300 border border-slate-700 self-start md:self-center">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'list' ? 'bg-teal-600 text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Complaint Queue</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'map' ? 'bg-teal-600 text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Department GIS Map</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalAssigned}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total in department</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{pendingCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting inspection</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-600 mt-2">{inProgressCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Field crew deployed</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{resolvedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Successfully closed</div>
        </div>

        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-sm col-span-2 lg:col-span-1 bg-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Critical / Urgent</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{criticalCount}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-0.5">Requires immediate action</div>
        </div>
      </div>

      {/* Main Content: List or Map */}
      {activeTab === 'map' ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Geographic Dispersion of Department Issues</h2>
              <p className="text-xs text-slate-500">Live coordinates of all grievances assigned to {departmentName}</p>
            </div>
            <button
              onClick={onRefreshComplaints}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Map</span>
            </button>
          </div>
          <div className="h-[500px] rounded-2xl overflow-hidden border border-slate-200">
            <MapComponent
              complaints={deptComplaints}
              onSelectComplaint={(c) => handleOpenDetails(c)}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, keyword, citizen, address..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 text-[11px]">Priority:</span>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="All">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium">
                <span className="text-slate-500 text-[11px]">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button
                onClick={onRefreshComplaints}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                title="Refresh Grievance Records"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grievance Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Grievance ID</th>
                  <th className="py-3.5 px-4">Issue Details</th>
                  <th className="py-3.5 px-4">Citizen & Location</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Reported</th>
                  <th className="py-3.5 px-4 text-right">Field Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-slate-600">No grievances match the current filter</p>
                      <p className="text-[11px] mt-0.5">All tickets for {departmentName} are cleared or filtered out.</p>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr key={c.complaintId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {c.complaintId}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-800 line-clamp-1">{c.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{c.description}</div>
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{c.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{c.citizenName || 'Anonymous Citizen'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">{c.address || 'Location on map'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetails(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect / Update</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail & Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {selectedComplaint.complaintId}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Field Grievance Inspection
                </h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Complaint summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{selectedComplaint.title}</h3>
                <div className="flex items-center gap-1.5">
                  <PriorityBadge priority={selectedComplaint.priority} />
                  <StatusBadge status={selectedComplaint.status} />
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedComplaint.description}</p>
              
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-200/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {selectedComplaint.address || 'Address provided'}
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  Citizen: {selectedComplaint.citizenName} ({selectedComplaint.citizenPhone || 'N/A'})
                </span>
              </div>
            </div>

            {/* AI Summary note if available */}
            {selectedComplaint.aiAnalysis && (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  AI Triage Insights
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="font-semibold">Category:</span> {selectedComplaint.aiAnalysis.category}</div>
                  <div><span className="font-semibold">Severity:</span> {selectedComplaint.aiAnalysis.severity} / 10</div>
                  <div><span className="font-semibold">Est. Turnaround:</span> {selectedComplaint.aiAnalysis.estimatedResolutionDays || 3} days</div>
                  <div><span className="font-semibold">Department:</span> {selectedComplaint.department}</div>
                </div>
              </div>
            )}

            {/* Action Form */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Update Work Order & Redressal Status
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grievance Status
                  </label>
                  <select
                    value={updateStatusVal}
                    onChange={(e) => setUpdateStatusVal(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Pending">Pending (Inspection Scheduled)</option>
                    <option value="In Progress">In Progress (Field Work Active)</option>
                    <option value="Resolved">Resolved (Work Completed)</option>
                    <option value="Rejected">Rejected (Out of Municipal Scope)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Department
                  </label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 truncate">
                    {departmentName}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Field Inspection & Resolution Remarks
                </label>
                <textarea
                  rows={3}
                  value={remarksVal}
                  onChange={(e) => setRemarksVal(e.target.value)}
                  placeholder="e.g. Dispatched asphalt repair team. Pothole filled and road leveled on 16 Sep."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {feedbackMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  feedbackMsg.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {feedbackMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('Resolved')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus()}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Save Update</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerDashboardPage;
