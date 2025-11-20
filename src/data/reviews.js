const STORAGE_KEY = 'app_reviews_v1';

const initialReviews = [
  { id: 1, user: 'ผู้ชายใส่เสื้อสีฟ้า', rating: 1, comment: 'สถานี EV charger ให้บริการดีมากครับ สถานที่สะอาด มีกาแฟบริการสำหรับรอชาร์จ มีจุดนั่งรอที่สะดวกสบาย และยังมีระบบจองล่วงหน้า ช่วยให้มั่นใจได้ว่าจะไม่เสียเวลามาแล้วไม่มีที่ชาร์จ ทำให้การชาร์จรถไฟฟ้าเป็นเรื่องง่ายและไม่น่าเบื่ออีกต่อไปเลยครับ' },
  { id: 2, user: 'ผู้ชายใส่เสื้อสีฟ้า', rating: 5, comment: 'ระบบ EV charger ใช้งานง่ายมาก เข้าใจได้ไม่ยากเลยครับ ตั้งแต่การค้นหาสถานีไปจนถึงการจ่ายเงิน มีขั้นตอนที่ชัดเจนและรวดเร็ว ไม่ต้องเสียเวลามานั่งงมกับขั้นตอนที่ยุ่งยากเหมือนบางที่ แถมยังมีตัวเลือกปลั๊กชาร์จหลายแบบรองรับรถทุกรุ่นด้วย' },
  { id: 3, user: 'ผู้หญิงใส่เสื้อสีชมพู', rating: 5, comment: 'สถานีชาร์จมีความปลอดภัยดีค่ะ มีไฟส่องสว่างตอนกลางคืน ทำให้ผู้หญิงอย่างเราอุ่นใจในการชาร์จตอนดึกๆ แถมพนักงานยังดูแลและให้คำแนะนำอย่างดีเมื่อเกิดปัญหาเล็กน้อย บริการดีเยี่ยมและน่าเชื่อถือมากค่ะ' },
  { id: 4, user: 'ผู้ชายใส่เสื้อสีเทา', rating: 5, comment: 'แอพพลิเคชั่นใช้งานง่ายมาก ไม่เคยเจอปัญหาในการเชื่อมต่อหรือการเริ่ม/หยุดชาร์จเลย แถมยังสามารถดูสถานะการชาร์จและค่าใช้จ่ายได้แบบเรียลไทม์ ทำให้ควบคุมค่าใช้จ่ายได้ง่ายขึ้น' },
];

function _readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function _writeStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore storage errors in dev/mock
  }
}

export function loadReviews() {
  const stored = _readStorage();
  return Array.isArray(stored) && stored.length ? stored : initialReviews.slice();
}

export function addReview(review) {
  const list = loadReviews();
  const nextId = list.length ? Math.max(...list.map(r => r.id)) + 1 : 1;
  const item = { id: nextId, ...review };
  list.push(item);
  _writeStorage(list);
  return item;
}

export { initialReviews };
export default { loadReviews, addReview, initialReviews };