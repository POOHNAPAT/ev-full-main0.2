import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useLanguage } from '../components/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-blue-600 text-xl" />,
      title: 'โทรศัพท์',
      details: ['+66 2 123 4567', '+66 81 234 5678'],
      description: 'จันทร์ - ศุกร์ 9:00 - 18:00 น.'
    },
    {
      icon: <FaEnvelope className="text-blue-600 text-xl" />,
      title: 'อีเมล',
      details: ['support@evcharger.co.th', 'info@evcharger.co.th'],
      description: 'เราจะตอบกลับภายใน 24 ชั่วโมง'
    },
    {
      icon: <FaMapMarkerAlt className="text-blue-600 text-xl" />,
      title: 'ที่อยู่',
      details: ['123 ถนนสีลม', 'แขวงสีลม เขตบางรัก', 'กรุงเทพฯ 10500'],
      description: 'สำนักงานใหญ่'
    },
    {
      icon: <FaClock className="text-blue-600 text-xl" />,
      title: 'เวลาทำการ',
      details: ['จันทร์ - ศุกร์: 9:00 - 18:00', 'เสาร์: 9:00 - 15:00', 'อาทิตย์: ปิดทำการ'],
      description: 'นอกเวลาทำการ โปรดใช้แบบฟอร์มติดต่อ'
    }
  ];

  const faqs = [
    {
      question: 'ฉันสามารถจองจุดชาร์จล่วงหน้าได้กี่วัน?',
      answer: 'คุณสามารถจองจุดชาร์จล่วงหน้าได้สูงสุด 30 วัน และสามารถยกเลิกหรือเปลี่ยนแปลงการจองได้ฟรีจนถึง 2 ชั่วโมงก่อนเวลาเริ่มใช้งาน'
    },
    {
      question: 'ระบบรองรับรถยนต์ไฟฟ้าทุกรุ่นหรือไม่?',
      answer: 'ใช่ ระบบของเรารองรับมาตรฐานการชาร์จทั้งหมด รวมถึง Type 1, Type 2, CCS, CHAdeMO และ Tesla Supercharger'
    },
    {
      question: 'ฉันจะชำระเงินอย่างไร?',
      answer: 'คุณสามารถชำระเงินได้หลายวิธี รวมถึงบัตรเครดิต บัตรเดบิต โอนเงินผ่านธนาคาร และกระเป๋าเงินอิเล็กทรอนิกส์'
    },
    {
      question: 'เกิดอะไรขึ้นถ้าฉันมาถึงสถานีชาร์จสายไป?',
      answer: 'หากคุณมาถึงสถานีชาร์จสายไปเกิน 15 นาที การจองจะถูกยกเลิกโดยอัตโนมัติ และจะไม่มีการคืนเงิน'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">ติดต่อเรา</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            มีคำถามหรือต้องการความช่วยเหลือ? ทีมงานของเราพร้อมให้บริการคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">ข้อมูลติดต่อ</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                      <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-4">ติดตามเรา</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-300">
                    <FaFacebook className="text-2xl" />
                  </a>
                  <a href="#" className="text-blue-400 hover:text-blue-600 transition duration-300">
                    <FaTwitter className="text-2xl" />
                  </a>
                  <a href="#" className="text-pink-600 hover:text-pink-800 transition duration-300">
                    <FaInstagram className="text-2xl" />
                  </a>
                  <a href="#" className="text-blue-700 hover:text-blue-900 transition duration-300">
                    <FaLinkedin className="text-2xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">ส่งข้อความถึงเรา</h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-green-600 text-3xl" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">ส่งข้อความสำเร็จ!</h3>
                  <p className="text-gray-600">ขอบคุณสำหรับการติดต่อเรา เราจะตอบกลับภายใน 24 ชั่วโมง</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="ชื่อของคุณ"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="อีเมลของคุณ"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อ *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="หัวข้อที่ต้องการติดต่อ"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                      placeholder="รายละเอียดที่ต้องการติดต่อ"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 flex items-center justify-center"
                  >
                    <FaPaperPlane className="mr-2" />
                    ส่งข้อความ
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">คำถามที่พบบ่อย</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
