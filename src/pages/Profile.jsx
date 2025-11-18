import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('นาย xxxx xxxxx');
  const [userAvatar, setUserAvatar] = useState('น');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedName) setUserName(savedName);
    if (savedAvatar) setUserAvatar(savedAvatar);
  }, []);

  const handlePaymentMethods = () => {
    navigate('/payment-methods');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userAvatar', userAvatar);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedName = localStorage.getItem('userName') || 'นาย xxxx xxxxx';
    const savedAvatar = localStorage.getItem('userAvatar') || 'น';
    setUserName(savedName);
    setUserAvatar(savedAvatar);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-section">
          <h1 className="profile-title">Profile</h1>
          <div className="user-info">
            <h2 className="profile-subtitle">ข้อมูลผู้ใช้</h2>
            <div className="user-info">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={userAvatar}
                    onChange={(e) => setUserAvatar(e.target.value)}
                    className="user-avatar-input"
                    maxLength="1"
                  />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="user-name-input"
                  />
                  <button onClick={handleSave} className="save-button">บันทึก</button>
                  <button onClick={handleCancel} className="cancel-button">ยกเลิก</button>
                </>
              ) : (
                <>
                  <div className="user-avatar">{userAvatar}</div>
                  <p className="user-name">{userName}</p>
                  <button onClick={handleEdit} className="edit-button">แก้ไข</button>
                </>
              )}
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
