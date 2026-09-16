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
