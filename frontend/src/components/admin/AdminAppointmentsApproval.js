import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import "./AdminAppointmentsApproval.css";

const AdminAppointmentsApproval = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch pending appointments for approval
  const fetchPendingAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/admin/appointments/pending");
      setPendingAppointments(response.data.appointments || []);
    } catch (err) {
      setError("Failed to load pending appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  // Approve appointment
  const handleApprove = async (id) => {
    setError("");
    setSuccessMsg("");
    try {
      await axios.patch(`/admin/appointments/${id}/approve`);
      setSuccessMsg("Appointment approved successfully");
      fetchPendingAppointments();
    } catch {
      setError("Failed to approve appointment.");
    }
  };

  // Reject appointment
  const handleReject = async (id) => {
    setError("");
    setSuccessMsg("");
    try {
      await axios.patch(`/admin/appointments/${id}/reject`);
      setSuccessMsg("Appointment rejected successfully");
      fetchPendingAppointments();
    } catch {
      setError("Failed to reject appointment.");
    }
  };

  return (
    <div className="admin-appointments-approval">
      <h2>Pending Appointments for Approval</h2>

      {loading && <p>Loading pending appointments...</p>}
      {error && <p className="message error">{error}</p>}
      {successMsg && <p className="message success">{successMsg}</p>}

      {!loading && pendingAppointments.length === 0 && (
        <p>No pending appointments to review.</p>
      )}

      <table className="appointment-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Specialty</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingAppointments.map((appt) => (
            <tr key={appt._id}>
              <td>{appt.patientId?.fullName || "N/A"}</td>
              <td>{appt.doctorId?.fullName || "N/A"}</td>
              <td>{appt.doctorId?.specialty || appt.department}</td>
              <td>{appt.date}</td>
              <td>{appt.time}</td>
              <td>{appt.reason || "-"}</td>
              <td>
                <button
                  className="action-btn approve"
                  onClick={() => handleApprove(appt._id)}
                >
                  Approve
                </button>
                <button
                  className="action-btn reject"
                  onClick={() => handleReject(appt._id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAppointmentsApproval;
