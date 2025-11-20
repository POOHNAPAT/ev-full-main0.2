import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  BatteryCharging, 
  Users, 
  Calendar, 
  DollarSign, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Power,
  RefreshCw,
  History,
  Shield
} from 'lucide-react';
import MapPage from './Map';
import '../styles/Map.css';

// --- MOCK DATA (Offline Mode) ---
const INITIAL_ADMINS = [
  { id: 1, username: 'admin', name: 'Super Admin', role: 'super_admin' }
];

const INITIAL_USERS = [
  { id: 1, name: 'Somchai Jaiidee', email: 'somchai@test.com', status: 'active', carModel: 'Tesla Model 3' },
  { id: 2, name: 'Somsri Rakdee', email: 'somsri@test.com', status: 'pending', carModel: 'BYD Atto 3' },
];

const INITIAL_STATIONS = [
  { id: 1, name: 'Station A - Siam', lat: 50, lng: 30, status: 'available', type: 'DC 120kW', price: 7.5 },
  { id: 2, name: 'Station B - Asoke', lat: 40, lng: 60, status: 'charging', type: 'AC 22kW', price: 5.5, currentSession: { user: 'Somchai', percent: 45 } },
  { id: 3, name: 'Station C - Bangna', lat: 70, lng: 80, status: 'maintenance', type: 'DC 50kW', price: 6.5 },
];

const INITIAL_BOOKINGS = [
  { id: 101, stationId: 1, userId: 1, time: '2023-10-25 14:00', status: 'confirmed' },
  { id: 102, stationId: 2, userId: 2, time: '2023-10-25 15:30', status: 'pending' },
];

const INITIAL_PAYMENTS = [
  { id: 501, userId: 1, amount: 350, date: '2023-10-24', status: 'completed', station: 'Station A' },
  { id: 502, userId: 2, amount: 120, date: '2023-10-24', status: 'refund_requested', station: 'Station B' },
];

// --- COMPONENTS ---

// 1. Login Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin({ username, role: 'admin' });
    } else {
      alert('Login Failed: Try username "admin" and password "password"');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">EV Admin Login</h2>
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

// 2. Main Application
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // App States
  const [stations, setStations] = useState(INITIAL_STATIONS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [appUsers, setAppUsers] = useState(INITIAL_USERS);
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);

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
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard stations={stations} bookings={bookings} payments={payments} />;
      case 'map': return <MapPage stations={stations} />;
      case 'stations': return <StationManagement stations={stations} setStations={setStations} />;
      case 'users': return <UserManagement users={appUsers} setUsers={setAppUsers} />;
      case 'admins': return <AdminManagement admins={admins} setAdmins={setAdmins} />;
      case 'history': return <HistoryView payments={payments} setPayments={setPayments} />;
      default: return <Dashboard stations={stations} bookings={bookings} payments={payments} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
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
          <SidebarItem icon={<Power size={20} />} text="จัดการตู้ชาร์จ" active={currentView === 'stations'} onClick={() => setCurrentView('stations')} />
          <SidebarItem icon={<Users size={20} />} text="สมาชิก (Users)" active={currentView === 'users'} onClick={() => setCurrentView('users')} />
          <SidebarItem icon={<Shield size={20} />} text="ผู้ดูแล (Admins)" active={currentView === 'admins'} onClick={() => setCurrentView('admins')} />
          <SidebarItem icon={<History size={20} />} text="ประวัติ & การเงิน" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700 bg-slate-900">
          <button onClick={() => setUser(null)} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition">
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
          </div>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, text, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{text}</span>
  </button>
);

// --- SUB-VIEWS ---

