// นำเข้า routing components จาก react-router-dom
import { Routes, Route, Link, useLocation } from 'react-router-dom'
// นำเข้า Page components ต่างๆ
import Home from './pages/Home' // หน้าแรก
import LoginSignup from './components/LoginSignup' // หน้าเข้าสู่ระบบและสมัครสมาชิก
import Admin from './pages/admin/Admin' // หน้าแอดมิน
import Logout from './pages/Logout' // หน้าออกจากระบบ
import MapPage from './pages/Map' // หน้าแผนที่สถานีชาร์จ
import Profile from './pages/Profile' // หน้าโปรไฟล์ผู้ใช้
import Booking from './pages/Booking' // หน้าจองสถานีชาร์จ
import Reviews from './pages/Reviews' // หน้ารีวิว
import PaymentMethods from './pages/PaymentMethods' // หน้าเลือกวิธีชำระเงิน
import Payment from './pages/Payment' // หน้าชำระเงิน
import UsageHistory from './pages/UsageHistory' // หน้าประวัติการใช้งาน
import Receipt from './pages/Receipt' // หน้าใบเสร็จ
import AddVehicle from './pages/AddVehicle' // หน้าเพิ่มรถ
import Contact from './pages/Contact' // หน้าติดต่อเรา
// นำเข้า Context Providers และ Custom Hooks
import { AuthProvider, useAuth } from './components/AuthContext' // จัดการ Authentication
import { LanguageProvider, useLanguage } from './components/LanguageContext' // จัดการภาษา
// นำเข้า Icons จาก react-icons
import { FaSearch, FaUser } from 'react-icons/fa'
import StationCheck from './pages/admin/StationCheck' // หน้าตรวจสอบสถานีสำหรับแอดมิน

/**
 * AppContent Component
 * Component หลักที่แสดง UI ของแอปพลิเคชัน รวมถึง navigation bar และ routing
 */
