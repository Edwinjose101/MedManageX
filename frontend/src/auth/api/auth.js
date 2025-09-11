import axios from 'axios';

// Register user
export const register = (data) => axios.post('/api/auth/register', data);

// Login user
export const login = (data) => axios.post('/api/auth/login', data);

// Get current user profile with token in Authorization header
export const getProfile = (token) => {
  return axios.get('/api/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
