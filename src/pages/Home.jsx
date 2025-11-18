import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import '../styles/Home.css';

export default function Home(){
  const { t } = useLanguage();

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
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-green">
            <span className="text-2xl">📊</span>
          </div>
          <h4 className="feature-title">{t.usageReport}</h4>
          <p className="feature-description">{t.usageDesc}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-purple">
            <span className="text-2xl">🚗</span>
          </div>
          <h4 className="feature-title">{t.allVehicles}</h4>
          <p className="feature-description">{t.allVehiclesDesc}</p>
          <ul className="vehicle-list">
            <li>CCS2</li>
            <li>CHAdeMO</li>
            <li>Type 2</li>
            <li>Tesla</li>
          </ul>
        </div>
      </section>

      <section id="contact" className="contact-section">
      </section>
    </div>
  )
}
