import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PaymentMethods.css';
import '../styles/UsageHistory.css';
import { loadHistory, loadPayments, initialHistory, paymentHistory } from '../data/History';
import stationsData from '../data/stations';
import { useAuth } from '../components/AuthContext';

export default function UsageHistory() {
  const [filter, setFilter] = useState('ทั้งหมด');
  const [stationSerial, setStationSerial] = useState('ทั้งหมด');
  const [historyList, setHistoryList] = useState([]);
  const [refundingId, setRefundingId] = useState(null);

  const { user } = useAuth();
  // If AuthContext doesn't provide a user (e.g. during testing), fall back
  // to a `currentUser` object stored in localStorage. This matches the
  // test snippet provided by the app (see README / console hint).
  const fallbackUser = (() => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();
  const effectiveUser = user || fallbackUser;

  useEffect(() => {
    // Build lists from initial/persisted usage and mock payment data,
    // then merge them so usage+payment for the same session show as one card.
    const usageList = (() => { const x = loadHistory(stationSerial, effectiveUser?.id); return Array.isArray(x) ? x : []; })();
    const paymentsList = (() => { const x = loadPayments(stationSerial, effectiveUser?.id); return Array.isArray(x) ? x : []; })();

    // Merge by key (stationSerial|date|time). If a payment matches a usage
    // entry, merge payment fields into the usage object. Otherwise keep
    // payment-only entries.
    const map = new Map();
    const makeKey = (it) => `${it.stationSerial || ''}|${it.date || ''}|${it.time || ''}`;

    usageList.forEach(u => {
      const key = makeKey(u);
      map.set(key, { ...u, _isUsage: true });
    });

    paymentsList.forEach(p => {
      const key = makeKey(p);
      if (map.has(key)) {
        const existing = map.get(key);
        map.set(key, {
          ...existing,
          payment: p.payment || existing.payment,
          cost: (typeof p.cost !== 'undefined' ? p.cost : existing.cost),
          status: p.status || existing.status,
          paymentId: p.id, // keep payment id for API operations
          refundedAt: p.refundedAt || existing.refundedAt,
          refundRequestedAt: p.refundRequestedAt || existing.refundRequestedAt,
          _hasPayment: true,
        });
      } else {
        map.set(key, { ...p, _isPaymentOnly: true, paymentId: p.id });
      }
    });

    const merged = Array.from(map.values());

    if (filter === 'ทั้งหมด') {
      setHistoryList(merged);
    } else if (filter === 'การใช้งาน' || filter === 'completed') {
      setHistoryList(merged.filter(i => i._isUsage));
    } else if (filter === 'การชำระเงิน' || filter === 'paid') {
      setHistoryList(merged.filter(i => i._hasPayment || i._isPaymentOnly));
    } else {
      setHistoryList(merged);
    }
  }, [stationSerial, filter, user]);

  const filteredHistory = historyList;

  // Compute usage/payment sources for summary (respect station filter and user)
  const usageListRaw = (() => { const x = loadHistory(stationSerial, effectiveUser?.id); return Array.isArray(x) ? x : []; })();
  const usageSource = usageListRaw;
  const paymentsSource = (() => { const x = loadPayments(stationSerial, effectiveUser?.id); return Array.isArray(x) ? x : []; })();

  // Summary: usage-based totals come from `usageSource`; payments totals come from `paymentsSource`.
  let totalSessions = 0;
  let totalEnergy = 0;
  let totalCost = 0;

  if (filter === 'การชำระเงิน') {
    totalSessions = paymentsSource.length;
    totalEnergy = 0;
    totalCost = paymentsSource.reduce((acc, cur) => acc + (cur.cost || 0), 0);
  } else {
    // For 'การใช้งาน' and 'ทั้งหมด' show usage totals (count/energy/cost) based on usageSource
    totalSessions = usageSource.length;
    totalEnergy = usageSource.reduce((acc, cur) => acc + (cur.energy || 0), 0);
    totalCost = usageSource.reduce((acc, cur) => acc + (cur.cost || 0), 0);
  }

  const summary = {
    totalSessions,
    totalEnergy,
    totalCost,
  };

  const handleRefundRequest = async (item) => {
    const paymentId = item.paymentId || item.id;
    if (!paymentId) {
      alert('ไม่สามารถขอคืนเงินได้ เนื่องจากไม่พบข้อมูลรายการ');
      return;
    }

    const confirmRefund = window.confirm(
      `คุณต้องการขอคืนเงินสำหรับรายการนี้ใช่หรือไม่?\n\n` +
      `สถานี: ${item.station}\n` +
      `วันที่: ${item.date} ${item.time}\n` +
      `จำนวนเงิน: ฿${item.cost} บาท\n\n` +
      `หมายเหตุ: คำขอจะถูกส่งไปยังแอดมินเพื่อพิจารณา`
    );

    if (!confirmRefund) return;

    setRefundingId(paymentId);

    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const response = await fetch(`${apiBase}/api/payments/${paymentId}/request-refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUser?.id,
          reason: 'User requested refund'
        })
      });

      if (response.ok) {
        alert('✓ ส่งคำขอคืนเงินสำเร็จ\n\nแอดมินจะตรวจสอบและดำเนินการภายใน 1-3 วันทำการ');
        // Update local state
        setHistoryList(historyList.map(h => {
          const hPaymentId = h.paymentId || h.id;
          return hPaymentId === paymentId
            ? { ...h, status: 'refund_requested', refundRequestedAt: new Date().toISOString() }
            : h;
        }));
      } else {
        throw new Error('Failed to request refund');
      }
    } catch (error) {
      console.error('Refund request error:', error);
      alert('⚠ ไม่สามารถส่งคำขอได้ในขณะนี้\n\nกรุณาลองใหม่อีกครั้งหรือติดต่อแอดมิน');
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-card">
          <div className="payment-header">
            <h1>ประวัติการใช้งาน</h1>
            <p>สรุปการใช้งานและใบเสร็จของคุณ</p>
          </div>
          {/* Resolved user info for debugging/testing */}
          <div style={{margin: '8px 0'}}>
            <div style={{padding:8, background:'#f0f7ff', borderRadius:6, fontSize:14, color:'#07324a'}}>
              <strong>Resolved user:</strong>{' '}
              {effectiveUser ? (
                <span>{effectiveUser.id} — {effectiveUser.email}{effectiveUser.name ? ` (${effectiveUser.name})` : ''}</span>
              ) : (
                <span style={{color:'#666'}}>None (not signed in)</span>
              )}
            </div>
          </div>
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
          {!user && (
            <div className="no-user-note" style={{padding: '12px', background: '#fff6e6', borderRadius:6, margin: '12px 0'}}>
              <strong>กรุณาเข้าสู่ระบบ</strong> เพื่อดูประวัติการใช้งานของคุณ.
              <div style={{marginTop:6,fontSize:12,color:'#666'}}>
                สำหรับการทดสอบ คุณสามารถตั้งค่าใน Console ของเบราว์เซอร์:
                <pre style={{background:'#f4f4f4',padding:6,borderRadius:4,color:'#222'}}>{`localStorage.setItem('currentUser', JSON.stringify({ id: 1, email: 'user1@example.com', name: 'User One' }))`}</pre>
                แล้วรีเฟรชหน้าเพื่อดูข้อมูลตัวอย่าง
              </div>
            </div>
          )}
          <div className="filter-section">
            <h2 className="filter-label">ตัวกรอง</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="การใช้งาน">ประวัติการใช้งาน</option>
              <option value="การชำระเงิน">ประวัติการชำระเงิน</option>
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
                      <span className="history-status" style={{backgroundColor: '#22c55e'}}>
                        ชำระเงินแล้ว
                      </span>
                    )}
                    {item.status === 'refund_requested' && (
                      <span className="history-status" style={{backgroundColor: '#f59e0b'}}>
                        ⏳ รอการคืนเงิน
                      </span>
                    )}
                    {item.status === 'refunded' && (
                      <span className="history-status" style={{backgroundColor: '#6b7280'}}>
                        ✓ คืนเงินแล้ว
                      </span>
                    )}
                  </div>
                  <div className="history-cost">
                    <div>฿ {item.cost} บาท</div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px'}}>
                      {item.status === 'paid' && (
                        <>
                          <Link to={`/receipt/${item.id}`} className="receipt-button">
                            📄 ใบเสร็จ
                          </Link>
                          <button
                            onClick={() => handleRefundRequest(item)}
                            disabled={refundingId === (item.paymentId || item.id)}
                            className="receipt-button"
                            style={{
                              backgroundColor: '#ef4444',
                              border: 'none',
                              cursor: refundingId === (item.paymentId || item.id) ? 'wait' : 'pointer',
                              opacity: refundingId === (item.paymentId || item.id) ? 0.6 : 1
                            }}
                          >
                            {refundingId === (item.paymentId || item.id) ? '⏳ กำลังส่ง...' : '💰 ขอคืนเงิน'}
                          </button>
                        </>
                      )}
                      {item.status === 'refund_requested' && (
                        <span style={{fontSize: '12px', color: '#f59e0b', fontWeight: 600}}>
                          รอแอดมินอนุมัติ
                        </span>
                      )}
                      {item.status === 'refunded' && item.refundedAt && (
                        <span style={{fontSize: '11px', color: '#6b7280'}}>
                          คืนเงินเมื่อ: {new Date(item.refundedAt).toLocaleDateString('th-TH')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="payment-actions">
            <Link to="/profile" className="btn btn-back">
              ← กลับ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
