import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const AdminAddMedicalRecord = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Surgery',
    'Dermatology',
    'Psychiatry'
  ]); // Example departments, you can fetch from API later

  const [form, setForm] = useState({
    patientId: '',
    department: '',
    doctorId: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch patients list (only patients)
    const fetchPatients = async () => {
      try {
        const { data } = await axios.get('/admin/patients'); // You may need to create this endpoint or reuse existing
        setPatients(data);
      } catch {
        setError('Failed to load patients');
      }
    };

    // Fetch doctors list (only doctors)
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get('/admin/doctors'); // You may need to create this endpoint or reuse existing
        setDoctors(data);
      } catch {
        setError('Failed to load doctors');
      }
    };

    fetchPatients();
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.patientId || !form.department || !form.notes.trim()) {
      setError('Patient, Department and Notes are required.');
      return;
    }

    try {
      await axios.post('/admin/medical-records', {
        patientId: form.patientId,
        department: form.department,
        doctorId: form.doctorId || null,
        notes: form.notes,
      });
      setSuccess('Medical record added successfully!');
      setForm({ patientId: '', department: '', doctorId: '', notes: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add medical record');
    }
  };

  return (
    <div>
      <h2>Add Medical Record</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Patient:
          <select name="patientId" value={form.patientId} onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.fullName}
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Department:
          <select name="department" value={form.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Doctor (optional):
          <select name="doctorId" value={form.doctorId} onChange={handleChange}>
            <option value="">No Doctor Assigned</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.fullName} ({d.specialty})
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Notes:
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Enter medical notes here"
          />
        </label>
        <br />

        <button type="submit">Add Medical Record</button>
      </form>
    </div>
  );
};

export default AdminAddMedicalRecord;
