import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { FaCalendarAlt, FaClock, FaBolt, FaWifi, FaCoffee, FaRestroom, FaShieldAlt, FaUtensils, FaShoppingCart, FaMapMarkerAlt, FaCheckCircle, FaEdit, FaQrcode, FaArrowLeft } from 'react-icons/fa';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';
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
  const [stations, setStations] = useState([]);
  // station starts as null; accesses must be guarded (previously caused crash)
  const [station, setStation] = useState(null);
  const [step, setStep] = useState('select');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Load stations from API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
        const response = await fetch(apiBase + '/api/stations');
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const data = await response.json();
        setStations(Array.isArray(data) ? data : []);

        // Find the station by id
        const foundStation = (Array.isArray(data) ? data : []).find(s => String(s.id) === String(id) || String(s.stationSerial) === String(id));
        setStation(foundStation || { id, name: id, availablePorts: 1, available: 'N/A', power: 'N/A', amenities: 'N/A' });
      } catch (error) {
        console.error('Error fetching stations:', error);
        setStation({ id, name: id, availablePorts: 1, available: 'N/A', power: 'N/A', amenities: 'N/A' });
      }
    };
    
    fetchStations();
  }, [id]);
  
  // QR Scanner modal state
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const handleBook = () => {
    if (!user) {
      try { sessionStorage.setItem('allowLogin', '1'); sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search); } catch (e) {}
      navigate('/login');
      return;
    }
    if (!station) {
      alert('กำลังโหลดข้อมูลสถานี กรุณารอสักครู่');
      return;
    }
    // Treat unknown availability as available (default 1) so user can submit
    const availablePorts = station?.availablePorts == null ? 1 : Number(station?.availablePorts || 0);
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
      
      // POST to API only
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const resp = await fetch(base + '/api/bookings', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(bookingData) 
      });
      
      if (!resp.ok) {
        throw new Error('Failed to create booking');
      }
      
      const created = await resp.json();
      console.log('Created booking via API:', created);

      // Best-effort: decrement station availablePorts if API supports it
      try {
        await fetch(base + '/api/stations/' + encodeURIComponent(id) + '/decrement', { method: 'PUT' });
      } catch (e) {
        // ignore if not supported
      }
      
      // inform user and wait for admin approval
      alert('คำร้องการจองถูกส่งแล้ว รอการอนุมัติจากผู้ดูแลระบบ');
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

          {station && (
            <div className="station-info">
              <FaMapMarkerAlt className="station-info-icon" />
              <div className="station-details">
                <p className="station-name">สถานี: {station?.name}</p>
                <p className="station-date">
                  <FaCalendarAlt className="station-date-icon" />
                  วันที่ 28 พฤศจิกายน 2568
                </p>
              </div>
            </div>
          )}

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
                  {(() => {
                    const ap = station?.availablePorts == null ? 1 : Number(station?.availablePorts || 0);
                    return (
                      <span className={`font-medium ${ap > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {station?.availablePorts == null ? '-' : (station?.availablePorts || 0)}
                      </span>
                    );
                  })()}
                  {(() => {
                    const ap = station?.availablePorts == null ? 1 : Number(station?.availablePorts || 0);
                    return ap <= 0 ? <span className="text-xs text-red-600 ml-2">(เต็ม)</span> : null;
                  })()}
                </p>
                <p className="details-item">กำลังไฟ: <span className="font-medium">{station?.power || '-'}</span></p>
                <p className="details-item">สิ่งอำนวยความสะดวก: {station?.amenities || '-'}</p>
              </div>

              <button
                onClick={handleBook}
                className="book-button"
                disabled={(() => {
                  if (!station || !startTime || !endTime) return true;
                  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) return true;
                  const ap = station?.availablePorts == null ? 1 : Number(station?.availablePorts || 0);
                  return ap <= 0;
                })()}
              >
                <FaCheckCircle />
                {(station?.availablePorts == null ? 1 : Number(station?.availablePorts || 0)) <= 0 ? 'สถานีเต็ม' : 'จองเลย'}
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
                  จุดชาร์จ: {station?.availablePorts || 0}, {station?.power || '-'}
                </p>
                <p className="confirmation-detail">
                  <FaMapMarkerAlt className="confirmation-detail-icon marker" />
                  สิ่งอำนวยความสะดวก: {station?.amenities || '-'}
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
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => setShowQRScanner(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                >
                  <FaQrcode />
                  สแกน QR Code ที่ตู้ชาร์จ
                </button>
              </div>
              <Link to="/" className="back-link">
                <FaArrowLeft />
                กลับไปหน้าแรก
              </Link>
            </div>
          )}
        </div>

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaQrcode style={{ color: '#4f46e5' }} />
                  สแกน QR Code
                </h3>
                <button
                  onClick={() => {
                    setShowQRScanner(false);
                    setScanResult(null);
                    setScanning(false);
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}
                >
                  ✕
                </button>
              </div>

              {!scanResult && !scanning && (
                <div>
                  <div style={{ background: '#f3f4f6', padding: '3rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>
                    <FaQrcode style={{ fontSize: '4rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#6b7280' }}>กดปุ่มด้านล่างเพื่อเริ่มสแกน</p>
                  </div>
                  <button
                    onClick={() => {
                      setScanning(true);
                      // Simulate scanning delay
                      setTimeout(() => {
                        setScanning(false);
                        // Mock scan result with station data
                        setScanResult({
                          success: true,
                          stationId: id,
                          stationName: station.name,
                          bookingId: `BK${Date.now()}`,
                          timestamp: new Date().toLocaleString('th-TH')
                        });
                      }, 2000);
                    }}
                    style={{ width: '100%', background: '#4f46e5', color: 'white', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}
                  >
                    เริ่มสแกน
                  </button>
                </div>
              )}

              {scanning && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ border: '4px solid #e5e7eb', borderTop: '4px solid #4f46e5', borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                  <p style={{ color: '#6b7280' }}>กำลังสแกน QR Code...</p>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {scanResult && (
                <div>
                  <div style={{ background: scanResult.success ? '#d1fae5' : '#fee2e2', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <FaCheckCircle style={{ color: scanResult.success ? '#10b981' : '#ef4444', fontSize: '1.5rem' }} />
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: scanResult.success ? '#065f46' : '#991b1b' }}>
                        {scanResult.success ? 'สแกนสำเร็จ!' : 'สแกนล้มเหลว'}
                      </h4>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: scanResult.success ? '#065f46' : '#991b1b' }}>
                      <p><strong>สถานี:</strong> {scanResult.stationName}</p>
                      <p><strong>Booking ID:</strong> {scanResult.bookingId}</p>
                      <p><strong>เวลา:</strong> {scanResult.timestamp}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setScanResult(null);
                        setScanning(false);
                      }}
                      style={{ flex: 1, background: '#f3f4f6', color: '#374151', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' }}
                    >
                      สแกนอีกครั้ง
                    </button>
                    <button
                      onClick={() => {
                        setShowQRScanner(false);
                        setScanResult(null);
                        setScanning(false);
                      }}
                      style={{ flex: 1, background: '#4f46e5', color: 'white', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' }}
                    >
                      เสร็จสิ้น
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
