const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.resolve(__dirname, '..', 'src', 'data');
const stationsFile = path.join(dataDir, 'stations-data.json');
const usersFile = path.join(dataDir, 'users.json');
const paymentsFile = path.join(dataDir, 'History-user.json');
const bookingsFile = path.join(dataDir, 'bookings.json');
const contactsFile = path.join(dataDir, 'contacts.json');

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/stations', (req, res) => {
  const data = readJson(stationsFile);
  if (data == null) return res.status(500).json({ error: 'Failed to read stations file' });
  res.json(Array.isArray(data) ? data : data);
});

// Helper to compute energy by type & minutes
function computeEnergy(type, minutes) {
  if (!minutes || minutes <= 0) return 0;
  const t = String(type || '').toLowerCase();
  // AC 40 kW/hr, DC 60 kW/hr, Both -> choose DC if contains dc else AC
  const rate = t.includes('dc') ? 60 : 40; // kW per hour
  return Math.round(((minutes / 60) * rate) * 10) / 10; // one decimal
}

// Combined endpoint (legacy) - still creates both entries
app.post('/api/history', (req, res) => {
  const body = req.body || {};
  const data = readJson(paymentsFile) || { initialHistory: [], paymentHistory: [] };
  const initialArr = Array.isArray(data.initialHistory) ? data.initialHistory : [];
  const paymentArr = Array.isArray(data.paymentHistory) ? data.paymentHistory : [];

  const nextInitialId = `h-${String(initialArr.length ? Math.max(...initialArr.map(h => Number(String(h.id).replace(/[^0-9]/g,''))||0))+1 : 1).padStart(3,'0')}`;
  const nextPaymentId = `p-${String(paymentArr.length ? Math.max(...paymentArr.map(h => Number(String(h.id).replace(/[^0-9]/g,''))||0))+1 : 1).padStart(3,'0')}`;

  const type = body.type || 'AC';
  const start = body.startTime || body.time || '';
  const end = body.endTime || '';
  const minutes = (start && end) ? (() => { const [sh,sm]=start.split(':').map(Number); const [eh,em]=end.split(':').map(Number); return (eh*60+em)-(sh*60+sm); })() : (body.minutes || 0);
  const energy = body.energy != null ? body.energy : computeEnergy(type, minutes);

  const sessionEntry = {
    id: nextInitialId,
    station: body.station || body.stationName || '',
    stationSerial: body.stationSerial || body.stationId || '',
    type,
    date: body.date || new Date().toISOString().slice(0,10),
    time: start,
    duration: body.duration || (minutes ? `${minutes} นาที` : ''),
    energy,
    cost: body.cost || body.paidAmount || 0,
    status: 'completed',
    userId: body.userId || null,
    userEmail: body.userEmail || body.email || '',
    bookingId: body.bookingId || body.id || null,
    paidAt: body.paidAt || new Date().toISOString()
  };

  const paymentEntry = {
    id: nextPaymentId,
    station: sessionEntry.station,
    stationSerial: sessionEntry.stationSerial,
    date: sessionEntry.date,
    time: sessionEntry.time,
    payment: body.paymentMethod || 'PromptPay',
    cost: sessionEntry.cost,
    status: 'paid',
    userId: sessionEntry.userId,
    userEmail: sessionEntry.userEmail,
    bookingId: sessionEntry.bookingId
  };

  initialArr.push(sessionEntry);
  paymentArr.push(paymentEntry);
  data.initialHistory = initialArr;
  data.paymentHistory = paymentArr;
  try { writeJson(paymentsFile, data); res.status(201).json({ session: sessionEntry, payment: paymentEntry }); }
  catch(e){ res.status(500).json({ error:'Failed to write history file' }); }
});

