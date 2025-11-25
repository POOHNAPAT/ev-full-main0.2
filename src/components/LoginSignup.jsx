import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/LoginSignup.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

function LoginSignup({ initialIsLogin = true }) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { login, signup, clearAuthUser } = useAuth();
  const navigate = useNavigate();
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  const handleAdminClick = (e) => {
    e.preventDefault();
    clearAuthUser();
    window.location.href = '/admin';
  };

  useEffect(() => {
    setIsLogin(initialIsLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    try {
      const ok = sessionStorage.getItem('allowLogin');
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      if (ok && redirect) setRedirectAfterLogin(redirect);
    } catch (e) {}
  }, [initialIsLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        // after successful login, redirect back if requested
        try {
          const redirect = sessionStorage.getItem('redirectAfterLogin');
          const allow = sessionStorage.getItem('allowLogin');
          if (allow && redirect) {
            sessionStorage.removeItem('allowLogin');
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirect);
            return;
          }
        } catch (e) {}
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        const created = await signup(formData.email, formData.password);
        // After registration, signup now auto-logs in the user. Redirect accordingly.
        try {
          const redirect = sessionStorage.getItem('redirectAfterLogin');
          const allow = sessionStorage.getItem('allowLogin');
          if (allow && redirect) {
            sessionStorage.removeItem('allowLogin');
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirect);
            return;
          }
        } catch (e) {}
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh' }}>
      <div style={{ position: 'absolute', left: 16, top: 16, zIndex: 60 }}>
        <Link to="/" className="back-home-button bg-white text-blue-600 px-3 py-1 rounded shadow">กลับหน้าหลัก</Link>
      </div>
      <a className="admin-button top-right" href="/admin" onClick={handleAdminClick}>
        Admin
      </a>
      <div className="login-container">
        <div className="left-panel">
          <h2>{isLogin ? 'Hello, Welcome!' : 'Join Us!'}</h2>
          <p>{isLogin ? 'ลงทะเบียนเพื่อใช้งาน' : 'Already have an account?'}</p>
          <button className="signup-button" onClick={toggleMode}>
            {isLogin ? 'Register' : 'Log in'}
          </button>
        </div>

        <div className="right-panel">
          <h1>{isLogin ? 'Log in' : 'Sign up'}</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {!isLogin && (
              <div className="input-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            {isLogin && (
              <a href="#" className="forgot-password">Forgot Password</a>
            )}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <button type="submit" className="login-button">
              {isLogin ? 'Log in' : 'Register'}
            </button>

            <p className="social-text">or register with social platforms</p>

            <div className="social-icons">
              <a href="#" className="social-icon"><FaGoogle /></a>
              <a href="#" className="social-icon"><FaFacebookF /></a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
