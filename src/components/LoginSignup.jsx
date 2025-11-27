// นำเข้า React และ hooks ที่จำเป็น
import React, { useState, useEffect } from 'react';
// นำเข้า routing utilities
import { useNavigate, Link } from 'react-router-dom';
// นำเข้า Auth context สำหรับจัดการ authentication
import { useAuth } from './AuthContext';
// นำเข้า CSS สำหรับหน้า login/signup
import '../styles/LoginSignup.css';
// นำเข้า icons สำหรับ social media login
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

/**
 * LoginSignup Component
 * หน้าสำหรับเข้าสู่ระบบและสมัครสมาชิก
 * สามารถสลับระหว่างโหมด login และ signup ได้
 * @param {boolean} initialIsLogin - กำหนดว่าจะเริ่มที่โหมด login (true) หรือ signup (false)
 */
function LoginSignup({ initialIsLogin = true }) {
  // State สำหรับกำหนดโหมดปัจจุบัน (login หรือ signup)
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  // State สำหรับเก็บข้อมูลใน form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  // State สำหรับแสดงข้อความ error
  const [error, setError] = useState('');
  // ดึง functions จาก Auth context
  const { login, signup, clearAuthUser } = useAuth();
  // Hook สำหรับ navigate ไปหน้าอื่น
  const navigate = useNavigate();
  // State สำหรับเก็บ URL ที่จะ redirect หลัง login สำเร็จ
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  /**
   * ฟังก์ชันจัดการการคลิกปุ่ม Admin
   * ล้างข้อมูล user แล้ว redirect ไปหน้า admin
   */
  const handleAdminClick = (e) => {
    e.preventDefault();
    // ล้างข้อมูล authentication
    clearAuthUser();
    // ไปหน้า admin
    window.location.href = '/admin';
  };

  /**
   * useEffect Hook
   * ทำงานเมื่อ initialIsLogin เปลี่ยน
   * รีเซ็ต form และตรวจสอบ redirect URL จาก sessionStorage
   */
  useEffect(() => {
    // อัปเดตโหมดตาม prop
    setIsLogin(initialIsLogin);
    // รีเซ็ต form data
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    // ล้าง error message
    setError('');
    // ตรวจสอบ redirect URL ที่บันทึกไว้ใน sessionStorage
    try {
      const ok = sessionStorage.getItem('allowLogin');
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      if (ok && redirect) setRedirectAfterLogin(redirect);
    } catch (e) {}
  }, [initialIsLogin]);

  /**
   * ฟังก์ชันจัดการการเปลี่ยนแปลงค่าใน input fields
   */
  const handleInputChange = (e) => {
    // ดึงชื่อและค่าจาก input
    const { name, value } = e.target;
    // อัปเดต formData
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * ฟังก์ชันจัดการการ submit form
   * ทำงาน login หรือ signup ตามโหมดปัจจุบัน
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ล้าง error ก่อนที่จะ submit
    setError('');
    try {
      // ถ้าเป็นโหมด login
      if (isLogin) {
        // เรียก login function
        await login(formData.email, formData.password);
        // หลัง login สำเร็จ, ตรวจสอบว่ามี redirect URL หรือไม่
        try {
          const redirect = sessionStorage.getItem('redirectAfterLogin');
          const allow = sessionStorage.getItem('allowLogin');
          if (allow && redirect) {
            // ล้างข้อมูลจาก sessionStorage
            sessionStorage.removeItem('allowLogin');
            sessionStorage.removeItem('redirectAfterLogin');
            // redirect ไปยังหน้าที่ต้องการ
            navigate(redirect);
            return;
          }
        } catch (e) {}
        // ถ้าไม่มี redirect ให้ไปหน้าแรก
        navigate('/');
      } else {
        // ถ้าเป็นโหมด signup
        // ตรวจสอบว่า password ตรงกันหรือไม่
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        // เรียก signup function
        const created = await signup(formData.email, formData.password);
        // หลังสมัครสมาชิกสำเร็จ, ตรวจสอบ redirect URL
        try {
          const redirect = sessionStorage.getItem('redirectAfterLogin');
          const allow = sessionStorage.getItem('allowLogin');
          if (allow && redirect) {
            // ล้างข้อมูลจาก sessionStorage
            sessionStorage.removeItem('allowLogin');
            sessionStorage.removeItem('redirectAfterLogin');
            // redirect ไปยังหน้าที่ต้องการ
            navigate(redirect);
            return;
          }
        } catch (e) {}
        // ถ้าไม่มี redirect ให้ไปหน้าแรก
        navigate('/');
      }
    } catch (err) {
      // แสดง error message ถ้ามีปัญหา
      setError(err.message);
    }
  };

  /**
   * ฟังก์ชันสลับระหว่างโหมด login และ signup
   */
  const toggleMode = () => {
    // สลับโหมด
    setIsLogin(!isLogin);
    // รีเซ็ต form
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    // ล้าง error
    setError('');
  };

  // แสดง UI ของหน้า login/signup
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
