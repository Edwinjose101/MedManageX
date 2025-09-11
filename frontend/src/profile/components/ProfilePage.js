import React, { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return <div>No user data available. Please log in.</div>;
  }

  return (
    <div className="profile-page dashboard-container max-w-3xl mx-auto p-6 bg-white rounded shadow flex flex-col">
      <header className="flex items-center space-x-6 mb-6">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={48} className="text-gray-400" />
          </div>
        )}
        <h1 className="text-3xl font-bold">{user.fullName || user.name || 'No Name'}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div>
          <strong>Full Name:</strong> {user.fullName || user.name || 'Not provided'}
        </div>
        <div>
          <strong>Email:</strong> {user.email || 'Not provided'}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone || 'Not provided'}
        </div>
        <div>
          <strong>Address:</strong> {user.address || 'Not provided'}
        </div>
        <div>
          <strong>Date of Birth:</strong>{' '}
          {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}
        </div>
        <div>
          <strong>Age:</strong> {user.age || 'Not provided'}
        </div>
        <div>
          <strong>Gender:</strong> {user.gender || 'Not provided'}
        </div>
        <div>
          <strong>Blood Group:</strong> {user.bloodGroup || 'Not provided'}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
