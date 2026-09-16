/**
 * Multi-Channel Citizen Notification Service
 * Supports: In-App, Email (SMTP/Nodemailer), and SMS (Configurable Provider/Twilio/Simulation)
 * Features: Failure isolation, idempotency guard, and configurable provider adapters.
 */

import nodemailer from 'nodemailer';

// ==========================================
// CONFIGURATION & PROVIDER ADAPTERS
// ==========================================

const isTestMode = process.env.NOTIFICATION_TEST_MODE !== 'false';
const emailFrom = process.env.EMAIL_FROM || 'CivicResolve Notifications <notifications@civicresolve.gov>';

// --- 1. Email Provider Adapter ---
class EmailProvider {
  constructor() {
    this.hasSmtpConfig = Boolean(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );

    if (this.hasSmtpConfig && !isTestMode) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log(`📧 Connected live SMTP Email Provider (${process.env.SMTP_HOST})`);
    } else {
      console.log('📧 Notification Service: Using Safe Simulation Mode for Email (Logs to console & records delivery)');
    }
  }

  async sendEmail({ to, subject, text, html }) {
    if (!to) {
      throw new Error('Recipient email address is required');
    }

    if (this.hasSmtpConfig && !isTestMode && this.transporter) {
      const info = await this.transporter.sendMail({
        from: emailFrom,
        to,
        subject,
        text,
        html: html || text.replace(/\n/g, '<br/>')
      });
      return {
        provider: 'smtp',
        status: 'delivered',
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      };
    }

    // Safe Test / Dev Simulation
    console.log('\n======================================================');
    console.log('📨 [EMAIL SIMULATOR]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('------------------------------------------------------');
    console.log(text);
    console.log('======================================================\n');

    return {
      provider: 'simulated_email',
      status: 'simulated_delivered',
      recipient: to,
      timestamp: new Date().toISOString()
    };
  }
}

// --- 2. Configurable SMS Provider Adapter ---
class SmsProvider {
  constructor() {
    this.providerType = process.env.SMS_PROVIDER || 'twilio';
    this.hasTwilioConfig = Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    );

    if (this.hasTwilioConfig && !isTestMode) {
      console.log(`📱 Connected live Twilio SMS Provider (${process.env.TWILIO_PHONE_NUMBER})`);
    } else {
      console.log('📱 Notification Service: Using Safe Simulation Mode for SMS (Logs to console & records delivery)');
    }
  }

  async sendSms({ to, message }) {
    if (!to) {
      throw new Error('Recipient mobile phone number is required');
    }

    // Clean phone number
    const cleanPhone = to.trim();

    // 1. Live Twilio integration if configured
    if (this.hasTwilioConfig && !isTestMode) {
      try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;

        const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        const params = new URLSearchParams();
        params.append('To', cleanPhone);
        params.append('From', fromNumber);
        params.append('Body', message);

        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Twilio SMS dispatch failed');
        }

        return {
          provider: 'twilio',
          status: 'delivered',
          sid: data.sid,
          timestamp: new Date().toISOString()
        };
      } catch (err) {
        throw new Error(`Twilio SMS Provider error: ${err.message}`);
      }
    }

    // 2. Safe Test / Dev Simulation
    console.log('\n======================================================');
    console.log('📱 [SMS SIMULATOR]');
    console.log(`Recipient: ${cleanPhone}`);
    console.log(`Message: "${message}"`);
    console.log('======================================================\n');

    return {
      provider: 'simulated_sms',
      status: 'simulated_delivered',
      recipient: cleanPhone,
      timestamp: new Date().toISOString()
    };
  }
}

const emailService = new EmailProvider();
const smsService = new SmsProvider();

// ==========================================
// NOTIFICATION DISPATCH ENGINE
// ==========================================

