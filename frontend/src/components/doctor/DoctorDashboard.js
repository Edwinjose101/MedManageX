import React, { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios'; // your axios instance with baseURL and token setup
import { AuthContext } from '../../auth/context/AuthContext'; // adjust path if needed
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const DoctorDashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/auth/profile');
        setDoctorProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {doctorProfile.fullName}</h1>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition space-x-2"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <nav style={{ marginBottom: '15px' }}>
        <button
          onClick={() => setActiveSection('profile')}
          disabled={activeSection === 'profile'}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveSection('appointments')}
          disabled={activeSection === 'appointments'}
        >
          Appointments
        </button>
        <button
          onClick={() => setActiveSection('messages')}
          disabled={activeSection === 'messages'}
        >
          Messages & Alerts
        </button>

        {/* New button for Patients List */}
        <button
          onClick={() => navigate('/doctor/patients')}
          style={{ marginLeft: '10px' }}
        >
          My Patients
        </button>
      </nav>

      <section style={{ border: '1px solid #ccc', padding: '15px' }}>
        {activeSection === 'profile' && (
          <>
            <h2>Profile Summary</h2>
            <p><strong>Specialty:</strong> {doctorProfile.specialty}</p>
            <p><strong>Email:</strong> {doctorProfile.email}</p>
            <p><strong>Phone:</strong> {doctorProfile.phone}</p>
          </>
        )}

        {activeSection === 'appointments' && (
          <p>Appointments feature coming soon...</p>
        )}

        {activeSection === 'messages' && (
          <p>Messages & Alerts feature coming soon...</p>
        )}
      </section>
    </div>
  );
};

export default DoctorDashboard;
