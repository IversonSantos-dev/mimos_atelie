import React, { createContext, useContext, useState } from 'react';
import { getSupabaseClient } from '../services/supabaseService';

interface AdminCredentials {
  email: string;
  passwordHash: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  adminEmail: string;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateAdminCredentials: (email: string, newPassword: string) => void;
}

const AUTH_SESSION_KEY = 'mimos_atelie_admin_session_v1';
const ADMIN_CREDS_KEY = 'mimos_atelie_admin_creds_v1';

const DEFAULT_CREDS: AdminCredentials = {
  email: 'eversonpaiva87@gmail.com',
  passwordHash: 'Mimosatelie@2026',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredCreds(): AdminCredentials {
  try {
    const raw = localStorage.getItem(ADMIN_CREDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminCredentials;
      if (parsed.email && parsed.passwordHash) {
        // Se ainda for a conta antiga de teste, migra automaticamente para o novo admin padrão
        if (parsed.email.toLowerCase() === 'admin@mimosatelie.com') {
          localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(DEFAULT_CREDS));
          return DEFAULT_CREDS;
        }
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_CREDS;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionEmail, setSessionEmail] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
    } catch {
      return null;
    }
  });

  const login = async (
    email: string,
    password: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Verifica credencial administrativa local configurada
    const stored = getStoredCreds();
    if (cleanEmail === stored.email.toLowerCase() && cleanPass === stored.passwordHash) {
      sessionStorage.setItem(AUTH_SESSION_KEY, stored.email);
      localStorage.setItem(AUTH_SESSION_KEY, stored.email);
      setSessionEmail(stored.email);
      return { ok: true };
    }

    // 2. Se o Supabase estiver ativo, tenta autenticar via Supabase Auth
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });
        if (!error && data.user?.email) {
          sessionStorage.setItem(AUTH_SESSION_KEY, data.user.email);
          localStorage.setItem(AUTH_SESSION_KEY, data.user.email);
          setSessionEmail(data.user.email);
          return { ok: true };
        }
      } catch {
        // Fallback para erro padrão
      }
    }

    return {
      ok: false,
      error: 'Credenciais inválidas. Verifique seu e-mail e senha de administrador.',
    };
  };

  const logout = async () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    setSessionEmail(null);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
  };

  const updateAdminCredentials = (email: string, newPassword: string) => {
    const updated: AdminCredentials = {
      email: email.trim(),
      passwordHash: newPassword.trim(),
    };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updated));
    sessionStorage.setItem(AUTH_SESSION_KEY, updated.email);
    localStorage.setItem(AUTH_SESSION_KEY, updated.email);
    setSessionEmail(updated.email);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(sessionEmail),
        adminEmail: sessionEmail || getStoredCreds().email,
        login,
        logout,
        updateAdminCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
}
