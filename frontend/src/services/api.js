const API_BASE = '/api';

export const api = {
  // AI Preview Analysis
  async analyzeComplaint(title, description) {
    const res = await fetch(`${API_BASE}/complaints/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    if (!res.ok) throw new Error('AI analysis failed');
    return res.json();
  },

  // Get Complaints
  async getComplaints(filters = {}) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== 'All') query.append(key, val);
    });
    const res = await fetch(`${API_BASE}/complaints?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return res.json();
  },

  // Get Complaint by ID
  async getComplaint(id) {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Complaint not found');
    return res.json();
  },

  // Submit Complaint
  async createComplaint(data) {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit complaint');
    return res.json();
  },

  // Update Status
  async updateStatus(id, status, remarks = '') {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Assign Department
  async assignDepartment(id, department, remarks = '') {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department, remarks })
    });
    if (!res.ok) throw new Error('Failed to assign department');
    return res.json();
  },

  // Add Remarks
  async addRemarks(id, remarks) {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/remarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remarks })
    });
    if (!res.ok) throw new Error('Failed to add remarks');
    return res.json();
  },

  // Admin Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/complaints/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Authentication
  async login(email, password, role = 'citizen') {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async register(name, email, phone, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  // Citizen Notification System
  async getNotifications(userId, email) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (email) params.append('email', email);

    const res = await fetch(`${API_BASE}/notifications?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(notificationId, userId) {
    const res = await fetch(`${API_BASE}/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
    return res.json();
  },

  async markAllNotificationsRead(userId, email) {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email })
    });
    if (!res.ok) throw new Error('Failed to mark all notifications as read');
    return res.json();
  },

  async getNotificationSummary(userId, email) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (email) params.append('email', email);

    const res = await fetch(`${API_BASE}/notifications/summary?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch notification summary');
    return res.json();
  }
};

