import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();

  const handlePaymentMethods = () => {
    navigate('/payment-methods');
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-section">
          <h1 className="profile-title">Profile</h1>
          <div className="user-info">
            <h2 className="profile-subtitle">ข้อมูลผู้ใช้</h2>
            <div className="user-info">
              <div className="user-avatar">น</div>
              <p className="user-name">นาย xxxx xxxxx</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="profile-subtitle">Applications</h2>
          <div className="applications-grid">
            <button
              onClick={() => navigate('/usage-history')}
              className="app-button"
            >
              <span className="app-button-icon">📋</span> ประวัติการใช้งาน
            </button>
            <button
              onClick={handlePaymentMethods}
              className="app-button"
            >
              <span className="app-button-icon">💳</span> วิธีการชำระเงิน
            </button>
          </div>
        </div>

        <div className="actions-section">
          <h2 className="actions-title">ปุ่มดำเนินการ</h2>
          <div className="actions-buttons">
            <Link to="/add-vehicle" className="action-button">
              <span className="action-button-icon">➕</span> เพิ่มพาหนะ
            </Link>
            <button className="action-button secondary">
              <span className="action-button-icon">🚪</span> Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
