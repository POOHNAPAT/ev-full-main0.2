import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UsageHistory.css';

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
    <div className="usage-history-container">
      <div className="usage-history-content">
        <div className="usage-history-section">
          <h1 className="usage-history-title">Usage history</h1>
          <div className="summary-section">
            <h2 className="usage-history-subtitle">สรุปการใช้งาน</h2>
            <div className="summary-grid">
              <div className="summary-card blue">
                <p className="summary-label">ครั้งทั้งหมด</p>
                <p className="summary-value blue">{summary.totalSessions} ครั้ง</p>
              </div>
              <div className="summary-card green">
                <p className="summary-label">พลังงานรวม</p>
                <p className="summary-value green">{summary.totalEnergy} kWh</p>
              </div>
              <div className="summary-card yellow">
                <p className="summary-label">ค่าใช้จ่ายทั้งหมด</p>
                <p className="summary-value yellow">฿ {summary.totalCost} บาท</p>
              </div>
            </div>
          </div>
          <div className="filter-section">
            <h2 className="filter-label">ตัวกรอง</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="completed">ประวัติการใช้งาน</option>
              <option value="paid">ประวัติการชำระเงิน</option>
            </select>
          </div>
          <div className="history-list">
            {filteredHistory.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-item-content">
                  <div className="history-details">
                    <p className="history-station">
                      {item.station} {item.type && `(มีป้าย ${item.type})`}
                    </p>
                    <p className="history-meta">
                      {item.date} 🕓 {item.time}
                    </p>
                    {item.duration && (
                      <p className="history-meta">ระยะเวลาชาร์จ {item.duration}</p>
                    )}
                    {item.energy && (
                      <p className="history-meta">พลังงานที่ชาร์จได้: {item.energy} kWh</p>
                    )}
                    {item.payment && (
                      <p className="history-meta">{item.payment}</p>
                    )}
                    {item.status === 'paid' && (
                      <span className="history-status">
                        ชำระเงินแล้ว
                      </span>
                    )}
                  </div>
                  <div className="history-cost">
                    <div>฿ {item.cost} บาท</div>
                    {item.status === 'paid' && (
                      <Link to={`/receipt/${item.id}`} className="receipt-button">ใบเสร็จ</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="back-section">
            <Link to="/profile" className="back-button">
              กลับ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
