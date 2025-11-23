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

app.get('/api/users', (req, res) => {
  const data = readJson(usersFile);
  if (data == null) return res.status(500).json({ error: 'Failed to read users file' });
  res.json(data);
});

app.get('/api/payments', (req, res) => {
  const data = readJson(paymentsFile);
  if (data == null) return res.status(500).json({ error: 'Failed to read payments file' });
  res.json(data);
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
  const newUser = { ...body, id: Number(body.id || maxId + 1) };
  users.push(newUser);
  data.users = users;
  try {
    writeJson(usersFile, data);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json({ error: 'Failed to write users file' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
