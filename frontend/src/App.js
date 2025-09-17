import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';

import HomePage from './homepage/components/HomePage';
import Login from './auth/components/Login';
import Register from './auth/components/Register';
import DoctorRegister from './auth/components/DoctorRegister';

import ManageDoctors from './admin/ManageDoctors';

import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminAddMedicalRecord from './components/admin/AdminAddMedicalRecord';

import DoctorDashboard from './components/doctor/DoctorDashboard';

import DoctorPatients from './components/doctor/DoctorPatients';
import PatientRecords from './components/doctor/PatientRecords';
import AddMedicalRecordDoctor from './components/doctor/AddMedicalRecordDoctor'; // NEW

import ProfilePage from './profile/components/ProfilePage';

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
          <Route path="/register-doctor" element={<DoctorRegister />} />

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
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-doctors"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageDoctors />
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
          {/* Admin Add Medical Record */}
          <Route
            path="/admin/add-medical-record"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAddMedicalRecord />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor Patients List */}
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorPatients />
              </ProtectedRoute>
            }
          />
          {/* Patient Records View */}
          <Route
            path="/doctor/patients/:id"
            element={
              <ProtectedRoute requiredRole="doctor">
                <PatientRecords />
              </ProtectedRoute>
            }
          />
          {/* NEW: Doctor Add Medical Record */}
          <Route
            path="/doctor/patients/:id/add-record"
            element={
              <ProtectedRoute requiredRole="doctor">
                <AddMedicalRecordDoctor />
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
