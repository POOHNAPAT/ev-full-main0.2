/**
 * Users Data Module
 * จัดการข้อมูลผู้ใช้ในระบบ
 * ใช้ localStorage สำหรับเก็บข้อมูลในฝั่ง client
 */

// นำเข้าข้อมูลผู้ใช้เริ่มต้นจาก JSON file
import data from './users.json';

// กำหนด key สำหรับเก็บข้อมูลใน localStorage
const STORAGE_KEY = 'app_users_v1';

/**
 * ฟังก์ชันอ่านข้อมูลผู้ใช้จาก localStorage
 * @returns {Array|null} - array ของผู้ใช้หรือ null ถ้าไม่มีข้อมูล
 */
function _readStorage() {
  try {
    // ดึงข้อมูลจาก localStorage
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // แปลง JSON string เป็น object
    const parsed = JSON.parse(raw);
    // ตรวจสอบว่าเป็น array หรือไม่
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

/**
 * ฟังก์ชันเขียนข้อมูลผู้ใช้ลง localStorage
 * @param {Array} list - array ของผู้ใช้ที่ต้องการบันทึก
 */
function _writeStorage(list) {
  try {
    // แปลง array เป็น JSON string และบันทึกลง localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // เพิกเฉยต่อ error (เช่น storage quota exceeded)
  }
}

// สร้าง in-memory copy ของข้อมูลผู้ใช้เพื่อให้สามารถแก้ไขได้ขณะ runtime
// ถ้ามีข้อมูลใน localStorage ให้ใช้ข้อมูลนั้น ไม่งั้นใช้ข้อมูลจาก JSON file
const stored = (typeof localStorage !== 'undefined') ? _readStorage() : null;
let users = Array.isArray(stored) && stored.length ? stored.map(u => ({ ...u })) : (Array.isArray(data.users) ? data.users.map(u => ({ ...u })) : []);

// ดึงข้อมูล Admins จาก JSON file
const Admins = Array.isArray(data.Admins) ? data.Admins : [];

// บันทึกข้อมูลผู้ใช้เริ่มต้นลง localStorage
_writeStorage(users);

/**
 * ค้นหาผู้ใช้ด้วย email
 * @param {string} email - email ที่ต้องการค้นหา
 * @returns {Object|undefined} - ข้อมูลผู้ใช้หรือ undefined ถ้าไม่พบ
 */
export function findUserByEmail(email) {
  if (!email) return undefined;
  // ทำความสะอาด email (trim และแปลงเป็นพิมพ์เล็ก)
  const key = String(email).trim().toLowerCase();
  // ค้นหาผู้ใช้ที่มี email ตรงกัน
  return users.find(u => String(u.email || '').trim().toLowerCase() === key);
}

/**
 * เพิ่มผู้ใช้ใหม่เข้าระบบ
 * @param {string} email - email ของผู้ใช้ใหม่
 * @param {string} password - รหัสผ่านของผู้ใช้ใหม่
 * @returns {Object} - ข้อมูลผู้ใช้ที่สร้างใหม่
 */
export function addUser(email, password) {
  // ทำความสะอาด email
  const cleanEmail = String(email || '').trim().toLowerCase();
  // สร้าง ID ใหม่ (เพิ่มจากค่าสูงสุดปัจจุบัน)
  const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  // สร้างชื่อจาก email (ส่วนก่อน @)
  const nameFromEmail = String(cleanEmail).split('@')[0];
  // สร้าง object ผู้ใช้ใหม่
  const newUser = {
    id: nextId,
    email: cleanEmail,
    password,
    name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1), // Capitalize ชื่อ
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
