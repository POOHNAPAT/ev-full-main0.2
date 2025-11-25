import data from './users.json';

const STORAGE_KEY = 'app_users_v1';

function _readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function _writeStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

// Initialize an in-memory copy of users so runtime code can mutate it if needed
const stored = (typeof localStorage !== 'undefined') ? _readStorage() : null;
let users = Array.isArray(stored) && stored.length ? stored.map(u => ({ ...u })) : (Array.isArray(data.users) ? data.users.map(u => ({ ...u })) : []);

const Admins = Array.isArray(data.Admins) ? data.Admins : [];

_writeStorage(users);

export function findUserByEmail(email) {
  if (!email) return undefined;
  const key = String(email).trim().toLowerCase();
  return users.find(u => String(u.email || '').trim().toLowerCase() === key);
}

export function addUser(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const nameFromEmail = String(cleanEmail).split('@')[0];
  const newUser = {
    id: nextId,
    email: cleanEmail,
    password,
    name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
    modelcar: '',
    status: 'active',
    historyCookies: 0,
  };
  users.push(newUser);
  _writeStorage(users);
  return newUser;
}

export { Admins };

export default users;

export function updateUser(updated) {
  const idx = users.findIndex(u => u.id === updated.id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updated };
  _writeStorage(users);
  return users[idx];
}
