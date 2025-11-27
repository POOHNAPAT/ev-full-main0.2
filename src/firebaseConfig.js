/**
 * Firebase Configuration
 * ไฟล์ตั้งค่าสำหรับเชื่อมต่อ Firebase services
 * หมายเหตุ: ไฟล์นี้เป็นตัวอย่างเท่านั้น (ยังไม่ได้ใช้งาน Firebase จริงในระบบ)
 */

// นำเข้า Firebase initialization functions
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Firebase configuration object
 * เก็บ API keys และ project identifiers สำหรับเชื่อมต่อ Firebase
 * หมายเหตุ: ค่าเหล่านี้เป็น placeholder ต้องแทนที่ด้วยค่าจริงจาก Firebase Console
 */
const firebaseConfig = {
  apiKey: "AIzaSyD_your_actual_api_key_here", // API Key จาก Firebase project
  authDomain: "your-project.firebaseapp.com", // Authentication domain
  projectId: "your-project-id", // Project ID
  storageBucket: "your-project.appspot.com", // Storage bucket URL
  messagingSenderId: "123456789012", // Messaging sender ID
  appId: "1:123456789012:web:abcdef123456" // App ID
};

// Export configuration เพื่อใช้งานในส่วนอื่นของแอปพลิเคชัน
export { firebaseConfig };
