import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const AdminRecordsOverview = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `/admin/medical-records?search=${encodeURIComponent(
          search.trim()
        )}&page=${page}&limit=${limit}`;
        const { data } = await axios.get(url);
        setRecords(data.records);
        setTotal(data.total);
      } catch (err) {
        setError("Failed to load medical records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [search, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleEdit = (recordId) => {
    alert(`Edit record: ${recordId}`);
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this medical record?"))
      return;

    try {
      await axios.delete(`/admin/medical-records/${recordId}`);
      setRecords((prev) => prev.filter((rec) => rec._id !== recordId));
      setTotal((prev) => prev - 1);
      alert("Record deleted successfully");
    } catch {
      alert("Failed to delete record");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Medical Records Overview</h2>

      <input
        type="text"
        placeholder="Search medical notes..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        style={{
          marginBottom: 12,
          padding: 8,
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      {loading && <p>Loading records...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <table
            style={{ width: "100%", borderCollapse: "collapse" }}
            border="1"
            cellPadding="8"
          >
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id}>
                    <td>{rec.patientId?.fullName || "Unknown"}</td>
                    <td>{rec.doctorId?.fullName || "N/A"}</td>
                    <td>{rec.department}</td>
                    <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
                    <td>{rec.notes}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(rec._id)}
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(rec._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminRecordsOverview;
