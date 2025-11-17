import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">จองจุดชาร์จ</h1>
      <p className="mb-4">สถานี: {station.name}</p>
      <p className="mb-4">วันที่ 28 พฤศจิกายน 2568</p>

      {step === 'select' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">เลือกเวลาเริ่ม: </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <label className="block text-sm font-medium mb-1 mt-2">ถึง: </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <p className="text-sm font-medium">ข้อมูลจุดชาร์จ: {station.available}, {station.power}</p>
            <p className="text-sm">รายละเอียดเพิ่มเติม: {station.amenities}</p>
          </div>
          <button
            onClick={handleBook}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={!startTime || !endTime}
          >
            จองเลย
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">รายละเอียดการจอง: เวลา {startTime} - {endTime}</p>
            <p className="text-sm">ข้อมูลจุดชาร์จ: {station.available}, {station.power}</p>
            <p className="text-sm">รายละเอียดเพิ่มเติม: {station.amenities}</p>
          </div>
          <button
            onClick={() => setStep('select')}
            className="bg-gray-600 text-white px-4 py-2 rounded mr-2"
          >
            แก้ไข
          </button>
          <button
            onClick={() => setShowQR(true)}
            className="bg-green-600 text-white px-4 py-2 rounded mr-2"
          >
            เสร็จสิ้น
          </button>
        </div>
      )}

      {showQR && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-2">QR Code สำหรับสแกนตู้ชาร์จ</h2>
          <QRCode value={`${id}-${startTime}-${endTime}`} />
          <p className="mt-2 text-sm">สแกน QR Code ที่ตู้ชาร์จเพื่อเริ่มใช้งาน</p>
          <Link to="/map" className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded">
            กลับไปแผนที่
          </Link>
        </div>
      )}

      <Link to="/map" className="inline-block mt-4 text-blue-600 hover:underline">กลับไปแผนที่</Link>
    </div>
  );
}
