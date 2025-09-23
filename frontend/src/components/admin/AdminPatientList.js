import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const AdminPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Use useCallback to memoize fetchPatients, so useEffect can safely depend on it
  const fetchPatients = useCallback(async () => {
    try {
      const response = await axios.get("/admin/patients");
      let filtered = response.data;

      if (search.trim()) {
        filtered = filtered.filter((p) =>
          p.fullName.toLowerCase().includes(search.toLowerCase())
        );
      }

      setPatients(filtered);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  }, [search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handlePatientClick = (id) => {
    navigate(`/admin/patients/${id}`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Patient List</h2>

      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />

      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Patient Name</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td style={{ textAlign: "center" }}>No patients found.</td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr
                key={patient._id}
                style={{ cursor: "pointer" }}
                onClick={() => handlePatientClick(patient._id)}
              >
                <td>{patient.fullName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPatientList;
