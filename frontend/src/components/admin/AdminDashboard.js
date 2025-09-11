import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2>Hospital Admin</h2>
        <nav>
          <ul>
            <li><a href="/dashboard">Overview</a></li>
            <li><a href="/patients">Manage Patients</a></li>
            <li><a href="/doctors">Manage Doctors</a></li>
            <li><a href="/appointments">Appointments</a></li>
            <li><a href="/departments">Departments & Wards</a></li>
            <li><a href="/billing">Billing</a></li>
            <li><a href="/reports">Reports</a></li>
            <li><a href="/settings">Settings</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Topbar / Header */}
        <header className="header">
          <h1>Dashboard Overview</h1>
          {/* Could include admin profile, notifications */}
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
