import React, { createContext, useContext, useEffect, useState } from 'react';

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

      const cleanEmail = String(email || '').trim().toLowerCase();

      const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

      // Fetch users from API
      let foundUser = null;
      try {
        const res = await fetch(base + '/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users from API');
        }
        const data = await res.json();
        const list = Array.isArray(data.users) ? data.users : (Array.isArray(data) ? data : []);
        foundUser = list.find(u => String(u.email || '').trim().toLowerCase() === cleanEmail);
      } catch (e) {
        throw new Error('Unable to connect to server. Please try again later.');
      }

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // check status
      const status = String(foundUser.status || 'active').toLowerCase();
      if (status === 'pending') throw new Error('บัญชียังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ');
      if (status === 'banned' || status === 'suspended') throw new Error('บัญชีถูกระงับ ติดต่อผู้ดูแลระบบ');

      if (foundUser.password !== password) {
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
      const cleanEmail = String(email || '').trim().toLowerCase();

      // Create user via API
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

      try {
        // fetch current users to check duplicates on server
        const listRes = await fetch(base + '/api/users');
        if (!listRes.ok) {
          throw new Error('Failed to fetch users from API');
        }
        const listData = await listRes.json();
        const serverUsers = Array.isArray(listData.users) ? listData.users : (Array.isArray(listData) ? listData : []);
        if (serverUsers.find(u => String(u.email || '').trim().toLowerCase() === cleanEmail)) {
          throw new Error('User already exists with this email');
        }

        // Create new user
        const payload = { email: cleanEmail, password, status: 'active' };
        const res = await fetch(base + '/api/users', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
        });
        
        if (!res.ok) {
          throw new Error('Failed to create user');
        }
        
        const created = await res.json();
        // auto-login newly created user
        const userData = { id: created.id, email: created.email, name: created.name };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return created;
      } catch (e) {
        throw new Error(e.message || 'Unable to connect to server. Please try again later.');
      }
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

  const clearAuthUser = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, authLoading, login, signup, logout, clearAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
