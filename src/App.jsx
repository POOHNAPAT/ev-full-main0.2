import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import LoginSignup from './components/LoginSignup'
import Admin from './pages/admin/Admin'
import Logout from './pages/Logout'
import MapPage from './pages/Map'
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import Reviews from './pages/Reviews'
import PaymentMethods from './pages/PaymentMethods'
import Payment from './pages/Payment'
import UsageHistory from './pages/UsageHistory'
import Receipt from './pages/Receipt'
import AddVehicle from './pages/AddVehicle'
import Contact from './pages/Contact'
import { AuthProvider, useAuth } from './components/AuthContext'
import { LanguageProvider, useLanguage } from './components/LanguageContext'
import { FaSearch, FaUser } from 'react-icons/fa'
import StationCheck from './pages/admin/StationCheck'

function AppContent() {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, loading, authLoading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If the current route is the login or signup page, render the LoginSignup component
  // full-screen without the main navbar/footer.
  if (location.pathname === '/login') return <LoginSignup initialIsLogin={true} />;
  if (location.pathname === '/signup') return <LoginSignup initialIsLogin={false} />;
  // Allow public access to Home and other public pages even when not authenticated.
  // Protected routes (like booking/profile) handle redirects themselves.

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">EV Charger</div>
        <nav className="space-x-4 flex items-center">
            <Link to="/" className="hover:underline transition duration-300 hover:text-blue-200">{t.home}</Link>
            <Link to="/map" className="hover:underline transition duration-300 hover:text-blue-200">{t.map}</Link>
            <Link to="/reviews" className="hover:underline transition duration-300 hover:text-blue-200">{t.reviews}</Link>
            <Link to="/contact" className="hover:underline transition duration-300 hover:text-blue-200">{t.contact}</Link>
          <button onClick={toggleLanguage} className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
            {language === 'th' ? 'EN' : 'TH'}
          </button>
          {user ? (
            <>
              <Link to="/profile" className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
                <FaUser className="text-lg" />
              </Link>
              <Link to="/logout" className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
                ออกจากระบบ
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="ml-3 bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50">เข้าสู่ระบบ</Link>
              <Link to="/signup" className="ml-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">สมัครสมาชิก</Link>
            </>
          )}
        </nav>
      </header>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<LoginSignup initialIsLogin={true} />} />
            <Route path="/signup" element={<LoginSignup initialIsLogin={false} />} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/map" element={<MapPage/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/booking/:id" element={<Booking/>} />
            <Route path="/payment/:bookingId" element={<Payment/>} />
            <Route path="/reviews" element={<Reviews/>} />
            <Route path="/payment-methods" element={<PaymentMethods/>} />
            <Route path="/usage-history" element={<UsageHistory/>} />
            <Route path="/admin/station-check" element={<StationCheck/>} />
            <Route path="/receipt/:id" element={<Receipt/>} />
            <Route path="/add-vehicle" element={<AddVehicle/>} />
            <Route path="/contact" element={<Contact/>} />
          </Routes>
        </main>

        <footer className="bg-gray-100 text-gray-600 p-4 text-center">
          EV Charger Demo
        </footer>
      </div>
  );
}

export default function App(){
  const location = useLocation();
  // ถ้าอยู่หน้า /admin ไม่ต้องใช้ AuthProvider
  if (location.pathname === '/admin') {
    return (
      <LanguageProvider>
        <Admin />
      </LanguageProvider>
    );
  }
  // ให้หน้า station-check ของแอดมินไม่ต้องล็อกอิน
  if (location.pathname === '/admin/station-check') {
    return (
      <LanguageProvider>
        <StationCheck />
      </LanguageProvider>
    );
  }
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
