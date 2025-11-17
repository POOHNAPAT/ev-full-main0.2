import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  const handlePaymentMethods = () => {
    navigate('/payment-methods');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Profile</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">ข้อมูลผู้ใช้</h2>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                น
              </div>
              <p className="text-lg text-gray-600">นาย xxxx xxxxx</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/usage-history')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition duration-200 flex items-center"
            >
              <span className="mr-2">📋</span> ประวัติการใช้งาน
            </button>
            <button
              onClick={handlePaymentMethods}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition duration-200 flex items-center"
            >
              <span className="mr-2">💳</span> วิธีการชำระเงิน
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">ปุ่มดำเนินการ</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/add-vehicle" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center">
              <span className="mr-2">➕</span> เพิ่มพาหนะ
            </Link>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center">
              <span className="mr-2">🚪</span> Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
