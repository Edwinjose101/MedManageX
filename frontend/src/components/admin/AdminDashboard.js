import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthContext";
import { LogOut } from "lucide-react";
import axios from "../../api/axios";

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await axios.get("/admin/appointments/load");
        setPendingCount(response.data.summary?.pending ?? 0);
      } catch (error) {
        console.error("Error fetching pending appointments count:", error);
        setPendingCount(0);
      }
    };
    fetchPendingCount();
  }, []);

  const navLinkStyle = {
    fontWeight: "500",
    padding: "8px 12px",
    borderRadius: "6px",
    display: "block",
    textDecoration: "none",
    marginBottom: "1rem",
    color: "#374151",
    transition: "background-color 0.2s ease",
  };

  const activeStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "700",
  };

  return (
    <div className="admin-dashboard-container" style={{ display: "flex" }}>
      {/* Sidebar Navigation */}
      <aside
        className="sidebar"
        style={{
          width: "220px",
          padding: "20px",
          backgroundColor: "#f7f9fc",
          borderRight: "1px solid #ddd",
          height: "100vh",
          position: "fixed",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "1.5rem",
            fontWeight: "600",
            color: "#3f51b5",
          }}
        >
          Hospital Admin
        </h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {/* Sidebar items */}
            <li>
              <NavLink
                to="/dashboard"
                style={({ isActive }) =>
                  isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle
                }
              >
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patients"
                style={({ isActive }) =>
                  isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle
                }
              >
                Manage Patients
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/manage-doctors"
                style={({ isActive }) =>
                  isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle
                }
              >
                Manage Doctors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/appointments-approval"
                style={({ isActive }) =>
                  isActive
                    ? {
                        ...navLinkStyle,
                        ...activeStyle,
                        fontWeight: "bold",
                        color: "white",
                      }
                    : { ...navLinkStyle, fontWeight: "bold", color: "#2563eb" }
                }
              >
                Approve Appointments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/departments"
                style={({ isActive }) =>
                  isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle
                }
              >
                Departments & Wards
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/billing"
                style={({ isActive }) =>
                  isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle
                }
              >
                Billing
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                style={({ isActive }) =>
                  isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle
                }
              >
                Reports
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/appointment-load"
                style={({ isActive }) =>
                  isActive
                    ? {
                        ...navLinkStyle,
                        ...activeStyle,
                        fontWeight: "bold",
                        color: "white",
                      }
                    : { ...navLinkStyle, fontWeight: "bold", color: "#2563eb" }
                }
              >
                Appointment Load Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                style={({ isActive }) =>
                  isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle
                }
              >
                Settings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/patients"
                style={({ isActive }) =>
                  isActive
                    ? {
                        ...navLinkStyle,
                        ...activeStyle,
                        fontWeight: "bold",
                        color: "white",
                      }
                    : { ...navLinkStyle, fontWeight: "bold", color: "#2563eb" }
                }
              >
                Medical Records Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/add-medical-record"
                style={({ isActive }) =>
                  isActive
                    ? {
                        ...navLinkStyle,
                        ...activeStyle,
                        fontWeight: "bold",
                        color: "white",
                      }
                    : { ...navLinkStyle, fontWeight: "bold", color: "#2563eb" }
                }
              >
                Add Medical Record
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main
        className="main-content"
        style={{ flexGrow: 1, marginLeft: "220px", padding: "24px" }}
      >
        {/* Topbar / Header */}
        <header
          className="header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1>Dashboard Overview</h1>

          {/* Logout button */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user && (
              <span>
                Welcome, <strong>{user.fullName}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition space-x-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Overview Tiles */}
        <section
          className="overview-tiles"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <div
            className="tile"
            style={{
              flex: "1 1 200px",
              background: "#fff",
              padding: "1rem",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              color: "#21325e",
            }}
          >
            <h3>Total Patients</h3>
            <p>1,234</p>
          </div>
          <div
            className="tile"
            style={{
              flex: "1 1 200px",
              background: "#fff",
              padding: "1rem",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              color: "#21325e",
            }}
          >
            <h3>Total Doctors</h3>
            <p>56</p>
          </div>
          <div
            className="tile"
            style={{
              flex: "1 1 200px",
              background: "#fff",
              padding: "1rem",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              color: "#21325e",
            }}
          >
            <h3>Upcoming Appointments</h3>
            <p>{pendingCount}</p>
          </div>
          <div
            className="tile"
            style={{
              flex: "1 1 200px",
              background: "#fff",
              padding: "1rem",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              color: "#21325e",
            }}
          >
            <h3>Available Wards</h3>
            <p>15</p>
          </div>
        </section>

        {/* Recent Activities or Notifications */}
        <section className="recent-activities" style={{ marginTop: "2rem" }}>
          <h2>Recent Activities</h2>
          {/* List recent user actions, approvals, alerts */}
        </section>

        {/* Quick Actions */}
        <section
          className="quick-actions"
          style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}
        >
          <button
            onClick={() => navigate("/patients")}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Add New Patient
          </button>
          <button
            onClick={() => navigate("/admin/manage-doctors")}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Add New Doctor
          </button>
          <button
            onClick={() => navigate("/appointments")}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Schedule Appointment
          </button>
          <button
            onClick={() => navigate("/admin/add-medical-record")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Add Medical Record
          </button>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
