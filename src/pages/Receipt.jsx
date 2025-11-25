import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Receipt.css';
import { loadBookings } from '../data/bookings';

export default function Receipt() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      const bookingId = id;
      let booking = null;
      // Try API bookings
      try {
        const apiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:4000' : '';
        if (apiBase) {
          const resp = await fetch(apiBase + '/api/bookings');
          if (resp.ok) {
            const data = await resp.json();
            booking = (data || []).find(b => String(b.id) === String(bookingId));
          }
        }
      } catch (e) {
        // ignore API failure
      }
      // Fallback local storage
      if (!booking) {
        try {
          const all = loadBookings();
          booking = all.find(b => String(b.id) === String(bookingId));
        } catch (e) { /* ignore */ }
      }

      // If booking exists and status indicates paid/completed, build record
      if (booking) {
        const startM = booking.startTime;
        const endM = booking.endTime;
        const toMinutes = t => { if(!t) return 0; const [H,M]=String(t).split(':').map(Number); return (H||0)*60+(M||0); };
        const mins = Math.max(1, toMinutes(endM) - toMinutes(startM));
        const rawName = String(booking.stationName || '').toLowerCase();
        const chargerType = (rawName.includes('dc') || rawName.includes('fast')) ? 'DC Fast' : 'AC';
        const ratePerHour = chargerType.toLowerCase().includes('dc') ? 60 : 40;
        const energy = Math.round(((mins/60)*ratePerHour)*10)/10;
        
        // Load station to get pricePerUnit for display
        let pricePerUnit = 7.5;
        try {
          const apiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:4000' : '';
          if (apiBase) {
            const stationsResp = await fetch(apiBase + '/api/stations');
            if (stationsResp.ok) {
              const stationsList = await stationsResp.json();
              const station = stationsList.find(s => String(s.id) === String(booking.stationId));
              if (station && station.pricePerUnit) {
                pricePerUnit = station.pricePerUnit;
              }
            }
          }
        } catch (e) {
          console.warn('Could not load station price for receipt', e);
        }
        
        setRecord({
          id: booking.id,
            station: booking.stationName,
            type: chargerType,
            date: booking.date,
            time: booking.startTime,
            duration: `${mins} นาที`,
            energy,
            pricePerUnit,
            cost: booking.paidAmount || booking.cost || 0,
            status: booking.status,
            payment: booking.paymentMethod || (booking.status === 'paid' ? 'PromptPay' : 'ไม่ระบุ')
        });
      } else {
        setError('ไม่พบข้อมูลการชำระเงินสำหรับหมายเลขนี้');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="receipt-container"><div className="receipt-content"><h1 className="receipt-title">กำลังโหลด...</h1></div></div>;
  }
  if (error || !record) {
    return (
      <div className="receipt-container">
        <div className="receipt-content">
          <h1 className="receipt-title">ไม่พบใบเสร็จ</h1>
          <p className="text-sm text-gray-500">{error || 'ไม่มีข้อมูล'}</p>
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
              <div className="detail-row"><span className="detail-label">สถานี:</span><span className="detail-value">{record.station}</span></div>
              <div className="detail-row"><span className="detail-label">วันที่:</span><span className="detail-value">{record.date}</span></div>
              <div className="detail-row"><span className="detail-label">เวลา:</span><span className="detail-value">{record.time}</span></div>
              <div className="detail-row"><span className="detail-label">ระยะเวลา:</span><span className="detail-value">{record.duration}</span></div>
              <div className="detail-row"><span className="detail-label">ประเภท:</span><span className="detail-value">{record.type}</span></div>
              <div className="detail-row"><span className="detail-label">พลังงาน:</span><span className="detail-value">{record.energy} kWh</span></div>
              <div className="detail-row"><span className="detail-label">ราคาต่อหน่วย:</span><span className="detail-value">฿{record.pricePerUnit} / kWh</span></div>
            </div>
          </div>
          <div className="receipt-section">
            <h3 className="section-title">การชำระเงิน</h3>
            <div className="receipt-payment">
              <div className="detail-row"><span className="detail-label">วิธีการชำระ:</span><span className="detail-value">{record.payment}</span></div>
              <div className="detail-row"><span className="detail-label">คำนวณ:</span><span className="detail-value">{record.energy} kWh × ฿{record.pricePerUnit}</span></div>
              <div className="detail-row total"><span className="detail-label">ยอดรวม:</span><span className="detail-value total-amount">฿ {record.cost} บาท</span></div>
              <div className="detail-row"><span className="detail-label">สถานะ:</span><span className="detail-value">{record.status}</span></div>
            </div>
          </div>
        </div>
        <div className="receipt-footer"><p className="receipt-thankyou">ขอบคุณที่ใช้บริการ</p><p className="receipt-id">เลขที่ใบเสร็จ: #{record.id}</p></div>
        <div className="receipt-actions"><button onClick={() => window.print()} className="print-button">พิมพ์ใบเสร็จ</button><Link to="/usage-history" className="back-button">กลับ</Link></div>
      </div>
    </div>
  );
}
