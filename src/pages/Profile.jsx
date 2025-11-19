import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCar, FaChargingStation, FaTrash } from 'react-icons/fa';
import '../styles/Profile.css';
import '../styles/Vehicles.css';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('นาย xxxx xxxxx');
  const [userEmail, setUserEmail] = useState('example@email.com');
  const [userPhone, setUserPhone] = useState('081-234-5678');
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedPhone = localStorage.getItem('userPhone');
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
    if (savedPhone) setUserPhone(savedPhone);
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
  }, []);

  const handlePaymentMethods = () => {
    navigate('/payment-methods');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userPhone', userPhone);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedName = localStorage.getItem('userName') || 'นาย xxxx xxxxx';
    const savedEmail = localStorage.getItem('userEmail') || 'example@email.com';
    const savedPhone = localStorage.getItem('userPhone') || '081-234-5678';
    setUserName(savedName);
    setUserEmail(savedEmail);
    setUserPhone(savedPhone);
    setIsEditing(false);
  };

  const handleDeleteVehicle = (vehicleId) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-section">
          <h1 className="profile-title">Profile</h1>
          <div className="user-info">

            <div className="user-details">
              {isEditing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="user-name-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="user-email-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone:</label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="user-phone-input"
                    />
                  </div>
                  <div className="button-group">
                    <button onClick={handleSave} className="save-button">บันทึก</button>
                    <button onClick={handleCancel} className="cancel-button">ยกเลิก</button>
                  </div>
                </div>
              ) : (
                <div className="display-info">
                  <div className="user-text-info">
                    <p className="user-name">{userName}</p>
                    <p className="user-email">{userEmail}</p>
                    <p className="user-phone">{userPhone}</p>
                  </div>
                  <button onClick={handleEdit} className="edit-button">แก้ไข</button>
                </div>
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

        {vehicles.length > 0 && (
          <div className="profile-section">
            <h2 className="profile-subtitle">พาหนะของฉัน</h2>
            <div className="vehicles-list">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="vehicle-card">
                  <div className="vehicle-icon">
                    <FaChargingStation className="text-green-600" />
                  </div>
                  <div className="vehicle-details">
                    <h3 className="vehicle-title">{vehicle.brand} {vehicle.model} ({vehicle.year})</h3>
                    <p className="vehicle-info">ทะเบียน: {vehicle.licensePlate}</p>
                    {vehicle.batteryCapacity && (
                      <p className="vehicle-info">แบตเตอรี่: {vehicle.batteryCapacity} kWh</p>
                    )}
                    {vehicle.chargingType && (
                      <p className="vehicle-info">การชาร์จ: {vehicle.chargingType}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="vehicle-delete-btn"
                    title="ลบพาหนะ"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="actions-section">
          <h2 className="actions-title">ปุ่มดำเนินการ</h2>
          <div className="actions-buttons">
            <Link to="/add-vehicle" className="action-button">
              <span className="action-button-icon">➕</span> เพิ่มพาหนะ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
