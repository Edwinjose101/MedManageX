import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const PatientRecordsView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get("/patient/records");
        setRecords(data.records);
        if (data.length > 0) setSelectedRecordIndex(0);
      } catch (err) {
        setError("Failed to load medical records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) return <p>Loading records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (records.length === 0) return <p>No medical records available.</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e0f2fe 0%, #f9fafb 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 64,
        paddingLeft: 16,
        paddingRight: 16,
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 40,
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          alignItems: "flex-start",
        }}
      >
        {/* Dates List */}
        <div
          style={{
            width: 220,
            border: "1px solid #cbd5e1",
            borderRadius: 12,
            overflowY: "auto",
            padding: 16,
            boxShadow: "0 4px 6px rgba(100, 116, 139, 0.1)",
            background: "white",
          }}
          aria-label="Dates list"
        >
          <h3 style={{ marginTop: 0, marginBottom: 16, color: "#1e3a8a" }}>
            Medical Records
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {records.map((record, index) => (
              <li
                key={record._id}
                onClick={() => setSelectedRecordIndex(index)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderRadius: 8,
                  backgroundColor:
                    index === selectedRecordIndex ? "#bfdbfe" : "transparent",
                  fontWeight: index === selectedRecordIndex ? "700" : "normal",
                  marginBottom: 8,
                  userSelect: "none",
                  transition: "background-color 0.2s ease",
                  color: "#1e40af",
                }}
              >
                {new Date(record.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </li>
            ))}
          </ul>
        </div>

        {/* Details Pane */}
        <div
          style={{
            flexGrow: 1,
            border: "1px solid #cbd5e1",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 4px 6px rgba(100, 116, 139, 0.1)",
            overflowY: "auto",
            background: "white",
            color: "#334155",
            height: "600px",
          }}
          aria-label="Record details"
        >
          <h3
            style={{
              borderBottom: "2px solid #bfdbfe",
              paddingBottom: 8,
              marginBottom: 20,
              color: "#1e3a8a",
            }}
          >
            Record Details
          </h3>
          {selectedRecordIndex !== null ? (
            <>
              <p>
                <strong>Date and Time:</strong>{" "}
                {new Date(
                  records[selectedRecordIndex].createdAt
                ).toLocaleString()}
              </p>
              <p>
                <strong>By:</strong>{" "}
                {records[selectedRecordIndex].createdByRole === "admin"
                  ? "Assigned by Administrator"
                  : records[selectedRecordIndex].doctorId
                  ? `Dr. ${
                      records[selectedRecordIndex].doctorId.fullName ||
                      "Unknown"
                    }`
                  : "By Administrator"}
              </p>
              <p>
                <strong>Notes:</strong>
                <br />
                {records[selectedRecordIndex].notes}
              </p>
            </>
          ) : (
            <p>Select a record to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecordsView;
