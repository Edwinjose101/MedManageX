import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

const PatientRecords = () => {
  const { id: patientId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get(`/doctor/patients/${patientId}/records`);
        setRecords(data);
      } catch (err) {
        setError('Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) {
      setSubmitError('Note cannot be empty');
      return;
    }
    setSubmitError('');
    setSubmitSuccess('');
    setSubmitting(true);

    try {
      await axios.post(`/doctor/patients/${patientId}/records`, { notes: newNote });
      setNewNote('');
      setSubmitSuccess('Record added successfully');
      // Refresh records
      const { data } = await axios.get(`/doctor/patients/${patientId}/records`);
      setRecords(data);
    } catch (err) {
      setSubmitError('Failed to add record');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading records...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Medical Records</h2>
      {records.length === 0 && <p>No records available yet.</p>}
      <ul>
        {records.map((rec) => (
          <li key={rec._id}>
            <strong>{new Date(rec.createdAt).toLocaleString()}</strong>
            <p>{rec.notes}</p>
            <small>By Dr. {rec.doctorId?.fullName || 'Unknown'}</small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddRecord}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={4}
          placeholder="Add new medical note"
          disabled={submitting}
        />
        <br />
        <button type="submit" disabled={submitting}>Add Record</button>
      </form>

      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      {submitSuccess && <p style={{ color: 'green' }}>{submitSuccess}</p>}
    </div>
  );
};

export default PatientRecords;