const Dashboard = ({ stations, bookings, payments }) => {
  const available = stations.filter(s => s.status === 'available').length;
  const charging = stations.filter(s => s.status === 'charging').length;
  const revenue = payments.filter(p => p.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="รายได้ทั้งหมด" value={`฿${revenue.toLocaleString()}`} icon={<DollarSign size={24} className="text-green-500" />} color="bg-green-50" />
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between ${color}`}>
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className="p-3 bg-white rounded-full shadow-sm">
      {icon}
    </div>
  </div>
);

const StationManagement = ({ stations, setStations }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newStation, setNewStation] = useState({ name: '', type: 'DC 50kW', price: 0, status: 'available', lat: '', lng: '' });

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
    const id = Math.max(...stations.map(s => s.id)) + 1;
    setStations([...stations, { ...newStation, id, lat: Number(newStation.lat), lng: Number(newStation.lng) }]);
    setIsAdding(false);
    setNewStation({ name: '', type: 'DC 50kW', price: 0, status: 'available', lat: '', lng: '' });
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
              <option>AC 22kW</option>
              <option>DC 50kW</option>
              <option>DC 120kW</option>
            </select>
            <input required type="number" placeholder="ราคาต่อหน่วย" className="border p-2 rounded" value={newStation.price} onChange={e => setNewStation({...newStation, price: Number(e.target.value)})} />
            <input required type="number" step="any" placeholder="Latitude" className="border p-2 rounded" value={newStation.lat} onChange={e => setNewStation({...newStation, lat: e.target.value})} />
            <input required type="number" step="any" placeholder="Longitude" className="border p-2 rounded" value={newStation.lng} onChange={e => setNewStation({...newStation, lng: e.target.value})} />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex-1">บันทึก</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">ยกเลิก</button>
            </div>
          </form>
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

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => toggleStatus(station.id)}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
                  station.status === 'maintenance' 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                {station.status === 'maintenance' ? 'เปิดใช้งาน' : 'ปิดปรับปรุง'}
              </button>
              <button onClick={() => handleDelete(station.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                <Trash2 size={18} />
              </button>
            </div>
            <button className="w-full mt-2 py-2 text-blue-600 text-sm hover:bg-blue-50 rounded">
              ดูประวัติการใช้งาน
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const QueueManagement = ({ bookings, setBookings, stations, users }) => {
  const cancelBooking = (id) => {
    if(window.confirm('ยืนยันการยกเลิกคิวนี้?')) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
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
                    <button className="text-blue-600 hover:text-blue-800" title="เปลี่ยนเวลา"><Edit size={18} /></button>
                    <button onClick={() => cancelBooking(booking.id)} className="text-red-600 hover:text-red-800" title="ยกเลิก"><XCircle size={18} /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HistoryView = ({ payments, setPayments }) => {
  const [filter, setFilter] = useState('all');

  const processRefund = (id) => {
    if(window.confirm('ยืนยันการคืนเงิน? (จำลองระบบ)')) {
      setPayments(payments.map(p => p.id === id ? { ...p, status: 'refunded' } : p));
      alert('คืนเงินสำเร็จ (Mock)');
    }
  };

  const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['all', 'completed', 'refund_requested', 'refunded'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600">Transaction ID</th>
              <th className="p-4 text-gray-600">วันที่</th>
              <th className="p-4 text-gray-600">สถานี</th>
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
                <td className="p-4">{p.station}</td>
                <td className="p-4 font-bold">฿{p.amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    p.status === 'completed' ? 'bg-green-100 text-green-800' :
                    p.status === 'refund_requested' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {p.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {p.status === 'refund_requested' && (
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

const UserManagement = ({ users, setUsers }) => {
  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
  };

  const approveUser = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
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
                <button onClick={() => toggleStatus(u.id)} className="text-gray-500 hover:bg-gray-100 p-1 rounded" title="ระงับ/ปลดระงับ">
                  <Power size={18} />
                </button>
                <button className="text-red-500 hover:bg-red-50 p-1 rounded" title="ลบ">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminManagement = ({ admins, setAdmins }) => {
    const [newAdmin, setNewAdmin] = useState({ username: '', name: '', role: 'admin' });

    const handleAdd = (e) => {
        e.preventDefault();
        setAdmins([...admins, { ...newAdmin, id: Date.now() }]);
        setNewAdmin({ username: '', name: '', role: 'admin' });
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
                                <td className="p-4">
                                    {a.role !== 'super_admin' && (
                                        <button onClick={() => setAdmins(admins.filter(x => x.id !== a.id))} className="text-red-500 hover:underline text-sm">ลบ</button>
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