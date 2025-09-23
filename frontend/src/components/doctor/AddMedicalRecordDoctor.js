import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const AddMedicalRecordDoctor = () => {
  const { id: patientId } = useParams();
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError("Notes cannot be empty.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await axios.post(`/doctor/patients/${patientId}/records`, { notes });
      setSuccess("Medical record added!");
      setNotes("");
      // Optionally: navigate(`/doctor/patients/${patientId}`); // If you plan to use navigate in the future, uncomment this and re-import.
    } catch (err) {
      setError("Error adding medical record.");
    }
    setSubmitting(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(115deg, #f0f7fd 0%, #e8edfd 50%, #cee0f7 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "64px",
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          borderRadius: 22,
          boxShadow: "0 8px 32px #bed5ed55",
          border: "2px solid #e6ecfe",
          padding: "36px 35px 42px 35px",
          width: "100%",
          maxWidth: 520,
          minHeight: 410,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            color: "#274ca6",
            marginBottom: 4,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          Add Medical Record
        </h2>
        <div
          style={{
            color: "#557abb",
            fontWeight: 500,
            marginBottom: 26,
            fontSize: 15,
          }}
        >
          All medical data is confidential and securely stored.
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={8}
          placeholder="Enter medical notes here..."
          disabled={submitting}
          style={{
            width: "100%",
            minHeight: 120,
            resize: "vertical",
            fontSize: 16,
            padding: 14,
            borderRadius: 13,
            border: "2px solid #c2dbfb",
            boxShadow: "0 2px 8px #e9effa",
            background: "#f6fbff",
            color: "#22344a",
            marginBottom: 28,
            outlineColor: "#5178da",
            transition: "border 0.17s, outline 0.14s",
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            background: "linear-gradient(90deg,#388ffb 0%,#4176ea 100%)",
            color: "white",
            padding: "15px",
            fontWeight: 800,
            fontSize: 18,
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: "0 3px 18px #cfe4fa",
            letterSpacing: 1.2,
            marginBottom: 10,
            transition: "background 0.17s",
          }}
        >
          {submitting ? "Adding..." : "Add Record"}
        </button>
        {error && <div style={{ color: "#e35151", marginTop: 8 }}>{error}</div>}
        {success && (
          <div style={{ color: "#36b46d", marginTop: 8 }}>{success}</div>
        )}
      </form>
    </div>
  );
};

export default AddMedicalRecordDoctor;
