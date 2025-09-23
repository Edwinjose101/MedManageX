import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./DoctorPatients.css"; // import CSS file here

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const url = search
          ? `/doctor/patients?search=${encodeURIComponent(search)}`
          : "/doctor/patients";
        const { data } = await axios.get(url);
        setPatients(data);
      } catch (err) {
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  if (loading)
    return (
      <div className="doctor-patients-container">
        <div
          className="content-card"
          style={{ maxWidth: 400, textAlign: "center" }}
        >
          <ClipLoader color="#2563eb" size={40} />
          <p
            style={{
              color: "#2563eb",
              fontWeight: 600,
              fontSize: 18,
              marginTop: 16,
            }}
          >
            Loading patients...
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 24 }}>
        {error}
      </p>
    );
  if (patients.length === 0)
    return (
      <div className="doctor-patients-container">
        <div className="no-patients-message">No patients found.</div>
      </div>
    );

  return (
    <div className="doctor-patients-container">
      <div className="content-card">
        <div className="page-inner">
          <h2 className="page-title">Your Patients</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search patients by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {patients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <div className="patient-name">{patient.fullName}</div>
              <div className="patient-buttons">
                <button
                  onClick={() => navigate(`/doctor/patients/${patient._id}`)}
                  className="view-records-btn"
                >
                  View Records
                </button>
                <button
                  onClick={() =>
                    navigate(`/doctor/patients/${patient._id}/add-record`)
                  }
                  className="add-record-btn"
                >
                  Add Medical Record
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
