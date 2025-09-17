import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const AddMedicalRecordDoctor = () => {
  const { id: patientId } = useParams();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Notes cannot be empty.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await axios.post(`/doctor/patients/${patientId}/records`, { notes });
      setSuccess('Medical record added!');
      setNotes('');
      // Optionally navigate to records page:
      // navigate(`/doctor/patients/${patientId}`);
    } catch (err) {
      setError('Error adding medical record.');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Add Medical Record</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={12}             
          style={{ width: '100%', resize: 'vertical', fontSize: '16px', padding: '10px' }}
          placeholder="Enter medical notes here..."
          disabled={submitting}
        />
        <br />
        <button type="submit" disabled={submitting} style={{ marginTop: '12px', padding: '10px 20px' }}>
          Add Record
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    </div>
  );
};

export default AddMedicalRecordDoctor;
