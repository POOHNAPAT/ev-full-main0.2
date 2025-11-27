import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../components/LanguageContext";
import "../styles/Home.css";
import { useAuth } from '../components/AuthContext';

export default function Home() {
  const { t } = useLanguage();
  const [recentBooking, setRecentBooking] = useState(null);
  const { user } = useAuth();
  const [approvedBookings, setApprovedBookings] = useState([]);
  const navigate = useNavigate();
  
  // Real-time charging status
  const [currentSession, setCurrentSession] = useState(null);
  const [chargingProgress, setChargingProgress] = useState(0);

  useEffect(() => {
    // Check for recent booking in localStorage
    const booking = localStorage.getItem("recentBooking");
    if (booking) {
      setRecentBooking(JSON.parse(booking));
    }
  }, []);

  // load approved bookings for current user
  const loadUserApprovedBookings = async () => {
    try {
      if (!user) {
        setApprovedBookings([]);
        return;
      }

      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      
      // Load from API only
      const response = await fetch(apiBase + '/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const all = await response.json();
      console.log('Loaded bookings from API:', all);

      const email = String(user.email || '').toLowerCase();
      const uid = String(user.id || '');
      const matches = (all || []).filter(b => String(b.status).toLowerCase() === 'approved' && (
        (b.userId && String(b.userId) === uid) || (b.userEmail && String(b.userEmail).toLowerCase() === email)
      ));
      setApprovedBookings(matches);
      console.log('Filtered approved bookings for user:', matches);
    } catch (e) {
      console.error('Error loading bookings:', e);
      setApprovedBookings([]);
    }
  };

  useEffect(() => {
    loadUserApprovedBookings();
    const onBookingsChanged = () => loadUserApprovedBookings();
    window.addEventListener('bookings-changed', onBookingsChanged);
    const onStorage = (e) => {
      if (!e || !e.key) return;
      if (e.key === 'app_bookings_v1') loadUserApprovedBookings();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('bookings-changed', onBookingsChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, [user]);

  // Poll for current charging session
  useEffect(() => {
    if (!user) {
      setCurrentSession(null);
      return;
    }

    const checkCurrentSession = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
        
        // Load from API only
        const response = await fetch(`${apiBase}/api/history`);
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        
        const historyData = await response.json();
        if (!historyData) return;

        const userEmail = String(user.email || '').toLowerCase();
        const userId = String(user.id || '');

        // Find active session (status 'charging' or 'active')
        const sessions = historyData.sessions || [];
        const activeSession = sessions.find(s => 
          (String(s.userId) === userId || String(s.userEmail).toLowerCase() === userEmail) &&
          (s.status === 'charging' || s.status === 'active')
        );

        if (activeSession) {
          setCurrentSession(activeSession);

          // Calculate progress based on time elapsed
          const start = new Date(activeSession.startedAt || Date.now());
          const now = new Date();
          const elapsed = Math.max(0, now - start) / 1000 / 60; // minutes
          const total = parseInt(activeSession.minutes) || 60;
          const progress = Math.min(100, (elapsed / total) * 100);
          setChargingProgress(Math.round(progress));
        } else {
          setCurrentSession(null);
          setChargingProgress(0);
        }
      } catch (e) {
        console.error('Error checking current session', e);
      }
    };

    checkCurrentSession();
    const interval = setInterval(checkCurrentSession, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  const [showFeatures, setShowFeatures] = useState(false);

  const [stationsList, setStationsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    try {
      const map = loadStations();
      const arr = Object.values(map || {});
      // sort by available desc then by name
      arr.sort((a, b) => (Number(b.available || 0) - Number(a.available || 0)) || String(a.name).localeCompare(b.name));
      setStationsList(arr);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleDeleteBooking = () => {
    console.log("Deleting booking...");
    localStorage.removeItem("recentBooking");
    setRecentBooking(null);
    console.log("Booking deleted");
  };

  return (
    <div className="page-background">
      <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text-content">
          <h2 className="hero-title">{t.bookEV}</h2>
          <h1 className="hero-main-title">{t.evCharger}</h1>
          <p className="hero-description">
            ค้นหาสถานีชาร์จใกล้คุณและจองได้อย่างง่ายดาย
          </p>
        </div>

        <div className="search-container" style={{ position: 'relative' }}>
          <input
            aria-label="ค้นหาสถานีชาร์จ"
            placeholder={t.searchPlaceholder}
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowFeatures(true);
            }}
            onFocus={() => setShowFeatures(true)}
            onBlur={() => setTimeout(() => setShowFeatures(false), 160)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                // Navigate to map page when Enter is pressed
                window.location.href = "/map";
              }
            }}
          />
          <Link to="/map" className="search-button">
            {t.bookButton}
          </Link>

          {/* Suggestions dropdown when the user types */}
          {showFeatures && searchTerm.trim() !== "" && stationsList.length > 0 && (
            <div className="search-suggestions">
              <div className="suggestion-scroll">
                {stationsList
                  .filter(s => String(s.name).toLowerCase().includes(String(searchTerm).toLowerCase()))
                  .slice(0, 20)
                  .map(s => (
                    <div
                      key={s.id}
                      className="suggestion-item"
                      onMouseDown={() => navigate(`/booking/${s.id}`)}
                    >
                      <div className="suggestion-icon">🔍</div>
                      <div className="suggestion-text">
                        <div className="suggestion-title">{s.name}</div>
                        <div className="suggestion-sub">ว่าง: {s.available} • {s.power}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Featured stations hidden; using dropdown filtered by typed input */}
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
          <Link to="/map" className="feature-button">
            จองเลย
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-icon-green">
            <span className="text-2xl">📊</span>
          </div>
          <h4 className="feature-title">{t.usageReport}</h4>
          <p className="feature-description">{t.usageDesc}</p>
          <Link to="/usage-history" className="feature-button">
            ดูรายงาน
          </Link>
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
          <Link to="/add-vehicle" className="feature-button">
            เพิ่มรถ
          </Link>
        </div>
      </section>

      {/* Real-time Charging Status */}
      {currentSession && (
        <section className="charging-status-section" style={{ margin: '2rem auto', maxWidth: '800px', padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem' }}>⚡</span>
            กำลังชาร์จอยู่ในขณะนี้
          </h3>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>สถานี</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{currentSession.station || 'N/A'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>ประเภทหัวชาร์จ</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{currentSession.type || 'N/A'}</div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>ความคืบหน้า</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{chargingProgress}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, #4ade80, #22c55e)', height: '100%', width: `${chargingProgress}%`, transition: 'width 0.5s ease' }}></div>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
                เวลาโดยประมาณ: {currentSession.duration || 'N/A'}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.85, textAlign: 'center' }}>
            ระบบจะอัพเดทสถานะอัตโนมัติทุก 5 วินาที
          </div>
        </section>
      )}

      {/* Recent Booking Section */}
      {/* Approved Bookings (from admin confirmation) */}
      {approvedBookings && approvedBookings.length > 0 && (
        <section className="approved-booking-section">
          <div className="approved-booking-card">
            <div className="approved-booking-header">
              <h3 className="approved-booking-title">
                <span className="title-icon">✅</span>
                การจองที่ได้รับการอนุมัติ
              </h3>
              <span className="booking-count-badge">{approvedBookings.length} รายการ</span>
            </div>
            <div className="approved-list">
              {approvedBookings.map(b => (
                <div key={b.id} className="approved-item">
                  <div className="approved-content">
                    <div className="approved-info">
                      <div className="station-icon">📍</div>
                      <div className="station-details">
                        <div className="approved-station">{b.stationName}</div>
                        <div className="approved-meta">
                          <span className="meta-icon">📅</span>
                          {b.date} • {b.startTime} - {b.endTime}
                        </div>
                        <div className="booking-id">รหัสการจอง: #{b.id}</div>
                      </div>
                    </div>
                    <div className="approved-qr-section">
                      <div className="qr-label">สแกนเพื่อเข้าใช้งาน</div>
                      <div className="approved-qr">
                        <img alt="QR code" src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({ bookingId: b.id, stationId: b.stationId, userId: b.userId, email: b.userEmail }))}`} />
                      </div>
                    </div>
                  </div>
                  <div className="approved-actions">
                    <button className="complete-charge-button" onClick={async () => {
                      try {
                        const completedData = { ...b, status: 'completed', completedAt: new Date().toISOString() };
                        
                        // Try to update via API first
                        let updated = null;
                        try {
                          const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                            ? 'http://localhost:4000'
                            : '';
                          if (apiBase) {
                            const response = await fetch(`${apiBase}/api/bookings/${b.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'completed', completedAt: new Date().toISOString() })
                            });
                            if (response.ok) {
                              updated = await response.json();
                              console.log('Updated booking via API:', updated);
                            }
                          }
                          // Navigate to payment page
                          navigate(`/payment/${b.id}`);
                        } catch (apiError) {
                          console.error('Failed to update booking:', apiError);
                          alert('ไม่สามารถอัพเดทการจองได้');
                        }
                      } catch (e) {
                        console.error('Error completing charge', e);
                        alert('ไม่สามารถทำเครื่องหมายการชาร์จเสร็จสิ้นได้');
                      }
                    }}>ชาร์จเสร็จสิ้น</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {recentBooking && (
          <section className="recent-booking-section">
          <div className="recent-booking-card">
            <h3 className="recent-booking-title">การจองล่าสุด</h3>
            <div className="recent-booking-details">
              <p>
                <strong>สถานี:</strong> {recentBooking.stationName}
              </p>
              <p>
                <strong>วันที่:</strong> {recentBooking.date}
              </p>
              <p>
                <strong>เวลา:</strong> {recentBooking.startTime} -{" "}
                {recentBooking.endTime}
              </p>
              <p>
                <strong>สถานะ:</strong>{" "}
                <span className="status-confirmed">ยืนยันแล้ว</span>
              </p>
            </div>
            <div className="recent-booking-actions">
              <button
                onClick={handleDeleteBooking}
                className="delete-booking-button"
              >
                ลบการจอง
              </button>
            </div>
          </div>
        </section>
      )}
      </div>
    </div>
  );
}
