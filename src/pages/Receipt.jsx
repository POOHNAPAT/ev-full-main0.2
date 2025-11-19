import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Receipt.css';

export default function Receipt() {
  const { id } = useParams();

  // Mock data - in real app, fetch from API or context
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
      status: 'paid',
      payment: 'PromptPay',
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
      status: 'paid',
      payment: 'PromptPay',
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

  const item = history.find(h => h.id === parseInt(id));

  if (!item) {
    return (
      <div className="receipt-container">
        <div className="receipt-content">
          <h1 className="receipt-title">ไม่พบใบเสร็จ</h1>
          <Link to="/usage-history" className="back-button">กลับไปยังประวัติการใช้งาน</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      <div className="receipt-content">
        <div className="receipt-header">
          <div className="receipt-logo">⚡ EV Charge</div>
          <h1 className="receipt-title">ใบเสร็จการชำระเงิน</h1>
          <p className="receipt-subtitle">Receipt</p>
        </div>
        <div className="receipt-body">
          <div className="receipt-section">
            <h3 className="section-title">รายละเอียดการชาร์จ</h3>
            <div className="receipt-details">
              <div className="detail-row">
                <span className="detail-label">สถานี:</span>
                <span className="detail-value">{item.station}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">วันที่:</span>
                <span className="detail-value">{item.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">เวลา:</span>
                <span className="detail-value">{item.time}</span>
              </div>
              {item.duration && (
                <div className="detail-row">
                  <span className="detail-label">ระยะเวลา:</span>
                  <span className="detail-value">{item.duration}</span>
                </div>
              )}
              {item.energy && (
                <div className="detail-row">
                  <span className="detail-label">พลังงาน:</span>
                  <span className="detail-value">{item.energy} kWh</span>
                </div>
              )}
            </div>
          </div>
          <div className="receipt-section">
            <h3 className="section-title">การชำระเงิน</h3>
            <div className="receipt-payment">
              <div className="detail-row">
                <span className="detail-label">วิธีการชำระ:</span>
                <span className="detail-value">{item.payment || 'ไม่ระบุ'}</span>
              </div>
              <div className="detail-row total">
                <span className="detail-label">ยอดรวม:</span>
                <span className="detail-value total-amount">฿ {item.cost} บาท</span>
              </div>
            </div>
          </div>
        </div>
        <div className="receipt-footer">
          <p className="receipt-thankyou">ขอบคุณที่ใช้บริการ</p>
          <p className="receipt-id">เลขที่ใบเสร็จ: #{item.id}</p>
        </div>
        <div className="receipt-actions">
          <button onClick={() => window.print()} className="print-button">พิมพ์ใบเสร็จ</button>
          <Link to="/usage-history" className="back-button">กลับ</Link>
        </div>
      </div>
    </div>
  );
}
