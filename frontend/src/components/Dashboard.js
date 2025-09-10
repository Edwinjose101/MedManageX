import React, { useContext } from 'react';
import { AuthContext } from '../auth/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {user && (
        <>
          <p>Welcome, {user.name}!</p>
          <p>Your role: <strong>{user.role}</strong></p>
        </>
      )}

      <nav>
        <ul>
          <li><Link to="/patients">Patient Management</Link></li>
          {/* Add more navigation links here as needed */}
        </ul>
      </nav>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
