# CivicResolve – AI-Powered Citizen Grievance Resolution System

CivicResolve is a comprehensive, production-grade civic-tech platform where citizens can report public infrastructure issues (damaged roads, garbage collection delays, streetlights, water supply leaks, drainage overflows, and damaged public amenities). The platform utilizes artificial intelligence to categorize the complaint, assess its severity and priority, pinpoint precise GIS coordinates, and route it to the appropriate municipal department.

---

## 🌐 Live Public Deployment URLs

| Service | Public HTTPS URL | Status |
| :--- | :--- | :--- |
| **Full-Stack Application (Frontend + API)** | **[https://03ae533a2996a2.lhr.life](https://03ae533a2996a2.lhr.life)** | 🟢 Live |
| **Backend REST API** | **[https://03ae533a2996a2.lhr.life/api/complaints](https://03ae533a2996a2.lhr.life/api/complaints)** | 🟢 Live |
| **AI Triage Endpoint** | **[https://03ae533a2996a2.lhr.life/api/complaints/analyze](https://03ae533a2996a2.lhr.life/api/complaints/analyze)** | 🟢 Live |
| **API Health Status** | **[https://03ae533a2996a2.lhr.life/api/health](https://03ae533a2996a2.lhr.life/api/health)** | 🟢 Live |
| **Netlify Edge Mirror** | **[https://celebrated-sprite-725dab.netlify.app](https://celebrated-sprite-725dab.netlify.app)** | 🟢 Live *(Pass: `My-Drop-Site`)* |

---

## 👥 Hackathon Demo User Credentials

The application features 1-click credential auto-fill buttons on both login screens:

| Role | Portal URL | Demo Email | Demo Password | Scope / Department |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | `/login` | `citizen@civicresolve.demo` | `Citizen@12345` | File issues, view my complaints, track status, edit profile |
| **Department Officer** | `/admin/login` | `officer@civicresolve.demo` | `Officer@12345` | Public Works Department (PWD) Queue, field remarks, mark resolved |
| **Municipal Admin** | `/admin/login` | `admin@civicresolve.demo` | `Admin@12345` | City Command & Control, all departments, reassignments, GIS Map |

---

## 🏛️ Project Architecture & Structure

```
civicresolve/
├── frontend/               # React 18 + Vite + Tailwind CSS + Leaflet GIS UI
│   ├── src/
│   │   ├── components/     # Navbar, Footer, MapComponent, StatusBadge, PriorityBadge, ProtectedRoute
│   │   ├── context/        # AuthContext.jsx (Firebase session & role manager)
│   │   ├── pages/          # LandingPage, ReportIssuePage, TrackingPage, MyComplaintsPage,
│   │   │                   # CitizenDashboard, CitizenLoginPage, CitizenRegisterPage,
│   │   │                   # ForgotPasswordPage, AdminLoginPage, AdminDashboardPage,
│   │   │                   # OfficerDashboardPage, ProfilePage
│   │   ├── services/       # api.js & firebaseAuth.js
│   │   ├── App.jsx         # React Router v7 routes & role guards
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Node.js + Express REST API & SPA Server
│   ├── routes/             # complaints.js, auth.js
│   ├── services/           # db.js (Firestore + Persistent store), aiService.js
│   ├── data/               # seedComplaints.js (Initial demo complaints)
│   ├── server.js           # Full-stack server (serves API & static frontend)
│   └── package.json
│
├── ai-service/             # Python FastAPI AI / NLP & Computer Vision Service
│   ├── classifier.py       # Rule-based NLP classifier & department router
│   ├── vision.py           # Computer vision damage inspection layer
│   ├── main.py             # FastAPI entry point (Port 8000)
│   └── requirements.txt
│
├── firebase/               # Firebase configurations & security rules
│   ├── firestore.rules     # Secure Firestore security rules
│   ├── storage.rules       # Firebase Storage upload rules
│   └── firebase.json       # Emulator & deployment specs
│
├── render.yaml             # Render Cloud Blueprint (Node fullstack + Python FastAPI)
├── netlify.toml            # Netlify SPA routing redirects and build specs
├── vercel.json             # Vercel serverless configuration
└── Dockerfile              # Production multi-stage Docker container
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18+ or Bun)
- **Python** (3.10+)

### 2. Running Microservices Locally

#### Step 1: Start the Python AI Service (Port 8000)
```bash
cd ai-service
pip install -r requirements.txt
python3 main.py
```
- Health Check: `http://localhost:8000/health`
- AI Endpoint: `POST http://localhost:8000/analyze-complaint`

#### Step 2: Start the Express Backend API (Port 5001)
```bash
cd backend
npm install
npm start
```
- Health Check: `http://localhost:5001/api/health`
- REST APIs: `http://localhost:5001/api/complaints`

#### Step 3: Start the Frontend Application (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
- Access the web app in your browser at: **`http://localhost:3000`**

---

## ☁️ Cloud Deployment Options

### Option 1: Render (Recommended for Full-Stack)
The repository includes a ready-to-use **`render.yaml`** blueprint.
1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) > **New > Blueprint**.
3. Select this repository. Render will automatically spin up:
   - `civicresolve-web`: Node.js Fullstack Service (Frontend SPA + Express API).
   - `civicresolve-ai`: Python FastAPI Service.

### Option 2: Vercel
Deploy via Vercel CLI:
```bash
bunx vercel
```
Using the included `vercel.json`, Vercel builds the Vite frontend and deploys it to the edge.

### Option 3: Netlify
Deploy via Netlify CLI:
```bash
bunx netlify deploy --prod
```
Using `netlify.toml`, Netlify builds the app and configures SPA redirects (`/* -> /index.html 200`).

### Option 4: Docker Container
Build and run the self-contained production container:
```bash
docker build -t civicresolve .
docker run -p 5001:5001 civicresolve
```

---

## 🔑 Environment Variables Configuration

### Backend Configuration (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5001
AI_SERVICE_URL=http://localhost:8000

# Optional: Firebase Admin SDK Credentials
# (If omitted, backend automatically runs in persistent store mode with demo complaints)
FIREBASE_PROJECT_ID=civicresolve-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@civicresolve-prod.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgI...==\n-----END PRIVATE KEY-----\n"
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```
*(If omitted, frontend operates with built-in client-side demo persistence)*

---

## 🔄 System Communication Flow

```
[Citizen / Officer Browser]
         │
         ├── (1) Submits complaint & photos ──► [Express Backend (Port 5001)]
         │                                               │
         │                                               ├── (2) Queries NLP/Vision ──► [FastAPI AI Service (Port 8000)]
         │                                               │                                         │
         │                                               │◄── (3) Returns Category, Severity, ─────┘
         │                                               │        Priority & Department
         │                                               │
         │◄── (5) Returns Complaint ID & Status ─────────┴── (4) Persists Record ──► [Firebase Firestore / Store]
```

1. **Complaint Filing**: Citizen enters problem title and description, attaches photo/video, and selects GPS location on the interactive Leaflet map.
2. **AI Pre-Analysis**: Frontend calls backend `/api/complaints/analyze`, which forwards to FastAPI `/analyze-complaint` (with resilient fallback).
3. **Citizen Review**: Citizen reviews the AI-derived Category, Severity, and Target Department before final submission.
4. **Dispatch**: Backend records the complaint with reference ID (e.g. `CR-2026-9966`) and routes it to the relevant department.
5. **Department Officer Actions**: Field officers inspect department tickets, update progress, append inspection remarks, and mark issues as **Resolved**.
6. **Live Tracking**: Citizens enter their reference ID at any time to monitor progress across all resolution milestones.

---

## 🔔 Multi-Channel Citizen Notification System

CivicResolve features an automated, failure-isolated notification engine supporting three delivery channels:

1. **Email Notification** (SMTP / Nodemailer)
2. **SMS Notification** (Twilio Provider API Adapter)
3. **In-App Notification** (Firestore `notifications` collection with unread counter & interactive bell)

### Notification Channels by Event Type

| Event Trigger | Description | Channels Dispatched |
| :--- | :--- | :--- |
| **Complaint Submitted** | Citizen files a new grievance | 🔔 In-App + 📧 Email |
| **Complaint Assigned** | Municipal admin/AI assigns issue to department | 🔔 In-App + 📧 Email |
| **Complaint Status Changed** | Status moves between Pending, In Progress, etc. | 🔔 In-App + 📧 Email + 📱 SMS |
| **Complaint Resolved** | Officer marks ticket as Resolved with inspection remarks | 🔔 In-App + 📧 Email + 📱 SMS |

### Key System Guarantees

- **Idempotent Resolution**: Prevents duplicate notification spam. When a ticket is marked "Resolved", `resolvedNotifiedAt` timestamp is saved. Subsequent edits while remaining "Resolved" will never re-send notifications.
- **Channel Isolation & Failure Tolerance**: If an external provider (e.g. SMTP or SMS) fails or experiences a timeout, the other channels (such as In-App and SMS) still succeed uninterrupted. Per-channel delivery statuses and errors are captured on the notification document.
- **Zero Frontend Leakage**: All SMS/SMTP API keys and provider tokens remain strictly on the backend.
- **Safe Simulation Mode**: When credentials are not configured (`NOTIFICATION_TEST_MODE=true`), all emails and SMS messages are safely logged with full formatting to the terminal without incurring external API costs.

### Firestore Notifications Schema

```json
{
  "notificationId": "NOTIF-111173",
  "userId": "citizen_demo_1",
  "citizenEmail": "aarav.sharma@example.com",
  "complaintId": "CR-2026-8106",
  "type": "resolved",
  "title": "Complaint Resolved: CR-2026-8106",
  "message": "Your complaint \"Broken street lamp\" has been resolved by Electrical & Streetlighting Division.",
  "createdAt": "2026-09-16T20:21:51.173Z",
  "read": false,
  "channels": ["in_app", "email", "sms"],
  "deliveryStatus": {
    "inApp": "delivered",
    "email": "simulated_delivered",
    "sms": "simulated_delivered"
  },
  "deliveryErrors": null,
  "remarks": "Lamp fixture replaced and high-efficiency LED installed. Tested functional."
}
```

### Notification Environment Variables (`backend/.env`)

```env
# Enable Safe Simulation Mode (default for local dev)
NOTIFICATION_TEST_MODE=true

# Sender Identity
EMAIL_FROM="CivicResolve Notifications <notifications@civicresolve.gov>"

# Live Email SMTP Settings (optional, when NOTIFICATION_TEST_MODE=false)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# Live SMS Provider Settings (Twilio)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Local Testing of Notification Workflow

1. **Check Citizen Notifications**:
   ```bash
   curl "http://localhost:5001/api/notifications?userId=citizen_demo_1"
   ```

2. **Trigger Resolution via Officer Status Update**:
   ```bash
   curl -X PUT "http://localhost:5001/api/complaints/CR-2025-1001/status" \
     -H "Content-Type: application/json" \
     -d '{"status": "Resolved", "remarks": "Pothole filled and road leveled on 17 Sep"}'
   ```
   *(Observe terminal output showing formatted Email and SMS simulator dispatches!)*

3. **Verify Duplicate Prevention**:
   Run the exact same command again. The system logs:
   `ℹ️ Resolution notification already sent for CR-2025-1001. Skipping duplicate.`

4. **Mark As Read / Read-All**:
   ```bash
   curl -X PUT "http://localhost:5001/api/notifications/read-all" \
     -H "Content-Type: application/json" \
     -d '{"userId": "citizen_demo_1"}'
   ```