// New endpoint: create only session (charging) record
app.post('/api/history/session', (req,res) => {
  const body = req.body || {};
  const data = readJson(paymentsFile) || { initialHistory: [], paymentHistory: [] };
  const arr = Array.isArray(data.initialHistory)? data.initialHistory: [];
  const nextId = `h-${String(arr.length ? Math.max(...arr.map(h => Number(String(h.id).replace(/[^0-9]/g,''))||0))+1 : 1).padStart(3,'0')}`;
  const type = body.type || 'AC';
  const start = body.startTime || body.time || '';
  const end = body.endTime || '';
  const minutes = (start && end) ? (() => { const [sh,sm]=start.split(':').map(Number); const [eh,em]=end.split(':').map(Number); return (eh*60+em)-(sh*60+sm); })() : (body.minutes || 0);
  const energy = body.energy != null ? body.energy : computeEnergy(type, minutes);
  const entry = {
    id: nextId,
    station: body.station || body.stationName || '',
    stationSerial: body.stationSerial || body.stationId || '',
    type,
    date: body.date || new Date().toISOString().slice(0,10),
    time: start,
    duration: body.duration || (minutes ? `${minutes} นาที` : ''),
    energy,
    cost: body.cost || body.paidAmount || 0,
    status: 'completed',
    userId: body.userId || null,
    userEmail: body.userEmail || body.email || '',
    bookingId: body.bookingId || body.id || null,
    paidAt: body.paidAt || new Date().toISOString()
  };
  arr.push(entry); data.initialHistory = arr; if(!data.paymentHistory) data.paymentHistory=[];
  try { writeJson(paymentsFile, data); res.status(201).json(entry); }
  catch(e){ res.status(500).json({ error:'Failed to write history file' }); }
});

// New endpoint: create only payment record
app.post('/api/history/payment', (req,res) => {
  const body = req.body || {};
  const data = readJson(paymentsFile) || { initialHistory: [], paymentHistory: [] };
  const arr = Array.isArray(data.paymentHistory)? data.paymentHistory: [];
  const nextId = `p-${String(arr.length ? Math.max(...arr.map(h => Number(String(h.id).replace(/[^0-9]/g,''))||0))+1 : 1).padStart(3,'0')}`;
  const entry = {
    id: nextId,
    station: body.station || body.stationName || '',
    stationSerial: body.stationSerial || body.stationId || '',
    date: body.date || new Date().toISOString().slice(0,10),
    time: body.startTime || body.time || '',
    payment: body.paymentMethod || 'PromptPay',
    cost: body.cost || body.paidAmount || 0,
    status: body.status || 'paid',
    userId: body.userId || null,
    userEmail: body.userEmail || body.email || '',
    bookingId: body.bookingId || body.id || null
  };
  arr.push(entry); data.paymentHistory = arr; if(!data.initialHistory) data.initialHistory=[];
  try { writeJson(paymentsFile, data); res.status(201).json(entry); }
  catch(e){ res.status(500).json({ error:'Failed to write history file' }); }
});

app.post('/api/stations', (req, res) => {
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  const data = readJson(stationsFile) || [];
  const arr = Array.isArray(data) ? data : [];
  const maxId = arr.length ? Math.max(...arr.map(s => Number(s.id) || 0)) : 0;
  const newId = Number(body.id || maxId + 1);
  const newStation = { ...body, id: newId };
  // auto-generate stationSerial if not provided (ST + zero-padded id)
  if (!newStation.stationSerial) {
    const pad = String(newId).padStart(3, '0');
    newStation.stationSerial = `ST${pad}`;
  }
  arr.push(newStation);
  try {
    writeJson(stationsFile, arr);
    res.status(201).json(newStation);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write stations file' });
  }
});

app.post('/api/admins', (req, res) => {
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  const data = readJson(usersFile) || {};
  const admins = Array.isArray(data.Admins) ? data.Admins : [];
  const newAdmin = { ...body, id: Number(body.id || Date.now()) };
  admins.push(newAdmin);
  data.Admins = admins;
  try {
    writeJson(usersFile, data);
    res.status(201).json(newAdmin);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write users file' });
  }
});

app.post('/api/users', (req, res) => {
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  const data = readJson(usersFile) || {};
  const users = Array.isArray(data.users) ? data.users : [];
  const maxId = users.length ? Math.max(...users.map(u => Number(u.id) || 0)) : 0;
  const newId = Number(body.id || maxId + 1);
  const newUser = {
    id: newId,
    email: body.email || '',
    password: body.password || '',
    name: (typeof body.name === 'string') ? body.name : (body.email ? String(body.email).split('@')[0] : ''),
    modelcar: body.modelcar || body.carModel || '',
    telephone: body.telephone || body.phone || '',
    status: body.status || 'pending',
    historyCookies: typeof body.historyCookies === 'number' ? body.historyCookies : 0,
    // include any other fields submitted
    ...body
  };
  users.push(newUser);
  data.users = users;
  try {
    writeJson(usersFile, data);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write users file' });
  }
});

