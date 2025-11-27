# EV Charging Station Management System

ระบบจัดการสถานีชาร์จรถยนต์ไฟฟ้า พร้อมระบบจองและแผนที่

## 🚀 วิธีการรัน

### 1. ติดตั้ง Dependencies
```cmd
npm install
```

### 2. เริ่มต้นระบบ (เปิด 2 terminals)

**Terminal 1: Backend API**
```cmd
npm run start:api
```

**Terminal 2: Frontend**
```cmd
npm run dev
```

### 3. เปิดเบราว์เซอร์
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`

## 🔑 การเข้าสู่ระบบ

**Admin:**
- URL: `/admin`
- Username: `admin`
- Password: `password`

**User:**
- สมัครสมาชิกใหม่หรือ Login ที่หน้า `/login`

## 📦 เทคโนโลยีที่ใช้
- React + Vite
- Express API (Backend)
- Leaflet Maps
- Firebase Authentication
- Tailwind CSS
