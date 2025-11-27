// นำเข้า React และ hooks สำหรับจัดการ context
import React, { createContext, useContext, useState } from 'react';

// สร้าง Context สำหรับการจัดการภาษาทั่วทั้งแอปพลิเคชัน
const LanguageContext = createContext();

/**
 * Custom Hook สำหรับเข้าถึง Language Context
 * @returns {Object} context object ที่มี language, toggleLanguage, และ translations
 */
export const useLanguage = () => useContext(LanguageContext);

/**
 * LanguageProvider Component
 * จัดการการเปลี่ยนภาษาและข้อความแปลทั่วทั้งแอปพลิเคชัน
 * @param {Object} children - Component ลูกที่จะได้รับ context
 */
export const LanguageProvider = ({ children }) => {
  // State สำหรับเก็บภาษาปัจจุบัน ('th' สำหรับภาษาไทย, 'en' สำหรับภาษาอังกฤษ)
  const [language, setLanguage] = useState('th');

  /**
   * ฟังก์ชันสลับภาษาระหว่างไทยและอังกฤษ
   */
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  /**
   * Object เก็บข้อความแปลทั้งหมดของทั้งสองภาษา
   * แต่ละภาษาจะมี key-value pairs ของข้อความแปล
   */
  const translations = {
    // ข้อความภาษาไทย
    th: {
      home: 'หน้าแรก',
      map: 'แผนที่สถานีชาร์จ',
      reviews: 'รีวิว',
      searchAll: 'ค้นหาสถานีชาร์จทั้งหมดในปัจจุบัน',
      contact: 'ติดต่อเรา',
      bookEV: 'จองจุดชาร์จรถไฟฟ้า',
      evCharger: 'EV Charger',
      searchPlaceholder: 'ค้นหาสถานีชาร์จทั้งหมดในปัจจุบัน',
      bookButton: 'จองจุดชาร์จ',
      whyBook: 'ทำไมต้องจองกับเรา',
      advanceBooking: 'จองล่วงหน้า',
      advanceDesc: '  จองได้ 24 ชั่วโมง ไม่ต้องกังวลเรื่องที่ว่าง',
      usageReport: 'รายงานการใช้งาน',
      usageDesc: 'ดูสถิติการชาร์จ ค่าใช้จ่าย และข้อมูลสถานีชาร์จได้',
      allVehicles: 'รองรับทุกรุ่นรถ',
      allVehiclesDesc: 'รองรับปลั๊กชาร์จทุกมาตรฐาน',
      contactEmail: 'Email: support@evcharger.example (ตัวอย่าง)',
      acCharger: 'AC Charger',
      dcCharger: 'DC Fast Charger',
      clickMarkerNote: 'คลิกที่หมุดเพื่อจองสถานีชาร์จ',
      stationDetails: 'รายละเอียดสถานี',
      typeLabel: 'ประเภท',
      availableLabel: 'จุดว่าง',
      powerLabel: 'กำลังไฟ',
      amenitiesLabel: 'สิ่งอำนวยความสะดวก',
      bookThisStation: 'จองสถานีนี้',
      acLegend: 'AC Charger (ชาร์จปกติ)',
      dcLegend: 'DC Fast Charger (ชาร์จเร็ว)'
    },
    en: {
      home: 'Home',
      map: 'Charging Stations Map',
      reviews: 'Reviews',
      searchAll: 'Search all current charging stations',
      contact: 'Contact Us',
      bookEV: 'Book EV Charging Station',
      evCharger: 'EV Charger',
      searchPlaceholder: 'Search all current charging stations',
      bookButton: 'Book Charging Station',
      whyBook: 'Why Book With Us',
      advanceBooking: 'Advance Booking',
      advanceDesc: 'Book 24 hours in advance, no worries about availability',
      usageReport: 'Usage Report',
      usageDesc: 'View charging statistics, costs, and station information',
      allVehicles: 'Supports All Vehicle Types',
      allVehiclesDesc: 'Supports all charging plug standards',
      contactEmail: 'Email: support@evcharger.example (example)',
      acCharger: 'AC Charger',
      dcCharger: 'DC Fast Charger',
      clickMarkerNote: 'Click a marker to book a station',
      stationDetails: 'Station Details',
      typeLabel: 'Type',
      availableLabel: 'Available Slots',
      powerLabel: 'Power',
      amenitiesLabel: 'Amenities',
      bookThisStation: 'Book this station',
      acLegend: 'AC Charger (normal charging)',
      dcLegend: 'DC Fast Charger (fast charging)'
    },
  };

  // ส่งค่า context ไปยัง component ลูกทั้งหมด
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};
