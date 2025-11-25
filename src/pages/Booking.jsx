import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { addBooking } from '../data/bookings';
import { FaCalendarAlt, FaClock, FaBolt, FaWifi, FaCoffee, FaRestroom, FaShieldAlt, FaUtensils, FaShoppingCart, FaMapMarkerAlt, FaCheckCircle, FaEdit, FaQrcode, FaArrowLeft } from 'react-icons/fa';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';
import { loadStations, decrementAvailable } from '../data/stations';
import '../styles/Booking.css';

// Simple QR code component (placeholder)
const QRCode = ({ value }) => (
  <div className="border-2 border-gray-300 p-4 inline-block">
    <p className="text-sm text-center">QR Code for: {value}</p>
    {/* In a real app, use a QR library like qrcode.react */}
  </div>
);

export default function Booking() {
  const { id } = useParams();
  const stations = loadStations();
  const station = stations[id] || { name: id, available: 'N/A', power: 'N/A', amenities: 'N/A' };
  const [step, setStep] = useState('select');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const handleBook = () => {
    if (!user) {
      // remember to redirect back after login
      try { sessionStorage.setItem('allowLogin', '1'); sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search); } catch (e) {}
      navigate('/login');
      return;
    }
    
    // Check if station has available ports (use availablePorts from stations-data.json)
    const availablePorts = Number(station.availablePorts || 0);
    if (availablePorts <= 0) {
      alert('สถานีนี้เต็มแล้ว ไม่สามารถจองได้ในขณะนี้ กรุณาเลือกสถานีอื่น');
      return;
    }
    
    if (startTime && endTime) {
      setStep('confirm');
    }
  };

  // Time slot helpers: generate select options instead of free typing
  const generateTimeSlots = (intervalMinutes = 30) => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += intervalMinutes) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }
    }
    return slots;
  };

  const slots = generateTimeSlots(15);
  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [hh, mm] = String(t).split(':').map(Number);
    return hh * 60 + (mm || 0);
  };

  const findNextSlot = (t) => {
    const i = slots.indexOf(t);
    if (i === -1) return slots[0];
    return slots[Math.min(i + 1, slots.length - 1)];
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        stationId: id,
        stationName: station.name,
        startTime,
        endTime,
        date: '28 พฤศจิกายน 2568',
        timestamp: new Date().toISOString(),
        status: 'pending',
        userEmail: (user && user.email) || '',
        userId: (user && user.id) || null
      };
      // Try to POST to API if available, otherwise fallback to local storage
      let created = null;
      try {
        const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
        const resp = await fetch(base + '/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingData) });
        if (resp.ok) {
          created = await resp.json();
          console.log('Created booking via API:', created);
        } else {
          console.warn('API /api/bookings returned', resp.status);
        }
      } catch (e) {
        console.warn('API not available, falling back to local storage for bookings');
      }

      if (!created) {
        created = addBooking(bookingData);
        console.log('Created booking (pending, local):', created);
      }
      // inform user and wait for admin approval
      alert('คำร้องการจองถูกส่งแล้ว รอการอนุมัติจากผู้ดูแลระบบ');
      // keep on the page or redirect to home
      navigate('/');
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการจอง กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <div className="booking-content">
          <div className="booking-header">
            <FaBolt className="booking-header-icon" />
            <h1 className="booking-title">จองจุดชาร์จ</h1>
          </div>

          <div className="station-info">
            <FaMapMarkerAlt className="station-info-icon" />
            <div className="station-details">
              <p className="station-name">สถานี: {station.name}</p>
              <p className="station-date">
                <FaCalendarAlt className="station-date-icon" />
                วันที่ 28 พฤศจิกายน 2568
              </p>
            </div>
          </div>

          {step === 'select' ? (
            <div className="booking-section">
              <h2 className="section-title">
                <FaClock className="section-title-icon" />
                เลือกเวลาใช้งาน
              </h2>
              <div className="time-selection">
                <div className="time-group">
                  <label className="time-label">เวลาเริ่ม:</label>
                  <select
                    value={startTime}
                    onChange={(e) => {
                      const v = e.target.value;
                      setStartTime(v);
                      // if endTime is not set or <= start, advance endTime to next slot
                      if (!endTime || timeToMinutes(endTime) <= timeToMinutes(v)) {
                        setEndTime(findNextSlot(v));
                      }
                    }}
                    className="time-input"
                  >
                    <option value="">เลือกเวลาเริ่ม</option>
                    {slots.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="time-group">
                  <label className="time-label">เวลาสิ้นสุด:</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="time-input"
                  >
                    <option value="">เลือกเวลาสิ้นสุด</option>
                    {slots.map(s => (
                      <option key={s} value={s} disabled={startTime && timeToMinutes(s) <= timeToMinutes(startTime)}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="station-details-section">
                <h3 className="details-title">
                  <FaBolt className="details-title-icon" />
                  ข้อมูลจุดชาร์จ
                </h3>
                <p className="details-item">
                  จำนวนจุดว่าง: 
                  <span className={`font-medium ${Number(station.availablePorts || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {station.availablePorts || 0}
                  </span>
                  {Number(station.availablePorts || 0) <= 0 && <span className="text-xs text-red-600 ml-2">(เต็ม)</span>}
                </p>
                <p className="details-item">กำลังไฟ: <span className="font-medium">{station.power}</span></p>
                <p className="details-item">สิ่งอำนวยความสะดวก: {station.amenities}</p>
              </div>

              <button
                onClick={handleBook}
                className="book-button"
                disabled={!startTime || !endTime || timeToMinutes(endTime) <= timeToMinutes(startTime) || Number(station.availablePorts || 0) <= 0}
              >
                <FaCheckCircle />
                {Number(station.availablePorts || 0) <= 0 ? 'สถานีเต็ม' : 'จองเลย'}
              </button>
            </div>
          ) : (
            <div className="confirmation-section">
              <h2 className="confirmation-title">
                <FaCheckCircle className="confirmation-title-icon" />
                ยืนยันการจอง
              </h2>
              <div className="confirmation-details">
                <h3 className="confirmation-details-title">รายละเอียดการจอง</h3>
                <p className="confirmation-detail">
                  <FaClock className="confirmation-detail-icon clock" />
                  เวลา: {startTime} - {endTime}
                </p>
                <p className="confirmation-detail">
                  <FaBolt className="confirmation-detail-icon bolt" />
                  จุดชาร์จ: {station.availablePorts || 0}, {station.power}
                </p>
                <p className="confirmation-detail">
                  <FaMapMarkerAlt className="confirmation-detail-icon marker" />
                  สิ่งอำนวยความสะดวก: {station.amenities}
                </p>
              </div>
              <div className="action-buttons">
                <button
                  onClick={() => setStep('select')}
                  className="btn btn-secondary"
                >
                  <FaEdit />
                  แก้ไข
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="btn btn-primary"
                >
                  <FaCheckCircle />
                  เสร็จสิ้น
                </button>
              </div>
            </div>
          )}

          {showQR && (
            <div className="qr-section">
              <h2 className="qr-title">
                <FaQrcode className="qr-title-icon" />
                QR Code สำหรับสแกนตู้ชาร์จ
              </h2>
              <div className="qr-container">
                <QRCode value={`${id}-${startTime}-${endTime}`} />
              </div>
              <p className="qr-instruction">สแกน QR Code ที่ตู้ชาร์จเพื่อเริ่มใช้งาน</p>
              <Link to="/" className="back-link">
                <FaArrowLeft />
                กลับไปหน้าแรก
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
