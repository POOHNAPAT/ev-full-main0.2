import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { loadStations } from '../stations';

// Custom icons for AC (green) and DC (red)
const acIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dcIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapPage(){
  const [filter, setFilter] = useState('all');
  const [selectedStation, setSelectedStation] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    // initialize map
    const map = L.map('map').setView([13.736717,100.523186], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // sample markers with charger types and ids
    const markers = [
      { id: 'central-world', name: 'Central World', lat:13.7466, lng:100.5390, type: 'AC' },
      { id: 'siam-paragon', name: 'Siam Paragon', lat:13.7460, lng:100.5345, type: 'DC' },
      { id: 'mbk-center', name: 'MBK Center', lat:13.7469, lng:100.5291, type: 'AC' },
      { id: 'emquartier', name: 'EmQuartier', lat:13.7313, lng:100.5696, type: 'DC' },
      { id: 'terminal-21', name: 'Terminal 21', lat:13.7384, lng:100.5601, type: 'AC' },
      { id: 'asiatique', name: 'Asiatique', lat:13.7204, lng:100.5134, type: 'DC' },
      { id: 'chatuchak-market', name: 'Chatuchak Weekend Market', lat:13.7991, lng:100.5492, type: 'AC' },
      { id: 'lumpini-park', name: 'Lumpini Park', lat:13.7313, lng:100.5411, type: 'DC' },
      { id: 'bangkok-hospital', name: 'Bangkok Hospital', lat:13.7229, lng:100.5289, type: 'AC' },
      { id: 'grand-palace', name: 'Grand Palace', lat:13.7500, lng:100.4917, type: 'DC' },
      { id: 'siam-square', name: 'Siam Square', lat:13.7456, lng:100.5347, type: 'AC' },
      { id: 'wat-arun', name: 'Wat Arun', lat:13.7437, lng:100.4889, type: 'DC' },
      { id: 'jim-thompson', name: 'Jim Thompson House', lat:13.7504, lng:100.5279, type: 'AC' },
      { id: 'patpong', name: 'Patpong Night Market', lat:13.7286, lng:100.5347, type: 'DC' },
      { id: 'erawan-shrine', name: 'Erawan Shrine', lat:13.7438, lng:100.5394, type: 'AC' },
      { id: 'khao-san', name: 'Khao San Road', lat:13.7589, lng:100.4972, type: 'DC' },
      { id: 'silom-complex', name: 'Silom Complex', lat:13.7229, lng:100.5172, type: 'AC' },
      { id: 'victory-monument', name: 'Victory Monument', lat:13.7627, lng:100.5371, type: 'DC' },
      { id: 'central-chidlom', name: 'Central Chidlom', lat:13.7442, lng:100.5431, type: 'AC' },
      { id: 'sukhumvit', name: 'Sukhumvit Road', lat:13.7367, lng:100.5600, type: 'DC' },
      { id: 'don-mueang', name: 'Don Mueang Airport', lat:13.9125, lng:100.6067, type: 'AC' },
      { id: 'suvarnabhumi', name: 'Suvarnabhumi Airport', lat:13.6811, lng:100.7472, type: 'DC' },
      { id: 'bangkok-university', name: 'Bangkok University', lat:13.7384, lng:100.5322, type: 'AC' }
    ];

    const filteredMarkers = filter === 'all' ? markers : markers.filter(m => m.type === filter);

    // Load station details from localStorage or default
    const stations = loadStations();

    filteredMarkers.forEach(m=>{
      const icon = m.type === 'AC' ? acIcon : dcIcon;
      const station = stations[m.id] || { name: m.name, available: 'N/A', power: 'N/A', amenities: 'N/A' };
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

      // Add click event to show station details below map
      marker.on('click', () => {
        setSelectedStation({ ...m, ...station });
      });

      marker.bindPopup(`
        <div style="max-width: 250px; font-family: Arial, sans-serif;">
          <b style="font-size: 16px; color: #333;">${m.name}</b><br/>
          <span style="color: #666; font-size: 14px;">${m.type} Charger</span><br/>
          <div style="margin: 8px 0; font-size: 13px;">
            <div><b>จุดว่าง:</b> <span style="color: #22c55e;">${station.available}</span></div>
            <div><b>กำลังไฟ:</b> ${station.power}</div>
            <div><b>สิ่งอำนวยความสะดวก:</b> ${station.amenities}</div>
          </div>
          <button onclick="window.location.href='/booking/${m.id}'" style="background: #2563eb; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">จอง</button>
        </div>
      `);
    });

    return ()=> {
      map.remove();
    }
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">แผนที่สถานีชาร์จ</h2>
        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📍 ทั้งหมด
          </button>
          <button
            onClick={() => setFilter('AC')}
            className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
              filter === 'AC'
                ? 'bg-green-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔋 AC Charger
          </button>
          <button
            onClick={() => setFilter('DC')}
            className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
              filter === 'DC'
                ? 'bg-red-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⚡ DC Fast Charger
          </button>
        </div>
        <div id="map" className="rounded-xl shadow-lg" style={{ height: '500px' }} />
        <div className="mt-4 flex justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <span>AC Charger (ชาร์จปกติ)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded-full"></span>
            <span>DC Fast Charger (ชาร์จเร็ว)</span>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">คลิกที่หมุดเพื่อจองสถานีชาร์จ</p>
      </div>

      {selectedStation && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">รายละเอียดสถานี</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-semibold mb-2 text-blue-600">{selectedStation.name}</h4>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">ประเภท:</span> {selectedStation.type} Charger</p>
                <p><span className="font-medium">จุดว่าง:</span> <span className="text-green-600 font-semibold">{selectedStation.available}</span></p>
                <p><span className="font-medium">กำลังไฟ:</span> {selectedStation.power}</p>
                <p><span className="font-medium">สิ่งอำนวยความสะดวก:</span> {selectedStation.amenities}</p>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={() => navigate(`/booking/${selectedStation.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition duration-200 hover:scale-105"
              >
                จองสถานีนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
