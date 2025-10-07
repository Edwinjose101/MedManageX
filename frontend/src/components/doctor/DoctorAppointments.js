import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch confirmed appointments for logged-in doctor
  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/doctor/appointments?status=confirmed");
      setAppointments(response.data.appointments || []);
    } catch {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Confirmation dialog before status update
  const updateStatus = async (id, status) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this appointment as ${status}?`
      )
    ) {
      return;
    }
    setError("");
    setSuccessMsg("");
    try {
      await axios.patch(`/doctor/appointments/${id}/status`, { status });
      setSuccessMsg(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch {
      setError("Failed to update appointment status.");
    }
  };

  // Capitalize status for display
  const formatStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

  return (
    <div>
      <h2>My Confirmed Appointments</h2>

      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      {!loading && appointments.length === 0 && (
        <p>No confirmed appointments.</p>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 20,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f4f8" }}>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Date</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Time</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Patient</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Reason</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Status</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id}>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {appt.date}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {appt.time}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {appt.patientId?.fullName || "N/A"}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {appt.reason || "-"}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {formatStatus(appt.status)}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                <button
                  onClick={() => updateStatus(appt._id, "completed")}
                  disabled={appt.status === "completed"}
                  style={{
                    marginRight: 8,
                    padding: "6px 12px",
                    backgroundColor:
                      appt.status === "completed" ? "#94d3a2" : "#38a169",
                    color: "white",
                    border: "none",
                    borderRadius: 5,
                    cursor:
                      appt.status === "completed" ? "not-allowed" : "pointer",
                  }}
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => updateStatus(appt._id, "no-show")}
                  disabled={
                    appt.status === "no-show" || appt.status === "completed"
                  }
                  style={{
                    padding: "6px 12px",
                    backgroundColor:
                      appt.status === "no-show" || appt.status === "completed"
                        ? "#fca5a5"
                        : "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: 5,
                    cursor:
                      appt.status === "no-show" || appt.status === "completed"
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Mark No-Show
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorAppointments;
