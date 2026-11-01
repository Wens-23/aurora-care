'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/* ---------------- Toast context ---------------- */
const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-[2000] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            'min-w-[240px] rounded-[10px] px-[18px] py-[13px] text-[13.5px] font-semibold text-white shadow-lg2 ' +
            (t.kind === 'ok' ? 'bg-teal-dark' : t.kind === 'bad' ? 'bg-[#d5473f]' : 'bg-navy')
          }
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, kind) => {
    const id = Date.now() + Math.random();
    setToasts((cur) => [...cur, { id, msg, kind }]);
    setTimeout(() => {
      setToasts((cur) => cur.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastStack toasts={toasts} />
    </ToastContext.Provider>
  );
}

/* ---------------- Auth context ---------------- */
const AuthContext = createContext({ user: null, loading: true, refresh: async () => {}, logout: async () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
