import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/context/AuthContext";
import ProtectedRoute from "./auth/components/ProtectedRoute";

import HomePage from "./homepage/components/HomePage";
import Login from "./auth/components/Login";
import Register from "./auth/components/Register";
import DoctorRegister from "./auth/components/DoctorRegister";
import ManageDoctors from "./components/admin/ManageDoctors";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminAddMedicalRecord from "./components/admin/AdminAddMedicalRecord";
import AdminRecordsOverview from "./components/admin/AdminRecordsOverview";
import AdminPatientList from "./components/admin/AdminPatientList";
import AdminPatientDetails from "./components/admin/AdminPatientDetails";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import DoctorPatients from "./components/doctor/DoctorPatients";
import PatientRecords from "./components/doctor/PatientRecords";
import AddMedicalRecord from "./components/doctor/AddMedicalRecordDoctor";

import PatientDashboardLayout from "./components/patient/PatientDashboardLayout";
import PatientRecordsView from "./components/patient/PatientRecordsView";
import PatientProfileView from "./components/patient/PatientProfileView";
import PatientProfileEdit from "./components/patient/PatientProfileEdit";

import ScheduleAppointment from "./components/patient/ScheduleAppointment";
import MyAppointments from "./components/patient/MyAppointments";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-doctor" element={<DoctorRegister />} />

          {/* Admin */}
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
          <Route
            path="/admin/add-medical-record"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAddMedicalRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/records-overview"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminRecordsOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPatientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPatientDetails />
              </ProtectedRoute>
            }
          />

          {/* Doctor */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients/:id"
            element={
              <ProtectedRoute requiredRole="doctor">
                <PatientRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients/:id/add-record"
            element={
              <ProtectedRoute requiredRole="doctor">
                <AddMedicalRecord />
              </ProtectedRoute>
            }
          />

          {/* Patient - use layout */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="records" element={<PatientRecordsView />} />
            <Route path="profile" element={<PatientProfileView />} />
            <Route path="profile/edit" element={<PatientProfileEdit />} />
            <Route path="schedule-appointment" element={<ScheduleAppointment />} />
            <Route path="my-appointments" element={<MyAppointments />} />
          </Route>

          {/* Other */}
          <Route path="/unauthorized" element={<h2>403: Unauthorized Access</h2>} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
