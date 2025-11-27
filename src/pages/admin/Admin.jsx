/**
 * Admin Dashboard Component
 * หน้าแดชบอร์ดสำหรับผู้ดูแลระบบ EV Charger
 * จัดการสถานีชาร์จ, ผู้ใช้, การจอง, ประวัติการใช้งาน และผู้ดูแลระบบ
 */

// นำเข้า React และ hooks
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// นำเข้า icons จาก lucide-react สำหรับ UI
import { 
  MapPin,           // ไอคอนแผนที่
  BatteryCharging,  // ไอคอนแบตเตอรี่ชาร์จ
  Users,            // ไอคอนผู้ใช้
  Calendar,         // ไอคอนปฏิทิน
  DollarSign,       // ไอคอนเงิน
  Settings,         // ไอคอนตั้งค่า
  LogOut,           // ไอคอนออกจากระบบ
  Search,           // ไอคอนค้นหา
  Plus,             // ไอคอนเพิ่ม
  Trash2,           // ไอคอนลบ
  Edit,             // ไอคอนแก้ไข
  CheckCircle,      // ไอคอนอนุมัติ
  XCircle,          // ไอคอนปฏิเสธ
  Power,            // ไอคอนพลังงาน
  RefreshCw,        // ไอคอนรีเฟรช
  History,          // ไอคอนประวัติ
  Shield            // ไอคอนการป้องกัน
} from 'lucide-react';
import MapPage from '../Map';
import '../../styles/Map.css';
// ข้อมูลทั้งหมดจะถูกโหลดจาก API - ไม่ต้อง import ไฟล์ data โดยตรง

/**
 * Helper function สำหรับดึง API base URL
 * @returns {string} URL ของ API server
 */
const getApiBase = () => {
  return import.meta.env.VITE_API_BASE || 'http://localhost:4000';
};

// หมายเหตุ: ไฟล์ bookings.json อาจยังไม่มี — เริ่มต้นด้วย array ว่าง

// --- COMPONENTS ---

/**
 * Login Component
 * Component สำหรับหน้า login ของผู้ดูแลระบบ
 * @param {Function} onLogin - callback เมื่อ login สำเร็จ
 * @param {Array} admins - รายการผู้ดูแลระบบจาก API
 */
