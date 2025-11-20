import React, { useState, useEffect } from 'react';
import '../styles/Reviews.css';
import { loadReviews, addReview } from '../data/reviews';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const added = addReview({ user: 'You', ...newReview });
    setReviews(prev => [...prev, added]);
    setNewReview({ rating: 5, comment: '' });
  };

  useEffect(() => {
    const loaded = loadReviews();
    setReviews(loaded);
  }, []);

  const totalReviews = reviews.length;
  const averageRating = totalReviews ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) : 0;
  const satisfaction = '86%';

  const ratingCounts = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = totalReviews ? ((count / totalReviews) * 100).toFixed(0) : '0';
    return { star, count, percentage };
  });

  return (
    <div className="page-background">
      <div className="reviews-container">
      <div className="reviews-section">
        <h1 className="reviews-title">รีวิวจากผู้ใช้งาน</h1>

        <div className="stats-section">
          <h2 className="stats-title">สรุปคะแนนและรีวิว</h2>
          <div className="stats-grid">
            <div className="stat-card blue">
              <p className="stat-value blue">{averageRating.toFixed(1)}</p>
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
    </div>
  );
}
