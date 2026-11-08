import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MapRoute } from './pages/MapRoute';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { SosPage } from './pages/SosPage';
import { CommunityReports } from './pages/CommunityReports';
import { Notifications } from './pages/Notifications';
import { ProfilePreferences } from './pages/ProfilePreferences';
import { AdminDashboard } from './pages/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('saferoute_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('saferoute_token');
  const userJson = localStorage.getItem('saferoute_user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/route-map" element={<ProtectedRoute><MapRoute /></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><EmergencyContacts /></ProtectedRoute>} />
            <Route path="/sos" element={<ProtectedRoute><SosPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><CommunityReports /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePreferences /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
