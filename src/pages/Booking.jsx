import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaBolt, FaWifi, FaCoffee, FaRestroom, FaShieldAlt, FaUtensils, FaShoppingCart, FaMapMarkerAlt, FaCheckCircle, FaEdit, FaQrcode, FaArrowLeft } from 'react-icons/fa';

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
  // Add more as needed
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <FaBolt className="text-blue-600 text-2xl mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">จองจุดชาร์จ</h1>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center">
          <FaMapMarkerAlt className="text-blue-600 mr-2" />
          <div>
            <p className="font-semibold text-gray-800">สถานี: {station.name}</p>
            <p className="text-gray-600 flex items-center">
              <FaCalendarAlt className="mr-1" />
              วันที่ 28 พฤศจิกายน 2568
            </p>
          </div>
        </div>

        {step === 'select' ? (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaClock className="text-blue-600 mr-2" />
              เลือกเวลาใช้งาน
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">เวลาเริ่ม:</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">เวลาสิ้นสุด:</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <FaBolt className="text-yellow-500 mr-2" />
                ข้อมูลจุดชาร์จ
              </h3>
              <p className="text-sm text-gray-600 mb-1">จำนวนจุดว่าง: <span className="font-medium text-green-600">{station.available}</span></p>
              <p className="text-sm text-gray-600 mb-2">กำลังไฟ: <span className="font-medium">{station.power}</span></p>
              <p className="text-sm text-gray-600">สิ่งอำนวยความสะดวก: {station.amenities}</p>
            </div>

            <button
              onClick={handleBook}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!startTime || !endTime}
            >
              <FaCheckCircle className="mr-2" />
              จองเลย
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCheckCircle className="text-green-600 mr-2" />
              ยืนยันการจอง
            </h2>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2 text-green-800">รายละเอียดการจอง</h3>
              <p className="text-sm text-gray-700 mb-1 flex items-center">
                <FaClock className="mr-2 text-blue-600" />
                เวลา: {startTime} - {endTime}
              </p>
              <p className="text-sm text-gray-700 mb-1 flex items-center">
                <FaBolt className="mr-2 text-yellow-500" />
                จุดชาร์จ: {station.available}, {station.power}
              </p>
              <p className="text-sm text-gray-700 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                สิ่งอำนวยความสะดวก: {station.amenities}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setStep('select')}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center"
              >
                <FaEdit className="mr-2" />
                แก้ไข
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition duration-300 flex items-center justify-center"
              >
                <FaCheckCircle className="mr-2" />
                เสร็จสิ้น
              </button>
            </div>
          </div>
        )}

        {showQR && (
          <div className="bg-white p-6 rounded-lg shadow-md border mt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaQrcode className="text-blue-600 mr-2" />
              QR Code สำหรับสแกนตู้ชาร์จ
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4 flex justify-center">
              <QRCode value={`${id}-${startTime}-${endTime}`} />
            </div>
            <p className="text-sm text-gray-600 mb-4 text-center">สแกน QR Code ที่ตู้ชาร์จเพื่อเริ่มใช้งาน</p>
            <Link to="/map" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 flex items-center justify-center">
              <FaArrowLeft className="mr-2" />
              กลับไปแผนที่
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/map" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300">
            <FaArrowLeft className="mr-1" />
            กลับไปแผนที่
          </Link>
        </div>
      </div>
    </div>
  );
}
