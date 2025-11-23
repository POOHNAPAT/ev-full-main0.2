import stations from './stations-data.json';

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