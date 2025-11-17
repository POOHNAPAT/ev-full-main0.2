import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';

export default function Home(){
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 p-12 rounded-2xl mb-12 text-center text-white shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 opacity-90">{t.bookEV}</h2>
        <h1 className="text-5xl font-bold mb-4">{t.evCharger}</h1>
        <p className="mb-8 text-lg opacity-90">ค้นหาสถานีชาร์จใกล้คุณและจองได้อย่างง่ายดาย</p>

        <div id="search-all" className="max-w-3xl mx-auto flex items-center gap-4 bg-white p-4 rounded-full shadow-lg">
          <input
            aria-label="ค้นหาสถานีชาร์จ"
            placeholder={t.searchPlaceholder}
            className="flex-1 px-6 py-3 rounded-full border-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link to="/map" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition duration-300 shadow-md">{t.bookButton}</Link>
        </div>
      </section>

      {/* Main Heading */}
      <section className="mb-12 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">{t.whyBook}</h3>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 bg-white border rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⏰</span>
          </div>
          <h4 className="text-xl font-bold mb-3 text-gray-800">{t.advanceBooking}</h4>
          <p className="text-gray-600 leading-relaxed">{t.advanceDesc}</p>
        </div>

        <div className="p-8 bg-white border rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h4 className="text-xl font-bold mb-3 text-gray-800">{t.usageReport}</h4>
          <p className="text-gray-600 leading-relaxed">{t.usageDesc}</p>
        </div>

        <div className="p-8 bg-white border rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚗</span>
          </div>
          <h4 className="text-xl font-bold mb-3 text-gray-800">{t.allVehicles}</h4>
          <p className="text-gray-600 leading-relaxed mb-3">{t.allVehiclesDesc}</p>
          <ul className="text-gray-600 list-disc list-inside space-y-1">
            <li>CCS2</li>
            <li>CHAdeMO</li>
            <li>Type 2</li>
            <li>Tesla</li>
          </ul>
        </div>
      </section>



      <section id="contact" className="mb-16 bg-gray-50 p-8 rounded-xl">
        <h4 className="text-2xl font-bold mb-4 text-center">{t.contact}</h4>
        <p className="text-gray-600 text-center">{t.contactEmail}</p>
      </section>
    </div>
  )
}
