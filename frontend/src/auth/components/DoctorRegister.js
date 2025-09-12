import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const initialFormState = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  dob: '',
  age: '',
  gender: '',
  bloodGroup: '',
  specialty: '',
};

const genders = ['male', 'female', 'other'];

const specialties = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Surgery',
  'Dermatology',
  'Psychiatry',
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.age || formData.age <= 0) newErrors.age = 'Valid Age is required';
    if (!formData.gender) newErrors.gender = 'Gender selection is required';
    if (!formData.bloodGroup.trim()) newErrors.bloodGroup = 'Blood Group is required';
    if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    setSuccessMsg('');

    try {
      const { data } = await axios.post('/auth/register-doctor', formData);
      setSuccessMsg(data.msg);
      setFormData(initialFormState);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setApiError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '1rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>Doctor Registration</h2>
      <form onSubmit={handleSubmit} noValidate>
        {[
          { label: 'Full Name', name: 'fullName', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Password', name: 'password', type: 'password' },
          { label: 'Phone', name: 'phone', type: 'text', optional: true },
          { label: 'Address', name: 'address', type: 'text', optional: true },
          { label: 'Date of Birth', name: 'dob', type: 'date' },
          { label: 'Age', name: 'age', type: 'number' },
        ].map(({ label, name, type, optional }) => (
          <div key={name} style={{ marginBottom: 12 }}>
            <label htmlFor={name} style={{ display: 'block', fontWeight: 'bold' }}>
              {label} {optional ? '(optional)' : '*'}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, borderColor: errors[name] ? 'red' : '#ccc', borderRadius: 4 }}
              min={type === 'number' ? 0 : undefined}
              required={!optional}
            />
            {errors[name] && <small style={{ color: 'red' }}>{errors[name]}</small>}
          </div>
        ))}

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="gender" style={{ display: 'block', fontWeight: 'bold' }}>
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderColor: errors.gender ? 'red' : '#ccc', borderRadius: 4 }}
            required
          >
            <option value="">Select gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
          {errors.gender && <small style={{ color: 'red' }}>{errors.gender}</small>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="bloodGroup" style={{ display: 'block', fontWeight: 'bold' }}>
            Blood Group *
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderColor: errors.bloodGroup ? 'red' : '#ccc', borderRadius: 4 }}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          {errors.bloodGroup && <small style={{ color: 'red' }}>{errors.bloodGroup}</small>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="specialty" style={{ display: 'block', fontWeight: 'bold' }}>
            Specialty *
          </label>
          <select
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderColor: errors.specialty ? 'red' : '#ccc', borderRadius: 4 }}
            required
          >
            <option value="">Select Specialty</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {errors.specialty && <small style={{ color: 'red' }}>{errors.specialty}</small>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#999' : '#007bff',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          {loading ? 'Registering...' : 'Register as Doctor'}
        </button>

        {apiError && <p style={{ color: 'red', marginTop: 12 }}>{apiError}</p>}
        {successMsg && <p style={{ color: 'green', marginTop: 12 }}>{successMsg}</p>}
      </form>
    </div>
  );
};

export default DoctorRegister;
