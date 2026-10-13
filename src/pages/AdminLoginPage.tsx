import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, KeyRound, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { settings } = useCatalog();

  const [email, setEmail] = useState('admin@mimosatelie.com');
  const [password, setPassword] = useState('mimos2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.ok) {
      onSuccess();
    } else {
      setError(res.error || 'Falha na autenticação.');
    }
  };

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-3xl bg-white border border-atelie-rose-300/80 p-7 sm:p-9 shadow-atelie-soft"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-atelie-rose-300 bg-white p-1 shadow-md mb-2">
            <img
              src="/images/logo.jpg"
              alt={settings.brandName}
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-atelie-rose-800">
            <Sparkles className="h-3 w-3 text-atelie-rose-600" />
            ACESSO RESTRITO • GESTÃO
          </span>

          <h1 className="mt-1 font-display text-2xl font-bold text-atelie-brown-900">
            Painel {settings.brandName}
          </h1>
          <p className="mt-1 text-xs text-atelie-brown-600">
            Gerenciamento de terços, catálogo, preços em tempo real e WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-atelie-brown-700">
              E-mail do Administrador
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-atelie-brown-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-atelie-rose-300 bg-atelie-cream-200/80 pl-10 pr-4 py-2.5 text-sm text-atelie-brown-900 placeholder-atelie-brown-400 focus:border-atelie-rose-500 focus:outline-none"
                placeholder="admin@mimosatelie.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-atelie-brown-700">
              Chave de Segurança / Senha
            </label>
            <div className="relative mt-1.5">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-atelie-brown-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-atelie-rose-300 bg-atelie-cream-200/80 pl-10 pr-4 py-2.5 font-mono text-sm text-atelie-brown-900 placeholder-atelie-brown-400 focus:border-atelie-rose-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow transition hover:brightness-105"
          >
            <span>{loading ? 'Autenticando...' : 'Entrar no Dashboard'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Credenciais Iniciais pré-preenchidas para conveniência */}
        <div className="mt-6 rounded-2xl border border-atelie-rose-300 bg-atelie-rose-50 p-3.5 font-mono text-[11px] text-atelie-brown-700">
          <div className="flex items-center gap-1.5 text-atelie-rose-800 font-bold">
            <ShieldCheck className="h-4 w-4 text-atelie-rose-600" />
            <span>Credenciais de Acesso:</span>
          </div>
          <p className="mt-1">
            E-mail: <span className="font-bold text-atelie-brown-900">admin@mimosatelie.com</span>
          </p>
          <p>
            Senha: <span className="font-bold text-atelie-brown-900">mimos2026</span> (alterável dentro do painel)
          </p>
        </div>
      </motion.div>
    </div>
  );
};
