import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // doctor id for spinner
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPendingDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/admin/pending-doctors');
      setDoctors(data);
    } catch (err) {
      setError('Failed to fetch pending doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    setError('');
    setSuccess('');
    try {
      await axios.patch(`/admin/approve-doctor/${id}`);
      setSuccess('Doctor approved successfully');
      fetchPendingDoctors(); // refresh list
    } catch {
      setError('Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/admin/reject-doctor/${id}`);
      setSuccess('Doctor rejected and removed');
      fetchPendingDoctors(); // refresh list
    } catch {
      setError('Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p>Loading pending doctors...</p>;

  return (
    <div style={{ maxWidth: 900, margin: '1rem auto' }}>
      <h2>Pending Doctor Approvals</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {doctors.length === 0 ? (
        <p>No pending doctors for approval.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th>Full Name</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{doc.fullName}</td>
                <td>{doc.email}</td>
                <td>{doc.specialty}</td>
                <td>
                  <button
                    onClick={() => handleApprove(doc._id)}
                    disabled={actionLoading === doc._id}
                    style={{ marginRight: 8 }}
                  >
                    {actionLoading === doc._id ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(doc._id)}
                    disabled={actionLoading === doc._id}
                    style={{ color: 'red' }}
                  >
                    {actionLoading === doc._id ? 'Rejecting...' : 'Reject'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageDoctors;
