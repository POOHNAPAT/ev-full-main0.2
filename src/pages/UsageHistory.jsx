import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UsageHistory() {
  const [filter, setFilter] = useState('ทั้งหมด');

  const summary = {
    totalSessions: 2,
    totalEnergy: 88,
    totalCost: 580,
  };

  const history = [
    {
      id: 1,
      station: 'Central World – ชั้น B2',
      type: 'AC',
      date: '2025-10-7',
      time: '09:45',
      duration: '50 นาที',
      energy: 47.5,
      cost: 280,
      status: 'completed',
    },
    {
      id: 2,
      station: 'Bangkok Hospital – อาคารจอด P2 EV Zone',
      type: 'DC Fast',
      date: '2025-10-7',
      time: '15:45',
      duration: '30 นาที',
      energy: 40.5,
      cost: 300,
      status: 'completed',
    },
    {
      id: 3,
      station: 'ชาร์จไฟ – Central World – ชั้น B2',
      date: '2025-10-7',
      time: '09:45',
      payment: 'PromptPay',
      cost: 280,
      status: 'paid',
    },
    {
      id: 4,
      station: 'Bangkok Hospital – อาคารจอด P2 EV Zone',
      date: '2025-10-7',
      time: '15:45',
      payment: 'PromptPay',
      cost: 300,
      status: 'paid',
    },
  ];

  const filteredHistory = filter === 'ทั้งหมด' ? history : history.filter(item => item.status === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Usage history</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">สรุปการใช้งาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">ครั้งทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-600">{summary.totalSessions} ครั้ง</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">พลังงานรวม</p>
                <p className="text-2xl font-bold text-green-600">{summary.totalEnergy} kWh</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">ค่าใช้จ่ายทั้งหมด</p>
                <p className="text-2xl font-bold text-yellow-600">฿ {summary.totalCost} บาท</p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">ตัวกรอง</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="completed">ประวัติการใช้งาน</option>
              <option value="paid">ประวัติการชำระเงิน</option>
            </select>
          </div>
          <div className="space-y-4">
            {filteredHistory.map(item => (
              <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {item.station} {item.type && `(มีป้าย ${item.type})`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.date} 🕓 {item.time}
                    </p>
                    {item.duration && (
                      <p className="text-sm text-gray-600">ระยะเวลาชาร์จ {item.duration}</p>
                    )}
                    {item.energy && (
                      <p className="text-sm text-gray-600">พลังงานที่ชาร์จได้: {item.energy} kWh</p>
                    )}
                    {item.payment && (
                      <p className="text-sm text-gray-600">{item.payment}</p>
                    )}
                    {item.status === 'paid' && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                        ชำระเงินแล้ว
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">฿ {item.cost} บาท</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/profile" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200">
              กลับ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
