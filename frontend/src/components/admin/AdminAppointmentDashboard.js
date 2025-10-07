import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const AdminAppointmentDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appointmentData, setAppointmentData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch appointment data grouped by doctor and date
  const fetchAppointmentLoad = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await axios.get("/admin/appointments/load");
      setAppointmentData(resp.data.appointmentLoad || []);
      setSummary(resp.data.summary || null);
      setPendingCount(resp.data.summary?.pending || 0); // Set pending from summary
    } catch (err) {
      setError("Failed to load appointment reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentLoad();
  }, []);

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2>Appointment Load Dashboard</h2>

      {/* Show pending appointments count as upcoming */}
      <div style={{ marginBottom: 20 }}>
        <p>
          <strong>Total Appointments:</strong> {summary?.totalAppointments ?? 0}
        </p>
        <p>
          <strong>Pending Approvals (Upcoming):</strong> {pendingCount}
        </p>
        <p>
          <strong>Confirmed:</strong> {summary?.confirmed ?? 0}
        </p>
        <p>
          <strong>Cancelled:</strong> {summary?.cancelled ?? 0}
        </p>
      </div>

      {loading && <p>Loading appointment data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && appointmentData.length === 0 && (
        <p>No appointment data found.</p>
      )}

      {appointmentData.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f0f4f8" }}>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Doctor</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>
                Total Appointments
              </th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Pending</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>
                Confirmed
              </th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>
                Cancelled
              </th>
            </tr>
          </thead>
          <tbody>
            {appointmentData.map((entry) => (
              <tr key={`${entry.doctorId}-${entry.date}`}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {entry.doctorName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {entry.date}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {entry.total}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {entry.pending}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {entry.confirmed}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {entry.cancelled}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAppointmentDashboard;
