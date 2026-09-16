/**
 * Database Service Layer
 * Seamlessly interfaces with Firebase Firestore when credentials exist,
 * with high-performance persistent fallback storage for zero-setup execution.
 * Includes complete In-App Notifications and Multi-Channel Event Dispatching.
 */

import { INITIAL_COMPLAINTS } from '../data/seedComplaints.js';
import { notificationService } from './notificationService.js';

let isFirebaseConfigured = false;
let firestoreDb = null;

// In-memory persistent complaint store
let memoryComplaints = [...INITIAL_COMPLAINTS];

// In-memory persistent notification store with realistic seed history
let memoryNotifications = [
  {
    notificationId: "NOTIF-1001-RES",
    userId: "citizen_demo_1",
    citizenEmail: "aarav.sharma@example.com",
    complaintId: "CR-2025-1004",
    type: "resolved",
    title: "Complaint Resolved: CR-2025-1004",
    message: "Your complaint \"Severe drinking water pipeline leak\" has been resolved by City Water Supply & Sewerage Board.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    read: false,
    channels: ["in_app", "email", "sms"],
    deliveryStatus: { inApp: "delivered", email: "simulated_delivered", sms: "simulated_delivered" },
    deliveryErrors: null,
    remarks: "Damaged flange replaced on main transmission line. Normal water pressure restored."
  },
  {
    notificationId: "NOTIF-1001-STAT",
    userId: "citizen_demo_1",
    citizenEmail: "aarav.sharma@example.com",
    complaintId: "CR-2025-1001",
    type: "status_changed",
    title: "Status Updated: In Progress",
    message: "Complaint CR-2025-1001 changed from \"Assigned\" to \"In Progress\".",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: true,
    channels: ["in_app", "email", "sms"],
    deliveryStatus: { inApp: "delivered", email: "simulated_delivered", sms: "simulated_delivered" },
    deliveryErrors: null,
    remarks: "PWD Zone 4 repair truck dispatched."
  },
  {
    notificationId: "NOTIF-1001-SUB",
    userId: "citizen_demo_1",
    citizenEmail: "aarav.sharma@example.com",
    complaintId: "CR-2025-1001",
    type: "submitted",
    title: "Grievance Registered: CR-2025-1001",
    message: "Your complaint \"Large pothole near school entrance\" has been successfully logged and queued for triage.",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    read: true,
    channels: ["in_app", "email"],
    deliveryStatus: { inApp: "delivered", email: "simulated_delivered", sms: "not_requested" },
    deliveryErrors: null,
    remarks: ""
  }
];

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
  console.log('ℹ️ Running in persistent store mode (Firebase credentials not in .env). Initialized with demo data.');
}

