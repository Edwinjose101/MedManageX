import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthContext";
import { LogOut, Users, Stethoscope, Calendar, FileText, Activity } from "lucide-react";
import axios from "../../api/axios";

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [medicalRecordsCount, setMedicalRecordsCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          axios.get("/admin/appointments/load"),
          axios.get("/admin/doctors"),
        ]);
        
        setPendingCount(appointmentsRes.data.summary?.pending ?? 0);
        setDoctorsCount(doctorsRes.data.length ?? 0);
        setMedicalRecordsCount(0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setPendingCount(0);
        setDoctorsCount(0);
        setMedicalRecordsCount(0);
      }
    };
    fetchDashboardData();
  }, []);

  const navItems = [
    {
      path: "/admin/manage-doctors",
      label: "Manage Doctors",
      icon: <Stethoscope size={18} />,
    },
    {
      path: "/admin/appointments-approval",
      label: "Approve Appointments",
      icon: <Calendar size={18} />,
    },
    {
      path: "/admin/appointment-load",
      label: "Appointment Dashboard",
      icon: <Users size={18} />,
    },
    {
      path: "/admin/patients",
      label: "Medical Records",
      icon: <FileText size={18} />,
    },
    {
      path: "/admin/add-medical-record",
      label: "Add Medical Record",
      icon: <FileText size={18} />,
    },
  ];

  const quickActions = [
    {
      label: "Manage Doctors",
      path: "/admin/manage-doctors",
      icon: <Stethoscope size={20} />,
    },
    {
      label: "Approve Appointments",
      path: "/admin/appointments-approval",
      icon: <Calendar size={20} />,
    },
    {
      label: "Appointment Dashboard",
      path: "/admin/appointment-load",
      icon: <Activity size={20} />,
    },
    {
      label: "Add Medical Record",
      path: "/admin/add-medical-record",
      icon: <FileText size={20} />,
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <div className="hospital-logo">H</div>
            Hospital Admin
          </h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Admin Dashboard</h1>
              <p>Welcome back, manage your hospital efficiently</p>
            </div>
            
            <div className="header-actions">
              {user && (
                <div className="user-welcome">
                  <p className="welcome-text">Welcome</p>
                  <p className="user-name">{user.fullName}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Overview Tiles */}
        <section className="dashboard-tiles">
          <div className="tile tile-blue">
            <div className="tile-content">
              <div>
                <p className="tile-label">Pending Appointments</p>
                <p className="tile-value">{pendingCount}</p>
              </div>
              <div className="tile-icon">
                <Calendar className="icon" size={24} />
              </div>
            </div>
          </div>

          <div className="tile tile-green">
            <div className="tile-content">
              <div>
                <p className="tile-label">Total Doctors</p>
                <p className="tile-value">{doctorsCount}</p>
              </div>
              <div className="tile-icon">
                <Stethoscope className="icon" size={24} />
              </div>
            </div>
          </div>

          <div className="tile tile-purple">
            <div className="tile-content">
              <div>
                <p className="tile-label">Medical Records</p>
                <p className="tile-value">{medicalRecordsCount}</p>
              </div>
              <div className="tile-icon">
                <FileText className="icon" size={24} />
              </div>
            </div>
          </div>

          <div className="tile tile-orange">
            <div className="tile-content">
              <div>
                <p className="tile-label">System Status</p>
                <p className="tile-status">Operational</p>
              </div>
              <div className="tile-icon">
                <div className="status-indicator"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="quick-action-btn"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity Placeholder */}
        <section className="recent-activity">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-placeholder">
            <p>No recent activity to display</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;