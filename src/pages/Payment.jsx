import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Booking.css';

function timeToMinutes(t) {
  if (!t) return 0;
  const [hh, mm] = String(t).split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        // Load from API only
        const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
        const response = await fetch(`${apiBase}/api/bookings`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const all = await response.json();
        const b = all.find(x => String(x.id) === String(bookingId));
      if (b) {
        setBooking(b);
        // Calculate cost from pricePerUnit * energy
        const mins = Math.max(1, timeToMinutes(b.endTime) - timeToMinutes(b.startTime));
        const rawName = String(b.stationName || '').toLowerCase();
        const chargerType = (rawName.includes('dc') || rawName.includes('fast')) ? 'DC Fast' : 'AC';
        const ratePerHour = chargerType.toLowerCase().includes('dc') ? 60 : 40; // kW/hour
        const energy = Math.round(((mins / 60) * ratePerHour) * 10) / 10;
        
          // Load station to get pricePerUnit
          let pricePerUnit = 7.5; // default
          const stationsResp = await fetch(`${apiBase}/api/stations`);
          if (stationsResp.ok) {
            const stationsList = await stationsResp.json();
            const station = stationsList.find(s => String(s.id) === String(b.stationId));
            if (station && station.pricePerUnit) {
              pricePerUnit = station.pricePerUnit;
            }
          }
          
          const cost = Math.round(energy * pricePerUnit * 100) / 100;
          setAmount(cost);
        }
      } catch (error) {
        console.error('Error loading booking:', error);
      }
    };
    
    loadBookingData();
  }, [bookingId]);

  const handlePay = async () => {
    if (!booking) return;
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(r => setTimeout(r, 800));
      
      const paymentData = { status: 'paid', paidAt: new Date().toISOString(), paidAmount: amount };
      
      // Update via API
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const response = await fetch(`${apiBase}/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      
      const updated = await response.json();
      console.log('Updated booking payment via API:', updated);
      
      // Compute minutes & charger type
      const mins = Math.max(1, timeToMinutes(booking.endTime) - timeToMinutes(booking.startTime));
      const rawName = String(booking.stationName || '').toLowerCase();
      const chargerType = (rawName.includes('dc') || rawName.includes('fast')) ? 'DC Fast' : 'AC';
      const ratePerHour = chargerType.toLowerCase().includes('dc') ? 60 : 40; // kW/hour
      const energy = Math.round(((mins / 60) * ratePerHour) * 10) / 10; // one decimal

        // Read saved payment method from localStorage
        let paymentMethod = 'PromptPay'; // default
        try {
          const savedMethod = localStorage.getItem('paymentMethod');
          if (savedMethod) {
            if (savedMethod === 'credit') {
              const cardData = localStorage.getItem('creditCard');
              paymentMethod = cardData ? `บัตรเครดิต/เดบิต (${JSON.parse(cardData).number?.slice(-4) || 'xxxx'})` : 'บัตรเครดิต/เดบิต';
            } else if (savedMethod === 'bank') {
              const bank = localStorage.getItem('selectedBank');
              paymentMethod = bank ? `โอนผ่านธนาคาร (${bank})` : 'โอนผ่านธนาคาร';
            }
          }
        } catch (e) {
          console.warn('Could not read payment method', e);
        }

        // Prepare payload pieces
        const basePayload = {
          station: booking.stationName,
          stationSerial: booking.stationId,
          stationId: booking.stationId,
          type: chargerType,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          duration: `${mins} นาที`,
          minutes: mins,
          energy,
          cost: amount,
          userId: booking.userId,
          userEmail: booking.userEmail,
          bookingId: booking.id,
          paidAt: new Date().toISOString(),
          paymentMethod
        };

      // Save session & payment history via API
      try {
        console.log('Sending session history:', basePayload);
        const sessionResp = await fetch(`${apiBase}/api/history/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(basePayload)
        });
        if (sessionResp.ok) {
          const sessionSaved = await sessionResp.json();
          console.log('✅ Session saved:', sessionSaved);
        }
      } catch (e) {
        console.warn('Session history request failed', e);
      }
      
      try {
        console.log('Sending payment history:', basePayload);
        const paymentResp = await fetch(`${apiBase}/api/history/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(basePayload)
        });
        if (paymentResp.ok) {
          const paymentSaved = await paymentResp.json();
          console.log('✅ Payment saved:', paymentSaved);
        }
      } catch (e) {
        console.warn('Payment history request failed', e);
      }
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('bookings-changed', { detail: { action: 'update', booking: updated } }));
      // navigate to receipt view if available
      navigate(`/receipt/${booking.id}`);
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดขณะชำระเงิน');
    } finally {
      setProcessing(false);
    }
  };

  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center">ไม่พบการจอง</div>;
  }

  return (
    <div className="booking-container">
      <div className="booking-card">
        <div className="booking-content">
          <h2 className="section-title">ชำระเงินสำหรับการจอง</h2>
          <div className="confirmation-details">
            <p><strong>สถานี:</strong> {booking.stationName}</p>
            <p><strong>วันที่:</strong> {booking.date}</p>
            <p><strong>เวลา:</strong> {booking.startTime} - {booking.endTime}</p>
            <p><strong>สถานะ:</strong> {booking.status}</p>
            <p><strong>ยอดที่ต้องชำระ:</strong> ฿{amount}</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>ย้อนกลับ</button>
            <button className="btn btn-primary" onClick={handlePay} disabled={processing}>{processing ? 'กำลังชำระ...' : 'ชำระตอนนี้'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
