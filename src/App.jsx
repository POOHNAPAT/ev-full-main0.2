import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import LoginSignup from './components/LoginSignup'
import MapPage from './pages/Map'
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import Reviews from './pages/Reviews'
import PaymentMethods from './pages/PaymentMethods'
import UsageHistory from './pages/UsageHistory'
import AddVehicle from './pages/AddVehicle'
import Contact from './pages/Contact'
import { AuthProvider, useAuth } from './components/AuthContext'
import { LanguageProvider, useLanguage } from './components/LanguageContext'
import { FaSearch, FaUser } from 'react-icons/fa'

function AppContent() {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <LoginSignup initialIsLogin={true} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">EV Charger</div>
        <nav className="space-x-4 flex items-center">
            <Link to="/" className="hover:underline transition duration-300 hover:text-blue-200">{t.home}</Link>
            <Link to="/map" className="hover:underline transition duration-300 hover:text-blue-200">{t.map}</Link>
            <Link to="/reviews" className="hover:underline transition duration-300 hover:text-blue-200">{t.reviews}</Link>
            <div className="flex items-center space-x-1 bg-white text-blue-600 px-3 py-1 rounded-full">
              <FaSearch className="text-sm" />
              <input
                type="text"
                placeholder={t.searchAll}
                className="bg-transparent text-blue-600 placeholder-blue-600 text-sm outline-none w-48"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = '/map';
                  }
                }}
              />
            </div>
            <Link to="/contact" className="hover:underline transition duration-300 hover:text-blue-200">{t.contact}</Link>
          <button onClick={toggleLanguage} className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
            {language === 'th' ? 'EN' : 'TH'}
          </button>
          <Link to="/profile" className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
            <FaUser className="text-lg" />
          </Link>
          <button onClick={() => {
            const { logout } = useAuth();
            logout();
          }} className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
            Logout
          </button>
        </nav>
      </header>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<LoginSignup initialIsLogin={true} />} />
            <Route path="/signup" element={<LoginSignup initialIsLogin={false} />} />
            <Route path="/map" element={<MapPage/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/booking/:id" element={<Booking/>} />
            <Route path="/reviews" element={<Reviews/>} />
            <Route path="/payment-methods" element={<PaymentMethods/>} />
            <Route path="/usage-history" element={<UsageHistory/>} />
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
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
