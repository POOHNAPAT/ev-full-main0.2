import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useLanguage } from '../components/LanguageContext';
import '../styles/Contact.css';

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
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-header">
          <h1 className="contact-header-title">ติดต่อเรา</h1>
          <p className="contact-header-subtitle">
            มีคำถามหรือต้องการความช่วยเหลือ? ทีมงานของเราพร้อมให้บริการคุณ
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-section">
            <h2 className="contact-info-title">ข้อมูลติดต่อ</h2>
            <div className="contact-info-list">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-item">
                  <div className="contact-info-icon">
                    {info.icon}
                  </div>
                  <div className="contact-info-details">
                    <h3>{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx}>{detail}</p>
                    ))}
                    <p className="contact-info-description">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="social-media">
              <h3 className="social-media-title">ติดตามเรา</h3>
              <div className="social-links">
                <a href="#" className="social-link facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="social-link twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-link linkedin">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2 className="contact-form-title">ส่งข้อความถึงเรา</h2>

            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">
                  <FaCheckCircle />
                </div>
                <h3 className="success-title">ส่งข้อความสำเร็จ!</h3>
                <p className="success-text">ขอบคุณสำหรับการติดต่อเรา เราจะตอบกลับภายใน 24 ชั่วโมง</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ชื่อ *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="ชื่อของคุณ"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">อีเมล *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="อีเมลของคุณ"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">หัวข้อ *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="หัวข้อที่ต้องการติดต่อ"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ข้อความ *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="form-textarea"
                    placeholder="รายละเอียดที่ต้องการติดต่อ"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                >
                  <FaPaperPlane />
                  ส่งข้อความ
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="faq-section">
          <h2 className="faq-title">คำถามที่พบบ่อย</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
