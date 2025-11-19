import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';
import { loadStations } from '../data/stations';

// Ensure Leaflet uses the local marker assets provided by the package
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl
});

// Create DivIcons so we can style markers with CSS (no external images required)
const acIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="custom-marker ac"><div class="marker-pin"></div><div class="marker-shadow"></div></div>`,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -36]
});

const dcIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="custom-marker dc"><div class="marker-pin"></div><div class="marker-shadow"></div></div>`,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -36]
});

// Thai name mapping for search
const thaiNameMap = {
  'สนามบินสุวรรณภูมิ': 'suvarnabhumi',
  'ดอนเมือง': 'don-mueang',
  'มหาวิทยาลัยกรุงเทพ': 'bangkok-university',
  'สยาม': 'siam-square',
  'ชัยชนะ': 'victory-monument',
  'สีลม': 'silom-complex',
  'เขาสาน': 'khao-san',
  'เศรษฐีพลาซ่า': 'erawan-shrine',
  'พัฒน์พระนคร': 'patpong',
  'วัดอรุณ': 'wat-arun',
  'จิมโทมป์': 'jim-thompson',
  'เซนทรัล': 'central-world',
  'พระแกรนด์': 'grand-palace',
  'ลุมพินี': 'lumpini-park',
  'สุขุมวิท': 'sukhumvit',
  'เอมควอเทียร์': 'emquartier',
  'สยามพารากอน': 'siam-paragon',
  'เอ็มบีเค': 'mbk-center',
  'ตั้ง21': 'terminal-21',
  'อโศะ': 'asiatique',
  'เซนทรัลชิดลม': 'central-chidlom',
  'ตลาดจตุจักร': 'chatuchak-market',
  'โรงพยาบาลกรุงเทพ': 'bangkok-hospital'
};

