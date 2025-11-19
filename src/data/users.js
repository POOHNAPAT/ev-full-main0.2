// Mock user data for demo authentication
let users = [
  {
    id: 1,
    email: 'user1@example.com',
    password: '1111',
    name: 'User One'
  },
  {
    id: 2,
    email: 'user2@example.com',
    password: 'password123',
    name: 'User Two'
  },
  {
    id: 3,
    email: 'demo@evcharger.com',
    password: 'demo123',
    name: 'Demo User'
  }
];

let nextId = 4;

// Find user by email
export function findUserByEmail(email) {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Add new user
export function addUser(email, password) {
  const newUser = {
    id: nextId++,
    email: email.toLowerCase(),
    password,
    name: email.split('@')[0] // Use part before @ as name
  };
  users.push(newUser);
  return newUser;
}

// Get all users (for debugging)
export function getAllUsers() {
  return users;
}
