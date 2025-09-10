import React, { useState, useContext } from 'react';
import { login } from '../api/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Hospital } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
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
      const { data } = await login({ email, password });
      contextLogin(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to the Hospital Management System</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <Mail /> Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </label>
        <label>
          <Lock /> Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-msg">{error}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
