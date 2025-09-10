import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await getProfile(token);
      setUser(res.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = useCallback((newToken, userData) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
