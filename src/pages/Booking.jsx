import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaBolt, FaWifi, FaCoffee, FaRestroom, FaShieldAlt, FaUtensils, FaShoppingCart, FaMapMarkerAlt, FaCheckCircle, FaEdit, FaQrcode, FaArrowLeft } from 'react-icons/fa';
import '../styles/Booking.css';

// Simple QR code component (placeholder)
const QRCode = ({ value }) => (
  <div className="border-2 border-gray-300 p-4 inline-block">
    <p className="text-sm text-center">QR Code for: {value}</p>
    {/* In a real app, use a QR library like qrcode.react */}
  </div>
);

// Station details mapping
const stations = {
  'central-world': { name: 'Central World – ชั้น B2', available: '6/10', power: '150 kW', amenities: 'Wi-Fi ฟรี, ร้านกาแฟ, ห้องน้ำ, ระบบรักษาความปลอดภัย, พื้นที่พักผ่อน, ร้านอาหาร' },
  'siam-paragon': { name: 'Siam Paragon', available: '4/8', power: '100 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ' },
  'mbk-center': { name: 'MBK Center', available: '5/10', power: '120 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ' },
  'bangkok-mall': { name: 'Bangkok Mall', available: '3/6', power: '80 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ, ร้านอาหาร' },
  'terminal-21': { name: 'Terminal 21', available: '7/12', power: '200 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่พักผ่อน' },
  'central-plaza': { name: 'Central Plaza', available: '2/4', power: '50 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ' },
  'central-chidlom': { name: 'Central Chidlom', available: '8/15', power: '180 kW', amenities: 'Wi-Fi ฟรี, ร้านกาแฟ, ห้องน้ำ, ระบบรักษาความปลอดภัย, ร้านอาหาร, พื้นที่จอดรถ' },
  'emquartier': { name: 'EmQuartier', available: '5/8', power: '120 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่พักผ่อน, ร้านค้า' },
  'gateway-ekamai': { name: 'Gateway Ekamai', available: '4/6', power: '90 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ, ร้านอาหาร, ระบบรักษาความปลอดภัย' },
  'the-emerald': { name: 'The Emerald', available: '6/10', power: '150 kW', amenities: 'Wi-Fi ฟรี, ร้านกาแฟ, ห้องน้ำ, พื้นที่พักผ่อน, ร้านอาหาร' },
  'central-festival': { name: 'Central Festival EastVille', available: '9/14', power: '220 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ, ร้านอาหาร, พื้นที่พักผ่อน, ระบบรักษาความปลอดภัย' },
  'major-cineplex': { name: 'Major Cineplex', available: '3/5', power: '75 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่จอดรถ' },
  'chatuchak-market': { name: 'Chatuchak Weekend Market', available: '12/20', power: '250 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่จอดรถ, ระบบรักษาความปลอดภัย, ร้านค้า, พื้นที่พักผ่อน' },
};

export default function Booking() {
  const { id } = useParams();
  const station = stations[id] || { name: id, available: 'N/A', power: 'N/A', amenities: 'N/A' };
  const [step, setStep] = useState('select');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleBook = () => {
    if (startTime && endTime) {
      setStep('confirm');
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
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="time-input"
                  />
                </div>
                <div className="time-group">
                  <label className="time-label">เวลาสิ้นสุด:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="time-input"
                  />
                </div>
              </div>

              <div className="station-details-section">
                <h3 className="details-title">
                  <FaBolt className="details-title-icon" />
                  ข้อมูลจุดชาร์จ
                </h3>
                <p className="details-item">จำนวนจุดว่าง: <span className="font-medium text-green-600">{station.available}</span></p>
                <p className="details-item">กำลังไฟ: <span className="font-medium">{station.power}</span></p>
                <p className="details-item">สิ่งอำนวยความสะดวก: {station.amenities}</p>
              </div>

              <button
                onClick={handleBook}
                className="book-button"
                disabled={!startTime || !endTime}
              >
                <FaCheckCircle />
                จองเลย
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
                  จุดชาร์จ: {station.available}, {station.power}
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
                  onClick={() => setShowQR(true)}
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
              <Link to="/map" className="back-link">
                <FaArrowLeft />
                กลับไปแผนที่
              </Link>
            </div>
          )}

          <div className="footer-link">
            <Link to="/map">
              <FaArrowLeft className="footer-link-icon" />
              กลับไปแผนที่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
