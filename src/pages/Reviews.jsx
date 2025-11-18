import React, { useState } from 'react';
import '../styles/Reviews.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([
    { id: 1, user: 'ผู้ชายใส่เสื้อสีฟ้า', rating: 1, comment: 'สถานี EV charger ให้บริการดีมากครับ สถานที่สะอาด มีกาแฟบริการสำหรับรอชาร์จ มีจุดนั่งรอที่สะดวกสบาย และยังมีระบบจองล่วงหน้า ช่วยให้มั่นใจได้ว่าจะไม่เสียเวลามาแล้วไม่มีที่ชาร์จ ทำให้การชาร์จรถไฟฟ้าเป็นเรื่องง่ายและไม่น่าเบื่ออีกต่อไปเลยครับ' },
    { id: 2, user: 'ผู้ชายใส่เสื้อสีฟ้า', rating: 5, comment: 'ระบบ EV charger ใช้งานง่ายมาก เข้าใจได้ไม่ยากเลยครับ ตั้งแต่การค้นหาสถานีไปจนถึงการจ่ายเงิน มีขั้นตอนที่ชัดเจนและรวดเร็ว ไม่ต้องเสียเวลามานั่งงมกับขั้นตอนที่ยุ่งยากเหมือนบางที่ แถมยังมีตัวเลือกปลั๊กชาร์จหลายแบบรองรับรถทุกรุ่นด้วย' },
    { id: 3, user: 'ผู้หญิงใส่เสื้อสีชมพู', rating: 5, comment: 'สถานีชาร์จมีความปลอดภัยดีค่ะ มีไฟส่องสว่างตอนกลางคืน ทำให้ผู้หญิงอย่างเราอุ่นใจในการชาร์จตอนดึกๆ แถมพนักงานยังดูแลและให้คำแนะนำอย่างดีเมื่อเกิดปัญหาเล็กน้อย บริการดีเยี่ยมและน่าเชื่อถือมากค่ะ' },
    { id: 4, user: 'ผู้ชายใส่เสื้อสีเทา', rating: 5, comment: 'แอพพลิเคชั่นใช้งานง่ายมาก ไม่เคยเจอปัญหาในการเชื่อมต่อหรือการเริ่ม/หยุดชาร์จเลย แถมยังสามารถดูสถานะการชาร์จและค่าใช้จ่ายได้แบบเรียลไทม์ ทำให้ควบคุมค่าใช้จ่ายได้ง่ายขึ้น' },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([...reviews, { id: reviews.length + 1, user: 'You', ...newReview }]);
    setNewReview({ rating: 5, comment: '' });
  };

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;
  const satisfaction = '86%';

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: ((reviews.filter(r => r.rating === star).length / totalReviews) * 100).toFixed(0)
  }));

  return (
    <div className="reviews-container">
      <div className="reviews-section">
        <h1 className="reviews-title">รีวิวจากผู้ใช้งาน</h1>

        <div className="stats-section">
          <h2 className="stats-title">สรุปคะแนนและรีวิว</h2>
          <div className="stats-grid">
            <div className="stat-card blue">
              <p className="stat-value blue">{averageRating}</p>
              <p className="stat-label">คะแนนเฉลี่ย</p>
              <div className="stat-stars">
                {'⭐'.repeat(Math.round(averageRating))}
              </div>
            </div>
            <div className="stat-card green">
              <p className="stat-value green">{totalReviews}</p>
              <p className="stat-label">รีวิวทั้งหมด</p>
              <div className="stat-emoji">📝</div>
            </div>
            <div className="stat-card purple">
              <p className="stat-value purple">{satisfaction}</p>
              <p className="stat-label">ความพึงพอใจ</p>
              <div className="stat-emoji">😊</div>
            </div>
          </div>

          <div className="rating-breakdown">
            <h3 className="rating-title">การให้คะแนน</h3>
            {ratingCounts.map(({ star, count, percentage }) => (
              <div key={star} className="rating-item">
                <span className="rating-label">{star} ดาว</span>
                <div className="rating-bar-container">
                  <div
                    className="rating-bar"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="rating-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="write-review-section">
          <h2 className="write-review-title">เขียนรีวิวของคุณ</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label className="form-label">คะแนน (1-5 ดาว)</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="form-select"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} ดาว {'⭐'.repeat(num)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">ความคิดเห็น</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="form-textarea"
                rows="5"
                placeholder="แบ่งปันประสบการณ์ของคุณ..."
                required
              />
            </div>
            <button
              type="submit"
              className="submit-button"
            >
              ส่งรีวิว
            </button>
          </form>
        </div>

        <div className="reviews-list-section">
          <h2 className="reviews-list-title">รีวิวล่าสุด</h2>
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <p className="review-user">{review.user}</p>
                  <div className="review-stars">
                    {'⭐'.repeat(review.rating)}
                  </div>
                </div>
                <p className="review-content">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
