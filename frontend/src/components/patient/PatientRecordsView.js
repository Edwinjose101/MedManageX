import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

// Utility to group records by department
const groupByDepartment = (records) => {
  const grouped = {};
  records.forEach((record) => {
    const dept = record.department || "Other";
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(record);
  });
  return grouped;
};

const PatientRecordsView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDepts, setExpandedDepts] = useState({});

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get("/patient/records");
        setRecords(data.records);
      } catch (err) {
        setError("Failed to load medical records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // Group records by department for display
  const grouped = groupByDepartment(records);

  if (loading) return <p>Loading records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (records.length === 0) return <p>No medical records available.</p>;

  const handleToggle = (dept) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [dept]: !prev[dept],
    }));
  };

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 12px" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: 18 }}>
        Patient Medical Records
      </h2>

      {Object.keys(grouped).map((dept) => (
        <div key={dept} style={{ marginBottom: 30 }}>
          {/* Collapsible Section Header */}
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "12px 26px",
              fontWeight: "bold",
              fontSize: "1.18rem",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              userSelect: "none",
              border: "1px solid #2563eb"
            }}
            onClick={() => handleToggle(dept)}
          >
            {dept} ({grouped[dept].length}){" "}
            <span style={{ marginLeft: 12 }}>
              {expandedDepts[dept] !== false ? "\u25BC" : "\u25B6"}
            </span>
          </div>
          {expandedDepts[dept] !== false && (
            <div style={{ border: "1px solid #d1e4fd", borderTop: 0, borderRadius: "0 0 8px 8px", background: "white", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#eff6ff" }}>
                    <th style={{ padding: 12, border: "1px solid #eef2f7", fontSize: 16, textAlign: "left" }}>Doctor</th>
                    <th style={{ padding: 12, border: "1px solid #eef2f7", fontSize: 16, textAlign: "left" }}>Date</th>
                    <th style={{ padding: 12, border: "1px solid #eef2f7", fontSize: 16, textAlign: "left" }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[dept].map((rec) => (
                    <tr key={rec._id}>
                      <td style={{ padding: 10, border: "1px solid #eef2f7" }}>
                        {rec.doctorId?.fullName || rec.doctor || "N/A"}
                      </td>
                      <td style={{ padding: 10, border: "1px solid #eef2f7" }}>
                        {new Date(rec.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td style={{ padding: 10, border: "1px solid #eef2f7" }}>
                        {rec.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientRecordsView;
