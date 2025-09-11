import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';

import HomePage from './homepage/components/HomePage';
import Login from './auth/components/Login';
import Register from './auth/components/Register';
import Dashboard from './components/Dashboard';
import PatientPage from './patients/components/PatientPage';
import ProfilePage from './profile/components/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized Access Page */}
          <Route path="/unauthorized" element={<h2>403: Unauthorized Access</h2>} />

          {/* Catch-all 404 */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
