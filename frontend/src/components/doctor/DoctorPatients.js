import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await axios.get('/doctor/patients');
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>{error}</p>;
  if (patients.length === 0) return <p>No patients found for your department.</p>;

  return (
    <div>
      <h2>Your Patients</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient._id}>
            {patient.fullName}
            {' '}
            <button onClick={() => navigate(`/doctor/patients/${patient._id}`)}>
              View Records
            </button>
            <button onClick={() => navigate(`/doctor/patients/${patient._id}/add-record`)}>
              Add Medical Record
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorPatients;

