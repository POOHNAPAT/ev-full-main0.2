// นำเข้า React และ ReactDOM สำหรับการ render แอปพลิเคชัน
import React from 'react'
import ReactDOM from 'react-dom/client'
// นำเข้า BrowserRouter สำหรับจัดการ routing ในแอปพลิเคชัน
import { BrowserRouter } from 'react-router-dom'
// นำเข้า App component หลักของแอปพลิเคชัน
import App from './App'
// นำเข้า global CSS styles
import './styles/global.css'

/**
 * Entry point ของแอปพลิเคชัน
 * สร้าง React root และ render แอปพลิเคชันเข้าไปใน DOM
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode ช่วยตรวจหา potential problems ในแอปพลิเคชัน
  <React.StrictMode>
    {/* BrowserRouter ให้ความสามารถในการ navigate ระหว่างหน้าต่างๆ */}
    <BrowserRouter
      future={{
        // เปิดใช้งาน future flags สำหรับ React Router v7
        v7_startTransition: true, // ใช้ startTransition API สำหรับ state updates
        v7_relativeSplatPath: true // ใช้ relative path resolution สำหรับ splat routes
      }}
    >
      {/* App component หลักของแอปพลิเคชัน */}
      <App/>
    </BrowserRouter>
  </React.StrictMode>
)
