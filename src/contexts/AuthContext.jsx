import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('taskManager_user');
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    if (token) {
      localStorage.setItem('token', token);
      const userObject = { id: 'oauth_user', name: name || 'OAuth User', email: email || '' };
      setUser(userObject);
      localStorage.setItem('taskManager_user', JSON.stringify(userObject)); // Save user details
      window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
    } else if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    // userData should include: name, email, password, password_confirmation
    const res = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem('taskManager_user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token); // Store the token
    return data.user;
  };

  const login = async (credentials) => {
    // credentials should include: email, password
    const res = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem('taskManager_user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token); // Store the token
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskManager_user');
    localStorage.removeItem('token'); // Also remove the token on logout
    // Clear user's tasks when logging out
    localStorage.removeItem('taskManager_tasks');
  };

  const value = {
    user,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};