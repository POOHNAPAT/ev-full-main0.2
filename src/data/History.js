import users from './users';
import rawData from './History-user.json';
import stationsData from './stations-data.json';

// Pick a sensible default user id for mock entries.
const defaultUserId = users?.[1]?.id ?? users?.[0]?.id ?? null;

// Source arrays from the JSON file (fall back to empty arrays)
const sourceUsageHistory = Array.isArray(rawData?.initialHistory) ? rawData.initialHistory : [];
const sourcePaymentHistory = Array.isArray(rawData?.paymentHistory) ? rawData.paymentHistory : [];

const STORAGE_KEY = 'app_history_entries_v1';

const getPriceForStation = (stationSerial) => {
  if (!stationSerial || !Array.isArray(stationsData)) return 8;
  const s = stationsData.find((st) => st.stationSerial === stationSerial);
  if (!s) return 8;
  return typeof s.pricePerUnit === 'number' ? s.pricePerUnit : 8;
};

const initialHistory = sourceUsageHistory.map((entry, index) => {
  const energy = Number(entry.energy) || 0;
  const price = getPriceForStation(entry.stationSerial);
  const computedCost = Math.round(energy * price);

  return {
    ...entry,
    id: entry.id || `mock-${index + 1}`,
    stationSerial: entry.stationSerial || `SN-MOCK-${(index % 3) + 1}`,
    userId: typeof entry.userId !== 'undefined' ? entry.userId : defaultUserId,
    date: entry.date || null,
    time: entry.time || null,
    energy,
    cost: computedCost,
    timestamp: entry.date && entry.time ? new Date(`${entry.date}T${entry.time}`).getTime() : Date.now() - index * 3600 * 1000,
    action: entry.status === 'completed' ? 'usage' : 'charging',
    details: {
      station: entry.station,
      duration: entry.duration,
      plate: entry.plate,
      ...entry,
    },
  };
});

const paymentHistory = sourcePaymentHistory.map((entry, index) => {
  // If payment entry contains energy, compute from that; otherwise try to match a usage entry
  const energy = typeof entry.energy !== 'undefined' ? Number(entry.energy) : null;
  let computedCost = typeof entry.cost === 'number' ? entry.cost : 0;

  if (energy !== null) {
    computedCost = Math.round(energy * getPriceForStation(entry.stationSerial));
  } else {
    const match = sourceUsageHistory.find(
      (h) => h.stationSerial === entry.stationSerial && h.userId === entry.userId && h.date === entry.date && h.time === entry.time
    );
    if (match) computedCost = Math.round((Number(match.energy) || 0) * getPriceForStation(match.stationSerial));
  }

  return {
    ...entry,
    id: entry.id || `p-mock-${index + 1}`,
    stationSerial: entry.stationSerial || `SN-MOCK-${(index % 3) + 1}`,
    userId: typeof entry.userId !== 'undefined' ? entry.userId : defaultUserId,
    date: entry.date || null,
    time: entry.time || null,
    cost: computedCost,
    timestamp: entry.date && entry.time ? new Date(`${entry.date}T${entry.time}`).getTime() : Date.now() - index * 3600 * 1000,
  };
});

function _readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function _writeStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore storage errors in dev/mock
  }
}

// Returns all history entries, optionally filtered by stationSerial and/or userId
export function loadHistory(stationSerial, userId) {
  const stored = _readStorage();
  const list = Array.isArray(stored) && stored.length ? stored : initialHistory.slice();

  let result = list;
  if (stationSerial && stationSerial !== 'ทั้งหมด') {
    result = result.filter((h) => h.stationSerial === stationSerial);
  }
  if (typeof userId !== 'undefined' && userId !== null) {
    result = result.filter((h) => h.userId === userId);
  }
  return result;
}

// Load payment entries (mock + optionally filtered).
export function loadPayments(stationSerial, userId) {
  let list = Array.isArray(paymentHistory) ? paymentHistory.slice() : [];

  if (stationSerial && stationSerial !== 'ทั้งหมด') {
    list = list.filter((p) => p.stationSerial === stationSerial);
  }
  if (typeof userId !== 'undefined' && userId !== null) {
    list = list.filter((p) => p.userId === userId);
  }
  return list;
}

// Export datasets for tests or previews
export { initialHistory, paymentHistory };

export default {
  loadHistory,
  loadPayments,
  initialHistory,
  paymentHistory,
};