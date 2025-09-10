import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, Hospital } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient', // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Join the Hospital Management System</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <User /> Name
          <input name="name" value={formData.name} onChange={handleChange} disabled={loading} />
        </label>
        <label>
          <Mail /> Email
          <input name="email" value={formData.email} onChange={handleChange} disabled={loading} />
        </label>
        <label>
          <Lock /> Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
        {/* Optional: role selection */}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="error-msg">{error}</p>}
      </form>
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
