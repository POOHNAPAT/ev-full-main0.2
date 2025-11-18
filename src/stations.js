// Default station data
export const defaultStations = {
  'central-world': { name: 'Central World – ชั้น B2', available: '6/10', power: '150 kW', amenities: 'Wi-Fi ฟรี, ร้านกาแฟ, ห้องน้ำ, ระบบรักษาความปลอดภัย, พื้นที่พักผ่อน, ร้านอาหาร' },
  'siam-paragon': { name: 'Siam Paragon', available: '4/8', power: '100 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ' },
  'mbk-center': { name: 'MBK Center', available: '5/10', power: '120 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ' },
  'emquartier': { name: 'EmQuartier', available: '5/8', power: '120 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่พักผ่อน, ร้านค้า' },
  'terminal-21': { name: 'Terminal 21', available: '7/12', power: '200 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่พักผ่อน' },
  'asiatique': { name: 'Asiatique', available: '3/6', power: '80 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่พักผ่อน' },
  'chatuchak-market': { name: 'Chatuchak Weekend Market', available: '12/20', power: '250 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่จอดรถ, ระบบรักษาความปลอดภัย, ร้านค้า, พื้นที่พักผ่อน' },
  'lumpini-park': { name: 'Lumpini Park', available: '2/4', power: '50 kW', amenities: 'Wi-Fi ฟรี, ห้องน้ำ, พื้นที่พักผ่อน' },
  'bangkok-hospital': { name: 'Bangkok Hospital', available: '1/2', power: '30 kW', amenities: 'Wi-Fi ฟรี, ห้องน้ำ, ระบบรักษาความปลอดภัย' },
  'grand-palace': { name: 'Grand Palace', available: '4/8', power: '100 kW', amenities: 'Wi-Fi ฟรี, ห้องน้ำ, พื้นที่พักผ่อน' },
  'siam-square': { name: 'Siam Square', available: '5/10', power: '120 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ' },
  'wat-arun': { name: 'Wat Arun', available: '3/6', power: '80 kW', amenities: 'Wi-Fi ฟรี, ห้องน้ำ, พื้นที่พักผ่อน' },
  'jim-thompson': { name: 'Jim Thompson House', available: '2/4', power: '50 kW', amenities: 'Wi-Fi ฟรี, ห้องน้ำ' },
  'patpong': { name: 'Patpong Night Market', available: '6/12', power: '150 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ' },
  'erawan-shrine': { name: 'Erawan Shrine', available: '4/8', power: '100 kW', amenities: 'Wi-Fi ฟรี, ห้องน้ำ, พื้นที่พักผ่อน' },
  'khao-san': { name: 'Khao San Road', available: '8/15', power: '180 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ' },
  'silom-complex': { name: 'Silom Complex', available: '5/10', power: '120 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ' },
  'victory-monument': { name: 'Victory Monument', available: '3/6', power: '80 kW', amenities: 'Wi-Fi ฟรี, ห้องน้ำ, พื้นที่พักผ่อน' },
  'central-chidlom': { name: 'Central Chidlom', available: '8/15', power: '180 kW', amenities: 'Wi-Fi ฟรี, ร้านกาแฟ, ห้องน้ำ, ระบบรักษาความปลอดภัย, ร้านอาหาร, พื้นที่จอดรถ' },
  'sukhumvit': { name: 'Sukhumvit Road', available: '4/8', power: '100 kW', amenities: 'Wi-Fi ฟรี, ร้านค้า, ห้องน้ำ' },
  'don-mueang': { name: 'Don Mueang Airport', available: '10/20', power: '300 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่พักผ่อน, ระบบรักษาความปลอดภัย' },
  'suvarnabhumi': { name: 'Suvarnabhumi Airport', available: '15/30', power: '500 kW', amenities: 'Wi-Fi ฟรี, ร้านอาหาร, ห้องน้ำ, พื้นที่พักผ่อน, ระบบรักษาความปลอดภัย, ร้านค้า' },
  'bangkok-university': { name: 'Bangkok University', available: '6/12', power: '150 kW', amenities: 'Wi-Fi ฟรี, ห้องน้ำ, พื้นที่พักผ่อน' },
};

// Function to load stations from localStorage or return default
export const loadStations = () => {
  const stored = localStorage.getItem('stations');
  return stored ? JSON.parse(stored) : { ...defaultStations };
};

// Function to save stations to localStorage
export const saveStations = (stations) => {
  localStorage.setItem('stations', JSON.stringify(stations));
};

// Function to decrement available spots for a station
export const decrementAvailable = (stationId) => {
  const stations = loadStations();
  if (stations[stationId]) {
    const [current, total] = stations[stationId].available.split('/').map(Number);
    if (current > 0) {
      stations[stationId].available = `${current - 1}/${total}`;
      saveStations(stations);
    }
  }
};
