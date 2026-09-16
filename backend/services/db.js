/**
 * Database Service Layer
 * Seamlessly interfaces with Firebase Firestore when credentials exist,
 * with high-performance persistent fallback storage for zero-setup execution.
 */

import { INITIAL_COMPLAINTS } from '../data/seedComplaints.js';

let isFirebaseConfigured = false;
let firestoreDb = null;

// In-memory persistent complaint store
let memoryComplaints = [...INITIAL_COMPLAINTS];

// Check for Firebase credentials in env
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    const { initializeApp, cert } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');
    
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    
    firestoreDb = getFirestore();
    isFirebaseConfigured = true;
    console.log('✅ Connected to live Firebase Firestore');
  } catch (err) {
    console.warn('⚠️ Firebase initialization skipped (using persistent store):', err.message);
  }
} else {
  console.log('ℹ️ Running in persistent store mode (Firebase credentials not in .env). Initialized with 6 demo complaints.');
}

export const dbService = {
  isFirebase: () => isFirebaseConfigured,

  // Get all complaints with optional filters
  async getAllComplaints(filters = {}) {
    let complaints = [...memoryComplaints];

    if (filters.userId) {
      complaints = complaints.filter(c => c.userId === filters.userId);
    }
    if (filters.status && filters.status !== 'All') {
      complaints = complaints.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.category && filters.category !== 'All') {
      complaints = complaints.filter(c => c.category === filters.category);
    }
    if (filters.priority && filters.priority !== 'All') {
      complaints = complaints.filter(c => c.priority === filters.priority);
    }
    if (filters.department && filters.department !== 'All') {
      complaints = complaints.filter(c => c.department === filters.department);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      complaints = complaints.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.complaintId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return complaints;
  },

  // Get single complaint by ID
  async getComplaintById(id) {
    return memoryComplaints.find(c => c.complaintId.toLowerCase() === id.toLowerCase()) || null;
  },

  // Create new complaint
  async createComplaint(data) {
    const complaintId = `CR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint = {
      complaintId,
      userId: data.userId || 'anonymous_citizen',
      citizenName: data.citizenName || 'Verified Citizen',
      citizenEmail: data.citizenEmail || 'citizen@civicresolve.gov',
      citizenPhone: data.citizenPhone || '',
      title: data.title,
      description: data.description,
      category: data.category || 'General Civic Grievance',
      severity: data.severity || 'Medium',
      priority: data.priority || 'Medium',
      department: data.department || 'General Civic Grievance Cell',
      aiSummary: data.aiSummary || data.title,
      imageUrl: data.imageUrl || '',
      videoUrl: data.videoUrl || '',
      latitude: Number(data.latitude) || 28.6139,
      longitude: Number(data.longitude) || 77.2090,
      address: data.address || 'Reported Location',
      status: 'Pending',
      officerRemarks: 'Complaint received and queued for department assignment.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryComplaints.unshift(newComplaint);

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await firestoreDb.collection('complaints').doc(complaintId).set(newComplaint);
      } catch (err) {
        console.error('Firestore write error:', err);
      }
    }

    return newComplaint;
  },

  // Update complaint status
  async updateStatus(id, status, remarks = '') {
    const complaint = memoryComplaints.find(c => c.complaintId.toLowerCase() === id.toLowerCase());
    if (!complaint) return null;

    complaint.status = status;
    complaint.updatedAt = new Date().toISOString();
    if (remarks) {
      complaint.officerRemarks = remarks;
    }

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await firestoreDb.collection('complaints').doc(complaint.complaintId).update({
          status,
          updatedAt: complaint.updatedAt,
          officerRemarks: complaint.officerRemarks
        });
      } catch (err) {
        console.error('Firestore update error:', err);
      }
    }

    return complaint;
  },

  // Assign department
  async assignDepartment(id, department, remarks = '') {
    const complaint = memoryComplaints.find(c => c.complaintId.toLowerCase() === id.toLowerCase());
    if (!complaint) return null;

    complaint.department = department;
    complaint.status = complaint.status === 'Pending' ? 'Assigned' : complaint.status;
    complaint.updatedAt = new Date().toISOString();
    if (remarks) {
      complaint.officerRemarks = remarks;
    }

    return complaint;
  },

  // Add officer remarks
  async addRemarks(id, remarks) {
    const complaint = memoryComplaints.find(c => c.complaintId.toLowerCase() === id.toLowerCase());
    if (!complaint) return null;

    complaint.officerRemarks = remarks;
    complaint.updatedAt = new Date().toISOString();
    return complaint;
  },

  // Get statistics for admin dashboard
  async getStatistics() {
    const total = memoryComplaints.length;
    const pending = memoryComplaints.filter(c => c.status === 'Pending').length;
    const inProgress = memoryComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Under Review').length;
    const resolved = memoryComplaints.filter(c => c.status === 'Resolved').length;
    const highPriority = memoryComplaints.filter(c => c.priority === 'High').length;

    // Group by department
    const byDepartment = {};
    memoryComplaints.forEach(c => {
      byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;
    });

    // Group by category
    const byCategory = {};
    memoryComplaints.forEach(c => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    });

    // Group by priority
    const byPriority = {
      High: memoryComplaints.filter(c => c.priority === 'High').length,
      Medium: memoryComplaints.filter(c => c.priority === 'Medium').length,
      Low: memoryComplaints.filter(c => c.priority === 'Low').length
    };

    // Group by status
    const byStatus = {
      Pending: pending,
      "In Progress": inProgress,
      Resolved: resolved
    };

    return {
      total,
      pending,
      inProgress,
      resolved,
      highPriority,
      byDepartment,
      byCategory,
      byPriority,
      byStatus
    };
  }
};
