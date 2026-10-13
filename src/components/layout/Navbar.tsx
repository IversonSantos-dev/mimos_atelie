import React from 'react';
import { ShieldCheck, MessageCircle, Lock } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';
import { sanitizePhoneNumber } from '../../utils/whatsapp';

interface NavbarProps {
  currentView: 'public' | 'admin';
  onNavigate: (view: 'public' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { settings, publicProducts } = useCatalog();
  const { isAuthenticated } = useAuth();

  const directWhatsAppHref = `https://wa.me/${sanitizePhoneNumber(
    settings.whatsappNumber
  )}?text=${encodeURIComponent(
    `Oi! Vim pelo portfólio digital do ${settings.brandName} e gostaria de atendimento exclusivo.`
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-atelie-rose-300/60 bg-[#FAF7F2]/95 backdrop-blur-xl shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Identidade da Marca com a Logo Oficial */}
        <button
          type="button"
          onClick={() => onNavigate('public')}
          className="group flex items-center gap-3.5 text-left focus:outline-none"
        >
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-atelie-rose-300/80 bg-white p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img
              src="/images/logo.jpg"
              alt={settings.brandName}
              className="h-full w-full rounded-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-atelie-rose-500 shadow-xs" />
          </div>
          <div>
            <span className="block font-display text-lg font-bold tracking-[0.16em] text-atelie-brown-800 uppercase group-hover:text-atelie-rose-600 transition-colors">
              {settings.brandName}
            </span>
            <span className="block font-mono text-[10px] tracking-[0.2em] text-atelie-brown-600 uppercase">
              {settings.brandTagline}
            </span>
          </div>
        </button>

        {/* Links Centrais de Navegação (Apenas na Vitrine Pública) */}
        {currentView === 'public' && (
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-atelie-brown-700">
            <a
              href="#acervo"
              className="transition-colors hover:text-atelie-rose-600 flex items-center gap-2"
            >
              <span>Acervo Artesanal</span>
              <span className="rounded-full border border-atelie-rose-300 bg-atelie-rose-100 px-2 py-0.5 font-mono text-[10px] font-bold text-atelie-rose-800">
                {publicProducts.length}
              </span>
            </a>
            <a href="#engenharia-sacra" className="transition-colors hover:text-atelie-rose-600">
              Detalhes & Arte
            </a>
            <a href="#atelier-bespoke" className="transition-colors hover:text-atelie-rose-600">
              Sob Medida
            </a>
          </nav>
        )}

        {/* Ações à Direita */}
        <div className="flex items-center gap-3">
          {currentView === 'public' ? (
            <>
              <MagneticButton
                href={directWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="gold"
                className="!px-4 !py-2.5 text-xs !shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Falar no WhatsApp</span>
              </MagneticButton>

              <button
                type="button"
                onClick={() => onNavigate('admin')}
                title="Acessar Painel Administrativo"
                className="inline-flex items-center gap-2 rounded-xl border border-atelie-rose-200 bg-white/90 px-3.5 py-2.5 text-xs font-medium text-atelie-brown-700 shadow-xs transition-all hover:border-atelie-rose-400 hover:text-atelie-brown-900"
              >
                {isAuthenticated ? (
                  <>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="hidden sm:inline font-semibold">Painel</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 text-atelie-rose-600" />
                    <span className="hidden sm:inline">Admin</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <MagneticButton
              onClick={() => onNavigate('public')}
              variant="glass"
              className="!px-4 !py-2 text-xs"
            >
              <span>← Voltar ao Catálogo</span>
            </MagneticButton>
          )}
        </div>
      </div>
    </header>
  );
};

