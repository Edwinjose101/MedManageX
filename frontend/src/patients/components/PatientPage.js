// import React, { useState, useContext } from 'react';
// import { getPatient, createPatient, addMedicalRecord } from '../api/patientApi';
// import { AuthContext } from '../../auth/context/AuthContext';

// const PatientPage = () => {
//   const { token } = useContext(AuthContext);
//   const [searchId, setSearchId] = useState('');
//   const [patient, setPatient] = useState(null);
//   const [department, setDepartment] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSearch = async () => {
//     setError(null);
//     if (!searchId.trim()) {
//       setError('Please enter a Patient ID or name');
//       return;
//     }
//     setLoading(true);
//     try {
//       const resp = await getPatient(searchId, department, token);
//       setPatient(resp.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error fetching patient data');
//       setPatient(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="patient-page">
//       <h2>Patient Management</h2>
//       <div>
//         <input
//           type="text"
//           placeholder="Enter Patient ID or Name"
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value)}
//           disabled={loading}
//           style={{ marginRight: '10px' }}
//         />
//         <input
//           type="text"
//           placeholder="Department (optional)"
//           value={department}
//           onChange={(e) => setDepartment(e.target.value)}
//           disabled={loading}
//           style={{ marginRight: '10px' }}
//         />
//         <button onClick={handleSearch} disabled={loading}>
//           {loading ? 'Searching...' : 'Search Patient'}
//         </button>
//       </div>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {patient && (
//         <div style={{ marginTop: '20px' }}>
//           <h3>Patient: {patient.name}</h3>
//           <p>ID: {patient.patientId}</p>
//           <p>Contact: {patient.contact}</p>

//           <h4>Medical Records {department && `(Filtered by ${department})`}:</h4>
//           {patient.medicalRecords && patient.medicalRecords.length === 0 ? (
//             <p>No medical records found.</p>
//           ) : (
//             <ul>
//               {patient.medicalRecords.map((rec, index) => (
//                 <li key={index}>
//                   <strong>{rec.department}</strong> - {new Date(rec.date).toLocaleDateString()}
//                   <br />
//                   {rec.report}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientPage;
