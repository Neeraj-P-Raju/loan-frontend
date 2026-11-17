import { createContext, useContext, useState } from 'react';
import { authLogin, authRegister, clearToken } from '../services/realApi.js';

// Demo authentication: no password is checked anywhere.
// The chosen role is stored in localStorage so a refresh keeps the session.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('demoUser'));
    } catch {
      return null;
    }
  });

  function login(email, role, name) {
    const u = { email, role, name: name || email.split('@')[0] };
    localStorage.setItem('demoUser', JSON.stringify(u));
    setUser(u);
  }

  // Real accounts (backend): the server checks the password and decides the role.
  async function signIn(email, password) {
    const u = await authLogin(email, password);
    localStorage.setItem('demoUser', JSON.stringify(u));
    setUser(u);
    return u;
  }

  async function signUp(name, email, password) {
    const u = await authRegister(name, email, password);
    localStorage.setItem('demoUser', JSON.stringify(u));
    setUser(u);
    return u;
  }

  function logout() {
    clearToken();
    localStorage.removeItem('demoUser');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout, signIn, signUp }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
