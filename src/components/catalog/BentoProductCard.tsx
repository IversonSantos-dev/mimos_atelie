import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, Sparkles, Scale, Ruler, Shield } from 'lucide-react';
import { Product } from '../../types';
import { buildProductWhatsAppUrl, formatCurrencyBRL } from '../../utils/whatsapp';
import { MagneticButton } from '../ui/MagneticButton';

interface BentoProductCardProps {
  product: Product;
  globalWhatsapp: string;
  onInspect: (product: Product) => void;
  index: number;
}

export const BentoProductCard: React.FC<BentoProductCardProps> = ({
  product,
  globalWhatsapp,
  onInspect,
  index,
}) => {
  const whatsappUrl = buildProductWhatsAppUrl(product, globalWhatsapp);

  // Classes de assimetria do Bento Grid (em telas grandes lg:grid-cols-12)
  const bentoSpanClass = {
    featured: 'lg:col-span-7 lg:row-span-2',
    wide: 'lg:col-span-7',
    tall: 'lg:col-span-5 lg:row-span-2',
    standard: 'lg:col-span-5',
  }[product.bentoSize || 'standard'];

  const isFeatured = product.bentoSize === 'featured';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white/95 border border-atelie-rose-300/70 shadow-atelie-soft transition-all duration-500 hover:border-atelie-rose-500 hover:shadow-lg ${bentoSpanClass}`}
    >
      {/* Brilho Superior no Hover */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-3/4 rounded-full bg-atelie-rose-300/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Área da Fotografia com Clique para Inspeção */}
      <div
        onClick={() => onInspect(product)}
        className={`relative w-full cursor-pointer overflow-hidden bg-atelie-cream-200 ${
          isFeatured ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[16/10]'
        }`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradiente Inferior para Leitura */}
        <div className="absolute inset-0 bg-gradient-to-t from-atelie-brown-950/60 via-transparent to-transparent opacity-70" />

        {/* Badges Superiores */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-atelie-rose-300 bg-white/95 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-atelie-rose-800 shadow-2xs backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-atelie-rose-600" />
            {product.badge || product.category}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(product);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 py-1 font-mono text-[11px] font-semibold text-atelie-brown-800 backdrop-blur-md shadow-2xs transition hover:border-atelie-rose-400 hover:text-atelie-rose-600"
          >
            <Eye className="h-3.5 w-3.5 text-atelie-rose-600" />
            <span>Detalhes</span>
          </button>
        </div>

        {/* Barra de Telemetria / Especificações Sobreposta na Base da Foto */}
        <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {product.specs.beadSizeMm && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-white/40 bg-white/90 px-2.5 py-1 font-mono text-[11px] font-semibold text-atelie-brown-800 backdrop-blur-md shadow-2xs">
                <Ruler className="h-3 w-3 text-atelie-rose-600" />
                {product.specs.beadSizeMm}
              </span>
            )}
            {product.specs.weightGrams && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-white/40 bg-white/90 px-2.5 py-1 font-mono text-[11px] font-semibold text-atelie-brown-800 backdrop-blur-md shadow-2xs">
                <Scale className="h-3 w-3 text-atelie-rose-600" />
                {product.specs.weightGrams}
              </span>
            )}
            {product.specs.patronSaint && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-atelie-rose-300/80 bg-white/90 px-2.5 py-1 font-mono text-[11px] font-semibold text-atelie-rose-800 backdrop-blur-md shadow-2xs">
                <Shield className="h-3 w-3 text-atelie-rose-600" />
                {product.specs.patronSaint}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-atelie-rose-700">
              {product.subtitle || product.category}
            </span>
          </div>

          <h3
            onClick={() => onInspect(product)}
            className={`mt-1.5 cursor-pointer font-display font-bold text-atelie-brown-900 transition-colors group-hover:text-atelie-rose-700 ${
              isFeatured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            }`}
          >
            {product.name}
          </h3>

          <p className="mt-2.5 line-clamp-3 text-xs sm:text-sm leading-relaxed text-atelie-brown-600">
            {product.description}
          </p>

          {/* Resumo Técnico de Materiais */}
          <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl border border-atelie-rose-200/80 bg-atelie-cream-200/80 p-3 sm:grid-cols-2">
            <div>
              <span className="block font-mono text-[10px] uppercase font-semibold tracking-wider text-atelie-brown-500">
                Matéria-Prima
              </span>
              <span className="mt-0.5 block truncate font-mono text-xs font-semibold text-atelie-brown-800">
                {product.specs.beadMaterial || 'Pedras Naturais Selecionadas'}
              </span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase font-semibold tracking-wider text-atelie-brown-500">
                Acabamento
              </span>
              <span className="mt-0.5 block truncate font-mono text-xs font-semibold text-atelie-rose-700">
                {product.specs.metalFinish || 'Banho de Ouro 18k'}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé do Card: Preço + CTA WhatsApp Dinâmico */}
        <div className="mt-5 flex flex-col gap-3 border-t border-atelie-rose-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block font-mono text-[10px] uppercase font-medium tracking-widest text-atelie-brown-500">
              Valor da Peça
            </span>
            <span className="font-mono text-2xl font-bold text-atelie-brown-900">
              {formatCurrencyBRL(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onInspect(product)}
              className="rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-3 text-xs font-semibold text-atelie-brown-800 transition hover:border-atelie-rose-500 hover:text-atelie-rose-700 shadow-2xs"
            >
              Detalhes
            </button>

            <MagneticButton
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="gold"
              className="!px-4 !py-3 text-xs font-bold uppercase tracking-wider !shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Pedir no WhatsApp</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
