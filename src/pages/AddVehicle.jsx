import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaPlus, FaCheck, FaArrowLeft, FaBatteryHalf, FaChargingStation } from 'react-icons/fa';
import '../styles/AddVehicle.css';

export default function AddVehicle() {
  const [vehicleType, setVehicleType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [chargingType, setChargingType] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const vehicleTypes = [
    { id: 'ev', name: 'รถยนต์ไฟฟ้า (EV)', icon: <FaChargingStation className="text-green-600" /> }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit logic here
      const vehicleData = {
        id: Date.now(), // Simple unique ID
        type: vehicleType,
        brand,
        model,
        year,
        licensePlate,
        batteryCapacity: vehicleType === 'ev' ? batteryCapacity : null,
        chargingType: vehicleType === 'ev' ? chargingType : null
      };

      // Save to localStorage
      const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
      existingVehicles.push(vehicleData);
      localStorage.setItem('vehicles', JSON.stringify(existingVehicles));

      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-content">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h1 className="success-title">เพิ่มพาหนะสำเร็จ!</h1>
            <p className="success-message">พาหนะของคุณได้ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว</p>
            <div className="success-details">
              <h3 className="success-details-title">รายละเอียดพาหนะ</h3>
              <p className="success-details-item">ประเภท: {vehicleTypes.find(v => v.id === vehicleType)?.name}</p>
              <p className="success-details-item">รุ่น: {brand} {model} ({year})</p>
              <p className="success-details-item">ทะเบียน: {licensePlate}</p>
            </div>
            <div className="success-actions">
              <Link to="/profile" className="btn btn-profile">
                <FaArrowLeft />
                กลับไปโปรไฟล์
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCar className="text-2xl mr-3" />
                <h1 className="text-2xl font-bold">เพิ่มพาหนะ</h1>
              </div>
              <Link to="/profile" className="text-blue-200 hover:text-white transition duration-300">
                <FaArrowLeft className="text-xl" />
              </Link>
            </div>
            <div className="mt-6">
              <div className="relative">
                {/* Background connector line spanning all steps */}
                <div className="absolute top-6 left-6 right-6 h-0.5 bg-blue-300"></div>

                {/* Active/completed connector overlay */}
                <div
                  className="absolute top-6 left-6 h-0.5 bg-green-400 transition-all duration-500"
                  style={{ width: step > 1 ? `${(step - 1) * 50}%` : '0%' }}
                ></div>

                <div className="flex items-center justify-between relative z-10">
                  {[1, 2, 3].map((num) => {
                    const stepIcons = {
                      1: <FaCar className="text-xs" />,
                      2: <FaBatteryHalf className="text-xs" />,
                      3: <FaCheck className="text-xs" />
                    };
                    const stepLabels = {
                      1: 'เลือกประเภท',
                      2: 'ข้อมูลพาหนะ',
                      3: 'ยืนยัน'
                    };
                    const isCompleted = num < step;
                    const isActive = num === step;
                    const isUpcoming = num > step;

                    return (
                      <div key={num} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full border-3 flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                          isCompleted ? 'bg-green-500 text-white border-green-500 animate-pulse' :
                          isActive ? 'bg-white text-blue-600 border-white shadow-xl scale-110' :
                          'bg-blue-400 text-white border-blue-400'
                        }`}>
                          {isCompleted ? <FaCheck className="text-xs" /> : stepIcons[num]}
                        </div>
                        <div className={`mt-2 text-xs font-medium transition-colors duration-300 text-center ${
                          isActive ? 'text-white' : isCompleted ? 'text-green-200' : 'text-blue-200'
                        }`}>
                          {stepLabels[num]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">เลือกประเภทพาหนะ</h2>
                  <div className="space-y-4">
                    {vehicleTypes.map((type) => (
                      <label key={type.id} className="block">
                        <input
                          type="radio"
                          name="vehicleType"
                          value={type.id}
                          checked={vehicleType === type.id}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 ${vehicleType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{type.icon}</div>
                            <span className="text-lg font-medium text-gray-800">{type.name}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">ข้อมูลพาหนะ</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">ยี่ห้อ *</label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="เช่น Toyota, Tesla"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">รุ่น *</label>
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="เช่น Camry, Model 3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">ปี *</label>
                      <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">ทะเบียนรถ *</label>
                      <input
                        type="text"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="กข 1234"
                        required
                      />
                    </div>
                  </div>

                  {vehicleType === 'ev' && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ความจุแบตเตอรี่ (kWh)</label>
                        <input
                          type="number"
                          value={batteryCapacity}
                          onChange={(e) => setBatteryCapacity(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                          placeholder="75"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ประเภทการชาร์จ</label>
                        <select
                          value={chargingType}
                          onChange={(e) => setChargingType(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        >
                          <option value="">เลือกประเภท</option>
                          <option value="type1">Type 1 (J1772)</option>
                          <option value="type2">Type 2 (Mennekes)</option>
                          <option value="ccs">CCS</option>
                          <option value="chademo">CHAdeMO</option>
                          <option value="tesla">Tesla Supercharger</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">ยืนยันข้อมูลพาหนะ</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">ประเภทพาหนะ:</p>
                        <p className="text-lg text-gray-800">{vehicleTypes.find(v => v.id === vehicleType)?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">ยี่ห้อและรุ่น:</p>
                        <p className="text-lg text-gray-800">{brand} {model}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">ปี:</p>
                        <p className="text-lg text-gray-800">{year}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">ทะเบียนรถ:</p>
                        <p className="text-lg text-gray-800">{licensePlate}</p>
                      </div>
                      {vehicleType === 'ev' && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-600">ความจุแบตเตอรี่:</p>
                            <p className="text-lg text-gray-800">{batteryCapacity} kWh</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">ประเภทการชาร์จ:</p>
                            <p className="text-lg text-gray-800">{chargingType}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center"
                  >
                    <FaArrowLeft className="mr-2" />
                    ย้อนกลับ
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center ml-auto"
                  disabled={step === 1 && !vehicleType}
                >
                  {step === 3 ? (
                    <>
                      <FaCheck className="mr-2" />
                      เพิ่มพาหนะ
                    </>
                  ) : (
                    <>
                      ถัดไป
                      <FaPlus className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
