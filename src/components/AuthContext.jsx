import React, { createContext, useContext, useEffect, useState } from 'react';
import { findUserByEmail, addUser } from '../data/users';

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(()=> {
    // Check for stored user session on app load
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));

      const foundUser = findUserByEmail(email);
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (email, password) => {
    setAuthLoading(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));

      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const newUser = addUser(email, password);
      const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setUser(null);
    localStorage.removeItem('currentUser');
    setAuthLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, authLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
