import React, { useState, useContext } from 'react';
import { login as apiLogin } from '../api/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmailFormat = (email) => {
    // Simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!validateEmailFormat(email.trim())) {
      setError('Please enter a valid email');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await apiLogin({ email: email.trim(), password });
      login(data.token, data.user);

      // Redirect based on role
      if (data.user.role === 'admin') {
      navigate('/admin/dashboard');
      } else if (data.user.role === 'doctor') {
      navigate('/doctor/dashboard');
       } else {
      navigate('/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" aria-live="polite">
      <h1>Welcome to the Hospital Management System</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">
          <Mail aria-hidden="true" /> Email
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="Enter your email"
            required
            aria-required="true"
            aria-describedby="emailHelp"
            autoComplete="username"
          />
        </label>
        <label htmlFor="password">
          <Lock aria-hidden="true" /> Password
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="Enter your password"
            required
            aria-required="true"
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && (
          <p className="error-msg" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
