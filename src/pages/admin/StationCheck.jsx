import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import stations from '../../data/stations';
import { loadVehicles } from '../../data/vehicles';
import { loadHistory } from '../../data/History';

export default function StationCheck() {
  const [selectedId, setSelectedId] = useState(stations[0] ? String(stations[0].id) : '');
  const [stationSerial, setStationSerial] = useState(stations[0] ? stations[0].stationSerial : '');
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!selectedId) return;
    const s = stations.find(st => String(st.id) === String(selectedId));
    const serial = s ? s.stationSerial : '';
    setStationSerial(serial);
  }, [selectedId]);

  useEffect(() => {
    if (!stationSerial) {
      setVehicles([]);
      setHistory([]);
      return;
    }
    setVehicles(loadVehicles(stationSerial));
    setHistory(loadHistory(stationSerial));
  }, [stationSerial]);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '32px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <Link 
            to="/admin" 
            style={{ 
              textDecoration: 'none', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            ← กลับไปหน้า Admin
          </Link>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '24px',
            color: '#1f2937',
            borderBottom: '3px solid #3b82f6',
            paddingBottom: '12px'
          }}>
            ตรวจสอบสถานี (Station Check)
          </h2>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              เลือกสถานีที่ต้องการจำลองเป็น:
            </label>
            <select 
              value={selectedId} 
              onChange={(e) => setSelectedId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.stationSerial})
                </option>
              ))}
            </select>
          </div>

          <div style={{ 
            marginTop: 20,
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <strong style={{ color: '#1f2937', fontSize: '16px' }}>Station Serial:</strong>{' '}
            <span style={{ color: '#3b82f6', fontSize: '18px', fontWeight: '600' }}>
              {stationSerial || '—'}
            </span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🚗 ยานพาหนะที่ผูกกับสถานี
          </h3>
          {vehicles.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '2px dashed #e5e7eb'
            }}>
              ไม่มีข้อมูลยานพาหนะสำหรับสถานีนี้
            </div>
          ) : (
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              display: 'grid',
              gap: '12px'
            }}>
              {vehicles.map((v) => (
                <li 
                  key={v.vehicleId}
                  style={{
                    padding: '16px 20px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '15px',
                    color: '#374151',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <span style={{ 
                    fontWeight: '600', 
                    color: '#3b82f6',
                    minWidth: '80px'
                  }}>{v.plate}</span>
                  <span style={{ color: '#6b7280' }}>—</span>
                  <span style={{ fontWeight: '500' }}>{v.model}</span>
                  <span style={{ color: '#6b7280' }}>—</span>
                  <span>{v.owner}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 ประวัติการใช้งานของสถานี
          </h3>
          {history.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '2px dashed #e5e7eb'
            }}>
              ไม่มีประวัติสำหรับสถานีนี้
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ 
                      border: '1px solid #e5e7eb', 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151'
                    }}>ID</th>
                    <th style={{ 
                      border: '1px solid #e5e7eb', 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151'
                    }}>วันที่</th>
                    <th style={{ 
                      border: '1px solid #e5e7eb', 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151'
                    }}>เวลา</th>
                    <th style={{ 
                      border: '1px solid #e5e7eb', 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151'
                    }}>ยานพาหนะ</th>
                    <th style={{ 
                      border: '1px solid #e5e7eb', 
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#374151'
                    }}>พลังงาน (kWh)</th>
                    <th style={{ 
                      border: '1px solid #e5e7eb', 
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#374151'
                    }}>ค่าใช้จ่าย</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, idx) => (
                    <tr 
                      key={h.id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? 'white' : '#f9fafb',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'white' : '#f9fafb'}
                    >
                      <td style={{ 
                        border: '1px solid #e5e7eb', 
                        padding: '12px 16px',
                        color: '#6b7280'
                      }}>{h.id}</td>
                      <td style={{ 
                        border: '1px solid #e5e7eb', 
                        padding: '12px 16px',
                        color: '#374151'
                      }}>{h.date}</td>
                      <td style={{ 
                        border: '1px solid #e5e7eb', 
                        padding: '12px 16px',
                        color: '#374151'
                      }}>{h.time}</td>
                      <td style={{ 
                        border: '1px solid #e5e7eb', 
                        padding: '12px 16px',
                        color: '#3b82f6',
                        fontWeight: '500'
                      }}>{h.plate || h.vehicleId || '—'}</td>
                      <td style={{ 
                        border: '1px solid #e5e7eb', 
                        padding: '12px 16px',
                        textAlign: 'right',
                        color: '#059669',
                        fontWeight: '500'
                      }}>{h.energy ?? '-'}</td>
                      <td style={{ 
                        border: '1px solid #e5e7eb', 
                        padding: '12px 16px',
                        textAlign: 'right',
                        color: '#dc2626',
                        fontWeight: '600'
                      }}>฿{h.cost ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
