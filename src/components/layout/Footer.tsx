import React from 'react';
import { MessageCircle, Shield, Award, Gem, Lock } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { formatPhoneDisplay, sanitizePhoneNumber } from '../../utils/whatsapp';

interface FooterProps {
  onNavigateAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin }) => {
  const { settings } = useCatalog();

  const whatsappHref = `https://wa.me/${sanitizePhoneNumber(
    settings.whatsappNumber
  )}?text=${encodeURIComponent(
    `Oi! Gostaria de falar com o ${settings.brandName} sobre os terços e artigos artesanais.`
  )}`;

  return (
    <footer className="relative z-10 mt-28 border-t border-atelie-rose-300/40 bg-[#2A160C] text-[#FAF7F2] backdrop-blur-xl">
      {/* Faixa de Garantias Artesanais */}
      <div className="mx-auto max-w-7xl border-b border-atelie-brown-700/60 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-4 rounded-2xl border border-atelie-rose-400/20 bg-[#382013]/60 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-atelie-rose-300/40 bg-atelie-rose-400/15 text-atelie-rose-300">
              <Gem className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold tracking-wider text-atelie-cream-100 uppercase">
                Gemas & Pedras Naturais
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#D3B7A5]">
                Pedras naturais selecionadas uma a uma, madeiras nobres e acabamento requintado com durabilidade incomparável.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-atelie-rose-400/20 bg-[#382013]/60 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-atelie-rose-300/40 bg-atelie-rose-400/15 text-atelie-rose-300">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold tracking-wider text-atelie-cream-100 uppercase">
                Manufatura Artesanal
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#D3B7A5]">
                Elos reforçados manualmente e carinho em cada detalhe, peças feitas para momentos de oração e herança familiar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-atelie-rose-400/20 bg-[#382013]/60 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-atelie-rose-300/40 bg-atelie-rose-400/15 text-atelie-rose-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold tracking-wider text-atelie-cream-100 uppercase">
                Atendimento WhatsApp
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#D3B7A5]">
                Encomendas personalizadas e modelos a pronta-entrega direto com o {settings.brandName}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal do Rodapé */}
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-atelie-rose-300 bg-white p-0.5 shadow-md">
              <img
                src="/images/logo.jpg"
                alt={settings.brandName}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-[0.16em] text-[#FAF7F2] uppercase">
                {settings.brandName}
              </span>
              <span className="block font-mono text-[11px] tracking-wider text-atelie-rose-300">
                {settings.instagramHandle || '@mimosateliebq'}
              </span>
            </div>
          </div>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-[#D3B7A5]">
            {settings.brandTagline}. Cada peça une fé, devoção sincera e a beleza do artesanato brasileiro.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl border border-atelie-rose-300/50 bg-atelie-rose-400/20 px-4 py-2.5 font-mono text-xs text-[#F5E0D7] transition hover:border-atelie-rose-300 hover:bg-atelie-rose-400/30"
          >
            <MessageCircle className="h-4 w-4 text-atelie-rose-300" />
            <span>WhatsApp Oficial: {formatPhoneDisplay(settings.whatsappNumber)}</span>
          </a>

          <button
            type="button"
            onClick={onNavigateAdmin}
            className="inline-flex items-center gap-2 rounded-xl border border-atelie-brown-700 bg-atelie-brown-800/80 px-4 py-2.5 text-xs text-[#D3B7A5] transition hover:border-atelie-rose-400 hover:text-atelie-rose-200"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Área Restrita (Admin)</span>
          </button>
        </div>
      </div>

      <div className="border-t border-atelie-brown-800 bg-[#1C0D07] py-5 text-center font-mono text-[11px] text-[#A7816A]">
        © {new Date().getFullYear()} {settings.brandName} • {settings.instagramHandle || '@mimosateliebq'} • Todos os direitos reservados.
      </div>
    </footer>
  );
};

