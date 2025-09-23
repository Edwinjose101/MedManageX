import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthContext";

const PatientProfileView = () => {
  const {  setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("/patient/profile");
        setProfile(response.data);
        if (setUser) setUser(response.data);
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setUser]);

  if (loading) return <p>Loading profile...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!profile)
    return <p>No profile found. Please complete your profile information.</p>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <span style={{ fontSize: 48 }}>👤</span>
        <h2 style={{ margin: 0 }}>{profile.fullName}</h2>
      </div>

      <table style={{ width: "100%", marginBottom: 32 }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600, padding: "8px 5px" }}>Email:</td>
            <td>{profile.email || "Not provided"}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: "8px 5px" }}>Phone:</td>
            <td>{profile.phone || "Not provided"}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: "8px 5px" }}>Address:</td>
            <td>{profile.address || "Not provided"}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: "8px 5px" }}>
              Date of Birth:
            </td>
            <td>{profile.dateOfBirth || "Not provided"}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: "8px 5px" }}>Age:</td>
            <td>{profile.age || "Not provided"}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: "8px 5px" }}>Gender:</td>
            <td>{profile.gender || "Not provided"}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: "8px 5px" }}>
              Blood Group:
            </td>
            <td>{profile.bloodGroup || "Not provided"}</td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={() => navigate("/patient/profile/edit")}
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "14px 32px",
          fontSize: 18,
          cursor: "pointer",
          fontWeight: "600",
          userSelect: "none",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default PatientProfileView;
