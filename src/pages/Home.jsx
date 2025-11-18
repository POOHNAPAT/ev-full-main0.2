import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import '../styles/Home.css';

export default function Home(){
  const { t } = useLanguage();
  const [recentBooking, setRecentBooking] = useState(null);

  useEffect(() => {
    // Check for recent booking in localStorage
    const booking = localStorage.getItem('recentBooking');
    if (booking) {
      setRecentBooking(JSON.parse(booking));
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="hero-section">
        <h2 className="hero-title">{t.bookEV}</h2>
        <h1 className="hero-main-title">{t.evCharger}</h1>
        <p className="hero-description">ค้นหาสถานีชาร์จใกล้คุณและจองได้อย่างง่ายดาย</p>

        <div className="search-container">
          <input
            aria-label="ค้นหาสถานีชาร์จ"
            placeholder={t.searchPlaceholder}
            className="search-input"
          />
          <Link to="/map" className="search-button">{t.bookButton}</Link>
        </div>
      </section>

      {/* Main Heading */}
      <section className="main-heading">
        <h3 className="main-heading-title">{t.whyBook}</h3>
        <div className="main-heading-divider"></div>
      </section>

      {/* Features */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <span className="text-2xl">⏰</span>
          </div>
          <h4 className="feature-title">{t.advanceBooking}</h4>
          <p className="feature-description">{t.advanceDesc}</p>
          <Link to="/map" className="feature-button">จองเลย</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-green">
            <span className="text-2xl">📊</span>
          </div>
          <h4 className="feature-title">{t.usageReport}</h4>
          <p className="feature-description">{t.usageDesc}</p>
          <Link to="/usage-history" className="feature-button">ดูรายงาน</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-purple">
            <span className="text-2xl">🚗</span>
          </div>
          <h4 className="feature-title">{t.allVehicles}</h4>
          <p className="feature-description">{t.allVehiclesDesc}</p>
          <ul className="vehicle-list">
            <li>CCS2</li>
            <li>Type 2</li>
            <li>Tesla</li>
          </ul>
          <Link to="/add-vehicle" className="feature-button">เพิ่มรถ</Link>
        </div>
      </section>

      {/* Recent Booking Section */}
      {recentBooking && (
        <section className="recent-booking-section">
          <div className="recent-booking-card">
            <h3 className="recent-booking-title">การจองล่าสุด</h3>
            <div className="recent-booking-details">
              <p><strong>สถานี:</strong> {recentBooking.stationName}</p>
              <p><strong>วันที่:</strong> {recentBooking.date}</p>
              <p><strong>เวลา:</strong> {recentBooking.startTime} - {recentBooking.endTime}</p>
              <p><strong>สถานะ:</strong> <span className="status-confirmed">ยืนยันแล้ว</span></p>
            </div>
            <div className="recent-booking-actions">
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="contact-section">
      </section>
    </div>
  )
}
