import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const AdminPatientDetails = () => {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [groupedRecords, setGroupedRecords] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [formData, setFormData] = useState({ notes: "" });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/admin/medical-records", {
          params: { patientId: id, limit: 100 },
        });
        setRecords(res.data.records);
        groupByDepartment(res.data.records);
      } catch (err) {
        setError("Failed to fetch medical records");
        setRecords([]);
        setGroupedRecords({});
      } finally {
        setLoading(false);
      }
    };
    fetchPatientRecords();
  }, [id]);

  const groupByDepartment = (records) => {
    const groups = records.reduce((acc, record) => {
      const dept = record.department || "Unknown";
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(record);
      return acc;
    }, {});
    setGroupedRecords(groups);
    const initiallyExpanded = {};
    Object.keys(groups).forEach((dept) => {
      initiallyExpanded[dept] = true;
    });
    setExpandedDepartments(initiallyExpanded);
  };

  const toggleDepartment = (dept) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [dept]: !prev[dept],
    }));
  };

  const handleEditClick = (record) => {
    setEditRecord(record);
    setFormData({ notes: record.notes || "" });
    setFormError(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.notes.trim()) {
      setFormError("Notes cannot be empty.");
      return;
    }

    try {
      await axios.put(`/admin/medical-records/${editRecord._id}`, {
        notes: formData.notes,
      });
      setEditRecord(null);
      // Refresh records after edit
      const res = await axios.get("/admin/medical-records", {
        params: { patientId: id, limit: 100 },
      });
      setRecords(res.data.records);
      groupByDepartment(res.data.records);
    } catch (err) {
      setFormError("Failed to update record.");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditRecord(null);
    setFormError(null);
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this medical record?"))
      return;

    try {
      await axios.delete(`/admin/medical-records/${recordId}`);
      // Refresh records after delete
      const res = await axios.get("/admin/medical-records", {
        params: { patientId: id, limit: 100 },
      });
      setRecords(res.data.records);
      groupByDepartment(res.data.records);
    } catch (err) {
      alert("Failed to delete the record.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Patient Medical Records</h2>
      {loading && <p>Loading records...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && Object.keys(groupedRecords).length === 0 && (
        <p>No records found for this patient.</p>
      )}

      {!loading &&
        !error &&
        Object.entries(groupedRecords).map(([dept, recordList]) => (
          <div
            key={dept}
            style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxShadow: "0 0 8px #ccc",
            }}
          >
            <div
              onClick={() => toggleDepartment(dept)}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                userSelect: "none",
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              {dept} ({recordList.length}){" "}
              {expandedDepartments[dept] ? "▼" : "▶"}
            </div>

            {expandedDepartments[dept] && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
                border="1"
                cellPadding="6"
                cellSpacing="0"
              >
                <thead
                  style={{ backgroundColor: "#f0f0f0", textAlign: "left" }}
                >
                  <tr>
                    <th style={{ width: "150px" }}>Doctor</th>
                    <th style={{ width: "120px" }}>Date</th>
                    <th>Notes</th>
                    <th style={{ width: "120px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recordList.map((record) => (
                    <tr key={record._id}>
                      <td
                        style={{
                          width: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {record.doctorId ? record.doctorId.fullName : "N/A"}
                      </td>
                      <td style={{ width: "120px" }}>
                        {new Date(record.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td>{record.notes}</td>
                      <td style={{ width: "120px" }}>
                        <button
                          onClick={() => handleEditClick(record)}
                          style={{ marginRight: "0.5rem" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          style={{ color: "red" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}

      {editRecord && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleFormSubmit}
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h3>Edit Medical Record</h3>
            <div style={{ marginBottom: "1rem" }}>
              <label>Notes:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows={5}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            {formError && (
              <p style={{ color: "red", marginBottom: "1rem" }}>{formError}</p>
            )}
            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{ marginRight: "1rem" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "0.5rem 1rem",
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPatientDetails;
