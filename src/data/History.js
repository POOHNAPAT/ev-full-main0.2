import users from "./users";

// Pick a sensible default user id for mock entries.
// Some parts of the mock data previously referenced `users[1].id` but
// `users` may only contain one entry (index 0). Use optional chaining
// and fallback to avoid runtime errors in environments with a single user.
const defaultUserId = users?.[1]?.id ?? users?.[0]?.id ?? null;

// Simple history mock + loader for UsageHistory
const STORAGE_KEY = 'app_history_entries_v1';

const initialHistory = [
  {
    id: 'h-001',
    station: 'Central World – ชั้น B2',
    stationSerial: 'ST001',
    type: 'AC',
    date: '2025-10-07',
    time: '09:45',
    duration: '50 นาที',
    energy: 47.5,
    cost: 280,
    status: 'completed',
    userId: 1,
    vehicleId: 'V-ST001-01',
    plate: 'กท-1234',
  },
  {
    id: 'h-002',
    station: 'Bangkok Hospital – อาคารจอด P2 EV Zone',
    stationSerial: 'ST002',
    type: 'DC Fast',
    date: '2025-10-07',
    time: '15:45',
    duration: '30 นาที',
    energy: 40.5,
    cost: 300,
    status: 'completed',
    userId: 1,
    vehicleId: 'V-ST002-01',
    plate: 'ขก-4321',
  },
];
const paymentHistory = [
  {
    id: 'p-001',
    station: 'Central World – ชั้น B2',
    stationSerial: 'ST001',
    date: '2025-10-07',
    time: '09:45',
    payment: 'PromptPay',
    cost: 280,
    status: 'paid',
    userId: 1,
    vehicleId: 'V-ST001-01',
    plate: 'กท-1234',
  },
  {
    id: 'p-002',
    station: 'Bangkok Hospital – อาคารจอด P2 EV Zone',
    stationSerial: 'ST002',
    date: '2025-10-07',
    time: '15:45',
    payment: 'PromptPay',
    cost: 300,
    status: 'paid',
    userId: 1,
    vehicleId: 'V-ST002-01',
    plate: 'ขก-4321',
  },
];

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

// Returns all history entries or filtered by stationSerial
// Returns all history entries, optionally filtered by stationSerial and/or userId
export function loadHistory(stationSerial, userId) {
  const stored = _readStorage();
  const list = Array.isArray(stored) && stored.length ? stored : initialHistory;
  let result = list;
  if (stationSerial && stationSerial !== 'ทั้งหมด') {
    result = result.filter((h) => h.stationSerial === stationSerial);
  }
  if (typeof userId !== 'undefined' && userId !== null) {
    result = result.filter((h) => h.userId === userId);
  }
  return result;
}

// Load payment entries (mock + optionally filtered). Kept separate from `paymentHistory`
// to allow the app to request payments similarly to usage entries.
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
  initialHistory,
  paymentHistory,
};
