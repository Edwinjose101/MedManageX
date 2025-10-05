import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../auth/context/AuthContext";

const MyAppointments = () => {
  const { user } = useContext(AuthContext);
  const patientId = user?._id; // Dynamically get logged-in patient's ID

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) return;
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`/appointments/patient/${patientId}`);
        setAppointments(data.appointments);
      } catch {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  const handleCancel = async (id) => {
    try {
      await axios.patch(`/appointments/${id}/cancel`);  // make sure this API exists
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Failed to cancel appointment");
    }
  };

  if (loading) return <p>Loading your appointments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (appointments.length === 0) return <p>You have no appointments.</p>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: 20, background: "#fff", borderRadius: 12 }}>
      <h2>My Appointments</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f4f8" }}>
            <th style={{ padding: 12, border: "1px solid #ddd" }}>Doctor</th>
            <th style={{ padding: 12, border: "1px solid #ddd" }}>Department</th>
            <th style={{ padding: 12, border: "1px solid #ddd" }}>Date</th>
            <th style={{ padding: 12, border: "1px solid #ddd" }}>Time</th>
            <th style={{ padding: 12, border: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: 12, border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>{a.doctorId?.fullName || "N/A"}</td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>{a.department}</td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>{a.date}</td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>{a.time}</td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>{a.status}</td>
              <td style={{ padding: 12, border: "1px solid #ddd" }}>
                {a.status === "pending" && (
                  <button onClick={() => handleCancel(a._id)} style={{ cursor: "pointer" }}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAppointments;