// Bookings endpoints (simple file-backed persistence)
app.get('/api/bookings', (req, res) => {
  const data = readJson(bookingsFile) || [];
  res.json(Array.isArray(data) ? data : []);
});

app.post('/api/bookings', (req, res) => {
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  const data = readJson(bookingsFile) || [];
  const arr = Array.isArray(data) ? data : [];
  const maxId = arr.length ? Math.max(...arr.map(b => Number(b.id) || 0)) : 0;
  const newId = Number(body.id || maxId + 1);
  const newBooking = { ...body, id: newId, timestamp: new Date().toISOString() };
  arr.push(newBooking);
  try {
    writeJson(bookingsFile, arr);
    res.status(201).json(newBooking);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write bookings file' });
  }
});

// Update booking by id (approve/reject)
app.put('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  const data = readJson(bookingsFile) || [];
  const arr = Array.isArray(data) ? data : [];
  const idx = arr.findIndex(b => Number(b.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  arr[idx] = { ...arr[idx], ...body };
  try {
    writeJson(bookingsFile, arr);
    res.json(arr[idx]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write bookings file' });
  }
});

// Update station by id (for admin editing)
app.put('/api/stations/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  const data = readJson(stationsFile) || [];
  const arr = Array.isArray(data) ? data : [];
  const idx = arr.findIndex(s => String(s.id) === String(id) || String(s.stationSerial) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Station not found' });
  
  // Merge updates but preserve id and stationSerial
  arr[idx] = { 
    ...arr[idx], 
    ...body,
    id: arr[idx].id,
    stationSerial: arr[idx].stationSerial
  };
  
  try {
    writeJson(stationsFile, arr);
    res.json(arr[idx]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write stations file' });
  }
});

// Decrement station availablePorts by station id and return updated station
app.put('/api/stations/:id/decrement', (req, res) => {
  const id = req.params.id;
  const data = readJson(stationsFile) || [];
  const arr = Array.isArray(data) ? data : [];
  const idx = arr.findIndex(s => String(s.id) === String(id) || String(s.stationSerial) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Station not found' });
  const current = Number(arr[idx].availablePorts || arr[idx].available || 0);
  if (current <= 0) return res.status(400).json({ error: 'No available ports' });
  arr[idx].availablePorts = current - 1;
  try {
    writeJson(stationsFile, arr);
    res.json({ id: arr[idx].id, availablePorts: arr[idx].availablePorts });
  } catch (e) {
    res.status(500).json({ error: 'Failed to write stations file' });
  }
});

// Contacts endpoints
app.get('/api/contacts', (req, res) => {
  const data = readJson(contactsFile) || [];
  res.json(Array.isArray(data) ? data : []);
});

app.post('/api/contacts', (req, res) => {
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  const data = readJson(contactsFile) || [];
  const arr = Array.isArray(data) ? data : [];
  const newContact = { id: Date.now(), ...body, timestamp: new Date().toISOString() };
  arr.unshift(newContact);
  try {
    writeJson(contactsFile, arr);
    res.status(201).json(newContact);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write contacts file' });
  }
});

app.put('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  const data = readJson(usersFile) || {};
  const users = Array.isArray(data.users) ? data.users : [];
  const idx = users.findIndex(u => Number(u.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  // merge and ensure expected fields are present
  users[idx] = {
    ...users[idx],
    ...body,
    email: body.email || users[idx].email || '',
    password: body.password || users[idx].password || '',
    name: ('name' in body) ? body.name : (users[idx].name || ''),
    modelcar: body.modelcar || body.carModel || users[idx].modelcar || users[idx].carModel || '',
    telephone: body.telephone || body.phone || users[idx].telephone || '',
    status: body.status || users[idx].status || 'active',
    historyCookies: typeof body.historyCookies === 'number' ? body.historyCookies : (users[idx].historyCookies || 0)
  };
  data.users = users;
  try {
    writeJson(usersFile, data);
    res.json(users[idx]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write users file' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
