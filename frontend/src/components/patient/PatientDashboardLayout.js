import React, { useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthContext";
import { User, FileText, LogOut, Calendar } from "lucide-react";

const Avatar = ({ src, alt }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "#cbd5e0",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {src ? (
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <User size={24} />
    )}
  </div>
);

const PatientDashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav
        style={{
          width: 250,
          backgroundColor: "#f7fafc",
          padding: 20,
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Avatar src={user?.avatarUrl} alt={user?.fullName || user?.name} />
          <div>
            <p style={{ fontWeight: "bold" }}>{user?.fullName || user?.name}</p>
            <p style={{ fontSize: 12, color: "#4a5568" }}>{user?.role}</p>
          </div>
        </div>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li style={{ marginBottom: 12 }}>
            <Link
              to="records"
              style={{
                color: "#3182ce",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FileText size={18} /> My Medical Records
            </Link>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Link
              to="/patient/profile"
              style={{
                color: "#3182ce",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <User size={18} /> View Profile
            </Link>
          </li>
          {/* New Appointment Scheduling Links */}
          <li style={{ marginBottom: 12 }}>
            <Link
              to="/patient/schedule-appointment"
              style={{
                color: "#3182ce",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Calendar size={18} /> Schedule Appointment
            </Link>
          </li>
          <li>
            <Link
              to="/patient/my-appointments"
              style={{
                color: "#3182ce",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Calendar size={18} /> My Appointments
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 30,
            width: "100%",
            padding: "10px",
            backgroundColor: "#e53e3e",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            fontWeight: "600",
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: 30, backgroundColor: "#edf2f7" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default PatientDashboardLayout;

