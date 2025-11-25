const STORAGE_KEY = 'app_reviews_v1';

import initialReviews from './reviews.json';

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