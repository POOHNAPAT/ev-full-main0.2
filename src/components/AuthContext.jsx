// นำเข้า React และ hooks ที่จำเป็นสำหรับการจัดการ state และ context
import React, { createContext, useContext, useEffect, useState } from 'react';

// สร้าง Context สำหรับการจัดการ Authentication ทั่วทั้งแอปพลิเคชัน
const AuthContext = createContext();

/**
 * AuthProvider Component
 * ใช้สำหรับจัดการสถานะการเข้าสู่ระบบของผู้ใช้ทั่วทั้งแอปพลิเคชัน
 * @param {Object} children - Component ลูกที่จะได้รับ context
 */
export function AuthProvider({ children }){
  // State สำหรับเก็บข้อมูลผู้ใช้ที่เข้าสู่ระบบ
  const [user, setUser] = useState(null);
  // State สำหรับแสดงสถานะการโหลดข้อมูลเริ่มต้น
  const [loading, setLoading] = useState(true);
  // State สำหรับแสดงสถานะการทำงานของ Authentication (login/signup/logout)
  const [authLoading, setAuthLoading] = useState(false);

  /**
   * useEffect Hook
   * ทำงานเมื่อ Component ถูกโหลดครั้งแรก
   * ตรวจสอบว่ามีข้อมูลผู้ใช้ที่บันทึกไว้ใน localStorage หรือไม่
   * ถ้ามีจะทำการกู้คืนสถานะการเข้าสู่ระบบ
   */
  useEffect(()=> {
    // ดึงข้อมูลผู้ใช้ที่บันทึกไว้จาก localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      // แปลง JSON string เป็น Object และเซ็ตเป็น user ปัจจุบัน
      setUser(JSON.parse(storedUser));
    }
    // เปลี่ยนสถานะ loading เป็น false เมื่อตรวจสอบเสร็จ
    setLoading(false);
  }, []);

  /**
   * ฟังก์ชัน login
   * ใช้สำหรับเข้าสู่ระบบด้วย email และ password
   * @param {string} email - อีเมลของผู้ใช้
   * @param {string} password - รหัสผ่านของผู้ใช้
   * @throws {Error} เมื่อข้อมูลไม่ถูกต้องหรือไม่สามารถเชื่อมต่อ API ได้
   */
  const login = async (email, password) => {
    // เปิดสถานะ loading สำหรับ authentication
    setAuthLoading(true);
    try {
      // จำลองการทำงานแบบ asynchronous (delay 500ms)
      await new Promise(resolve => setTimeout(resolve, 500));

      // ทำความสะอาด email: ลบช่องว่างและแปลงเป็นตัวพิมพ์เล็ก
      const cleanEmail = String(email || '').trim().toLowerCase();

      // ดึง URL base ของ API จาก environment variable หรือใช้ default
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

      // ดึงข้อมูลผู้ใช้จาก API
      let foundUser = null;
      try {
        // เรียก API เพื่อดึงรายการผู้ใช้ทั้งหมด
        const res = await fetch(base + '/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users from API');
        }
        // แปลง response เป็น JSON
        const data = await res.json();
        // ตรวจสอบและแปลงข้อมูลให้เป็น Array
        const list = Array.isArray(data.users) ? data.users : (Array.isArray(data) ? data : []);
        // ค้นหาผู้ใช้ที่มี email ตรงกับที่กรอกเข้ามา
        foundUser = list.find(u => String(u.email || '').trim().toLowerCase() === cleanEmail);
      } catch (e) {
        throw new Error('Unable to connect to server. Please try again later.');
      }

      // ตรวจสอบว่าพบผู้ใช้หรือไม่
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // ตรวจสอบสถานะบัญชีของผู้ใช้
      const status = String(foundUser.status || 'active').toLowerCase();
      // บัญชีที่รออนุมัติ
      if (status === 'pending') throw new Error('บัญชียังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ');
      // บัญชีที่ถูกระงับ
      if (status === 'banned' || status === 'suspended') throw new Error('บัญชีถูกระงับ ติดต่อผู้ดูแลระบบ');

      // ตรวจสอบรหัสผ่าน
      if (foundUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      // สร้างข้อมูลผู้ใช้สำหรับเก็บใน state และ localStorage
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      // อัปเดต state ของผู้ใช้
      setUser(userData);
      // บันทึกข้อมูลผู้ใช้ลง localStorage เพื่อให้คงอยู่หลังรีเฟรชหน้า
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } finally {
      // ปิดสถานะ loading ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด
      setAuthLoading(false);
    }
  };

  /**
   * ฟังก์ชัน signup
   * ใช้สำหรับสมัครสมาชิกใหม่
   * @param {string} email - อีเมลของผู้ใช้ใหม่
   * @param {string} password - รหัสผ่านของผู้ใช้ใหม่
   * @returns {Object} ข้อมูลผู้ใช้ที่สร้างใหม่
   * @throws {Error} เมื่อ email ซ้ำหรือไม่สามารถเชื่อมต่อ API ได้
   */
  const signup = async (email, password) => {
    // เปิดสถานะ loading สำหรับ authentication
    setAuthLoading(true);
    try {
      // จำลองการทำงานแบบ asynchronous (delay 500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      // ทำความสะอาด email: ลบช่องว่างและแปลงเป็นตัวพิมพ์เล็ก
      const cleanEmail = String(email || '').trim().toLowerCase();

      // ดึง URL base ของ API จาก environment variable หรือใช้ default
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

      try {
        // ดึงรายการผู้ใช้ปัจจุบันเพื่อตรวจสอบ email ซ้ำ
        const listRes = await fetch(base + '/api/users');
        if (!listRes.ok) {
          throw new Error('Failed to fetch users from API');
        }
        // แปลง response เป็น JSON
        const listData = await listRes.json();
        // ตรวจสอบและแปลงข้อมูลให้เป็น Array
        const serverUsers = Array.isArray(listData.users) ? listData.users : (Array.isArray(listData) ? listData : []);
        // ตรวจสอบว่ามี email นี้ในระบบแล้วหรือไม่
        if (serverUsers.find(u => String(u.email || '').trim().toLowerCase() === cleanEmail)) {
          throw new Error('User already exists with this email');
        }

        // สร้างผู้ใช้ใหม่
        // เตรียม payload สำหรับส่งไปยัง API
        const payload = { email: cleanEmail, password, status: 'active' };
        // เรียก API เพื่อสร้างผู้ใช้ใหม่ (POST request)
        const res = await fetch(base + '/api/users', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
        });
        
        // ตรวจสอบว่าการสร้างผู้ใช้สำเร็จหรือไม่
        if (!res.ok) {
          throw new Error('Failed to create user');
        }
        
        // แปลง response เป็น JSON และคืนค่าข้อมูลผู้ใช้ที่สร้างใหม่
        const created = await res.json();
        // ไม่ทำการเข้าสู่ระบบอัตโนมัติหลังสมัครสมาชิก แค่คืนค่าข้อมูลผู้ใช้
        return created;
      } catch (e) {
        // โยน error พร้อม message ที่เหมาะสม
        throw new Error(e.message || 'Unable to connect to server. Please try again later.');
      }
    } finally {
      // ปิดสถานะ loading ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด
      setAuthLoading(false);
    }
  };

  /**
   * ฟังก์ชัน logout
   * ใช้สำหรับออกจากระบบ
   * ลบข้อมูลผู้ใช้จาก state และ localStorage
   */
  const logout = async () => {
    // เปิดสถานะ loading
    setAuthLoading(true);
    // จำลอง delay เล็กน้อย (200ms)
    await new Promise(resolve => setTimeout(resolve, 200));
    // ล้างข้อมูลผู้ใช้จาก state
    setUser(null);
    // ลบข้อมูลผู้ใช้จาก localStorage
    localStorage.removeItem('currentUser');
    // ปิดสถานะ loading
    setAuthLoading(false);
  };

  /**
   * ฟังก์ชัน clearAuthUser
   * ใช้สำหรับล้างข้อมูลผู้ใช้แบบทันที (ไม่มี loading state)
   * มักใช้เมื่อต้องการบังคับให้ผู้ใช้ออกจากระบบ
   */
  const clearAuthUser = () => {
    // ล้างข้อมูลผู้ใช้จาก state
    setUser(null);
    // ลบข้อมูลผู้ใช้จาก localStorage
    localStorage.removeItem('currentUser');
  };

  // ส่งค่า context ไปยัง component ลูกทั้งหมด
  return (
    <AuthContext.Provider value={{ user, loading, authLoading, login, signup, logout, clearAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom Hook สำหรับเข้าถึง Auth Context
 * ใช้ในการดึงข้อมูล user, loading states และฟังก์ชัน authentication
 * @returns {Object} context object ที่มี user, loading, authLoading, login, signup, logout, clearAuthUser
 */
export const useAuth = () => useContext(AuthContext);
