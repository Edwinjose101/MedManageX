import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

const PatientRecords = () => {
  const { id: patientId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get(`/doctor/patients/${patientId}/records`);
        setRecords(data);
        if (data.length > 0) setSelectedRecordIndex(0);
      } catch (err) {
        setError('Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId]);

  if (loading) return <p>Loading records...</p>;
  if (error) return <p>{error}</p>;
  if (records.length === 0) return <p>No records available yet.</p>;

  return (
    <div style={{ display: 'flex', gap: 24, padding: 24, height: '600px' }}>
      {/* Left pane: Date list with scroll */}
      <div
        style={{
          width: 220,
          border: '1px solid #ccc',
          borderRadius: 8,
          overflowY: 'auto',
          padding: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
        aria-label="Dates list"
      >
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Dates</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {records.map((record, index) => (
            <li
              key={record._id}
              onClick={() => setSelectedRecordIndex(index)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderRadius: 6,
                backgroundColor: index === selectedRecordIndex ? '#e0e7ff' : 'transparent',
                fontWeight: index === selectedRecordIndex ? '600' : 'normal',
                marginBottom: 8,
                userSelect: 'none',
                transition: 'background-color 0.2s ease',
              }}
            >
              {new Date(record.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </li>
          ))}
        </ul>
      </div>

      {/* Right pane: Details */}
      <div
        style={{
          flexGrow: 1,
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflowY: 'auto',
        }}
        aria-label="Record details"
      >
        <h3>Details</h3>
        {selectedRecordIndex !== null ? (
          <>
            <p>
              <strong>Date and Time:</strong>{' '}
              {new Date(records[selectedRecordIndex].createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Notes:</strong>
              <br />
              {records[selectedRecordIndex].notes}
            </p>
            <p>
              <strong>By:</strong>{' '}
              {records[selectedRecordIndex].createdByRole === 'admin'
                ? 'Assigned by Administrator'
                : records[selectedRecordIndex].doctorId
                ? `Dr. ${records[selectedRecordIndex].doctorId.fullName || 'Unknown'}`
                : 'By Administrator'}
            </p>
          </>
        ) : (
          <p>Select a date to view details</p>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
