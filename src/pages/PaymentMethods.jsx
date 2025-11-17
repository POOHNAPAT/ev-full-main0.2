import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PaymentMethods.css';

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
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h1>วิธีการชำระเงิน</h1>
          <p>เลือกวิธีการชำระเงินที่คุณต้องการ</p>
        </div>
        <div className="payment-methods">
            {methods.map(method => (
              <div
                key={method.id}
                className={`payment-method-item ${selectedMethod === method.id ? 'active' : ''}`}
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
                <span className="payment-method-icon">{method.icon}</span>
                <div className="payment-method-content">
                  <span className="payment-method-name">{method.name}</span>
                  {selectedMethod === method.id && (
                    <div className="payment-method-checkmark">✓</div>
                  )}
                </div>
              </div>
            ))}
            {showCreditForm && (
              <div className="payment-form-section">
                <h3>💳 เพิ่มบัตรเครดิต/เดบิต</h3>
                <div>
                  <div className="form-group">
                    <label className="form-label">หมายเลขบัตร</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={creditCard.number}
                      onChange={(e) => setCreditCard({ ...creditCard, number: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">วันหมดอายุ</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={creditCard.expiry}
                        onChange={(e) => setCreditCard({ ...creditCard, expiry: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={creditCard.cvv}
                        onChange={(e) => setCreditCard({ ...creditCard, cvv: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">ชื่อบนบัตร</label>
                    <input
                      type="text"
                      placeholder="ชื่อเต็มบนบัตร"
                      value={creditCard.name}
                      onChange={(e) => setCreditCard({ ...creditCard, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
            {showBankForm && (
              <div className="payment-form-section">
                <h3>🏦 เลือกธนาคาร</h3>
                <div className="form-group">
                  <label className="form-label">ธนาคาร</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="form-select"
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
        <div className="payment-actions">
          <Link to="/profile" className="btn btn-back">
            ← กลับ
          </Link>
          <button
            className="btn btn-save"
            disabled={!selectedMethod}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
