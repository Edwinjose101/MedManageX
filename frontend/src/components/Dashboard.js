import React, { useContext } from 'react';
import { AuthContext } from '../auth/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Users, LogOut } from 'lucide-react';

const Avatar = ({ src, alt }) => (
  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
    {src ? (
      <img src={src} alt={alt} className="object-cover w-full h-full" />
    ) : (
      <User size={24} className="text-gray-400" />
    )}
  </div>
);

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
        <div className="flex items-center space-x-4 mb-6">
          <Avatar src={user.avatarUrl} alt={user.fullName || user.name} />
          <div>
            <p>Welcome, <strong>{user.fullName || user.name}</strong>!</p>
            <p>Your role: <span className="text-blue-600 font-semibold">{user.role}</span></p>
          </div>
        </div>
      )}

      <nav className="dashboard-nav mb-6">
        <ul className="space-y-3">
          <li>
            <Link to="/patients" className="flex items-center text-blue-600 hover:underline space-x-2">
              <Users size={18} />
              <span>Patient Management</span>
            </Link>
          </li>
          {/* Add more links here if needed */}
        </ul>
      </nav>

      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition space-x-2"
        >
          <User size={16} />
          <span>View Profile</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition space-x-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
