import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const PatientRecords = () => {
  const { id: patientId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get(
          `/doctor/patients/${patientId}/records`
        );
        setRecords(data);
        if (data.length > 0) setSelectedRecordIndex(0);
      } catch (err) {
        setError("Failed to load medical records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId]);

  const startEditing = () => {
    if (selectedRecordIndex !== null) {
      setEditedNotes(records[selectedRecordIndex].notes);
      setSaveError("");
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError("");
  };

  const saveEdits = async () => {
    if (!editedNotes.trim()) {
      setSaveError("Notes cannot be empty");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const recordId = records[selectedRecordIndex]._id;
      await axios.put(`/doctor/medical-records/${recordId}`, {
        notes: editedNotes,
      });
      const updatedRecords = [...records];
      updatedRecords[selectedRecordIndex].notes = editedNotes;
      setRecords(updatedRecords);
      setIsEditing(false);
    } catch (err) {
      setSaveError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async () => {
    if (selectedRecordIndex === null) return;
    if (!window.confirm("Are you sure you want to delete this medical record?"))
      return;
    setDeleting(true);
    setDeleteError("");
    try {
      const recordId = records[selectedRecordIndex]._id;
      await axios.delete(`/doctor/medical-records/${recordId}`);
      const updatedRecords = records.filter(
        (_, idx) => idx !== selectedRecordIndex
      );
      setRecords(updatedRecords);
      setSelectedRecordIndex(updatedRecords.length > 0 ? 0 : null);
      setIsEditing(false);
    } catch (err) {
      setDeleteError("Failed to delete record");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading records...</p>;
  if (error) return <p>{error}</p>;
  if (records.length === 0) return <p>No records available yet.</p>;

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
            Dates
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {records.map((record, index) => (
              <li
                key={record._id}
                onClick={() => {
                  setSelectedRecordIndex(index);
                  setIsEditing(false);
                  setDeleteError("");
                }}
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
            Details
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
              {isEditing ? (
                <>
                  <textarea
                    rows={8}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 16,
                      padding: 8,
                      borderRadius: 8,
                      borderColor: "#2563eb",
                    }}
                    disabled={saving || deleting}
                    autoFocus
                  />
                  {saveError && (
                    <p style={{ color: "red", marginTop: 8 }}>{saveError}</p>
                  )}
                  <button
                    onClick={saveEdits}
                    disabled={saving || deleting}
                    style={{
                      marginRight: 8,
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={saving || deleting}
                    style={{
                      backgroundColor: "#e4e4e4",
                      color: "#555",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <strong>Notes:</strong>
                    <br />
                    {records[selectedRecordIndex].notes}
                  </p>
                  <button
                    onClick={startEditing}
                    disabled={deleting}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button onClick={deleteRecord} disabled={saving || deleting}>
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                  {deleteError && (
                    <p style={{ color: "red", marginTop: 8 }}>{deleteError}</p>
                  )}
                </>
              )}
            </>
          ) : (
            <p>Select a date to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
