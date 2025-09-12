import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext'; // Adjust path as needed
import { LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2>Hospital Admin</h2>
        <nav>
          <ul>
            <li><Link to="/dashboard">Overview</Link></li>
            <li><Link to="/patients">Manage Patients</Link></li>
            <li><Link to="/admin/manage-doctors">Manage Doctors</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/departments">Departments & Wards</Link></li>
            <li><Link to="/billing">Billing</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Topbar / Header */}
        <header className="header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Dashboard Overview</h1>
          
          {/* Logout button */}
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {user && <span>Welcome, <strong>{user.fullName}</strong></span>}
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition space-x-2"
              style={{display: 'flex', alignItems: 'center'}}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Overview Tiles (Metrics) */}
        <section className="overview-tiles">
          <div className="tile">
            <h3>Total Patients</h3>
            <p>1,234</p>
          </div>
          <div className="tile">
            <h3>Total Doctors</h3>
            <p>56</p>
          </div>
          <div className="tile">
            <h3>Upcoming Appointments</h3>
            <p>78</p>
          </div>
          <div className="tile">
            <h3>Available Wards</h3>
            <p>15</p>
          </div>
        </section>

        {/* Recent Activities or Notifications */}
        <section className="recent-activities">
          <h2>Recent Activities</h2>
          {/* List recent user actions, approvals, alerts */}
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <button>Add New Patient</button>
          <button>Add New Doctor</button>
          <button>Schedule Appointment</button>
          {/* More quick action buttons */}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
