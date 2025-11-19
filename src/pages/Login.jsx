import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { FaFacebook, FaGoogle } from 'react-icons/fa';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try{
      await login(email, password);
      navigate('/');
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="left-panel">
          <h2>ยินดีต้อนรับ</h2>
          <p>เข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
          <button className="signup-button">สมัครสมาชิก</button>
        </div>
        <div className="right-panel">
          <h1>เข้าสู่ระบบ</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input placeholder="อีเมล" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <input placeholder="รหัสผ่าน" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <a href="#" className="forgot-password">ลืมรหัสผ่าน?</a>
            <button className="login-button">เข้าสู่ระบบ</button>
            {error && <div className="text-red-600">{error}</div>}
          </form>
          <p className="social-text">หรือเข้าสู่ระบบด้วย</p>
          <div className="social-icons">
            <a href="#" className="social-icon facebook"><FaFacebook /></a>
            <a href="#" className="social-icon google"><FaGoogle /></a>
          </div>
          <p className="mt-3">ยังไม่มียูสเซอร์? <Link to="/signup" className="text-blue-600">สมัคร</Link></p>
        </div>
      </div>
    </div>
  )
}
