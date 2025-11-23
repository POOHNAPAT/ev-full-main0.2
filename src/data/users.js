import data from './users.json';

// Initialize an in-memory copy of users so runtime code can mutate it if needed
let users = Array.isArray(data.users) ? data.users.map(u => ({ ...u })) : [];

const Admins = Array.isArray(data.Admins) ? data.Admins : [];

export function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

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
