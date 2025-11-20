// Mock user data for demo authentication
let users = [
  {
    id: 1,
    email: "user1@example.com",
    password: "1111",
    name: "User One",
    modelcar: "Tesla Model 3",
    status: "active",
    historyCookies: 1,
  },
];

let Admins = [
  { id: 1, 
    username: "admin", 
    name: "Super Admin", 
    role: "super_admin" 
  },
];
// Find a user by email
export function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

// Add a new user and return it
export function addUser(email, password) {
  const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const nameFromEmail = email.split('@')[0];
  const newUser = {
    id: nextId,
    email,
    password,
    name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
    modelcar: '',
    status: 'active',
    historyCookies: 0,
  };
  users.push(newUser);
  return newUser;
}

export { Admins };

export default users;
