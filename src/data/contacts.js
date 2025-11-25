const STORAGE_KEY = 'app_contacts_v1';

export function loadContacts() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load contacts from localStorage', e);
    return [];
  }
}

export function addContact(entry) {
  const contacts = loadContacts();
  const id = Date.now();
  const obj = {
    id,
    name: entry.name || '',
    email: entry.email || '',
    subject: entry.subject || '',
    message: entry.message || '',
    status: entry.status || 'new',
    timestamp: new Date().toISOString()
  };
  contacts.unshift(obj);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); } catch (e) { console.error('Failed to save contact', e); }
  try { if (typeof window !== 'undefined' && window.dispatchEvent) window.dispatchEvent(new CustomEvent('contacts-changed', { detail: { action: 'add', contact: obj } })); } catch (e) {}
  return obj;
}

export function updateContact(updated) {
  const contacts = loadContacts();
  const idx = contacts.findIndex(c => c.id === updated.id);
  if (idx === -1) return null;
  contacts[idx] = { ...contacts[idx], ...updated };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); } catch (e) { console.error('Failed to update contact', e); }
  try { if (typeof window !== 'undefined' && window.dispatchEvent) window.dispatchEvent(new CustomEvent('contacts-changed', { detail: { action: 'update', contact: contacts[idx] } })); } catch (e) {}
  return contacts[idx];
}

export function deleteContact(id) {
  let contacts = loadContacts();
  contacts = contacts.filter(c => c.id !== id);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); } catch (e) { console.error('Failed to delete contact', e); }
  try { if (typeof window !== 'undefined' && window.dispatchEvent) window.dispatchEvent(new CustomEvent('contacts-changed', { detail: { action: 'delete', id } })); } catch (e) {}
  return true;
}
