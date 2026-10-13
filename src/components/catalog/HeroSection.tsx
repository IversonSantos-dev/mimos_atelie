import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDownRight, Eye, MessageCircle, Compass, ShieldCheck, Layers } from 'lucide-react';
import { Product } from '../../types';
import { useCatalog } from '../../context/CatalogContext';
import { MagneticButton } from '../ui/MagneticButton';
import { buildProductWhatsAppUrl, formatCurrencyBRL } from '../../utils/whatsapp';

interface HeroSectionProps {
  featuredProduct?: Product;
  onInspectProduct: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProduct,
  onInspectProduct,
}) => {
  const { settings } = useCatalog();

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8 lg:pt-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Coluna Esquerda: Manifesto Artesanal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-7"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-atelie-rose-300 bg-white/90 px-3.5 py-1.5 shadow-xs backdrop-blur-md">
            <div className="h-5 w-5 rounded-full overflow-hidden border border-atelie-rose-300 shrink-0">
              <img src="/images/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-mono text-[11px] font-bold tracking-[0.22em] text-atelie-rose-800 uppercase">
              {settings.heroBadge}
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.14] tracking-tight text-atelie-brown-900 sm:text-5xl lg:text-6xl">
            Onde a{' '}
            <span className="text-gold-shimmer font-bold">Tradição Artesanal</span>{' '}
            Encontra a Fé & o Amor.
          </h1>

          <p className="max-w-2xl font-serif text-xl sm:text-2xl italic text-atelie-brown-700 leading-relaxed">
            “Peças artesanais e terços exclusivos esculpidos em pedras naturais, madeiras nobres e detalhes únicos — feitos no {settings.brandName} para atravessar gerações.”
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-atelie-brown-600">
            Cada terço e artesanato é confeccionado individualmente com atenção minuciosa ao peso, acabamento e harmonia. Conheça nosso catálogo completo ou encomende uma peça personalizada direto pelo WhatsApp.
          </p>

          {/* CTAs Magnéticos */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton href="#acervo" variant="gold" className="!px-7 !py-3.5 text-sm">
              <span>Explorar Catálogo de Terços</span>
              <ArrowDownRight className="h-4 w-4" />
            </MagneticButton>

            <MagneticButton
              href="#atelier-bespoke"
              variant="neon-outline"
              className="!px-6 !py-3.5 text-sm"
            >
              <Compass className="h-4 w-4 text-atelie-rose-600" />
              <span>Configurar Peça Sob Medida</span>
            </MagneticButton>
          </div>

          {/* Métricas de Cuidado e Qualidade */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-atelie-rose-200/80 max-w-lg">
            <div>
              <span className="block font-mono text-xl font-bold text-atelie-rose-700">100%</span>
              <span className="text-[11px] uppercase tracking-wider text-atelie-brown-600 font-semibold">
                Feito à Mão
              </span>
            </div>
            <div>
              <span className="block font-mono text-xl font-bold text-atelie-brown-900">Pedras Naturais</span>
              <span className="text-[11px] uppercase tracking-wider text-atelie-brown-600 font-semibold">
                & Metais Nobres
              </span>
            </div>
            <div>
              <span className="block font-mono text-xl font-bold text-atelie-rose-700">Com Carinho</span>
              <span className="text-[11px] uppercase tracking-wider text-atelie-brown-600 font-semibold">
                Barbacena • MG
              </span>
            </div>
          </div>
        </motion.div>

        {/* Coluna Direita: Vitrine Flutuante da Peça Assinatura */}
        {featuredProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="group relative overflow-hidden rounded-3xl glass-panel gold-border-glow p-4 sm:p-5 shadow-lg">
              {/* Etiqueta Superior */}
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-atelie-rose-300 bg-white/95 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.18em] text-atelie-rose-800 uppercase shadow-2xs">
                  <Layers className="h-3 w-3 text-atelie-rose-600" />
                  {featuredProduct.badge || 'PEÇA DESTAQUE'}
                </span>
                <span className="font-mono text-xs font-medium text-atelie-brown-600">
                  {featuredProduct.specs.beadSizeMm} • {featuredProduct.specs.weightGrams}
                </span>
              </div>

              {/* Imagem com Zoom Suave */}
              <div
                onClick={() => onInspectProduct(featuredProduct)}
                className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border border-atelie-rose-200/80 bg-white shadow-inner"
              >
                <img
                  src={featuredProduct.imageUrl}
                  alt={featuredProduct.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-atelie-brown-950/70 via-transparent to-transparent opacity-60" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspectProduct(featuredProduct);
                  }}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-semibold text-atelie-brown-800 backdrop-blur-md shadow-xs transition hover:border-atelie-rose-400 hover:text-atelie-rose-600"
                >
                  <Eye className="h-3.5 w-3.5 text-atelie-rose-600" />
                  <span>Ver Detalhes</span>
                </button>
              </div>

              {/* Metadados da Peça */}
              <div className="mt-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-atelie-rose-700">
                      {featuredProduct.category}
                    </p>
                    <h2 className="mt-0.5 font-display text-lg font-bold text-atelie-brown-900 leading-snug">
                      {featuredProduct.name}
                    </h2>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block font-mono text-[10px] uppercase font-medium text-atelie-brown-600">
                      Investimento
                    </span>
                    <span className="font-mono text-lg font-bold text-atelie-brown-900">
                      {formatCurrencyBRL(featuredProduct.price)}
                    </span>
                  </div>
                </div>

                {/* Mini Especificações */}
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-atelie-rose-200/80 bg-atelie-cream-200/80 p-2.5 font-mono text-[11px] text-atelie-brown-700">
                  <div className="truncate">
                    <span className="text-atelie-brown-500 font-medium">Gema: </span>
                    {featuredProduct.specs.beadMaterial}
                  </div>
                  <div className="truncate">
                    <span className="text-atelie-brown-500 font-medium">Devoção: </span>
                    {featuredProduct.specs.patronSaint}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <a
                    href={buildProductWhatsAppUrl(featuredProduct, settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow transition hover:brightness-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Encomendar no WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onInspectProduct(featuredProduct)}
                    className="inline-flex items-center justify-center rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-3 text-xs font-medium text-atelie-brown-800 transition hover:border-atelie-rose-500 hover:text-atelie-rose-600 shadow-2xs"
                    title="Ver Ficha Técnica Completa"
                  >
                    <ShieldCheck className="h-4 w-4 text-atelie-rose-600" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