const Login = ({ onLogin, admins = [] }) => {
  // State สำหรับเก็บ username และ password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Debug: แสดงจำนวนผู้ดูแลที่โหลดมาเมื่อ component ถูก render
  useEffect(() => {
    console.log('Login component loaded. Admins available:', admins.length);
    if (admins.length > 0) {
      console.log('Admin usernames:', admins.map(a => a.username));
    }
  }, [admins]);

  /**
   * ฟังก์ชันจัดการการ submit form login
   * ตรวจสอบ username และ password กับรายการผู้ดูแล
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Login attempt:', { username, passwordLength: password.length });
    console.log('Available admins:', admins.length);

    // ใช้ข้อมูล admins ที่โหลดจาก JSON/API ก่อน ถ้าไม่มีค่อยใช้ hardcoded fallback
    let matched = null;
    if (Array.isArray(admins) && admins.length > 0) {
      // ค้นหาผู้ดูแลที่ username และ password ตรงกัน
      matched = admins.find(a => String(a.username || '').trim() === String(username).trim() && String(a.password || '') === String(password));
      
      if (!matched) {
        // Debug: แสดงผลการเปรียบเทียบแต่ละรายการ
        console.log('No match found. Checking credentials...');
        admins.forEach(a => {
          const usernameMatch = String(a.username || '').trim() === String(username).trim();
          const passwordMatch = String(a.password || '') === String(password);
          console.log(`Admin ${a.username}: username match=${usernameMatch}, password match=${passwordMatch}`);
        });
      }
    } else {
      // Fallback: ใช้ hardcoded admin credentials
      console.log('No admins loaded, using fallback');
      if (username === 'admin' && password === 'password') matched = { username, role: 'admin', name: 'Super Admin' };
    }

    // ถ้าพบผู้ดูแลที่ตรงกัน
    if (matched) {
      console.log('Login successful:', matched.username);
      const adminUser = { username: matched.username, role: matched.role || 'admin', name: matched.name || matched.username, id: matched.id || Date.now() };
      localStorage.setItem('adminSession', JSON.stringify(adminUser));
      onLogin(adminUser);
      return;
    }

    alert('Login Failed: กรุณาตรวจสอบ username และ password\n(ผู้ดูแลที่เพิ่งสร้างสามารถเข้าสู่ระบบได้ทันที)');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">EV Admin Login</h2>
        <div className="text-center mb-4">
          <Link to="/login" className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300">กลับไปหน้า Login</Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input 
              type="text" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * PendingBookings Component
 * แสดงรายการจองที่รออนุมัติและจัดการการอนุมัติ/ปฏิเสธ
 * @param {Array} bookings - รายการจองทั้งหมด
 * @param {Function} setBookings - ฟังก์ชันอัปเดต bookings
 * @param {Array} stations - รายการสถานีชาร์จ
 * @param {Function} setStations - ฟังก์ชันอัปเดต stations
 * @param {Function} addToast - ฟังก์ชันแสดง notification
 */
const PendingBookings = ({ bookings, setBookings, stations, setStations, addToast }) => {
  // กรองเฉพาะการจองที่มีสถานะ pending
  const pending = Array.isArray(bookings) ? bookings.filter(b => String(b.status).toLowerCase() === 'pending') : [];
  // State สำหรับเก็บการจองที่กำลังจะอนุมัติ (สำหรับ confirmation dialog)
  const [confirmTarget, setConfirmTarget] = React.useState(null);
  // State สำหรับแสดงสถานะการประมวลผล
  const [isProcessing, setIsProcessing] = React.useState(false);

  // เปิด confirmation dialog
  const openConfirm = (b) => {
    setConfirmTarget(b);
  };

  // ปิด confirmation dialog
  const closeConfirm = () => {
    setConfirmTarget(null);
  };

  /**
   * ฟังก์ชันอนุมัติการจอง
   * - อัปเดตสถานะการจองเป็น 'approved'
   * - ลดจำนวนช่องว่างของสถานี
   * - อัปเดต UI และแสดง notification
   */
  const doApprove = async () => {
    if (!confirmTarget) return;
    setIsProcessing(true);
    const b = confirmTarget;
    const base = getApiBase();
    let updated = null;
    try {
      // Try server-side update first
      if (base) {
        const resp = await fetch(base + '/api/bookings/' + b.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved', approvedAt: new Date().toISOString() }) });
        if (resp.ok) {
          updated = await resp.json();
        }
      }
    } catch (e) {
      console.warn('API booking update failed, will fallback to local', e);
    }

    try {
      // If server couldn't update, fallback to local update
      if (!updated) {
        updated = updateBooking({ ...b, status: 'approved', approvedAt: new Date().toISOString() });
      }

      // Decrement station availability: try server endpoint first
      let remaining = null;
      try {
        if (base) {
          const sresp = await fetch(base + '/api/stations/' + b.stationId + '/decrement', { method: 'PUT' });
          if (sresp.ok) {
            const d = await sresp.json();
            remaining = d.availablePorts;
          }
        }
      } catch (e) {
        console.warn('Station decrement API failed, will fallback', e);
      }

      // Fallback decrement locally
      if (remaining === null) {
        try {
          decrementAvailable(b.stationId);
          const updatedMap = loadStations();
          const st = updatedMap[String(b.stationId)];
          remaining = st ? Number(st.available || st.availablePorts || 0) : null;
        } catch (e) {
          remaining = null;
        }
      }
      // update stations state in UI to reflect change (server or local)
      if (remaining !== null) {
        setStations(prev => prev.map(s => (String(s.id) === String(b.stationId) ? { ...s, availablePorts: remaining } : s)));
      }

      // Update bookings state
      if (updated) {
        setBookings(prev => prev.map(x => Number(x.id) === Number(updated.id) ? updated : x));
      }

      addToast && addToast('อนุมัติการจองเรียบร้อย', 'success', 3000);
      // Optionally show remaining in a brief toast
      if (remaining !== null) addToast && addToast(`ช่องว่างคงเหลือ: ${remaining}`, 'success', 3000);
    } catch (err) {
      console.error('Approve error', err);
      addToast && addToast('เกิดข้อผิดพลาด', 'error', 3000);
    } finally {
      setIsProcessing(false);
      closeConfirm();
    }
  };

  const handleReject = async (b) => {
    if (!window.confirm('ยืนยันการปฏิเสธการจองนี้?')) return;
    const base = getApiBase();
    let updated = null;
    try {
      if (base) {
        const resp = await fetch(base + '/api/bookings/' + b.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected', rejectedAt: new Date().toISOString() }) });
        if (resp.ok) updated = await resp.json();
      }
    } catch (e) {
      console.warn('API reject failed, fallback to local', e);
    }
    if (!updated) {
      updated = updateBooking({ ...b, status: 'rejected', rejectedAt: new Date().toISOString() });
    }
    if (updated) {
      setBookings(prev => prev.map(x => Number(x.id) === Number(updated.id) ? updated : x));
      addToast && addToast('ปฏิเสธการจองแล้ว', 'success', 2000);
    } else {
      addToast && addToast('ไม่สามารถปฏิเสธได้', 'error', 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">รายการจองที่รอการอนุมัติ</h3>
      {pending.length === 0 ? (
        <p className="text-gray-500">ไม่มีคำร้องการจองที่รออยู่</p>
      ) : (
        <div className="space-y-3">
          {pending.map(b => {
            // Get station name from stations array by stationId
            const station = stations.find(s => String(s.id) === String(b.stationId));
            const stationName = station?.name || b.stationName || 'ไม่ทราบชื่อสถานี';
            const currentAvail = station ? Number(station.availablePorts || station.available || 0) : null;
            
            return (
              <div key={b.id} className="p-4 border rounded-lg flex justify-between items-start bg-slate-50">
                  <div>
                    <div className="font-semibold">{stationName} <span className="text-sm text-gray-500">(ID: {b.stationId})</span></div>
                    <div className="text-sm text-gray-600">ผู้จอง: {b.userEmail || 'ไม่ระบุ'}</div>
                    <div className="text-sm text-gray-600 mt-1">วันที่: {b.date} • เวลา: {b.startTime} - {b.endTime}</div>
                    <div className="text-xs text-gray-500 mt-1">ส่งเมื่อ: {new Date(b.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className={`text-xs px-2 py-1 rounded-full border ${currentAvail !== null && currentAvail <= 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      ช่องว่างที่เหลืออยู่: {currentAvail !== null ? currentAvail : 'ไม่ทราบ'}
                    </div>
                    <button 
                      onClick={() => openConfirm(b)} 
                      disabled={currentAvail !== null && currentAvail <= 0}
                      className={`px-3 py-1 rounded text-sm ${currentAvail !== null && currentAvail <= 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                    >
                      Approve
                    </button>
                    <button onClick={() => handleReject(b)} className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700">Reject</button>
                  </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation modal */}
      {confirmTarget && (() => {
        const station = stations.find(s => String(s.id) === String(confirmTarget.stationId));
        const stationName = station?.name || confirmTarget.stationName || 'ไม่ทราบชื่อสถานี';
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={closeConfirm}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-96">
              <h4 className="text-lg font-semibold mb-2">ยืนยันการอนุมัติการจอง</h4>
              <p className="text-sm text-gray-700">สถานี: <strong>{stationName}</strong></p>
              <p className="text-sm text-gray-700">เวลาที่จอง: {confirmTarget.startTime} - {confirmTarget.endTime}</p>
            {
              (() => {
                const st = stations.find(s => String(s.id) === String(confirmTarget.stationId));
                const current = st ? Number(st.availablePorts || st.available || 0) : null;
                const predicted = current !== null ? Math.max(0, current - 1) : null;
                const isFull = current !== null && current <= 0;
                return (
                  <>
                    <p className={`mt-3 text-sm ${isFull ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                      ช่องว่างปัจจุบัน: {current !== null ? current : 'ไม่ทราบ'} — หลังอนุมัติจะเหลือ: {predicted !== null ? predicted : 'ไม่ทราบ'}
                    </p>
                    {isFull && (
                      <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">⚠️ สถานีนี้เต็มแล้ว ไม่สามารถอนุมัติการจองได้</p>
                    )}
                  </>
                );
              })()
            }
            <div className="mt-4 flex items-center justify-between">
              <button onClick={closeConfirm} className="px-4 py-2 rounded bg-gray-200">ยกเลิก</button>
              <button 
                onClick={doApprove} 
                disabled={isProcessing || (() => {
                  const st = stations.find(s => String(s.id) === String(confirmTarget.stationId));
                  const current = st ? Number(st.availablePorts || st.available || 0) : null;
                  return current !== null && current <= 0;
                })()} 
                className="px-4 py-2 rounded bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'กำลังประมวลผล...' : 'ยืนยันอนุมัติ'}
              </button>
            </div>
          </div>
        </div>
      );
      })()}
    </div>
  );
};

// 2. Main Application
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  // API availability + toast notifications
  const [apiAvailable, setApiAvailable] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, level = 'error', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, level }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  };
  
  // App States (start empty and load from API on mount; keep imports as fallbacks)
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [payments, setPayments] = useState([]);

  // Helper: build station label map from stations array
  const buildStationLabelMap = (stationsArr) => {
    const map = {};
    if (Array.isArray(stationsArr)) {
      stationsArr.forEach(s => {
        const serial = String(s.stationSerial || s.id || '').trim();
        if (serial) {
          map[serial] = s.name || s.stationSerial || s.id || '';
        }
      });
    }
    return map;
  };

  // Helper: normalize payments like earlier logic
  const normalizePayments = (input, stationsArr = []) => {
    const STATION_LABEL_MAP = buildStationLabelMap(stationsArr);
    const arr = Array.isArray(input)
      ? input
      : (Array.isArray(input?.paymentHistory) ? input.paymentHistory : (Array.isArray(input?.initialHistory) ? input.initialHistory : []));
    return arr.map(p => ({
      ...p,
      amount: typeof p.cost === 'number' ? p.cost : p.amount,
      station: STATION_LABEL_MAP[String(p.stationSerial || p.station || '').trim()] || p.station || ''
    }));
  };

  // Helper: normalize users from users.json (handles `modelcar` -> `carModel`)
  const normalizeUser = (u) => ({
    id: u.id,
    name: u.name || u.fullName || u.username || '',
    email: u.email || u.mail || '',
    status: u.status || 'active',
    carModel: u.carModel || u.modelcar || u.model || '',
    // preserve other fields
    ...u
  });

  useEffect(() => {
    // Load all data from API only
    const base = getApiBase();

    const fetchJson = (url) => fetch(url)
      .then(res => { 
        if (!res.ok) throw new Error(`HTTP ${res.status}`); 
        return res.json(); 
      })
      .then(d => { 
        setApiAvailable(true); 
        return d; 
      })
      .catch((err) => {
        setApiAvailable(false);
        addToast(`API Error: ${err.message}`);
        throw err;
      });

    Promise.all([
      fetchJson(base + '/api/stations'),
      fetchJson(base + '/api/users'),
      fetchJson(base + '/api/admins'),
      fetchJson(base + '/api/payments'),
      fetchJson(base + '/api/bookings'),
      fetchJson(base + '/api/contacts'),
    ]).then(([stationsRes, usersRes, adminsRes, paymentsRes, bookingsRes, contactsRes]) => {
      // stations: normalize raw stations (latitude/longitude) into UI shape (lat/lng)
      const rawArr = Array.isArray(stationsRes) ? stationsRes : (Array.isArray(stationsRes?.stations) ? stationsRes.stations : []);
      const sUI = (Array.isArray(rawArr) ? rawArr : []).map(raw => ({
        id: raw.id,
        stationSerial: raw.stationSerial ?? raw.id ?? '',
        name: raw.name,
        lat: raw.latitude ?? raw.lat ?? 0,
        lng: raw.longitude ?? raw.lng ?? 0,
        status: raw.status === 'busy' ? 'charging' : raw.status === 'offline' ? 'maintenance' : (raw.status || 'available'),
        type: raw.type ?? 'AC',
        price: raw.pricePerUnit ?? raw.price ?? 0,
        availablePorts: raw.availablePorts ?? 0,
        allPorts: raw.allPorts ?? 0,
        currentSession: raw.status === 'busy' ? (raw.currentSession ?? { user: 'Auto', percent: 30 }) : (raw.currentSession ?? null)
      }));
      setStations(sUI);

      // users — normalize regardless of source
      const uSource = Array.isArray(usersRes?.users) ? usersRes.users : (Array.isArray(usersRes) ? usersRes : []);
      setAppUsers(uSource.map(normalizeUser));
      
      // admins — use dedicated API endpoint
      const aSource = Array.isArray(adminsRes) ? adminsRes : [];
      // Also include any users from the users list that have role 'admin' as fallback
      const adminsFromUsers = (Array.isArray(uSource) ? uSource : []).filter(u => String(u.role || '').toLowerCase() === 'admin').map(u => ({ id: u.id, username: (u.email ? String(u.email).split('@')[0] : (u.username || u.name || u.id)), name: u.name || u.username || '', role: 'admin', ...u }));
      const combined = [
        ...aSource.map(a => ({ id: a.id, username: a.username, name: a.name, role: a.role || 'admin', password: a.password, ...a })),
        ...adminsFromUsers
      ];
      // dedupe by id or username
      const seen = new Set();
      const dedup = [];
      combined.forEach(x => {
        const key = x.id != null ? String(x.id) : String(x.username || x.name || '');
        if (!seen.has(key)) { seen.add(key); dedup.push(x); }
      });
      setAdmins(dedup);

      // payments - pass stations array for label mapping
      setPayments(normalizePayments(paymentsRes, sUI));
      // bookings
      const bk = Array.isArray(bookingsRes) ? bookingsRes : [];
      setBookings(bk);
      // contacts
      const cs = Array.isArray(contactsRes) ? contactsRes : [];
      setContacts(cs);
    }).catch((err) => {
      // if API fails completely, show error and set empty data
      console.error('Failed to load data from API:', err);
      addToast('ไม่สามารถโหลดข้อมูลจาก API ได้ กรุณาตรวจสอบการเชื่อมต่อ');
      setStations([]);
      setAppUsers([]);
      setAdmins([]);
      setPayments([]);
      setBookings([]);
      setContacts([]);
    });
  }, []);

  // Load admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        setUser(JSON.parse(adminSession));
      } catch (e) {
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  // Allow admin to stop a charging session immediately from the dashboard
  const stopCharging = (id) => {
    if (!window.confirm('ต้องการหยุดการชาร์จฉุกเฉินสำหรับสถานีนี้ทันทีหรือไม่?')) return;
    setStations(prev => prev.map(s => s.id === id ? { ...s, status: 'available', currentSession: null } : s));
  };

  // Simulation: Charging progress
  useEffect(() => {
    const interval = setInterval(() => {
      setStations(prev => prev.map(st => {
        if (st.status === 'charging' && st.currentSession) {
          return {
            ...st,
            currentSession: {
              ...st.currentSession,
              percent: Math.min(st.currentSession.percent + 1, 100)
            }
          };
        }
        return st;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return <Login onLogin={setUser} admins={admins} />;
  }

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard stations={stations} bookings={bookings} payments={payments} stopCharging={stopCharging} />;
      case 'map': return <MapPage stations={stations} />;
      case 'queue': return <PendingBookings bookings={bookings} setBookings={setBookings} stations={stations} setStations={setStations} addToast={addToast} />;
      case 'stations': return <StationManagement stations={stations} setStations={setStations} />;
      case 'users': return <UserManagement users={appUsers} setUsers={setAppUsers} addToast={addToast} admins={admins} setAdmins={setAdmins} />;
      case 'admins': return <AdminManagement admins={admins} setAdmins={setAdmins} addToast={addToast} />;
      case 'history': return <HistoryView payments={payments} setPayments={setPayments} stations={stations} />;
      case 'reports': return <ReportsView stations={stations} bookings={bookings} payments={payments} contacts={contacts} setContacts={setContacts} />;
      default: return <Dashboard stations={stations} bookings={bookings} payments={payments} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Toast container */}
      <div style={{ position: 'fixed', right: 16, top: 16, zIndex: 60 }}>
        {toasts.map(t => (
          <div key={t.id} className={`mb-2 max-w-sm w-full rounded-lg shadow-lg px-4 py-3 ${t.level === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="text-sm text-gray-800">{t.message}</div>
              <button onClick={() => setToasts(arr => arr.filter(x => x.id !== t.id))} className="text-xs text-gray-500">ปิด</button>
            </div>
          </div>
        ))}
      </div>
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BatteryCharging className="text-green-400" /> EV Manager
          </h1>
          <p className="text-xs text-slate-400 mt-2">v0.0.3 (Offline Mode)</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <SidebarItem icon={<Settings size={20} />} text="ภาพรวม (Dashboard)" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <SidebarItem icon={<MapPin size={20} />} text="ค้นหาตู้ชาร์จ (Map)" active={currentView === 'map'} onClick={() => setCurrentView('map')} />
          <SidebarItem icon={<Calendar size={20} />} text="รายการจอง (Pending)" active={currentView === 'queue'} onClick={() => setCurrentView('queue')} badge={bookings.filter(b => String(b.status).toLowerCase() === 'pending').length} />
          <SidebarItem icon={<Calendar size={20} />} text="รายงาน (Reports)" active={currentView === 'reports'} onClick={() => setCurrentView('reports')} />
          <SidebarItem icon={<Power size={20} />} text="จัดการตู้ชาร์จ" active={currentView === 'stations'} onClick={() => setCurrentView('stations')} />
          <SidebarItem icon={<Users size={20} />} text="สมาชิก (Users)" active={currentView === 'users'} onClick={() => setCurrentView('users')} />
          <SidebarItem icon={<Shield size={20} />} text="ผู้ดูแล (Admins)" active={currentView === 'admins'} onClick={() => setCurrentView('admins')} />
          <SidebarItem icon={<History size={20} />} text="ประวัติ & การเงิน" active={currentView === 'history'} onClick={() => setCurrentView('history')} />

        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700 bg-slate-900">
          <button 
            onClick={() => {
              localStorage.removeItem('adminSession');
              setUser(null);
            }} 
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {currentView === 'dashboard' && 'ภาพรวมระบบ'}
            {currentView === 'map' && 'แผนที่จุดชาร์จ'}
            {currentView === 'stations' && 'จัดการสถานีชาร์จ'}
            {currentView === 'queue' && 'รายการจองคิว'}
            {currentView === 'users' && 'จัดการสมาชิก'}
            {currentView === 'admins' && 'จัดการผู้ดูแลระบบ'}
            {currentView === 'history' && 'ประวัติและธุรกรรม'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              A
            </div>
            <Link to="/admin/station-check" className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">ตรวจสอบสถานี</Link>
          </div>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, text, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </div>
    {badge ? (
      <div className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white">{badge}</div>
    ) : null}
  </button>
);

// --- SUB-VIEWS ---

const Dashboard = ({ stations, bookings, payments, stopCharging }) => {
  const available = stations.filter(s => s.status === 'available').length;
  const charging = stations.filter(s => s.status === 'charging').length;
  // Compute revenue from payment history: treat 'paid' or 'completed' as collected
  const revenue = payments.reduce((acc, p) => {
    const st = String(p.status || '').toLowerCase();
    if (st === 'paid' || st === 'completed') return acc + (Number(p.amount || p.cost || 0));
    return acc;
  }, 0);
  const unpaidTotal = payments.reduce((acc, p) => {
    const st = String(p.status || '').toLowerCase();
    if (st !== 'paid' && st !== 'completed' && st !== 'refunded') return acc + (Number(p.amount || p.cost || 0));
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="รายได้ทั้งหมด" value={`฿${revenue.toLocaleString()}`} icon={<DollarSign size={24} className="text-green-500" />} color="bg-green-50" meta={unpaidTotal > 0 ? { text: `ค้างจ่าย ฿${unpaidTotal.toLocaleString()}`, color: 'text-red-600' } : null} />
        <StatCard title="ตู้ชาร์จว่าง" value={`${available} / ${stations.length}`} icon={<CheckCircle size={24} className="text-blue-500" />} color="bg-blue-50" />
        <StatCard title="กำลังชาร์จ" value={charging} icon={<BatteryCharging size={24} className="text-yellow-500" />} color="bg-yellow-50" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">สถานะการชาร์จแบบ Real-time</h3>
        <div className="space-y-4">
          {stations.filter(s => s.status === 'charging').length === 0 ? (
            <p className="text-gray-500 text-center py-4">ไม่มีการชาร์จในขณะนี้</p>
          ) : (
            stations.filter(s => s.status === 'charging').map(station => (
              <div key={station.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <BatteryCharging size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{station.name}</h4>
                    <p className="text-sm text-gray-500">User: {station.currentSession?.user}</p>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-bold text-blue-600">{station.currentSession?.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${station.currentSession?.percent}%` }}></div>
                  </div>
                  <div className="mt-2 text-right">
                    <button onClick={() => stopCharging && stopCharging(station.id)} className="text-xs text-red-600 underline mt-1 hover:text-red-800">หยุดทันที</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, meta }) => (
  <div className={`p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between ${color}`}>
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {meta && (
        <div className={`text-sm mt-1 ${meta.color || 'text-gray-500'}`}>{meta.text}</div>
      )}
    </div>
    <div className="p-3 bg-white rounded-full shadow-sm">
      {icon}
    </div>
  </div>
);

const StationManagement = ({ stations, setStations }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [newStation, setNewStation] = useState({ name: '', type: 'AC', location: '', availablePorts: '', allPorts: '', status: 'available', latitude: '', longitude: '', amenities: [] });
  const [amenityInput, setAmenityInput] = useState('');

  const zeroPad = (n, width = 3) => String(n).padStart(width, '0');

  const mapRawToUI = (s) => ({
    id: s.id,
    stationSerial: s.stationSerial ?? s.id ?? '',
    name: s.name,
    type: s.type ?? 'AC',
    location: s.location || s.city || '',
    availablePorts: s.availablePorts ?? s.available_ports ?? 0,
    allPorts: s.allPorts ?? s.all_ports ?? 0,
    price: s.pricePerUnit ?? s.price ?? 0,
    status: s.status === 'busy' ? 'charging' : (s.status || 'available'),
    lat: s.latitude ?? s.lat ?? 0,
    lng: s.longitude ?? s.lng ?? 0,
    amenities: Array.isArray(s.amenities) ? s.amenities : (s.amenities ? String(s.amenities).split(',').map(x => x.trim()) : [])
  });

  const toggleStatus = (id) => {
    setStations(stations.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'maintenance' ? 'available' : 'maintenance';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const stopCharging = (id) => {
    if (window.confirm('ต้องการหยุดการชาร์จฉุกเฉินหรือไม่?')) {
      setStations(stations.map(s => s.id === id ? { ...s, status: 'available', currentSession: null } : s));
    }
  };

  const handleDelete = (id) => {
    if(window.confirm('ยืนยันการลบตู้นี้?')) {
      setStations(stations.filter(s => s.id !== id));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const amenitiesArr = Array.isArray(newStation.amenities)
      ? newStation.amenities
      : String(newStation.amenities || '').split(',').map(x => x.trim()).filter(Boolean);
    const payload = {
      name: newStation.name,
      type: newStation.type,
      location: newStation.location,
      availablePorts: Number(newStation.availablePorts || 0),
      allPorts: Number(newStation.allPorts || 0),
      status: newStation.status,
      latitude: Number(newStation.latitude || 0),
      longitude: Number(newStation.longitude || 0),
      amenities: amenitiesArr
    };

    const base = getApiBase();
    fetch(base + '/api/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json()).then(created => {
      addToast('สถานีถูกบันทึกไปยังเซิร์ฟเวอร์', 'success');
      // server returns created station with id and stationSerial; map to UI shape
      const uiStation = mapRawToUI(created);
      setStations(prev => [...prev, uiStation]);
      setIsAdding(false);
      setNewStation({ name: '', type: 'AC', location: '', availablePorts: '', allPorts: '', status: 'available', latitude: '', longitude: '', amenities: '' });
    }).catch(() => {
      addToast('ไม่สามารถเชื่อมต่อ API — บันทึกไว้ในหน่วยความจำเท่านั้น', 'error');
      // fallback: in-memory create and generate stationSerial
      const id = Math.max(0, ...stations.map(s => s.id || 0)) + 1;
      const serial = `ST${zeroPad(id)}`;
        const created = { ...payload, id, stationSerial: serial };
      const uiStation = mapRawToUI(created);
      setStations(prev => [...prev, uiStation]);
      setIsAdding(false);
        setNewStation({ name: '', type: 'AC', location: '', availablePorts: '', allPorts: '', status: 'available', latitude: '', longitude: '', amenities: [] });
    });
  };

  // amenity helpers
  const addAmenity = (value) => {
    const v = String(value || '').trim().replace(/,$/, '');
    if (!v) return;
    setNewStation(ns => {
      const arr = Array.isArray(ns.amenities) ? ns.amenities.slice() : [];
      if (!arr.includes(v)) arr.push(v);
      return { ...ns, amenities: arr };
    });
    setAmenityInput('');
  };

  const removeAmenity = (value) => {
    setNewStation(ns => ({ ...ns, amenities: (Array.isArray(ns.amenities) ? ns.amenities.filter(a => a !== value) : []) }));
  };

  const handleAmenityKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const raw = amenityInput;
      if (raw) {
        // split by commas in case user pasted multiple
        raw.split(',').map(x => x.trim()).filter(Boolean).forEach(addAmenity);
      }
    }
  };

  // Extract lat/lng from Google Maps URL
  const extractLatLngFromUrl = (url) => {
    try {
      // Pattern 1: @lat,lng,zoom format
      const pattern1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match1 = url.match(pattern1);
      if (match1) {
        return { lat: match1[1], lng: match1[2] };
      }
      
      // Pattern 2: !3d format (sometimes used in Google Maps)
      const pattern2 = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
      const match2 = url.match(pattern2);
      if (match2) {
        return { lat: match2[1], lng: match2[2] };
      }
      
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleGoogleMapsUrl = (url) => {
    const coords = extractLatLngFromUrl(url);
    if (coords) {
      setNewStation({
        ...newStation,
        latitude: coords.lat,
        longitude: coords.lng
      });
      alert(`✓ ดึงพิกัดสำเร็จ!\nLatitude: ${coords.lat}\nLongitude: ${coords.lng}`);
    } else {
      alert('ไม่สามารถดึงพิกัดจาก URL นี้ได้\nกรุณาตรวจสอบ URL อีกครั้ง');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> เพิ่มตู้ชาร์จใหม่
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow mb-6 animate-fade-in">
          <h3 className="font-bold mb-4">เพิ่มตู้ชาร์จ</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="ชื่อสถานี" className="border p-2 rounded" value={newStation.name} onChange={e => setNewStation({...newStation, name: e.target.value})} />
            <select className="border p-2 rounded" value={newStation.type} onChange={e => setNewStation({...newStation, type: e.target.value})}>
              <option value="AC">AC</option>
              <option value="DC">DC</option>
              <option value="Both">Both</option>
            </select>

            <input required placeholder="ที่ตั้ง (location)" className="border p-2 rounded" value={newStation.location} onChange={e => setNewStation({...newStation, location: e.target.value})} />
            <input required type="number" placeholder="จำนวนเครื่องทั้งหมด" className="border p-2 rounded" value={newStation.allPorts} onChange={e => setNewStation({...newStation, allPorts: Number(e.target.value)})} />

            <select className="border p-2 rounded" value={newStation.status} onChange={e => setNewStation({...newStation, status: e.target.value})}>
              <option value="available">available</option>
              <option value="maintenance">maintenance</option>
              <option value="charging">charging</option>
            </select>

            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-2">วาง Google Maps URL เพื่อดึงพิกัดอัตโนมัติ</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="วาง Google Maps URL ที่นี่ (เช่น https://www.google.com/maps/place/...)"
                  className="border p-2 rounded flex-1"
                  onPaste={(e) => {
                    setTimeout(() => {
                      handleGoogleMapsUrl(e.target.value);
                      e.target.value = '';
                    }, 100);
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">วาง URL จาก Google Maps แล้วระบบจะดึงพิกัดให้อัตโนมัติ</p>
            </div>

            <input required type="number" step="any" placeholder="Latitude" className="border p-2 rounded bg-gray-50" value={newStation.latitude} onChange={e => setNewStation({...newStation, latitude: e.target.value})} />
            <input required type="number" step="any" placeholder="Longitude" className="border p-2 rounded bg-gray-50" value={newStation.longitude} onChange={e => setNewStation({...newStation, longitude: e.target.value})} />

            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-2">สิ่งอำนวยความสะดวก</label>
              <div className="flex flex-wrap gap-2 items-center border rounded p-2">
                {(Array.isArray(newStation.amenities) ? newStation.amenities : []).map(a => (
                  <span key={a} className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                    {a}
                    <button type="button" onClick={() => removeAmenity(a)} className="ml-2 text-blue-500 hover:text-blue-700">✕</button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="พิมพ์แล้วกด comma หรือ Enter เพื่อเพิ่ม"
                  className="flex-1 min-w-[160px] p-1 outline-none"
                  value={amenityInput}
                  onChange={e => setAmenityInput(e.target.value)}
                  onKeyDown={handleAmenityKeyDown}
                  onBlur={() => { if (amenityInput) { amenityInput.split(',').map(x => x.trim()).filter(Boolean).forEach(addAmenity); } }}
                />
                <button type="button" onClick={() => { if (amenityInput) { amenityInput.split(',').map(x => x.trim()).filter(Boolean).forEach(addAmenity); } }} className="ml-2 bg-green-600 text-white px-3 py-1 rounded text-sm">เพิ่ม</button>
              </div>
            </div>

            <div className="flex gap-2 col-span-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex-1">บันทึก</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">ยกเลิก</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Station Modal */}
      {editingStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setEditingStation(null)}></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-96 max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">แก้ไขสถานี: {editingStation.name}</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ช่องว่างที่ใช้ได้</label>
                <input 
                  type="number" 
                  min="0"
                  max={editingStation.allPorts || 999}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={editingStation.availablePorts}
                  onChange={(e) => setEditingStation({...editingStation, availablePorts: Number(e.target.value)})}
                />
                <p className="text-xs text-gray-500 mt-1">จำนวนช่องที่พร้อมใช้งาน (ต้องไม่เกิน {editingStation.allPorts})</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนช่องทั้งหมด</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={editingStation.allPorts}
                  onChange={(e) => setEditingStation({...editingStation, allPorts: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ราคาต่อหน่วย (฿/kWh)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.5"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={editingStation.price || 0}
                  onChange={(e) => setEditingStation({...editingStation, price: Number(e.target.value)})}
                />
                <p className="text-xs text-gray-500 mt-1">ราคาค่าไฟฟ้าต่อหน่วย (kWh)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                <select 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={editingStation.status}
                  onChange={(e) => setEditingStation({...editingStation, status: e.target.value})}
                >
                  <option value="available">พร้อมใช้งาน</option>
                  <option value="maintenance">ปิดปรับปรุง</option>
                  <option value="charging">กำลังชาร์จ</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => {
                  // Update station in state
                  setStations(stations.map(s => s.id === editingStation.id ? editingStation : s));
                  
                  // Try to update via API
                  const base = getApiBase();
                  if (base) {
                    // Prepare station data with pricePerUnit for API
                    const stationData = {
                      ...editingStation,
                      pricePerUnit: editingStation.price || 0,
                      latitude: editingStation.lat,
                      longitude: editingStation.lng
                    };
                    
                    fetch(base + '/api/stations/' + editingStation.id, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(stationData)
                    }).catch(() => {
                      console.warn('API update failed, using local state only');
                    });
                  }
                  
                  setEditingStation(null);
                }}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                บันทึก
              </button>
              <button 
                onClick={() => setEditingStation(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(station => (
          <div key={station.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{station.name}</h3>
                <p className="text-sm text-gray-500">{station.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                station.status === 'available' ? 'bg-green-100 text-green-800' :
                station.status === 'charging' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {station.status.toUpperCase()}
              </span>
            </div>

            {station.status === 'charging' && (
               <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                 <div className="flex justify-between text-sm mb-1">
                   <span>กำลังชาร์จ: {station.currentSession?.user}</span>
                   <span className="font-bold">{station.currentSession?.percent}%</span>
                 </div>
                 <button onClick={() => stopCharging(station.id)} className="text-xs text-red-600 underline mt-1 hover:text-red-800">
                   หยุดการชาร์จฉุกเฉิน
                 </button>
               </div>
            )}

            <div className="text-sm text-gray-600 mb-3">
              <div className="flex justify-between py-1">
                <span>ช่องว่าง:</span>
                <span className={`font-semibold ${station.availablePorts > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {station.availablePorts} / {station.allPorts}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>ราคา:</span>
                <span className="font-semibold text-blue-600">
                  ฿{station.price || 0}/kWh
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setEditingStation(station)}
                className="flex-1 py-2 px-3 rounded text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center gap-1"
              >
                <Edit size={16} /> แก้ไข
              </button>
              <button 
                onClick={() => toggleStatus(station.id)}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
                  station.status === 'maintenance' 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                {station.status === 'maintenance' ? 'เปิด' : 'ปิด'}
              </button>
              <button onClick={() => handleDelete(station.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QueueManagement = ({ bookings, setBookings, stations, users }) => {
  // Edit time modal state
  const [editingBooking, setEditingBooking] = useState(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');

  const generateTimeSlots = (intervalMinutes = 15) => {
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
  const timeSlots = generateTimeSlots(15);

  const openEdit = (b) => {
    const rawTime = String(b.time || '').trim();
    let start = b.startTime;
    let end = b.endTime;
    if ((!start || !end) && rawTime.includes('-')) {
      const parts = rawTime.split('-');
      start = start || parts[0].trim();
      end = end || parts[1].trim();
    }
    setEditStart(start || '');
    setEditEnd(end || '');
    setEditingBooking(b);
  };

  const closeEdit = () => {
    setEditingBooking(null);
    setEditStart('');
    setEditEnd('');
  };

  const saveEdit = async () => {
    if (!editingBooking) return;
    if (!editStart || !editEnd) { alert('กรุณาเลือกเวลาเริ่มและเวลาสิ้นสุด'); return; }
    // simple ordering check
    const toMinutes = (t) => { const [H,M] = String(t).split(':').map(Number); return (H||0)*60+(M||0); };
    if (toMinutes(editEnd) <= toMinutes(editStart)) { alert('เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม'); return; }
    const payload = {
      startTime: editStart,
      endTime: editEnd,
      time: `${editStart}-${editEnd}`
    };
    const base = getApiBase();
    let updated = null;
    try {
      if (base) {
        const resp = await fetch(base + '/api/bookings/' + editingBooking.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          updated = await resp.json();
        }
      }
    } catch (e) {
      // ignore - fallback to local
    }
    if (!updated) {
      updated = updateBooking({ ...editingBooking, ...payload });
    }
    if (updated) {
      setBookings(prev => prev.map(x => Number(x.id) === Number(updated.id) ? { ...x, ...payload } : x));
      window.dispatchEvent(new CustomEvent('bookings-changed', { detail: { action: 'update', booking: updated } }));
      closeEdit();
    } else {
      alert('ไม่สามารถบันทึกการแก้ไขเวลาได้');
    }
  };

  const cancelBooking = (id) => {
    if(window.confirm('ยืนยันการยกเลิกคิวนี้?')) {
      const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
      setBookings(updated);
      const obj = updated.find(x => x.id === id);
      if (obj) updateBooking(obj);
    }
  };

  const approveBooking = (id) => {
    if(window.confirm('อนุมัติการจองนี้และเริ่มหักจำนวนช่องว่างใช่หรือไม่?')) {
      const updated = bookings.map(b => b.id === id ? { ...b, status: 'confirmed' } : b);
      setBookings(updated);
      const obj = updated.find(x => x.id === id);
      if (obj) {
        // persist
        updateBooking(obj);
        // decrement station availability
        try { decrementAvailable(obj.stationId); } catch (e) {}
      }
    }
  };

  const getStationName = (id) => stations.find(s => s.id === id)?.name || 'Unknown';
  const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unknown';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-600">Booking ID</th>
            <th className="p-4 font-semibold text-gray-600">ผู้ใช้</th>
            <th className="p-4 font-semibold text-gray-600">สถานี</th>
            <th className="p-4 font-semibold text-gray-600">เวลาจอง</th>
            <th className="p-4 font-semibold text-gray-600">สถานะ</th>
            <th className="p-4 font-semibold text-gray-600">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map(booking => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="p-4 text-gray-900 font-medium">#{booking.id}</td>
              <td className="p-4">{getUserName(booking.userId)}</td>
              <td className="p-4 text-gray-600">{getStationName(booking.stationId)}</td>
              <td className="p-4">{booking.time}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="p-4 flex gap-2">
                {booking.status !== 'cancelled' && (
                  <>
                    <button onClick={() => openEdit(booking)} className="text-blue-600 hover:text-blue-800" title="เปลี่ยนเวลา"><Edit size={18} /></button>
                    {booking.status === 'pending' && (
                      <button onClick={() => approveBooking(booking.id)} className="text-green-600 hover:text-green-800" title="อนุมัติ"><CheckCircle size={18} /></button>
                    )}
                    <button onClick={() => cancelBooking(booking.id)} className="text-red-600 hover:text-red-800" title="ยกเลิก"><XCircle size={18} /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit}></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-[360px] max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">แก้ไขเวลาการจอง #{editingBooking.id}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">เวลาเริ่ม</label>
                <select value={editStart} onChange={e => {
                  const v = e.target.value; setEditStart(v); if (!editEnd || toMinutes(editEnd) <= toMinutes(v)) { setEditEnd(timeSlots[Math.min(timeSlots.indexOf(v)+1, timeSlots.length-1)]); }
                }} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">เลือกเวลาเริ่ม</option>
                  {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">เวลาสิ้นสุด</label>
                <select value={editEnd} onChange={e => setEditEnd(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">เลือกเวลาสิ้นสุด</option>
                  {timeSlots.map(ts => <option key={ts} value={ts} disabled={editStart && toMinutes(ts) <= toMinutes(editStart)}>{ts}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={saveEdit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">บันทึก</button>
              <button onClick={closeEdit} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryView = ({ payments, setPayments, stations }) => {
  const [filter, setFilter] = useState('all');
  const [stationSelected, setStationSelected] = useState('ทั้งหมด');
  const [qSearch, setQSearch] = useState('');
  const [searchType, setSearchType] = useState('all'); // all | id | stationSerial | stationName | plate
  const [showSuggestions, setShowSuggestions] = useState(false);

  const processRefund = async (id) => {
    if(!window.confirm('ยืนยันการคืนเงิน?')) return;
    const base = getApiBase();
    let updated = null;
    try {
      if (base) {
        const resp = await fetch(base + `/api/payments/${id}/refund`, { method: 'POST' });
        if (resp.ok) {
          updated = await resp.json();
        }
      }
    } catch (e) {
      console.warn('API refund failed, using local fallback', e);
    }
    if (!updated) {
      // Fallback: update local state only
      setPayments(payments.map(p => p.id === id ? { ...p, status: 'refunded', refundedAt: new Date().toISOString() } : p));
      alert('คืนเงินสำเร็จ (Local)');
    } else {
      setPayments(payments.map(p => p.id === id ? updated : p));
      alert('คืนเงินสำเร็จ');
    }
  };

  // Build dynamic filter options from actual statuses present in payments
  const statusOptions = Array.from(new Set(['all', ...payments.map(p => String(p.status || '').toLowerCase())]));

  // Build list of station options by merging imported stations and payment entries
  // Use stationSerial as the unique key when available, otherwise fall back to station name.
  const stationOptions = (() => {
    const map = new Map();

    if (Array.isArray(stations)) {
      stations.forEach(s => {
        const key = String(s.stationSerial ?? s.id ?? s.name ?? '').trim();
        if (!key) return;
        const label = s.name || s.stationSerial || s.id || key;
        map.set(key, { key, label });
      });
    }

    payments.forEach(p => {
      const key = String(p.stationSerial || p.station || '').trim();
      if (!key) return;
      const label = p.station || key;
      if (!map.has(key)) {
        map.set(key, { key, label });
      } else {
        const existing = map.get(key);
        if ((!existing.label || existing.label === existing.key) && p.station) {
          map.set(key, { key, label });
        }
      }
    });

    const options = [{ key: 'ทั้งหมด', label: 'ทั้งหมด' }, ...Array.from(map.values())];
    return options;
  })();

  // Build a quick lookup map from stationSerial -> station name (from imported stations)
  const stationLabelMap = (() => {
    const m = {};
    if (Array.isArray(stations)) {
      stations.forEach(s => {
        const key = String(s.stationSerial ?? s.name ?? '').trim();
        if (!key) return;
        m[key] = s.name || s.stationSerial || key;
      });
    }
    return m;
  })();

  // Combined filtering: status filter, station filter, and free-text/number search
  const q = String(qSearch || '').trim().toLowerCase();
  let filteredPayments = payments;
  if (filter !== 'all') {
    filteredPayments = filteredPayments.filter(p => String(p.status || '').toLowerCase() === filter);
  }
  if (stationSelected && stationSelected !== 'ทั้งหมด') {
    filteredPayments = filteredPayments.filter(p => {
      const pKey = String(p.stationSerial || p.station || '').trim();
      return pKey === stationSelected;
    });
  }

  // Type-aware search: when searchType !== 'all', only search that field
  if (q) {
    filteredPayments = filteredPayments.filter(p => {
      const id = String(p.id || '').toLowerCase();
      const stationSerial = String(p.stationSerial || '').toLowerCase();
      const stationName = (p.station || stationLabelMap[String(p.stationSerial || '').trim()] || '').toLowerCase();
      const plate = String(p.plate || p.details?.plate || p.vehicleId || '').toLowerCase();
      const amountStr = String(p.cost || p.amount || '').toLowerCase();

      if (searchType === 'all') {
        return id.includes(q) || stationSerial.includes(q) || stationName.includes(q) || plate.includes(q) || amountStr.includes(q);
      }
      if (searchType === 'id') return id.includes(q);
      if (searchType === 'stationSerial') return stationSerial.includes(q);
      if (searchType === 'stationName') return stationName.includes(q);
      if (searchType === 'plate') return plate.includes(q);
      return false;
    });
  }

  const statusBadgeClass = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'paid' || s === 'completed') return 'bg-green-100 text-green-800';
    if (s === 'refund_requested') return 'bg-orange-100 text-orange-800';
    if (s === 'refunded') return 'bg-gray-100 text-gray-800';
    // unpaid / pending / other statuses -> red highlight
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap items-center">
        {statusOptions.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
          >
            {String(f).replace('_', ' ')}
          </button>
        ))}
        <div style={{ width: 12 }} />
        <select value={stationSelected} onChange={(e) => setStationSelected(e.target.value)} className="border px-3 py-2 rounded text-sm">
          {stationOptions.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="border px-2 py-2 rounded text-sm">
          <option value="all">ทุกประเภท</option>
          <option value="id">ID</option>
          <option value="stationSerial">หมายเลขสถานี</option>
          <option value="stationName">ชื่อสถานี</option>
          <option value="plate">ป้ายทะเบียน</option>
        </select>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={qSearch}
            onChange={(e) => setQSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={searchType === 'all' ? 'ค้นหา ID / หมายเลขสถานี / ชื่อสถานี / ป้ายทะเบียน' : (searchType === 'id' ? 'ค้นหา ID' : searchType === 'stationSerial' ? 'ค้นหา หมายเลขสถานี' : searchType === 'stationName' ? 'ค้นหา ชื่อสถานี' : 'ค้นหา ป้ายทะเบียน')}
            className="border px-3 py-2 rounded text-sm"
            style={{ minWidth: 220 }}
          />
          <button type="button" onClick={() => setShowSuggestions(s => !s)} className="absolute right-1 top-1 bottom-1 px-2 text-sm bg-white border rounded">^</button>

          {showSuggestions && (
            <div className="absolute left-0 mt-10 w-full max-h-48 overflow-auto bg-white border rounded shadow z-30">
              {(function(){
                // compute suggestions based on searchType and current qSearch
                const setVals = new Set();
                for (const p of payments) {
                  let v = '';
                  if (searchType === 'all') {
                    // aggregate key fields
                    v = String(p.id || '') || String(p.stationSerial || p.station || '') || (p.station || '') || String(p.plate || p.details?.plate || p.vehicleId || '');
                  } else if (searchType === 'id') v = String(p.id || '');
                  else if (searchType === 'stationSerial') v = String(p.stationSerial || p.station || '');
                  else if (searchType === 'stationName') v = (p.station || stationLabelMap[String(p.stationSerial || '').trim()] || '');
                  else if (searchType === 'plate') v = String(p.plate || p.details?.plate || p.vehicleId || '');
                  v = String(v).trim();
                  if (!v) continue;
                  if (qSearch && !v.toLowerCase().includes(qSearch.toLowerCase())) continue;
                  setVals.add(v);
                  if (setVals.size >= 50) break;
                }
                const arr = Array.from(setVals).slice(0, 50);
                return arr.length === 0 ? <div className="p-2 text-sm text-gray-500">ไม่มีคำแนะนำ</div> : arr.map(item => (
                  <div key={item} onMouseDown={(e) => { e.preventDefault(); setQSearch(item); setShowSuggestions(false); }} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">{item}</div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600">Transaction ID</th>
              <th className="p-4 text-gray-600">วันที่</th>
              <th className="p-4 text-gray-600">ชื่อสถานี</th>
              <th className="p-4 text-gray-600">ป้ายทะเบียน</th>
              <th className="p-4 text-gray-600">ยอดเงิน (บาท)</th>
              <th className="p-4 text-gray-600">สถานะ</th>
              <th className="p-4 text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.map(p => (
              <tr key={p.id}>
                <td className="p-4 font-medium">#{p.id}</td>
                <td className="p-4 text-gray-500">{p.date}</td>
                {/* Station name (prefer explicit station or imported mapping) */}
                <td className="p-4">{
                  (p.station && String(p.station).trim()) ||
                  (p.details?.station && String(p.details.station).trim()) ||
                  (stationLabelMap[String(p.stationSerial || '').trim()] ? stationLabelMap[String(p.stationSerial || '').trim()] : (String(p.stationSerial || '').trim() || '-'))
                }</td>
                <td className="p-4">{String(p.plate || p.details?.plate || p.vehicleId || '-')}</td>
                <td className={`p-4 font-bold ${String(p.status || '').toLowerCase() === 'paid' || String(p.status || '').toLowerCase() === 'completed' ? '' : 'text-red-600'}`}>฿{Number(p.amount || p.cost || 0).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(p.status)}`}>
                    {String(p.status || '').replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {String(p.status || '').toLowerCase() === 'refund_requested' && (
                    <button 
                      onClick={() => processRefund(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> คืนเงิน
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserManagement = ({ users, setUsers, addToast, admins, setAdmins }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCarModel, setEditCarModel] = useState('');
  

  const openEditUser = (u) => {
    setEditingUser(u);
    setEditName(u.name || '');
    setEditEmail(u.email || '');
    setEditCarModel(u.carModel || '');
  };

  const closeEditUser = () => {
    setEditingUser(null);
    setEditName('');
    setEditEmail('');
    setEditCarModel('');
  };

  const saveEditUser = async () => {
    if (!editingUser) return;
    if (!editName || !editEmail) { alert('กรุณากรอกชื่อและอีเมล'); return; }
    const payload = { name: editName, email: editEmail, carModel: editCarModel };
    const base = getApiBase();
    let updated = null;
    try {
      if (base) {
        const resp = await fetch(base + `/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) updated = await resp.json();
      }
    } catch (e) {}
    if (!updated) {
      updated = updateUser({ ...editingUser, ...payload });
    }
    if (updated) {
      setUsers(prev => prev.map(x => x.id === updated.id ? updated : x));
      closeEditUser();
    } else {
      alert('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('ยืนยันการลบผู้ใช้นี้?')) return;
    const base = getApiBase();
    let success = false;
    try {
      if (base) {
        const resp = await fetch(base + `/api/users/${id}`, { method: 'DELETE' });
        if (resp.ok) success = true;
      }
    } catch (e) {}
    if (success || !base) {
      setUsers(prev => prev.filter(u => u.id !== id));
      alert('ลบผู้ใช้สำเร็จ');
    } else {
      alert('ไม่สามารถลบผู้ใช้ได้');
    }
  };

  

  const toggleStatus = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u);
    setUsers(updated);
    const userObj = updated.find(u => u.id === id);
    const base = getApiBase();
    if (base && userObj) {
      fetch(base + `/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userObj) })
        .then(res => { if (!res.ok) throw new Error('failed'); return res.json(); })
        .catch(() => {
          updateUser(userObj);
        });
    } else if (userObj) {
      updateUser(userObj);
    }
  };

  const approveUser = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, status: 'active' } : u);
    setUsers(updated);
    const userObj = updated.find(u => u.id === id);
    const base = getApiBase();
    if (base && userObj) {
      fetch(base + `/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userObj) })
        .then(res => { if (!res.ok) throw new Error('failed'); return res.json(); })
        .catch(() => {
          updateUser(userObj);
        });
    } else if (userObj) {
      updateUser(userObj);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">ชื่อ-นามสกุล</th>
            <th className="p-4">รถยนต์</th>
            <th className="p-4">สถานะ</th>
            <th className="p-4">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-4">
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </td>
              <td className="p-4">{u.carModel}</td>
              <td className="p-4">
                 <span className={`px-2 py-1 rounded text-xs ${
                    u.status === 'active' ? 'bg-green-100 text-green-800' :
                    u.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {u.status}
                  </span>
              </td>
              <td className="p-4 flex gap-2">
                {u.status === 'pending' && (
                  <button onClick={() => approveUser(u.id)} className="text-green-600 hover:bg-green-50 p-1 rounded" title="อนุมัติ">
                    <CheckCircle size={18} />
                  </button>
                )}
                <button onClick={() => openEditUser(u)} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="แก้ไข">
                  <Edit size={18} />
                </button>
                <button onClick={() => toggleStatus(u.id)} className="text-gray-500 hover:bg-gray-100 p-1 rounded" title="ระงับ/ปลดระงับ">
                  <Power size={18} />
                </button>
                <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-1 rounded" title="ลบ">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeEditUser}></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-[400px]">
            <h4 className="text-lg font-semibold mb-4">แก้ไขข้อมูลผู้ใช้</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">อีเมล</label>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">รุ่นรถยนต์</label>
                <input value={editCarModel} onChange={e => setEditCarModel(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={saveEditUser} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">บันทึก</button>
              <button onClick={closeEditUser} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminManagement = ({ admins, setAdmins, addToast }) => {
    const [newAdmin, setNewAdmin] = useState({ username: '', name: '', role: 'admin' });
    const [lastGeneratedPassword, setLastGeneratedPassword] = useState('');
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [editUsername, setEditUsername] = useState('');
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('admin');

    const openEditAdmin = (a) => {
      setEditingAdmin(a);
      setEditUsername(a.username || '');
      setEditName(a.name || '');
      setEditRole(a.role || 'admin');
    };

    const closeEditAdmin = () => {
      setEditingAdmin(null);
      setEditUsername('');
      setEditName('');
      setEditRole('admin');
    };

    const saveEditAdmin = async () => {
      if (!editingAdmin) return;
      if (!editUsername || !editName) { alert('กรุณากรอก Username และชื่อ'); return; }
      const payload = { username: editUsername, name: editName, role: editRole };
      const base = getApiBase();
      let updated = null;
      try {
        if (base) {
          const resp = await fetch(base + `/api/admins/${editingAdmin.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (resp.ok) updated = await resp.json();
        }
      } catch (e) {}
      if (!updated) {
        // fallback: update local state
        updated = { ...editingAdmin, ...payload };
      }
      setAdmins(prev => prev.map(x => x.id === updated.id ? updated : x));
      closeEditAdmin();
    };

    const generateRandomPassword = (len = 10) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
      let out = '';
      for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    };

    const handleAdd = (e) => {
        e.preventDefault();
      const generated = generateRandomPassword(10);
      const payload = { ...newAdmin, password: generated };
      const base = getApiBase();
      fetch(base + '/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json()).then(created => {
        addToast('ผู้ดูแลถูกบันทึกแล้ว สามารถเข้าสู่ระบบได้ทันที', 'success', 4000);
        setAdmins(prev => [...prev, created]);
        setNewAdmin({ username: '', name: '', role: 'admin' });
        setLastGeneratedPassword(created.password || generated);
      }).catch(() => {
        addToast('ไม่สามารถเชื่อมต่อ API — บันทึกผู้ดูแลไว้ในหน่วยความจำเท่านั้น', 'error');
        // fallback: in-memory
        const created = { ...payload, id: Date.now() };
        setAdmins(prev => [...prev, created]);
        setNewAdmin({ username: '', name: '', role: 'admin' });
        setLastGeneratedPassword(created.password || generated);
      });
    };

    return (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-4">เพิ่มผู้ดูแลระบบ</h3>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input 
                        placeholder="Username" 
                        className="border p-2 rounded flex-1" 
                        value={newAdmin.username}
                        onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
                        required
                    />
                    <input 
                        placeholder="ชื่อ-นามสกุล" 
                        className="border p-2 rounded flex-1" 
                        value={newAdmin.name}
                        onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-6 rounded hover:bg-blue-700">เพิ่ม</button>
                </form>
                  {lastGeneratedPassword && (
                    <div className="mt-3 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="text-green-600" size={20} />
                            <div className="font-semibold text-green-800">สร้างผู้ดูแลสำเร็จ!</div>
                          </div>
                          <div className="text-sm text-gray-700 mb-1">
                            <strong>Username:</strong> {newAdmin.username || admins[admins.length - 1]?.username || '-'}
                          </div>
                          <div className="text-sm mb-2">
                            <span className="text-gray-700"><strong>รหัสผ่าน:</strong></span>
                            <div className="font-mono font-bold text-lg text-green-900 bg-white px-3 py-2 rounded border border-green-200 mt-1">{lastGeneratedPassword}</div>
                          </div>
                          <div className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                            ⚠️ โปรดบันทึกรหัสผ่านนี้ไว้ — ผู้ดูแลสามารถเข้าสู่ระบบได้ทันที
                          </div>
                        </div>
                        <div>
                          <button onClick={async () => {
                            try { 
                              await navigator.clipboard.writeText(lastGeneratedPassword); 
                              addToast && addToast('คัดลอกรหัสผ่านแล้ว', 'success', 2000); 
                            }
                            catch (e) { addToast && addToast('ไม่สามารถคัดลอกรหัสผ่าน', 'error', 2000); }
                          }} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium">
                            คัดลอก
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4">Username</th>
                            <th className="p-4">ชื่อ</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {admins.map(a => (
                            <tr key={a.id}>
                                <td className="p-4">{a.username}</td>
                                <td className="p-4">{a.name}</td>
                                <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{a.role}</span></td>
                                <td className="p-4 flex gap-2">
                                    {a.role !== 'super_admin' && (
                                        <>
                                          <button onClick={() => openEditAdmin(a)} className="text-blue-600 hover:underline text-sm">แก้ไข</button>
                                          <button onClick={() => setAdmins(admins.filter(x => x.id !== a.id))} className="text-red-500 hover:underline text-sm">ลบ</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             {editingAdmin && (
               <div className="fixed inset-0 z-50 flex items-center justify-center">
                 <div className="absolute inset-0 bg-black/40" onClick={closeEditAdmin}></div>
                 <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-[400px]">
                   <h4 className="text-lg font-semibold mb-4">แก้ไขข้อมูลผู้ดูแล</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium mb-1">Username</label>
                       <input value={editUsername} onChange={e => setEditUsername(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium mb-1">ชื่อ</label>
                       <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium mb-1">Role</label>
                       <select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                         <option value="admin">Admin</option>
                         <option value="super_admin">Super Admin</option>
                       </select>
                     </div>
                   </div>
                   <div className="flex gap-2 mt-6">
                     <button onClick={saveEditAdmin} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">บันทึก</button>
                     <button onClick={closeEditAdmin} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">ยกเลิก</button>
                   </div>
                 </div>
               </div>
             )}
        </div>
    );
};

const ReportsView = ({ stations = [], bookings = [], payments = [], contacts = [], setContacts }) => {
  const totalStations = stations.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => String(b.status || '').toLowerCase() === 'pending').length;
  const revenue = payments.reduce((acc, p) => {
    const st = String(p.status || '').toLowerCase();
    if (st === 'paid' || st === 'completed') return acc + (Number(p.amount || p.cost || 0));
    return acc;
  }, 0);

  const markResolved = async (id) => {
    if (!window.confirm('ทำเครื่องหมายว่าอ่านแล้ว?')) return;
    const base = getApiBase();
    try {
      const response = await fetch(`${base}/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (response.ok) {
        setContacts(contacts.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
        alert('✓ ทำเครื่องหมายว่าอ่านแล้ว');
      }
    } catch (e) {
      console.warn('Failed to mark as resolved:', e);
      alert('⚠ ไม่สามารถอัพเดทได้');
    }
  };

  const removeMessage = async (id) => {
    if (!window.confirm('ยืนยันการลบข้อความนี้?')) return;
    const base = getApiBase();
    try {
      const response = await fetch(`${base}/api/contacts/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== id));
        alert('✓ ลบข้อความสำเร็จ');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (e) {
      console.warn('Failed to delete contact:', e);
      alert('⚠ ไม่สามารถลบได้');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard title="รายได้ที่เก็บได้" value={`฿${revenue.toLocaleString()}`} icon={<DollarSign size={24} className="text-green-500" />} color="bg-green-50" />
        <StatCard title="สถานีทั้งหมด" value={`${totalStations}`} icon={<MapPin size={24} className="text-blue-500" />} color="bg-blue-50" />
        <StatCard title="การจองทั้งหมด" value={`${totalBookings}`} icon={<Calendar size={24} className="text-purple-500" />} color="bg-purple-50" />
        <StatCard title="รอดำเนินการ" value={`${pendingBookings}`} icon={<svg width="20" height="20"><circle cx="10" cy="10" r="9" stroke="#f59e0b" strokeWidth="1.5" fill="none" /></svg>} color="bg-yellow-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">ข้อความจากหน้า Contact</h3>
          {contacts.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีข้อความจากผู้ใช้งาน</p>
          ) : (
            <ul className="space-y-3">
              {contacts.map(c => (
                <li key={c.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{c.name} <span className="text-xs text-gray-500">({c.email})</span></div>
                      <div className="text-sm text-gray-600">{c.subject}</div>
                      <div className="text-sm text-gray-700 mt-2">{c.message}</div>
                      <div className="text-xs text-gray-400 mt-2">ส่งเมื่อ: {new Date(c.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button onClick={() => markResolved(c.id)} className="text-green-600 text-sm">ทำเครื่องหมายว่าอ่านแล้ว</button>
                      <button onClick={() => removeMessage(c.id)} className="text-red-500 text-sm">ลบ</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">สรุปการจองล่าสุด</h3>
          <div className="overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-sm text-gray-600">ID</th>
                  <th className="p-3 text-sm text-gray-600">ผู้ใช้</th>
                  <th className="p-3 text-sm text-gray-600">สถานี</th>
                  <th className="p-3 text-sm text-gray-600">เวลา</th>
                  <th className="p-3 text-sm text-gray-600">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.slice(0, 12).map(b => (
                  <tr key={b.id}>
                    <td className="p-3 text-sm">#{b.id}</td>
                    <td className="p-3 text-sm">{b.userEmail || b.userId || '-'}</td>
                    <td className="p-3 text-sm">{b.stationName || b.stationId || '-'}</td>
                    <td className="p-3 text-sm">{b.startTime || b.time || '-'}</td>
                    <td className="p-3 text-sm">{String(b.status || '').toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};