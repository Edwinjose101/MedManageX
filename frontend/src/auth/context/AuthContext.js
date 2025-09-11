import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage for persistence
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Initialize token state from localStorage for persistence
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Logout function clears all auth data from state and localStorage
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  // Fetch user profile when token changes, or when app loads
  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setUser(null);
      localStorage.removeItem('user');
      return;
    }
    try {
      const res = await getProfile(token);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch {
      // If token invalid or profile fetch fails, logout user
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Login function stores token and user data in state and localStorage
  const login = useCallback((newToken, userData) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  // Convenience boolean to check if user is authenticated
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