function AppContent() {
  // ดึง language context สำหรับการจัดการภาษา
  const { language, toggleLanguage, t } = useLanguage();
  // ดึง auth context สำหรับข้อมูลผู้ใช้และสถานะการโหลด
  const { user, loading, authLoading } = useAuth();
  // ดึง location ปัจจุบันจาก router
  const location = useLocation();

  // แสดง loading screen ขณะตรวจสอบ authentication
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // ถ้าอยู่หน้า login หรือ signup ให้แสดงแบบเต็มหน้าจอ ไม่มี navbar/footer
  if (location.pathname === '/login') return <LoginSignup initialIsLogin={true} />;
  if (location.pathname === '/signup') return <LoginSignup initialIsLogin={false} />;
  // หน้าอื่นๆ สามารถเข้าถึงได้แม้ไม่ได้ login
  // หน้าที่ต้องการ authentication จะจัดการ redirect เอง

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header bar พร้อม navigation */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        {/* Logo/Brand name */}
        <div className="text-lg font-bold">EV Charger</div>
        {/* Navigation menu */}
        <nav className="space-x-4 flex items-center">
            {/* เมนูหลักของแอปพลิเคชัน */}
            <Link to="/" className="hover:underline transition duration-300 hover:text-blue-200">{t.home}</Link>
            <Link to="/map" className="hover:underline transition duration-300 hover:text-blue-200">{t.map}</Link>
            <Link to="/reviews" className="hover:underline transition duration-300 hover:text-blue-200">{t.reviews}</Link>
            <Link to="/contact" className="hover:underline transition duration-300 hover:text-blue-200">{t.contact}</Link>
          {/* ปุ่มสลับภาษา TH/EN */}
          <button onClick={toggleLanguage} className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
            {language === 'th' ? 'EN' : 'TH'}
          </button>
          {/* แสดงเมนูตามสถานะการล็อกอิน */}
          {user ? (
            // ถ้า login แล้ว: แสดง icon profile และปุ่มออกจากระบบ
            <>
              <Link to="/profile" className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
                <FaUser className="text-lg" />
              </Link>
              <Link to="/logout" className="ml-3 hover:underline transition duration-300 hover:text-blue-200">
                ออกจากระบบ
              </Link>
            </>
          ) : (
            // ถ้ายังไม่ได้ login: แสดงปุ่มเข้าสู่ระบบและสมัครสมาชิก
            <>
              <Link to="/login" className="ml-3 bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50">เข้าสู่ระบบ</Link>
              <Link to="/signup" className="ml-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">สมัครสมาชิก</Link>
            </>
          )}
        </nav>
      </header>

        {/* Main content area */}
        <main className="flex-1 p-6">
          {/* กำหนด Routes สำหรับทุกหน้าในแอปพลิเคชัน */}
          <Routes>
            {/* หน้าสำหรับแอดมิน */}
            <Route path="/admin" element={<Admin />} />
            {/* หน้าแรก */}
            <Route path="/" element={<Home/>} />
            {/* หน้า Login และ Signup */}
            <Route path="/login" element={<LoginSignup initialIsLogin={true} />} />
            <Route path="/signup" element={<LoginSignup initialIsLogin={false} />} />
            {/* หน้า Logout */}
            <Route path="/logout" element={<Logout/>} />
            {/* หน้าแผนที่สถานีชาร์จ */}
            <Route path="/map" element={<MapPage/>} />
            {/* หน้าโปรไฟล์ผู้ใช้ */}
            <Route path="/profile" element={<Profile/>} />
            {/* หน้าจองสถานีชาร์จ (รับ id เป็น parameter) */}
            <Route path="/booking/:id" element={<Booking/>} />
            {/* หน้าชำระเงิน (รับ bookingId เป็น parameter) */}
            <Route path="/payment/:bookingId" element={<Payment/>} />
            {/* หน้ารีวิว */}
            <Route path="/reviews" element={<Reviews/>} />
            {/* หน้าเลือกวิธีชำระเงิน */}
            <Route path="/payment-methods" element={<PaymentMethods/>} />
            {/* หน้าประวัติการใช้งาน */}
            <Route path="/usage-history" element={<UsageHistory/>} />
            {/* หน้าตรวจสอบสถานีสำหรับแอดมิน */}
            <Route path="/admin/station-check" element={<StationCheck/>} />
            {/* หน้าใบเสร็จ (รับ id เป็น parameter) */}
            <Route path="/receipt/:id" element={<Receipt/>} />
            {/* หน้าเพิ่มรถ */}
            <Route path="/add-vehicle" element={<AddVehicle/>} />
            {/* หน้าติดต่อเรา */}
            <Route path="/contact" element={<Contact/>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 text-gray-600 p-4 text-center">
          EV Charger Demo
        </footer>
      </div>
  );
}

/**
 * App Component (Main Export)
 * Component หลักที่ wrap ทั้งแอปพลิเคชันด้วย Providers
 * จัดการ routing พิเศษสำหรับหน้าแอดมินที่ไม่ต้องการ authentication
 */
export default function App(){
  // ดึง location ปัจจุบันจาก router
  const location = useLocation();
  
  // ถ้าอยู่หน้า /admin ให้แสดงแค่ LanguageProvider ไม่ต้องใช้ AuthProvider
  // เพราะหน้าแอดมินอาจมีระบบ auth แยกต่างหาก
  if (location.pathname === '/admin') {
    return (
      <LanguageProvider>
        <Admin />
      </LanguageProvider>
    );
  }
  
  // ให้หน้า station-check ของแอดมินเข้าถึงได้โดยไม่ต้องล็อกอิน
  if (location.pathname === '/admin/station-check') {
    return (
      <LanguageProvider>
        <StationCheck />
      </LanguageProvider>
    );
  }
  
  // สำหรับหน้าปกติ: wrap ด้วยทั้ง LanguageProvider และ AuthProvider
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
