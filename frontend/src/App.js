import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';

import Login from './auth/components/Login';
import Register from './auth/components/Register';
import Dashboard from './components/Dashboard';
import PatientPage from './patients/components/PatientPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
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

          {/* Catch-all 404 */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