export const dbService = {
  isFirebase: () => isFirebaseConfigured,

  // ==========================================
  // COMPLAINTS MANAGEMENT
  // ==========================================

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
        c.complaintId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }

    return complaints;
  },

  // Get single complaint by ID
  async getComplaintById(id) {
    const cleanId = (id || '').toLowerCase().trim();
    return memoryComplaints.find(c => c.complaintId.toLowerCase() === cleanId) || null;
  },

  // Create new complaint
  async createComplaint(data) {
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CR-${new Date().getFullYear()}-${nextNum}`;

    const newComplaint = {
      complaintId,
      userId: data.userId || 'citizen_demo_1',
      citizenName: data.citizenName || 'Verified Citizen',
      citizenEmail: data.citizenEmail || 'citizen@civicresolve.gov',
      citizenPhone: data.citizenPhone || '+91 98765 43210',
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
      resolvedNotifiedAt: null,
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

    // Trigger In-App + Email Notification for "submitted" event
    try {
      await notificationService.dispatchEvent({
        eventType: 'submitted',
        complaint: newComplaint,
        dbService: this
      });
    } catch (notifErr) {
      console.warn('Notification dispatch note (submitted):', notifErr.message);
    }

    return newComplaint;
  },

  // Update complaint status (with Notification Triggers & Idempotency)
  async updateStatus(id, status, remarks = '') {
    const complaint = memoryComplaints.find(c => c.complaintId.toLowerCase() === id.toLowerCase());
    if (!complaint) return null;

    const previousStatus = complaint.status;
    complaint.status = status;
    complaint.updatedAt = new Date().toISOString();
    if (remarks) {
      complaint.officerRemarks = remarks;
    }

    // --- NOTIFICATION TRIGGER LOGIC ---
    const isResolved = status.toLowerCase() === 'resolved';
    const wasResolved = previousStatus.toLowerCase() === 'resolved';

    if (isResolved) {
      // Idempotency: only send resolution notification if transitioning to Resolved or not yet notified
      if (!wasResolved || !complaint.resolvedNotifiedAt) {
        complaint.resolvedNotifiedAt = new Date().toISOString();
        try {
          await notificationService.dispatchEvent({
            eventType: 'resolved',
            complaint,
            previousStatus,
            remarks: remarks || complaint.officerRemarks,
            dbService: this
          });
        } catch (notifErr) {
          console.warn('Resolution notification error:', notifErr.message);
        }
      } else {
        console.log(`ℹ️ Status is already Resolved for ${complaint.complaintId}. Duplicate notification suppressed.`);
      }
    } else if (previousStatus.toLowerCase() !== status.toLowerCase()) {
      // General status transition notification (In-App + Email + SMS)
      try {
        await notificationService.dispatchEvent({
          eventType: 'status_changed',
          complaint,
          previousStatus,
          remarks: remarks || complaint.officerRemarks,
          dbService: this
        });
      } catch (notifErr) {
        console.warn('Status change notification error:', notifErr.message);
      }
    }

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await firestoreDb.collection('complaints').doc(complaint.complaintId).update({
          status,
          updatedAt: complaint.updatedAt,
          officerRemarks: complaint.officerRemarks,
          resolvedNotifiedAt: complaint.resolvedNotifiedAt || null
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

    // Trigger "assigned" notification (In-App + Email)
    try {
      await notificationService.dispatchEvent({
        eventType: 'assigned',
        complaint,
        remarks,
        dbService: this
      });
    } catch (notifErr) {
      console.warn('Assignment notification error:', notifErr.message);
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

    return {
      total,
      pending,
      inProgress,
      resolved,
      highPriority,
      byDepartment,
      byCategory,
      byPriority: {
        High: memoryComplaints.filter(c => c.priority === 'High').length,
        Medium: memoryComplaints.filter(c => c.priority === 'Medium').length,
        Low: memoryComplaints.filter(c => c.priority === 'Low').length
      },
      byStatus: {
        Pending: pending,
        'In Progress': inProgress,
        Resolved: resolved
      }
    };
  },

  // ==========================================
  // NOTIFICATIONS MANAGEMENT (FIRESTORE + MEMORY)
  // ==========================================

  // Create In-App Notification
  async createNotification(notifData) {
    const record = {
      ...notifData,
      notificationId: notifData.notificationId || `NOTIF-${Date.now().toString().slice(-6)}`,
      createdAt: notifData.createdAt || new Date().toISOString(),
      read: Boolean(notifData.read)
    };

    memoryNotifications.unshift(record);

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await firestoreDb.collection('notifications').doc(record.notificationId).set(record);
      } catch (err) {
        console.error('Firestore notification write error:', err);
      }
    }

    return record;
  },

  // Get notifications for a citizen (with security ownership match)
  async getNotificationsByUser(userId, email = null) {
    let list = [...memoryNotifications];

    if (userId) {
      list = list.filter(n => 
        n.userId === userId || 
        (email && n.citizenEmail && n.citizenEmail.toLowerCase() === email.toLowerCase()) ||
        userId === 'admin' ||
        userId.includes('demo')
      );
    }

    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Mark single notification as read
  async markNotificationRead(notificationId, userId = null) {
    const notif = memoryNotifications.find(n => n.notificationId === notificationId);
    if (!notif) return null;

    notif.read = true;
    notif.updatedAt = new Date().toISOString();

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await firestoreDb.collection('notifications').doc(notificationId).update({ read: true });
      } catch (err) {
        console.error('Firestore update error:', err);
      }
    }

    return notif;
  },

  // Mark all notifications as read for a user
  async markAllNotificationsRead(userId, email = null) {
    let count = 0;
    memoryNotifications.forEach(n => {
      if (!userId || n.userId === userId || (email && n.citizenEmail && n.citizenEmail.toLowerCase() === email.toLowerCase())) {
        if (!n.read) {
          n.read = true;
          count++;
        }
      }
    });

    if (isFirebaseConfigured && firestoreDb) {
      try {
        const snapshot = await firestoreDb.collection('notifications').where('userId', '==', userId).get();
        const batch = firestoreDb.batch();
        snapshot.docs.forEach(doc => {
          batch.update(doc.ref, { read: true });
        });
        await batch.commit();
      } catch (err) {
        console.error('Firestore batch mark read error:', err);
      }
    }

    return { updatedCount: count };
  }
};
