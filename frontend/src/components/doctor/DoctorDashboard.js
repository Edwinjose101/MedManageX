import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import DoctorAppointments from "./DoctorAppointments"; // Import the appointments component
import "./DoctorPatients.css"; // Adjust or add your CSS accordingly

const DoctorDashboard = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/auth/profile");
        setDoctorProfile(data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#1f2937",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Welcome, {doctorProfile.fullName}</h1>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#dc2626",
            color: "white",
            padding: "8px 14px",
            borderRadius: 7,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            gap: 8,
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#b91c1c")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#dc2626")
          }
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <nav
        style={{ marginTop: 20, marginBottom: 25, display: "flex", gap: 12 }}
      >
        <button
          onClick={() => setActiveSection("profile")}
          disabled={activeSection === "profile"}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "1.5px solid #2563eb",
            backgroundColor:
              activeSection === "profile" ? "#2563eb" : "transparent",
            color: activeSection === "profile" ? "white" : "#2563eb",
            cursor: activeSection === "profile" ? "default" : "pointer",
            fontWeight: 600,
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveSection("appointments")}
          disabled={activeSection === "appointments"}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "1.5px solid #2563eb",
            backgroundColor:
              activeSection === "appointments" ? "#2563eb" : "transparent",
            color: activeSection === "appointments" ? "white" : "#2563eb",
            cursor: activeSection === "appointments" ? "default" : "pointer",
            fontWeight: 600,
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          Appointments
        </button>
        <button
          onClick={() => setActiveSection("messages")}
          disabled={activeSection === "messages"}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "1.5px solid #2563eb",
            backgroundColor:
              activeSection === "messages" ? "#2563eb" : "transparent",
            color: activeSection === "messages" ? "white" : "#2563eb",
            cursor: activeSection === "messages" ? "default" : "pointer",
            fontWeight: 600,
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          Messages & Alerts
        </button>

        {/* New button for Patients List */}
        <button
          onClick={() => navigate("/doctor/patients")}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "1.5px solid #2563eb",
            backgroundColor: "transparent",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: 600,
            marginLeft: 10,
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#eff6ff")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          My Patients
        </button>
      </nav>

      <section
        style={{
          border: "1px solid #ccc",
          padding: 15,
          borderRadius: 8,
          backgroundColor: "white",
        }}
      >
        {activeSection === "profile" && (
          <>
            <h2 style={{ marginTop: 0, marginBottom: 15, color: "#1e40af" }}>
              Profile Summary
            </h2>
            <p>
              <strong>Specialty:</strong> {doctorProfile.specialty}
            </p>
            <p>
              <strong>Email:</strong> {doctorProfile.email}
            </p>
            <p>
              <strong>Phone:</strong> {doctorProfile.phone}
            </p>
          </>
        )}

        {activeSection === "appointments" && <DoctorAppointments />}

        {activeSection === "messages" && (
          <p>Messages & Alerts feature coming soon...</p>
        )}
      </section>
    </div>
  );
};

export default DoctorDashboard;