export const notificationService = {
  /**
   * Main Dispatcher for Complaint Events
   * Channels:
   * - submitted: In-App + Email
   * - assigned: In-App + Email
   * - status_changed: In-App + Email + SMS
   * - resolved: In-App + Email + SMS
   */
  async dispatchEvent({ eventType, complaint, previousStatus = null, remarks = '', dbService }) {
    if (!complaint) return null;

    const citizenName = complaint.citizenName || 'Citizen';
    const citizenEmail = complaint.citizenEmail;
    const citizenPhone = complaint.citizenPhone || '+91 98765 43210';
    const complaintId = complaint.complaintId;
    const title = complaint.title || 'Civic Issue';
    const category = complaint.category || 'General';
    const department = complaint.department || 'General Civic Grievance Cell';

    // 1. Idempotency Check for "Resolved"
    if (eventType === 'resolved') {
      if (complaint.resolvedNotifiedAt && previousStatus === 'Resolved') {
        console.log(`ℹ️ Resolution notification already sent for ${complaintId}. Skipping duplicate.`);
        return null;
      }
    }

    // Build Messages according to Event Type
    let notificationTitle = '';
    let notificationMessage = '';
    let emailSubject = '';
    let emailBody = '';
    let smsMessage = '';
    let channels = ['in_app'];

    switch (eventType) {
      case 'submitted': {
        channels = ['in_app', 'email'];
        notificationTitle = `Grievance Registered: ${complaintId}`;
        notificationMessage = `Your complaint "${title}" has been successfully logged and queued for triage.`;
        emailSubject = `CivicResolve - Complaint Submitted (${complaintId})`;
        emailBody = `Hello ${citizenName},\n\nYour civic grievance has been successfully submitted to CivicResolve.\n\nComplaint ID: ${complaintId}\nTitle: ${title}\nCategory: ${category}\nTarget Department: ${department}\nStatus: Pending\n\nYou can track the progress of your grievance at any time in the CivicResolve portal.\n\nThank you,\nCivicResolve Team`;
        break;
      }

      case 'assigned': {
        channels = ['in_app', 'email'];
        notificationTitle = `Assigned to ${department}`;
        notificationMessage = `Complaint ${complaintId} was officially assigned to ${department}.`;
        emailSubject = `CivicResolve - Complaint Assigned to ${department}`;
        emailBody = `Hello ${citizenName},\n\nYour grievance ${complaintId} ("${title}") has been assigned to the ${department}.\n\nAssigned Department: ${department}\n${remarks ? `Officer Remarks: ${remarks}\n` : ''}\nOur field maintenance team will inspect the site.\n\nThank you,\nCivicResolve Team`;
        break;
      }

      case 'status_changed': {
        channels = ['in_app', 'email', 'sms'];
        notificationTitle = `Status Updated: ${complaint.status}`;
        notificationMessage = `Complaint ${complaintId} changed from "${previousStatus || 'Previous'}" to "${complaint.status}".`;
        emailSubject = `CivicResolve - Complaint Status Updated to ${complaint.status}`;
        emailBody = `Hello ${citizenName},\n\nThe status of your complaint ${complaintId} has been updated.\n\nComplaint: ${title}\nCategory: ${category}\nNew Status: ${complaint.status}\n${remarks ? `Inspection Remarks: ${remarks}\n` : ''}\nLog in to CivicResolve to view live status updates.\n\nThank you,\nCivicResolve Team`;
        smsMessage = `CivicResolve: Status of complaint ${complaintId} is now "${complaint.status}". Log in to CivicResolve to view details.`;
        break;
      }

      case 'resolved':
      default: {
        channels = ['in_app', 'email', 'sms'];
        notificationTitle = `Complaint Resolved: ${complaintId}`;
        notificationMessage = `Your complaint "${title}" has been resolved by ${department}.`;
        
        // Exact Required Email Subject & Body
        emailSubject = 'CivicResolve - Complaint Resolved';
        emailBody = `Hello ${citizenName},\n\nYour CivicResolve complaint ${complaintId} has been resolved.\n\nComplaint: ${title}\nCategory: ${category}\nStatus: Resolved\n\n${remarks ? `Resolution details: ${remarks}\n` : 'Resolution details: Field maintenance action completed and verified by division officer.\n'}\nYou can log in to CivicResolve to view the complete complaint details.\n\nThank you,\nCivicResolve Team`;

        // Exact Required SMS Example
        smsMessage = `CivicResolve: Your complaint ${complaintId} has been resolved. Log in to CivicResolve to view the resolution details.`;
        break;
      }
    }

    // 2. Failure-Isolated Multi-Channel Execution
    const deliveryStatus = {
      inApp: 'pending',
      email: channels.includes('email') ? 'pending' : 'not_requested',
      sms: channels.includes('sms') ? 'pending' : 'not_requested'
    };

    const deliveryErrors = {};

    // --- Channel A: Email Dispatch ---
    let emailPromise = Promise.resolve(null);
    if (channels.includes('email') && citizenEmail) {
      emailPromise = emailService.sendEmail({
        to: citizenEmail,
        subject: emailSubject,
        text: emailBody
      })
      .then((res) => {
        deliveryStatus.email = res.status;
      })
      .catch((err) => {
        console.error(`❌ Email delivery error for ${complaintId}:`, err.message);
        deliveryStatus.email = 'failed';
        deliveryErrors.email = err.message;
      });
    } else if (channels.includes('email') && !citizenEmail) {
      deliveryStatus.email = 'skipped (no email registered)';
    }

    // --- Channel B: SMS Dispatch ---
    let smsPromise = Promise.resolve(null);
    if (channels.includes('sms') && citizenPhone) {
      smsPromise = smsService.sendSms({
        to: citizenPhone,
        message: smsMessage
      })
      .then((res) => {
        deliveryStatus.sms = res.status;
      })
      .catch((err) => {
        console.error(`❌ SMS delivery error for ${complaintId}:`, err.message);
        deliveryStatus.sms = 'failed';
        deliveryErrors.sms = err.message;
      });
    } else if (channels.includes('sms') && !citizenPhone) {
      deliveryStatus.sms = 'skipped (no phone registered)';
    }

    // Wait for external channels (failure on one never halts the other)
    await Promise.allSettled([emailPromise, smsPromise]);

    // --- Channel C: In-App Notification Record ---
    deliveryStatus.inApp = 'delivered';
    const notificationRecord = {
      notificationId: `NOTIF-${Date.now().toString().slice(-6)}`,
      userId: complaint.userId || 'citizen_demo_1',
      citizenEmail: citizenEmail || '',
      complaintId: complaint.complaintId,
      type: eventType,
      title: notificationTitle,
      message: notificationMessage,
      createdAt: new Date().toISOString(),
      read: false,
      channels,
      deliveryStatus,
      deliveryErrors: Object.keys(deliveryErrors).length > 0 ? deliveryErrors : null,
      remarks: remarks || ''
    };

    if (dbService && typeof dbService.createNotification === 'function') {
      try {
        await dbService.createNotification(notificationRecord);
      } catch (err) {
        console.error('Failed to write notification to db:', err.message);
      }
    }

    return notificationRecord;
  }
};
