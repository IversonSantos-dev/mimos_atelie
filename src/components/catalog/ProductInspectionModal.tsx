import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  MessageCircle,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Shield,
  Gem,
  Ruler,
  Scale,
  Cross,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../../types';
import {
  buildProductWhatsAppMessage,
  buildProductWhatsAppUrl,
  formatCurrencyBRL,
} from '../../utils/whatsapp';

interface ProductInspectionModalProps {
  product: Product | null;
  globalWhatsapp: string;
  onClose: () => void;
}

export const ProductInspectionModal: React.FC<ProductInspectionModalProps> = ({
  product,
  globalWhatsapp,
  onClose,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!product) return null;

  const whatsappUrl = buildProductWhatsAppUrl(product, globalWhatsapp);
  const whatsappMessagePreview = buildProductWhatsAppMessage(product.name);

  return (
    <AnimatePresence>
      <motion.div
        key="inspection-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-atelie-brown-950/70 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          key="inspection-dialog"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white border-2 border-atelie-rose-300 shadow-2xl"
        >
          {/* Botão Fechar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-atelie-rose-300 bg-white/90 text-atelie-brown-800 transition hover:bg-atelie-rose-100 hover:text-atelie-rose-700 shadow-xs"
            aria-label="Fechar inspeção"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
            {/* Coluna Esquerda: Visualizador Macro com Zoom */}
            <div className="relative flex flex-col justify-between bg-atelie-cream-200 lg:col-span-6 border-b lg:border-b-0 lg:border-r border-atelie-rose-200">
              <div
                onClick={() => setIsZoomed(!isZoomed)}
                className="relative flex-1 min-h-[320px] sm:min-h-[440px] cursor-zoom-in overflow-hidden flex items-center justify-center"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={`h-full w-full object-cover transition-transform duration-500 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-atelie-brown-950/40 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-atelie-rose-300 bg-white/95 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-atelie-rose-800 shadow-2xs">
                  <Sparkles className="h-3 w-3 text-atelie-rose-600" />
                  {product.badge || product.category}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                  }}
                  className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/90 px-3 py-1.5 font-mono text-xs font-semibold text-atelie-brown-800 backdrop-blur-md shadow-2xs transition hover:border-atelie-rose-400"
                >
                  {isZoomed ? (
                    <>
                      <ZoomOut className="h-3.5 w-3.5 text-atelie-rose-600" />
                      <span>Reduzir Zoom</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="h-3.5 w-3.5 text-atelie-rose-600" />
                      <span>Lente Macro (Zoom)</span>
                    </>
                  )}
                </button>
              </div>

              {/* História e Simbolismo Devocional */}
              {product.devotionHistory && (
                <div className="border-t border-atelie-rose-200 bg-white/80 p-5">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-atelie-rose-800">
                    Significado & Tradição
                  </span>
                  <p className="mt-1.5 font-serif text-base italic leading-relaxed text-atelie-brown-800">
                    “{product.devotionHistory}”
                  </p>
                </div>
              )}
            </div>

            {/* Coluna Direita: Especificações & Encomenda */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6 space-y-6 bg-white">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-atelie-rose-700">
                  {product.category} • {product.subtitle}
                </span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-atelie-brown-900 leading-tight">
                  {product.name}
                </h2>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-bold text-atelie-brown-900">
                    {formatCurrencyBRL(product.price)}
                  </span>
                  <span className="font-mono text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Disponível para encomenda
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-atelie-brown-600">
                  {product.description}
                </p>

                {/* Grade de Ficha Técnica Completa */}
                <div className="mt-6">
                  <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-atelie-brown-500 mb-3">
                    Especificações da Peça
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-atelie-rose-200 bg-atelie-cream-200/80 p-3">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold text-atelie-brown-500">
                        <Gem className="h-3.5 w-3.5 text-atelie-rose-600" />
                        <span>Contas / Pedras</span>
                      </div>
                      <p className="mt-1 font-mono text-xs font-bold text-atelie-brown-900">
                        {product.specs.beadMaterial || 'Pedras Naturais'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-atelie-rose-200 bg-atelie-cream-200/80 p-3">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold text-atelie-brown-500">
                        <Award className="h-3.5 w-3.5 text-atelie-rose-600" />
                        <span>Acabamento</span>
                      </div>
                      <p className="mt-1 font-mono text-xs font-bold text-atelie-rose-800">
                        {product.specs.metalFinish || 'Banho Ouro 18k'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-atelie-rose-200 bg-atelie-cream-200/80 p-3">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold text-atelie-brown-500">
                        <Ruler className="h-3.5 w-3.5 text-atelie-rose-600" />
                        <span>Tamanho & Comprimento</span>
                      </div>
                      <p className="mt-1 font-mono text-xs font-bold text-atelie-brown-900">
                        Contas {product.specs.beadSizeMm || '10mm'} • Total{' '}
                        {product.specs.lengthCm || '52cm'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-atelie-rose-200 bg-atelie-cream-200/80 p-3">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold text-atelie-brown-500">
                        <Scale className="h-3.5 w-3.5 text-atelie-rose-600" />
                        <span>Peso & Padroeiro</span>
                      </div>
                      <p className="mt-1 font-mono text-xs font-bold text-atelie-brown-900">
                        {product.specs.weightGrams || '70g'} • {product.specs.patronSaint || 'Devocional'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-atelie-rose-200 bg-atelie-cream-200/80 p-3 sm:col-span-2">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold text-atelie-brown-500">
                        <Cross className="h-3.5 w-3.5 text-atelie-rose-600" />
                        <span>Entremeio & Crucifixo</span>
                      </div>
                      <p className="mt-1 font-mono text-xs font-bold text-atelie-brown-900">
                        {product.specs.centerpiece || 'Entremeio Sacro'} +{' '}
                        {product.specs.crucifix || 'Crucifixo Forjado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview da Mensagem Automática + Botão de Encomenda */}
              <div className="space-y-3 border-t border-atelie-rose-200 pt-5">
                <div className="rounded-xl border border-atelie-rose-300 bg-atelie-rose-50 p-3">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-rose-800">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Mensagem de Encomenda no WhatsApp:</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-atelie-brown-700 italic">
                    “{whatsappMessagePreview}”
                  </p>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow transition hover:brightness-105"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Pedir Esta Peça pelo WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
