import { createContext, useContext, useState } from 'react';

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

  function logout() {
    localStorage.removeItem('demoUser');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
