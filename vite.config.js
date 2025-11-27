/**
 * Vite Configuration File
 * ไฟล์ตั้งค่าสำหรับ Vite build tool
 */

// นำเข้า defineConfig helper function จาก Vite
import { defineConfig } from 'vite'
// นำเข้า React plugin สำหรับ support React features
import react from '@vitejs/plugin-react'

// Export configuration object
export default defineConfig({
  // เปิดใช้งาน React plugin เพื่อ support JSX, Fast Refresh, และ React features อื่นๆ
  plugins: [react()],
})
