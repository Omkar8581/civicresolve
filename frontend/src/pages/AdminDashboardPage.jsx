import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  Filter,
  Search,
  Layers,
  ChevronDown,
  X,
  Send,
  Eye,
  Calendar,
  Sparkles,
  BarChart3,
  Map,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { MapComponent } from '../components/MapComponent';
import { api } from '../services/api';

export const AdminDashboardPage = ({ complaints, onRefreshComplaints, currentUser }) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'map'
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');

  // Selected complaint modal for details & dispatch actions
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatusVal, setUpdateStatusVal] = useState('');
  const [assignDeptVal, setAssignDeptVal] = useState('');
  const [remarksVal, setRemarksVal] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const DEPARTMENTS = [
    "Public Works Department (PWD)",
    "Municipal Solid Waste Management",
    "Electrical & Streetlighting Division",
    "City Water Supply & Sewerage Board",
    "Stormwater & Drainage Department",
    "Parks & Public Facilities Department",
    "Traffic Police & Urban Transit Authority",
    "State Electricity Distribution Board",
    "General Civic Grievance Cell"
  ];

  const CATEGORIES = [
    "Road Damage",
    "Garbage/Waste",
    "Streetlight",
    "Water Supply",
    "Drainage",
    "Public Infrastructure",
    "Traffic/Safety",
    "Electricity"
  ];

  // Load stats
  const fetchStats = async () => {
    try {
      const s = await api.getStats();
      setStats(s);
    } catch (e) {
      console.warn('Could not load stats:', e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [complaints]);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = !searchQuery || (
      c.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesCat = filterCategory === 'All' || c.category === filterCategory;
    const matchesPri = filterPriority === 'All' || c.priority === filterPriority;
    const matchesStat = filterStatus === 'All' || c.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesDept = filterDepartment === 'All' || c.department === filterDepartment;

    return matchesSearch && matchesCat && matchesPri && matchesStat && matchesDept;
  });

  // Open modal
  const handleOpenDetails = (c) => {
    setSelectedComplaint(c);
    setUpdateStatusVal(c.status);
    setAssignDeptVal(c.department);
    setRemarksVal('');
    setFeedbackMsg('');
  };

  // Perform Admin Action: Change status, department, and add remarks
  const handleSaveActions = async () => {
    if (!selectedComplaint) return;
    setIsUpdating(true);
    setFeedbackMsg('');

    try {
      // 1. Status update
      if (updateStatusVal && updateStatusVal !== selectedComplaint.status) {
        await api.updateStatus(selectedComplaint.complaintId, updateStatusVal, remarksVal);
      }
      // 2. Department assignment
      if (assignDeptVal && assignDeptVal !== selectedComplaint.department) {
        await api.assignDepartment(selectedComplaint.complaintId, assignDeptVal, remarksVal);
      } else if (remarksVal && (!updateStatusVal || updateStatusVal === selectedComplaint.status)) {
        await api.addRemarks(selectedComplaint.complaintId, remarksVal);
      }

      setFeedbackMsg('✅ Complaint record and dispatch status updated successfully.');
      onRefreshComplaints();
      fetchStats();

      setTimeout(() => {
        setSelectedComplaint(null);
      }, 1000);
    } catch (err) {
      setFeedbackMsg('❌ Failed to update complaint: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-widest">
              Officer Operations
            </span>
            <span className="text-xs text-slate-500 font-semibold">City Command & Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Grievance Management Dashboard
          </h1>
        </div>

        {/* View Switcher: List vs Map */}
        <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'list' ? 'bg-white text-teal-800 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Complaint Records</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'map' ? 'bg-white text-teal-800 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4 text-teal-600" />
            <span>GIS Map View</span>
          </button>
        </div>
      </div>

      {/* Top 5 Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Complaints</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats ? stats.total : complaints.length}</div>
          <span className="text-[10px] text-slate-400">All registered incidents</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Assignment</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {stats ? stats.pending : complaints.filter(c => c.status === 'Pending').length}
          </div>
          <span className="text-[10px] text-slate-400">Requires triage review</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">In Progress</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {stats ? stats.inProgress : complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Pending').length}
          </div>
          <span className="text-[10px] text-slate-400">Field work dispatched</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Resolved</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {stats ? stats.resolved : complaints.filter(c => c.status === 'Resolved').length}
          </div>
          <span className="text-[10px] text-slate-400">Signed off & closed</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">High Priority</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {stats ? stats.highPriority : complaints.filter(c => c.priority === 'High').length}
          </div>
          <span className="text-[10px] text-slate-400">Critical safety hazards</span>
        </div>
      </div>

      {/* Analytics Visual Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* By Category */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span>Complaints by Category</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </h3>
          <div className="space-y-2 text-xs">
            {CATEGORIES.slice(0, 5).map((cat) => {
              const count = complaints.filter(c => c.category === cat).length;
              const pct = complaints.length ? Math.round((count / complaints.length) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{cat}</span>
                    <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span>Complaints by Status</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </h3>
          <div className="space-y-2.5 text-xs">
            {['Pending', 'Assigned', 'In Progress', 'Resolved'].map((stat) => {
              const count = complaints.filter(c => c.status.toLowerCase() === stat.toLowerCase()).length;
              const pct = complaints.length ? Math.round((count / complaints.length) * 100) : 0;
              let barColor = 'bg-amber-500';
              if (stat === 'Resolved') barColor = 'bg-emerald-500';
              else if (stat === 'In Progress' || stat === 'Assigned') barColor = 'bg-blue-500';

              return (
                <div key={stat} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{stat}</span>
                    <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Priority */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span>Complaints by Priority</span>
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
          </h3>
          <div className="space-y-2.5 text-xs">
            {[
              { level: 'High', color: 'bg-rose-500', text: 'text-rose-700' },
              { level: 'Medium', color: 'bg-amber-500', text: 'text-amber-700' },
              { level: 'Low', color: 'bg-slate-400', text: 'text-slate-700' },
            ].map(({ level, color, text }) => {
              const count = complaints.filter(c => c.priority === level).length;
              const pct = complaints.length ? Math.round((count / complaints.length) * 100) : 0;

              return (
                <div key={level} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span className={text}>{level} Priority</span>
                    <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GIS Map View Tab */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Interactive Grievance Spatial Map</h2>
              <p className="text-xs text-slate-500">Live geo-tagged pins across the municipality. Click any pin to inspect.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Hazard</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved</span>
            </div>
          </div>
          <MapComponent complaints={complaints} height="520px" />
        </div>
      )}

      {/* Complaint Records List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Search and 4 Multi-Filters */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, title, citizen..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 truncate"
                >
                  <option value="All">All Departments</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Table of Complaints */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Complaint ID</th>
                    <th className="p-4">Citizen Info</th>
                    <th className="p-4">Category & Title</th>
                    <th className="p-4">AI Department</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                        No complaints match the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => (
                      <tr key={c.complaintId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {c.complaintId}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-bold text-slate-800">{c.citizenName || 'Citizen'}</div>
                          <div className="text-[11px] text-slate-400">{c.citizenPhone || c.citizenEmail}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="font-bold text-slate-800">{c.category}</div>
                          <div className="text-slate-500 truncate" title={c.title}>{c.title}</div>
                        </td>
                        <td className="p-4 max-w-[200px] truncate text-slate-700 font-medium" title={c.department}>
                          {c.department}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <PriorityBadge priority={c.priority} />
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenDetails(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Manage</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COMPLAINT DETAILS & DISPATCH MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  ⚖️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-teal-400">{selectedComplaint.complaintId}</span>
                    <StatusBadge status={selectedComplaint.status} />
                    <PriorityBadge priority={selectedComplaint.priority} />
                  </div>
                  <h3 className="font-extrabold text-base leading-tight mt-0.5">{selectedComplaint.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {feedbackMsg && (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                  {feedbackMsg}
                </div>
              )}

              {/* Grid: Incident Info vs Evidence & Map */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Details */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Citizen & Location</h4>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Citizen Name</span>
                      <span className="font-bold text-slate-900">{selectedComplaint.citizenName || 'Aarav Sharma'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Contact Info</span>
                      <span className="font-mono text-slate-700">{selectedComplaint.citizenPhone || selectedComplaint.citizenEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Location Address</span>
                      <span className="font-medium text-slate-800">{selectedComplaint.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">GPS Coordinates</span>
                      <span className="font-mono text-slate-600">{selectedComplaint.latitude}, {selectedComplaint.longitude}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Description</h4>
                    <p className="text-slate-700 leading-relaxed font-normal">{selectedComplaint.description}</p>
                  </div>

                  {/* AI Evaluation */}
                  <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
                    <span className="font-bold text-teal-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>AI Diagnostic Summary</span>
                    </span>
                    <p className="text-teal-950 font-medium italic">
                      &quot;{selectedComplaint.aiSummary}&quot;
                    </p>
                    <div className="flex gap-2 text-[10px] font-bold text-teal-800 pt-1">
                      <span>Category: {selectedComplaint.category}</span>
                      <span>•</span>
                      <span>Severity: {selectedComplaint.severity}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Map & Evidence Image */}
                <div className="space-y-4">
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-1.5">GIS Location Map</span>
                    <MapComponent
                      complaints={[selectedComplaint]}
                      center={[selectedComplaint.latitude, selectedComplaint.longitude]}
                      zoom={14}
                      height="160px"
                    />
                  </div>

                  {selectedComplaint.imageUrl && (
                    <div>
                      <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-1.5">Uploaded Evidence Image</span>
                      <img
                        src={selectedComplaint.imageUrl}
                        alt="Evidence"
                        className="w-full h-36 object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Actions Box */}
              <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>Administrative Dispatch Actions</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Update Complaint Status
                    </label>
                    <select
                      value={updateStatusVal}
                      onChange={(e) => setUpdateStatusVal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned to Department</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress (Field Work)</option>
                      <option value="Resolved">Resolved (Complete)</option>
                    </select>
                  </div>

                  {/* Assign Department Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Assign Department
                    </label>
                    <select
                      value={assignDeptVal}
                      onChange={(e) => setAssignDeptVal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 truncate"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Add Officer Remarks */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Officer Public Remarks / Resolution Notes
                  </label>
                  <textarea
                    rows={2}
                    value={remarksVal}
                    onChange={(e) => setRemarksVal(e.target.value)}
                    placeholder="Enter dispatch notes, crew arrival time, contractor details, or resolution sign-off..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                  {selectedComplaint.officerRemarks && (
                    <div className="text-[11px] text-slate-500 mt-1">
                      Current remarks: <span className="italic font-medium">{selectedComplaint.officerRemarks}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Changes immediately visible to citizen on tracking portal</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveActions}
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-colors"
                >
                  {isUpdating ? 'Saving...' : 'Save & Dispatch Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
