import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const USERS_KEY = 'bookworm-users';
const SESSION_KEY = 'bookworm-session';

const defaultAdmin = {
  id: 'u-admin',
  name: 'Admin',
  email: 'admin@bookworm.app',
  password: 'Admin@1234',
  role: 'admin',
  photo: '',
};

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = read(USERS_KEY, null);
    if (saved) return saved;
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]));
    return [defaultAdmin];
  });
  const [session, setSession] = useState(() => read(SESSION_KEY, null));

  const persistUsers = (next) => {
    setUsers(next);
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
  };

  const register = (payload) => {
    const { name, email, password, photo } = payload;
    if (!name || !email || !password) throw new Error('All required fields must be filled.');
    if (password.length < 8) throw new Error('Weak password. Minimum 8 characters required.');
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Duplicate email found.');
    const newUser = { id: crypto.randomUUID(), name, email, password, photo: photo || '', role: 'user' };
    const next = [...users, newUser];
    persistUsers(next);
    return true;
  };

  const login = ({ email, password }) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw new Error('Invalid credentials');
    const fakeJwt = btoa(`${found.email}.${Date.now()}`);
    const nextSession = { token: fakeJwt, user: { ...found, password: undefined } };
    setSession(nextSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateRole = (userId, role) => {
    const next = users.map((u) => (u.id === userId ? { ...u, role } : u));
    persistUsers(next);
  };

  const value = useMemo(() => ({ users, session, register, login, logout, updateRole }), [users, session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
