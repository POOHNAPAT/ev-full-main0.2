import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';
import stationsList, { loadStations } from '../data/stations';
import { useLanguage } from '../components/LanguageContext';

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

// Station data is provided by `stationsList` imported from data/stations.js

export default function MapPage(){
  const { language, toggleLanguage, t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const navigate = useNavigate();
    const mapRef = useRef(null);

  useEffect(()=>{
    // initialize map
    const map = L.map('map').setView([13.736717,100.523186], 12);
      // expose map so other handlers (dropdown) can pan/zoom
      mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Build markers from the imported stations list
    const markers = (stationsList || []).map(s => ({
      id: String(s.id),
      name: s.name,
      lat: s.latitude,
      lng: s.longitude,
      type: s.type === 'Both' ? 'Both' : (s.type === 'DC' ? 'DC' : 'AC'),
      amenities: Array.isArray(s.amenities) ? s.amenities : (s.amenities ? [s.amenities] : [])
    }));

    const filteredMarkers = filter === 'all'
      ? markers
      : markers.filter(m => {
          if (filter === 'AC') return m.type === 'AC' || m.type === 'Both';
          if (filter === 'DC') return m.type === 'DC' || m.type === 'Both';
          return true;
        });

    // Apply search filter by station name
    const searchFiltered = searchQuery.trim() === ''
      ? filteredMarkers
      : filteredMarkers.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
      station: stations[m.id] || { name: m.name, available: 'N/A', power: m.type, amenities: (m.amenities || []).join(', ') }
    }));

    // Clustering function: group markers that are within `pixelThreshold` of each other
    function renderClusters() {
      markerLayer.clearLayers();

      const pixelThreshold = 50; // pixels within which markers will cluster
      const allPoints = markerData.map(d => ({
        data: d,
        point: map.latLngToContainerPoint([d.lat, d.lng])
      }));

      const clusters = [];

      allPoints.forEach(p => {
        if (p._clustered) return;
        const cluster = { items: [p], sumLat: p.data.lat, sumLng: p.data.lng };
        p._clustered = true;

        allPoints.forEach(q => {
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

        clusters.forEach(c => {
          if (c.items.length === 1) {
            const d = c.items[0].data;
            const icon = (d.type === 'AC' || d.type === 'Both') ? acIcon : dcIcon;
            const m = L.marker([d.lat, d.lng], { icon }).addTo(markerLayer);
            m.on('click', () => setSelectedStation({ ...d, ...d.station }));
            m.bindPopup(`
              <div style="max-width: 250px; font-family: Arial, sans-serif;">
                <b style="font-size: 16px; color: #333;">${d.name}</b><br/>
                <span style="color: #666; font-size: 14px;">${d.type} ${t.evCharger || 'Charger'}</span><br/>
                <div style="margin: 8px 0; font-size: 13px;">
                  <div><b>${t.availableLabel}:</b> <span style="color: #22c55e;">${d.station.available}</span></div>
                  <div><b>${t.powerLabel}:</b> ${d.station.power}</div>
                  <div><b>${t.amenitiesLabel}:</b> ${d.station.amenities}</div>
                </div>
                <button onclick="window.location.href='/booking/${d.id}'" style="background: #2563eb; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">${t.bookButton || t.bookThisStation || 'Book'}</button>
              </div>
            `);
          } else {
            // create cluster marker - split into AC/DC halves
            const count = c.items.length;
            const avgLat = c.sumLat / count;
            const avgLng = c.sumLng / count;
            const size = Math.min(80, 24 + count * 6);
            const fontSize = Math.max(12, Math.floor(size / 3));

            // Count AC and DC in cluster (treat 'Both' as both)
            const acCount = c.items.filter(item => item.data.type === 'AC' || item.data.type === 'Both').length;
            const dcCount = c.items.filter(item => item.data.type === 'DC' || item.data.type === 'Both').length;

            let html;
            if (acCount > 0 && dcCount > 0) {
              // Mixed: split circle
              html = `
                <div class="cluster-marker" style="width:${size}px;height:${size}px;line-height:${size}px;font-size:${fontSize}px;">
                  <div class="cluster-half cluster-ac" style="width:50%;height:100%;background:#16a34a;border-radius:${size/2}px 0 0 ${size/2}px;"></div>
                  <div class="cluster-half cluster-dc" style="width:50%;height:100%;background:#dc2626;border-radius:0 ${size/2}px ${size/2}px 0;"></div>
                  <div class="cluster-text">${count}</div>
                </div>
              `;
            } else if (acCount > 0) {
              // AC only: full green
              html = `
                <div class="cluster-marker cluster-ac-only" style="width:${size}px;height:${size}px;line-height:${size}px;font-size:${fontSize}px;background:#16a34a;border-radius:50%;">
                  <div class="cluster-text">${count}</div>
                </div>
              `;
            } else if (dcCount > 0) {
              // DC only: full red
              html = `
                <div class="cluster-marker cluster-dc-only" style="width:${size}px;height:${size}px;line-height:${size}px;font-size:${fontSize}px;background:#dc2626;border-radius:50%;">
                  <div class="cluster-text">${count}</div>
                </div>
              `;
            }
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
  }, [filter, searchQuery, selectedAmenities, t]);
  // Handle selecting a station from the dropdown: pan/zoom to it and show details
  const handleSelectStation = (e) => {
    const id = e.target.value;
    if (!id) {
      setSelectedStation(null);
      return;
    }

    const s = (stationsList || []).find(st => String(st.id) === String(id));
    if (!s) return;

    const lat = s.latitude;
    const lng = s.longitude;
    // set selected station details
    setSelectedStation({ id: String(s.id), name: s.name, lat, lng, type: s.type, amenities: Array.isArray(s.amenities) ? s.amenities.join(', ') : (s.amenities || '') });

    if (mapRef.current) {
      try {
        mapRef.current.setView([lat, lng], 16, { animate: true });
        // open a small popup at the station
        L.popup({ closeButton: true, autoClose: true })
          .setLatLng([lat, lng])
          .setContent(`<div style="font-weight:600">${s.name}</div>`)
          .openOn(mapRef.current);
      } catch (err) {
        // ignore errors
      }
    }
  };

  return (
    <div className="page-background">
      <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{t.map || 'Map'}</h2>
        
        {/* Search Bar */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-400 mr-3">🔍</span>
            <select
              value={selectedStation ? selectedStation.id : ''}
              onChange={handleSelectStation}
              className="flex-1 bg-gray-100 outline-none text-gray-700 placeholder-gray-500"
            >
              <option value="">{t.selectStationPlaceholder || 'เลือกสถานี...'}</option>
              {(stationsList || []).map(s => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>
            {selectedStation && (
              <button
                onClick={() => { setSelectedStation(null); if (mapRef.current) mapRef.current.closePopup(); }}
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

        <div className="filter-buttons-container">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📍 ทั้งหมด
          </button>
          <button
            onClick={() => setFilter('AC')}
            className={`filter-button ${
              filter === 'AC'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔋 AC Charger
          </button>
          <button
            onClick={() => setFilter('DC')}
            className={`filter-button ${
              filter === 'DC'
                ? 'bg-red-600 text-white shadow-lg'
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
            <span>{t.acLegend}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded-full"></span>
            <span>{t.dcLegend}</span>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">{t.clickMarkerNote}</p>
      </div>

      {selectedStation && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">{t.stationDetails}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-semibold mb-2 text-blue-600">{selectedStation.name}</h4>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">{t.typeLabel}:</span> {selectedStation.type} {t.evCharger}</p>
                <p><span className="font-medium">{t.availableLabel}:</span> <span className="text-green-600 font-semibold">{selectedStation.available}</span></p>
                <p><span className="font-medium">{t.powerLabel}:</span> {selectedStation.power}</p>
                <p><span className="font-medium">{t.amenitiesLabel}:</span> {selectedStation.amenities}</p>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={() => navigate(`/booking/${selectedStation.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition duration-200 hover:scale-105"
              >
                {t.bookThisStation}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
