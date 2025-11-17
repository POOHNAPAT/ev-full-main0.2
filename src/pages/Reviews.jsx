import React, { useState } from 'react';

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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">รีวิวจากผู้ใช้งาน</h1>

        {/* Summary Stats */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">สรุปคะแนนและรีวิว</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl text-center shadow-md">
              <p className="text-4xl font-bold text-blue-600 mb-2">{averageRating}</p>
              <p className="text-sm text-gray-600">คะแนนเฉลี่ย</p>
              <div className="flex justify-center mt-2">
                {'⭐'.repeat(Math.round(averageRating))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl text-center shadow-md">
              <p className="text-4xl font-bold text-green-600 mb-2">{totalReviews}</p>
              <p className="text-sm text-gray-600">รีวิวทั้งหมด</p>
              <div className="text-2xl mt-2">📝</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl text-center shadow-md">
              <p className="text-4xl font-bold text-purple-600 mb-2">{satisfaction}</p>
              <p className="text-sm text-gray-600">ความพึงพอใจ</p>
              <div className="text-2xl mt-2">😊</div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">การให้คะแนน</h3>
            {ratingCounts.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center mb-3">
                <span className="w-12 text-sm font-medium">{star} ดาว</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Form */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">เขียนรีวิวของคุณ</h2>
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">คะแนน (1-5 ดาว)</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} ดาว {'⭐'.repeat(num)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">ความคิดเห็น</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="5"
                placeholder="แบ่งปันประสบการณ์ของคุณ..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-md"
            >
              ส่งรีวิว
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">รีวิวล่าสุด</h2>
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-800">{review.user}</p>
                  <div className="flex text-yellow-400">
                    {'⭐'.repeat(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
