import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../homepage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const loginOptions = [
    {
      role: 'Patient',
      description: 'Access your medical records, appointments, and prescriptions',
      icon: '👤',
      path: '/login', // Changed to original login path
      color: '#3B82F6'
    },
    {
      role: 'Doctor',
      description: 'Manage patient care, appointments, and medical records',
      icon: '⚕️',
      path: '/login', // You can change this later when doctor login is implemented
      color: '#10B981'
    },
    {
      role: 'Admin/Staff',
      description: 'Manage hospital operations, users, and system settings',
      icon: '💼',
      path: '/login', // You can change this later when admin login is implemented
      color: '#8B5CF6'
    }
  ];

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">MedManageX</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="homepage-main">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to MedManageX</h1>
          <p className="welcome-subtitle">
            Please select your role to continue to the login page
          </p>
        </div>

        <div className="login-options">
          {loginOptions.map((option, index) => (
            <div 
              key={index} 
              className="login-card"
              onClick={() => navigate(option.path)}
              style={{ '--accent-color': option.color }}
            >
              <div className="card-icon" style={{ backgroundColor: `${option.color}20` }}>
                <span style={{ color: option.color, fontSize: '2rem' }}>
                  {option.icon}
                </span>
              </div>
              <h3 className="card-role">{option.role}</h3>
              <p className="card-description">{option.description}</p>
              <button className="card-button">
                Continue as {option.role}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>© 2025 MedManageX. Secure Healthcare Management System</p>
      </footer>
    </div>
  );
};

export default HomePage;