export default function MapPage(){
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    // initialize map
    const map = L.map('map').setView([13.736717,100.523186], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // sample markers with charger types and amenities
    const markers = [
      { id: 'central-world', name: 'Central World', lat:13.7466, lng:100.5390, type: 'AC', amenities: ['wifi', 'bathroom', 'restaurant', 'restroom'] },
      { id: 'siam-paragon', name: 'Siam Paragon', lat:13.7460, lng:100.5345, type: 'DC', amenities: ['wifi', 'bathroom', 'shopping', 'restroom'] },
      { id: 'mbk-center', name: 'MBK Center', lat:13.7469, lng:100.5291, type: 'AC', amenities: ['wifi', 'bathroom', 'shopping', 'restaurant', 'restroom'] },
      { id: 'emquartier', name: 'EmQuartier', lat:13.7313, lng:100.5696, type: 'DC', amenities: ['wifi', 'shopping', 'restaurant', 'restroom'] },
      { id: 'terminal-21', name: 'Terminal 21', lat:13.7384, lng:100.5601, type: 'AC', amenities: ['wifi', 'bathroom', 'shopping', 'restaurant', 'restroom'] },
      { id: 'asiatique', name: 'Asiatique', lat:13.7204, lng:100.5134, type: 'DC', amenities: ['wifi', 'bathroom'] },
      { id: 'chatuchak-market', name: 'Chatuchak Weekend Market', lat:13.7991, lng:100.5492, type: 'AC', amenities: ['bathroom', 'restaurant', 'restroom'] },
      { id: 'lumpini-park', name: 'Lumpini Park', lat:13.7313, lng:100.5411, type: 'DC', amenities: ['wifi', 'bathroom'] },
      { id: 'bangkok-hospital', name: 'Bangkok Hospital', lat:13.7229, lng:100.5289, type: 'AC', amenities: ['wifi', 'bathroom'] },
      { id: 'grand-palace', name: 'Grand Palace', lat:13.7500, lng:100.4917, type: 'DC', amenities: ['bathroom'] },
      { id: 'siam-square', name: 'Siam Square', lat:13.7456, lng:100.5347, type: 'AC', amenities: ['wifi', 'bathroom', 'shopping', 'restaurant', 'restroom'] },
      { id: 'wat-arun', name: 'Wat Arun', lat:13.7437, lng:100.4889, type: 'DC', amenities: ['bathroom'] },
      { id: 'jim-thompson', name: 'Jim Thompson House', lat:13.7504, lng:100.5279, type: 'AC', amenities: ['wifi'] },
      { id: 'patpong', name: 'Patpong Night Market', lat:13.7286, lng:100.5347, type: 'DC', amenities: ['bathroom', 'restaurant'] },
      { id: 'erawan-shrine', name: 'Erawan Shrine', lat:13.7438, lng:100.5394, type: 'AC', amenities: ['bathroom'] },
      { id: 'khao-san', name: 'Khao San Road', lat:13.7589, lng:100.4972, type: 'DC', amenities: ['wifi', 'bathroom', 'restaurant', 'restroom'] },
      { id: 'silom-complex', name: 'Silom Complex', lat:13.7229, lng:100.5172, type: 'AC', amenities: ['wifi', 'bathroom', 'restaurant', 'restroom'] },
      { id: 'victory-monument', name: 'Victory Monument', lat:13.7627, lng:100.5371, type: 'DC', amenities: ['wifi', 'bathroom'] },
      { id: 'central-chidlom', name: 'Central Chidlom', lat:13.7442, lng:100.5431, type: 'AC', amenities: ['wifi', 'bathroom', 'shopping', 'restaurant', 'restroom'] },
      { id: 'sukhumvit', name: 'Sukhumvit Road', lat:13.7367, lng:100.5600, type: 'DC', amenities: ['wifi', 'bathroom'] },
      { id: 'don-mueang', name: 'Don Mueang Airport', lat:13.9125, lng:100.6067, type: 'AC', amenities: ['wifi', 'bathroom', 'restaurant', 'restroom'] },
      { id: 'suvarnabhumi', name: 'Suvarnabhumi Airport', lat:13.6811, lng:100.7472, type: 'DC', amenities: ['wifi', 'bathroom', 'shopping', 'restaurant', 'restroom'] },
      { id: 'bangkok-university', name: 'Bangkok University', lat:13.7384, lng:100.5322, type: 'AC', amenities: ['wifi', 'bathroom'] }
    ];

    const filteredMarkers = filter === 'all' ? markers : markers.filter(m => m.type === filter);

    // Apply search filter by name (English + Thai)
    const searchFiltered = searchQuery.trim() === '' 
      ? filteredMarkers 
      : filteredMarkers.filter(m => {
          const query = searchQuery.toLowerCase();
          const matchesEnglish = m.name.toLowerCase().includes(query);
          const matchesThai = Object.entries(thaiNameMap).some(([thai, id]) => 
            thai.includes(query) && m.id === id
          );
          return matchesEnglish || matchesThai;
        });
    
    // Apply amenity filter
    const amenityFiltered = selectedAmenities.length === 0
      ? searchFiltered
      : searchFiltered.filter(m => 
          selectedAmenities.every(amenity => m.amenities.includes(amenity))
        );

    // Load station details from localStorage or default
    const stations = loadStations();

    // Layer to hold all marker layers so we can clear easily
    const markerLayer = L.layerGroup().addTo(map);

    // Prepare marker data with station info
    const markerData = amenityFiltered.map(m => ({
      ...m,
      station: stations[m.id] || { name: m.name, available: 'N/A', power: 'N/A', amenities: 'N/A' }
    }));

    // Clustering function: group markers that are within `pixelThreshold` of each other
    function renderClusters() {
      markerLayer.clearLayers();

      const pixelThreshold = 50; // pixels within which markers will cluster
        // cluster per 'type' (AC / DC) so clusters only group same-type markers
        const pointsByType = {};
        markerData.forEach(d => {
          const p = { data: d, point: map.latLngToContainerPoint([d.lat, d.lng]) };
          (pointsByType[d.type] = pointsByType[d.type] || []).push(p);
        });

        const clusters = [];

        Object.keys(pointsByType).forEach(type => {
          const pts = pointsByType[type];
          pts.forEach(p => {
            if (p._clustered) return;
            const cluster = { items: [p], sumLat: p.data.lat, sumLng: p.data.lng, type };
            p._clustered = true;

            pts.forEach(q => {
              if (q === p || q._clustered) return;
              const dist = p.point.distanceTo(q.point);
              if (dist <= pixelThreshold) {
                q._clustered = true;
                cluster.items.push(q);
                cluster.sumLat += q.data.lat;
                cluster.sumLng += q.data.lng;
              }
            });

            clusters.push(cluster);
          });
        });

        clusters.forEach(c => {
          if (c.items.length === 1) {
            const d = c.items[0].data;
            const icon = d.type === 'AC' ? acIcon : dcIcon;
            const m = L.marker([d.lat, d.lng], { icon }).addTo(markerLayer);
            m.on('click', () => setSelectedStation({ ...d, ...d.station }));
            m.bindPopup(`
              <div style="max-width: 250px; font-family: Arial, sans-serif;">
                <b style="font-size: 16px; color: #333;">${d.name}</b><br/>
                <span style="color: #666; font-size: 14px;">${d.type} Charger</span><br/>
                <div style="margin: 8px 0; font-size: 13px;">
                  <div><b>จุดว่าง:</b> <span style="color: #22c55e;">${d.station.available}</span></div>
                  <div><b>กำลังไฟ:</b> ${d.station.power}</div>
                  <div><b>สิ่งอำนวยความสะดวก:</b> ${d.station.amenities}</div>
                </div>
                <button onclick="window.location.href='/booking/${d.id}'" style="background: #2563eb; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">จอง</button>
              </div>
            `);
          } else {
            // create cluster marker (type-aware)
            const count = c.items.length;
            const avgLat = c.sumLat / count;
            const avgLng = c.sumLng / count;
            const size = Math.min(80, 24 + count * 6);
            const fontSize = Math.max(12, Math.floor(size / 3));
            const typeClass = c.type === 'AC' ? 'ac' : 'dc';
            const html = `<div class="cluster-marker ${typeClass}" style="width:${size}px;height:${size}px;line-height:${size}px;font-size:${fontSize}px;">${count}</div>`;
            const clusterIcon = L.divIcon({ className: 'cluster-icon', html, iconSize: [size, size], iconAnchor: [size/2, size/2] });
            const cm = L.marker([avgLat, avgLng], { icon: clusterIcon }).addTo(markerLayer);
            // animate entry: add enter class then trigger active
            const el = cm.getElement && cm.getElement();
            if (el) {
              const inner = el.querySelector('.cluster-marker');
              if (inner) {
                inner.classList.add('cluster-enter');
                // trigger transition on next frame
                requestAnimationFrame(() => inner.classList.add('cluster-enter-active'));
              }
            }
            // zoom in on click
            cm.on('click', () => {
              map.setView([avgLat, avgLng], Math.min(map.getMaxZoom(), map.getZoom() + 2));
            });
          }
        });
    }

    // initial render
    renderClusters();

    // re-render clusters on map move/zoom or when filter changes
    map.on('moveend zoomend', renderClusters);

    return ()=> {
      map.off('moveend zoomend', renderClusters);
      map.remove();
    }
  }, [filter, searchQuery, selectedAmenities]);

  return (
    <div className="page-background">
      <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">แผนที่สถานีชาร์จ</h2>
        
        {/* Search Bar */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-400 mr-3">🔍</span>
            <input
              type="text"
              placeholder="ค้นหาสถานี..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-gray-100 outline-none text-gray-700 placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Amenity Filters */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedAmenities(selectedAmenities.includes('wifi') ? selectedAmenities.filter(a => a !== 'wifi') : [...selectedAmenities, 'wifi'])}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedAmenities.includes('wifi') 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📡 WiFi
          </button>
          <button
            onClick={() => setSelectedAmenities(selectedAmenities.includes('bathroom') ? selectedAmenities.filter(a => a !== 'bathroom') : [...selectedAmenities, 'bathroom'])}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedAmenities.includes('bathroom') 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🚽 ห้องน้ำ
          </button>
          <button
            onClick={() => setSelectedAmenities(selectedAmenities.includes('restroom') ? selectedAmenities.filter(a => a !== 'restroom') : [...selectedAmenities, 'restroom'])}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedAmenities.includes('restroom') 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🛏️ ห้องพัก
          </button>
          <button
            onClick={() => setSelectedAmenities(selectedAmenities.includes('restaurant') ? selectedAmenities.filter(a => a !== 'restaurant') : [...selectedAmenities, 'restaurant'])}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedAmenities.includes('restaurant') 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🍽️ ร้านอาหาร
          </button>
          <button
            onClick={() => setSelectedAmenities(selectedAmenities.includes('shopping') ? selectedAmenities.filter(a => a !== 'shopping') : [...selectedAmenities, 'shopping'])}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedAmenities.includes('shopping') 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🛍️ ช้อปปิ้ง
          </button>
          {selectedAmenities.length > 0 && (
            <button
              onClick={() => setSelectedAmenities([])}
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-200 text-red-700 hover:bg-red-300 transition"
            >
              ✕ ล้างตัวกรอง
            </button>
          )}
        </div>

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
    </div>
  )
}
