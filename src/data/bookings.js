const STORAGE_KEY = 'app_bookings_v1';

function _readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function _writeStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

export function loadBookings() {
  return Array.isArray(_readStorage()) ? _readStorage() : [];
}

export function addBooking(b) {
  const list = loadBookings();
  const nextId = list.length ? Math.max(...list.map(x => Number(x.id) || 0)) + 1 : 1;
  const item = { id: nextId, ...b };
  list.push(item);
  _writeStorage(list);
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('bookings-changed', { detail: { action: 'add', booking: item } }));
    }
  } catch (e) {
    // ignore
  }
  return item;
}

export function updateBooking(updated) {
  const list = loadBookings();
  const idx = list.findIndex(x => Number(x.id) === Number(updated.id));
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updated };
  _writeStorage(list);
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('bookings-changed', { detail: { action: 'update', booking: list[idx] } }));
    }
  } catch (e) {
    // ignore
  }
  return list[idx];
}

export default { loadBookings, addBooking, updateBooking };
