let stations = [
  {
    id: 1,
    name: 'Central World – ชั้น B2, กรุงเทพมหานคร',
    type: 'AC',
    location: 'กรุงเทพมหานคร',
    availablePorts: 4,
    allPorts: 6,
    status: 'available',
    latitude: 13.746100,
    longitude: 100.539400,
    amenities: ['wifi', 'bathroom', 'restaurant', 'restroom'],
    stationSerial: 'ST001'
  },
  {
    id: 2,
    name: 'Mega Bangna – ลานจอดรถ, สมุทรปราการ',
    type: 'Both',
    location: 'สมุทรปราการ',
    availablePorts: 3,
    allPorts: 8,
    status: 'available',
    latitude: 13.657900,
    longitude: 100.611600,
    amenities: ['wifi', 'shopping', 'restroom'],
    stationSerial: 'ST002'
  },
  {
    id: 3,
    name: 'Terminal 21 – พัทยา, ชลบุรี',
    type: 'DC',
    location: 'ชลบุรี',
    availablePorts: 1,
    allPorts: 4,
    status: 'busy',
    latitude: 12.927600,
    longitude: 100.877100,
    amenities: ['restaurant', 'parking'],
    stationSerial: 'ST003'
  },
  {
    id: 4,
    name: 'หาดใหญ่ EV Hub, สงขลา',
    type: 'AC',
    location: 'สงขลา',
    availablePorts: 2,
    allPorts: 3,
    status: 'available',
    latitude: 7.008900,
    longitude: 100.476200,
    amenities: ['restroom', 'cafe'],
    stationSerial: 'ST004'
  },
  {
    id: 5,
    name: 'Airport Plaza – เชียงใหม่',
    type: 'Both',
    location: 'เชียงใหม่',
    availablePorts: 5,
    allPorts: 8,
    status: 'available',
    latitude: 18.788300,
    longitude: 98.985300,
    amenities: ['wifi', 'shopping', 'bathroom'],
    stationSerial: 'ST005'
  },
  {
    id: 6,
    name: 'Central Festival – Phuket',
    type: 'DC',
    location: 'ภูเก็ต',
    availablePorts: 0,
    allPorts: 4,
    status: 'busy',
    latitude: 7.880400,
    longitude: 98.392300,
    amenities: ['restaurant', 'parking'],
    stationSerial: 'ST006'
  },
  {
    id: 7,
    name: 'วิทยาลัยเทคนิค ขอนแก่น EV, ขอนแก่น',
    type: 'AC',
    location: 'ขอนแก่น',
    availablePorts: 2,
    allPorts: 2,
    status: 'available',
    latitude: 16.438000,
    longitude: 102.835000,
    amenities: ['restroom'],
    stationSerial: 'ST007'
  },
  {
    id: 8,
    name: 'โครงการเมืองใหม่ – นครราชสีมา',
    type: 'Both',
    location: 'นครราชสีมา',
    availablePorts: 6,
    allPorts: 10,
    status: 'available',
    latitude: 14.979900,
    longitude: 102.097700,
    amenities: ['wifi', 'cafe', 'restroom'],
    stationSerial: 'ST008'
  },

  {
    id: 9,
    name: 'เซ็นทรัล พลาซา นครศรี, นครศรีธรรมราช',
    type: 'DC',
    location: 'นครศรีธรรมราช',
    availablePorts: 2,
    allPorts: 5,
    status: 'maintenance',
    latitude: 8.431600,
    longitude: 99.969300,
    amenities: ['parking', 'shopping'],
    stationSerial: 'ST009'
  },
  {
    id: 10,
    name: 'บขส. เมือง – สระบุรี',
    type: 'AC',
    location: 'สระบุรี',
    availablePorts: 1,
    allPorts: 2,
    status: 'available',
    latitude: 14.520900,
    longitude: 101.015800,
    amenities: ['restroom', 'parking'],
    stationSerial: 'ST010'
  },
  {
    id: 11,
    name: 'จุดพักริมทาง มอเตอร์เวย์, ปทุมธานี',
    type: 'Both',
    location: 'ปทุมธานี',
    availablePorts: 3,
    allPorts: 6,
    status: 'available',
    latitude: 14.020900,
    longitude: 100.538600,
    amenities: ['bathroom', 'shopping'],
    stationSerial: 'ST011'
  },
  {
    id: 12,
    name: 'สถานีรถไฟ เชียงราย',
    type: 'AC',
    location: 'เชียงราย',
    availablePorts: 2,
    allPorts: 2,
    status: 'available',
    latitude: 19.910700,
    longitude: 99.840000,
    amenities: ['restroom', 'cafe'],
    stationSerial: 'ST012'
  },
  {
    id: 13,
    name: 'ห้างสรรพสินค้า นครปฐม',
    type: 'DC',
    location: 'นครปฐม',
    availablePorts: 1,
    allPorts: 3,
    status: 'offline',
    latitude: 13.819800,
    longitude: 100.044800,
    amenities: ['parking'],
    stationSerial: 'ST013'
  },
  {
    id: 14,
    name: 'จุดชมวิว เขาใหญ่, นครราชสีมา',
    type: 'AC',
    location: 'นครราชสีมา',
    availablePorts: 2,
    allPorts: 4,
    status: 'available',
    latitude: 14.437800,
    longitude: 101.372500,
    amenities: ['restroom', 'restaurant'],
    stationSerial: 'ST014'
  },
  {
    id: 15,
    name: 'ตลาดน้ำโบราณ – สมุทรสงคราม',
    type: 'Both',
    location: 'สมุทรสงคราม',
    availablePorts: 4,
    allPorts: 4,
    status: 'available',
    latitude: 13.413400,
    longitude: 100.014700,
    amenities: ['shopping', 'restroom'],
    stationSerial: 'ST015'
  },
  {
    id: 16,
    name: 'โรงพยาบาล ภูเก็ต EV, ภูเก็ต',
    type: 'DC',
    location: 'ภูเก็ต',
    availablePorts: 1,
    allPorts: 2,
    status: 'busy',
    latitude: 7.880400,
    longitude: 98.388300,
    amenities: ['bathroom'],
    stationSerial: 'ST016'
  },
  {
    id: 17,
    name: 'ห้างโลตัส นนทบุรี',
    type: 'AC',
    location: 'นนทบุรี',
    availablePorts: 3,
    allPorts: 5,
    status: 'available',
    latitude: 13.859100,
    longitude: 100.490000,
    amenities: ['wifi', 'parking'],
    stationSerial: 'ST017'
  },
  {
    id: 18,
    name: 'จุดแวะเติมพลัง สุพรรณบุรี',
    type: 'Both',
    location: 'สุพรรณบุรี',
    availablePorts: 4,
    allPorts: 6,
    status: 'available',
    latitude: 14.474000,
    longitude: 100.123000,
    amenities: ['restroom', 'shopping'],
    stationSerial: 'ST018'
  },
  {
    id: 19,
    name: 'วิทยาลัยเทคโนโลยี ระยอง EV',
    type: 'AC',
    location: 'ระยอง',
    availablePorts: 1,
    allPorts: 2,
    status: 'maintenance',
    latitude: 12.681900,
    longitude: 101.255300,
    amenities: ['parking'],
    stationSerial: 'ST019'
  },
  {
    id: 20,
    name: 'ถนนคนเดิน – นครสวรรค์',
    type: 'Both',
    location: 'นครสวรรค์',
    availablePorts: 5,
    allPorts: 7,
    status: 'available',
    latitude: 15.703000,
    longitude: 100.129600,
    amenities: ['shopping', 'cafe'],
    stationSerial: 'ST020'
  },
  {
    id: 21,
    name: 'สนามบิน สุวรรณภูมิ – อาคารจอดรถ',
    type: 'DC',
    location: 'กรุงเทพมหานคร',
    availablePorts: 6,
    allPorts: 10,
    status: 'available',
    latitude: 13.690000,
    longitude: 100.750100,
    amenities: ['shopping', 'restaurant', 'bathroom'],
    stationSerial: 'ST021'
  },
  {
    id: 22,
    name: 'ศูนย์การค้า หาดใหญ่ มอลล์',
    type: 'Both',
    location: 'สงขลา',
    availablePorts: 2,
    allPorts: 5,
    status: 'busy',
    latitude: 6.993000,
    longitude: 100.473900,
    amenities: ['parking', 'shopping'],
    stationSerial: 'ST022'
  },
  {
    id: 23,
    name: 'จุดบริการริมทาง ชุมพร',
    type: 'AC',
    location: 'ชุมพร',
    availablePorts: 3,
    allPorts: 3,
    status: 'available',
    latitude: 10.494100,
    longitude: 99.181900,
    amenities: ['restroom'],
    stationSerial: 'ST023'
  },
  {
    id: 24,
    name: 'ตลาดเช้า – อุดรธานี',
    type: 'DC',
    location: 'อุดรธานี',
    availablePorts: 0,
    allPorts: 3,
    status: 'busy',
    latitude: 17.415600,
    longitude: 102.785600,
    amenities: ['shopping'],
    stationSerial: 'ST024'
  },
  {
    id: 25,
    name: 'ห้างสรรพสินค้า ขอนแก่น',
    type: 'Both',
    location: 'ขอนแก่น',
    availablePorts: 4,
    allPorts: 6,
    status: 'available',
    latitude: 16.441900,
    longitude: 102.831000,
    amenities: ['restaurant', 'wifi'],
    stationSerial: 'ST025'
  },
  {
    id: 26,
    name: 'จุดแวะพัก พัทยาเหนือ',
    type: 'AC',
    location: 'ชลบุรี',
    availablePorts: 2,
    allPorts: 4,
    status: 'available',
    latitude: 12.931700,
    longitude: 100.885500,
    amenities: ['restroom', 'cafe'],
    stationSerial: 'ST026'
  },
  {
    id: 27,
    name: 'หมู่บ้านธุรกิจ – สมุทรสาคร',
    type: 'Both',
    location: 'สมุทรสาคร',
    availablePorts: 5,
    allPorts: 5,
    status: 'available',
    latitude: 13.532600,
    longitude: 100.263600,
    amenities: ['shopping', 'parking'],
    stationSerial: 'ST027'
  },
  {
    id: 28,
    name: 'ศูนย์กีฬา ภูเก็ต EV',
    type: 'DC',
    location: 'ภูเก็ต',
    availablePorts: 1,
    allPorts: 2,
    status: 'maintenance',
    latitude: 7.879500,
    longitude: 98.392200,
    amenities: ['restroom'],
    stationSerial: 'ST028'
  },
  {
    id: 29,
    name: 'ตลาดกลางคืน เชียงใหม่',
    type: 'AC',
    location: 'เชียงใหม่',
    availablePorts: 3,
    allPorts: 3,
    status: 'available',
    latitude: 18.787700,
    longitude: 98.993100,
    amenities: ['shopping', 'cafe'],
    stationSerial: 'ST029'
  },
  {
    id: 30,
    name: 'อุทยานแห่งชาติ เขาสามร้อยยอด',
    type: 'Both',
    location: 'ประจวบคีรีขันธ์',
    availablePorts: 2,
    allPorts: 4,
    status: 'available',
    latitude: 12.339100,
    longitude: 99.923000,
    amenities: ['restroom', 'parking'],
    stationSerial: 'ST030'
  },
  {
    id: 31,
    name: 'ถนนคนเดิน หาดใหญ่',
    type: 'AC',
    location: 'สงขลา',
    availablePorts: 4,
    allPorts: 6,
    status: 'available',
    latitude: 6.999300,
    longitude: 100.473400,
    amenities: ['shopping', 'wifi'],
    stationSerial: 'ST031'
  },
  {
    id: 32,
    name: 'ศูนย์การค้า พิษณุโลก',
    type: 'DC',
    location: 'พิษณุโลก',
    availablePorts: 1,
    allPorts: 3,
    status: 'offline',
    latitude: 16.821600,
    longitude: 100.265400,
    amenities: ['parking'],
    stationSerial: 'ST032'
  },
  {
    id: 33,
    name: 'สถานีขนส่ง ชลบุรีกลาง',
    type: 'Both',
    location: 'ชลบุรี',
    availablePorts: 3,
    allPorts: 5,
    status: 'available',
    latitude: 13.361100,
    longitude: 100.984700,
    amenities: ['restroom', 'shopping'],
    stationSerial: 'ST033'
  },
  {
    id: 34,
    name: 'ตลาดสด นนทบุรี',
    type: 'AC',
    location: 'นนทบุรี',
    availablePorts: 2,
    allPorts: 2,
    status: 'available',
    latitude: 13.862300,
    longitude: 100.514100,
    amenities: ['shopping'],
    stationSerial: 'ST034'
  },
  {
    id: 35,
    name: 'หาดสุรินทร์ จุดแวะพัก',
    type: 'Both',
    location: 'กระบี่',
    availablePorts: 2,
    allPorts: 3,
    status: 'available',
    latitude: 8.052800,
    longitude: 98.906300,
    amenities: ['restroom'],
    stationSerial: 'ST035'
  },
  {
    id: 36,
    name: 'ศูนย์การค้า ลำปาง',
    type: 'DC',
    location: 'ลำปาง',
    availablePorts: 0,
    allPorts: 2,
    status: 'busy',
    latitude: 18.288400,
    longitude: 99.500800,
    amenities: ['parking'],
    stationSerial: 'ST036'
  },
  {
    id: 37,
    name: 'จุดบริการทางหลวง นครปฐม',
    type: 'AC',
    location: 'นครปฐม',
    availablePorts: 3,
    allPorts: 4,
    status: 'available',
    latitude: 13.819900,
    longitude: 100.048500,
    amenities: ['shopping', 'restroom'],
    stationSerial: 'ST037'
  },
  {
    id: 38,
    name: 'สถานีตำรวจภูธร ชัยภูมิ EV',
    type: 'Both',
    location: 'ชัยภูมิ',
    availablePorts: 2,
    allPorts: 3,
    status: 'available',
    latitude: 15.806000,
    longitude: 102.034700,
    amenities: ['parking'],
    stationSerial: 'ST038'
  },
  {
    id: 39,
    name: 'วิทยาลัยอาชีวศึกษา นครศรีฯ',
    type: 'AC',
    location: 'นครศรีธรรมราช',
    availablePorts: 1,
    allPorts: 1,
    status: 'available',
    latitude: 8.431000,
    longitude: 99.968000,
    amenities: ['restroom'],
    stationSerial: 'ST039'
  },
  {
    id: 40,
    name: 'ภูมิพลไนท์บาซาร์ – เชียงใหม่',
    type: 'Both',
    location: 'เชียงใหม่',
    availablePorts: 5,
    allPorts: 6,
    status: 'available',
    latitude: 18.786300,
    longitude: 98.986500,
    amenities: ['shopping', 'wifi', 'cafe'],
    stationSerial: 'ST040'
  },
  {
    id: 41,
    name: 'จุดแวะพัก อ.แม่สอด, ตาก',
    type: 'DC',
    location: 'ตาก',
    availablePorts: 1,
    allPorts: 2,
    status: 'available',
    latitude: 16.709300,
    longitude: 98.566000,
    amenities: ['restroom'],
    stationSerial: 'ST041'
  },
  {
    id: 42,
    name: 'ห้างเซ็นทรัล ลำลูกกา',
    type: 'AC',
    location: 'ปทุมธานี',
    availablePorts: 2,
    allPorts: 4,
    status: 'available',
    latitude: 14.041900,
    longitude: 100.729200,
    amenities: ['shopping', 'restaurant'],
    stationSerial: 'ST042'
  },
  {
    id: 43,
    name: 'ศูนย์การค้า นครสวรรค์',
    type: 'Both',
    location: 'นครสวรรค์',
    availablePorts: 3,
    allPorts: 5,
    status: 'busy',
    latitude: 15.699900,
    longitude: 100.129000,
    amenities: ['wifi', 'parking'],
    stationSerial: 'ST043'
  },
  {
    id: 44,
    name: 'สถานีบริการน้ำมัน ชุมพร',
    type: 'AC',
    location: 'ชุมพร',
    availablePorts: 2,
    allPorts: 2,
    status: 'available',
    latitude: 10.487200,
    longitude: 99.180300,
    amenities: ['shopping'],
    stationSerial: 'ST044'
  },
  {
    id: 45,
    name: 'ตลาดนัด เทศบาลเมือง, ระนอง',
    type: 'DC',
    location: 'ระนอง',
    availablePorts: 1,
    allPorts: 1,
    status: 'available',
    latitude: 9.958000,
    longitude: 98.605000,
    amenities: ['shopping'],
    stationSerial: 'ST045'
  },
  {
    id: 46,
    name: 'สถานีรถไฟ ชั้นใน – กรุงเทพ',
    type: 'Both',
    location: 'กรุงเทพมหานคร',
    availablePorts: 8,
    allPorts: 12,
    status: 'available',
    latitude: 13.756300,
    longitude: 100.501800,
    amenities: ['wifi', 'restaurant', 'bathroom'],
    stationSerial: 'ST046'
  },
  {
    id: 47,
    name: 'ศูนย์การค้า นครพนม',
    type: 'AC',
    location: 'นครพนม',
    availablePorts: 1,
    allPorts: 2,
    status: 'available',
    latitude: 17.397900,
    longitude: 104.776500,
    amenities: ['parking'],
    stationSerial: 'ST047'
  },
  {
    id: 48,
    name: 'แลนด์มาร์ค พัทยาใต้',
    type: 'DC',
    location: 'ชลบุรี',
    availablePorts: 0,
    allPorts: 3,
    status: 'busy',
    latitude: 12.925600,
    longitude: 100.873800,
    amenities: ['restaurant'],
    stationSerial: 'ST048'
  },
  {
    id: 49,
    name: 'ศูนย์บริการทางหลวง ขอนแก่น',
    type: 'Both',
    location: 'ขอนแก่น',
    availablePorts: 4,
    allPorts: 6,
    status: 'available',
    latitude: 16.432300,
    longitude: 102.823500,
    amenities: ['restroom', 'shopping'],
    stationSerial: 'ST049'
  },
  {
    id: 50,
    name: 'จุดเช็คอิน เกาะสมุย',
    type: 'AC',
    location: 'สุราษฎร์ธานี',
    availablePorts: 2,
    allPorts: 3,
    status: 'available',
    latitude: 9.512300,
    longitude: 99.935200,
    amenities: ['shopping', 'restroom'],
    stationSerial: 'ST050'
  }
];

