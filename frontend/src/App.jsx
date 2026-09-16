import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CitizenLoginPage } from './pages/CitizenLoginPage';
import { CitizenRegisterPage } from './pages/CitizenRegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { TrackingPage } from './pages/TrackingPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { api } from './services/api';

function AppContent() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  // Load complaints and stats from API
  const fetchComplaints = async () => {
    try {
      const data = await api.getComplaints();
      setComplaints(data);
    } catch (err) {
      console.warn('Backend API note:', err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const s = await api.getStats();
      setStats(s);
    } catch (err) {
      console.warn('Stats fetch note:', err.message);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, []);

  // Adapter for components still expecting setView(viewName)
  const setView = (view) => {
    switch (view) {
      case 'landing':
        navigate('/');
        break;
      case 'report':
        navigate('/citizen/report');
        break;
      case 'track':
        navigate('/track');
        break;
      case 'auth':
      case 'login':
        navigate('/login');
        break;
      case 'register':
        navigate('/register');
        break;
      case 'admin-login':
        navigate('/admin/login');
        break;
      case 'dashboard':
        navigate('/citizen/dashboard');
        break;
      case 'my-complaints':
        navigate('/citizen/complaints');
        break;
      case 'admin-dashboard':
        navigate('/admin/dashboard');
        break;
      case 'officer-dashboard':
        navigate('/officer/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleComplaintCreated = (newComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    setSelectedComplaintId(newComplaint.complaintId);
    fetchStats();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage setView={setView} stats={stats} />} />
          <Route path="/login" element={<CitizenLoginPage />} />
          <Route path="/register" element={<CitizenRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Public Grievance Tracking (Works with or without auth) */}
          <Route
            path="/track"
            element={
              <TrackingPage
                initialComplaintId={selectedComplaintId}
                complaints={complaints}
              />
            }
          />
          <Route
            path="/track/:id"
            element={
              <TrackingPage
                initialComplaintId={selectedComplaintId}
                complaints={complaints}
              />
            }
          />

          {/* Citizen Protected Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard
                  complaints={complaints}
                  currentUser={currentUser}
                  setView={setView}
                  setSelectedComplaintId={setSelectedComplaintId}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/report"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ReportIssuePage
                  currentUser={currentUser}
                  setView={setView}
                  onComplaintCreated={handleComplaintCreated}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <MyComplaintsPage
                  complaints={complaints}
                  currentUser={currentUser}
                  setView={setView}
                  setSelectedComplaintId={setSelectedComplaintId}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints/:id"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <TrackingPage
                  initialComplaintId={selectedComplaintId}
                  complaints={complaints}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/profile"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage
                  complaints={complaints}
                  onRefreshComplaints={fetchComplaints}
                  currentUser={currentUser}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Officer Protected Routes */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerDashboardPage
                  complaints={complaints}
                  onRefreshComplaints={fetchComplaints}
                  currentUser={currentUser}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/profile"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Convenience / Legacy Redirects */}
          <Route
            path="/dashboard"
            element={
              role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : role === 'officer' ? (
                <Navigate to="/officer/dashboard" replace />
              ) : (
                <Navigate to="/citizen/dashboard" replace />
              )
            }
          />
          <Route path="/report" element={<Navigate to="/citizen/report" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
