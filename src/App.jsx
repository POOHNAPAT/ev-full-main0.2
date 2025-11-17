import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MapPage from './pages/Map'
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import Reviews from './pages/Reviews'
import PaymentMethods from './pages/PaymentMethods'
import UsageHistory from './pages/UsageHistory'
import { AuthProvider } from './components/AuthContext'
import { LanguageProvider, useLanguage } from './components/LanguageContext'

function AppContent() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">EV Charger</div>
        <nav className="space-x-4 flex items-center">
            <Link to="/" className="hover:underline">{t.home}</Link>
            <Link to="/map" className="hover:underline">{t.map}</Link>
            <Link to="/reviews" className="hover:underline">{t.reviews}</Link>
            <a href="#search-all" className="hover:underline">{t.searchAll}</a>
            <a href="#contact" className="hover:underline">{t.contact}</a>
          <button onClick={toggleLanguage} className="ml-3 hover:underline">
            {language === 'th' ? 'EN' : 'TH'}
          </button>
          <Link to="/profile" className="ml-3 hover:underline">
            <span role="img" aria-label="profile">👤</span>
          </Link>
        </nav>
      </header>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/map" element={<MapPage/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/booking/:id" element={<Booking/>} />
            <Route path="/reviews" element={<Reviews/>} />
            <Route path="/payment-methods" element={<PaymentMethods/>} />
            <Route path="/usage-history" element={<UsageHistory/>} />
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