// Persist/load helper: use localStorage if available to allow runtime changes (like decrementing availability)
function _loadFromStorage() {
  try {
    const raw = localStorage.getItem('stationsData');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

function _saveToStorage(data) {
  try {
    localStorage.setItem('stationsData', JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export function loadStations() {
  // Return a mapping keyed by station id (string) for backwards compatibility
  const fromStorage = _loadFromStorage();
  const list = Array.isArray(fromStorage) ? fromStorage : stations;
  const map = {};
  list.forEach(s => {
    map[String(s.id)] = {
      id: s.id,
      name: s.name,
      available: s.availablePorts,
      power: s.type,
      amenities: Array.isArray(s.amenities) ? s.amenities.join(', ') : s.amenities,
      stationSerial: s.stationSerial
    };
  });
  return map;
}

export function decrementAvailable(id) {
  const key = String(id);
  const fromStorage = _loadFromStorage();
  const list = Array.isArray(fromStorage) ? fromStorage : stations.slice();
  const idx = list.findIndex(s => String(s.id) === key);
  if (idx !== -1) {
    if (typeof list[idx].availablePorts === 'number' && list[idx].availablePorts > 0) {
      list[idx].availablePorts = list[idx].availablePorts - 1;
      _saveToStorage(list);
      return true;
    }
  }
  return false;
}

// Named & default export of the raw stations list (array)
export { stations };
export default stations;