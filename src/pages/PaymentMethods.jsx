import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [creditCard, setCreditCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('');

  const methods = [
    { id: 'bank', name: 'โอนผ่านธนาคาร', icon: '🏦' },
    { id: 'credit', name: 'บัตรเครดิต/เดบิต', icon: '💳' },
  ];

  const banks = [
    'ธนาคารกรุงเทพ',
    'ธนาคารกสิกรไทย',
    'ธนาคารกรุงไทย',
    'ธนาคารไทยพาณิชย์',
    'ธนาคารทหารไทย',
    'ธนาคารออมสิน',
    'ธนาคารกรุงศรีอยุธยา',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">วิธีการชำระเงิน</h1>
          <p className="mb-6 text-gray-600">เลือกวิธีการชำระเงินที่คุณต้องการ</p>
          <div className="space-y-4">
            {methods.map(method => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${
                  selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => {
                  setSelectedMethod(method.id);
                  if (method.id === 'credit') {
                    setShowCreditForm(true);
                    setShowBankForm(false);
                  } else if (method.id === 'bank') {
                    setShowBankForm(true);
                    setShowCreditForm(false);
                  } else {
                    setShowCreditForm(false);
                    setShowBankForm(false);
                  }
                }}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-4">{method.icon}</span>
                  <span className="text-lg">{method.name}</span>
                  {selectedMethod === method.id && (
                    <span className="ml-auto text-blue-500">✓</span>
                  )}
                </div>
              </div>
            ))}
            {showCreditForm && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">เพิ่มบัตรเครดิต/เดบิต</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">หมายเลขบัตร</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={creditCard.number}
                      onChange={(e) => setCreditCard({ ...creditCard, number: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">วันหมดอายุ</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={creditCard.expiry}
                        onChange={(e) => setCreditCard({ ...creditCard, expiry: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={creditCard.cvv}
                        onChange={(e) => setCreditCard({ ...creditCard, cvv: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ชื่อบนบัตร</label>
                    <input
                      type="text"
                      placeholder="ชื่อเต็มบนบัตร"
                      value={creditCard.name}
                      onChange={(e) => setCreditCard({ ...creditCard, name: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
            {showBankForm && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">เลือกธนาคาร</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ธนาคาร</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">เลือกธนาคาร</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <Link to="/profile" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200">
              กลับ
            </Link>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              disabled={!selectedMethod}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
