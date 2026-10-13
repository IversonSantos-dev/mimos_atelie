import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, SlidersHorizontal, ShieldCheck, Cpu, Gem } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { useCatalog } from '../context/CatalogContext';
import { HeroSection } from '../components/catalog/HeroSection';
import { BentoProductCard } from '../components/catalog/BentoProductCard';
import { ProductInspectionModal } from '../components/catalog/ProductInspectionModal';
import { BespokeConfigurator } from '../components/catalog/BespokeConfigurator';

const COLLECTION_CATEGORIES: ProductCategory[] = [
  'Todos',
  'Edição Imperial',
  'Pedras Naturais',
  'Madeira Nobre',
  'Noivas & Relicários',
  'Artigos Sacros',
];

export const PublicPortfolioPage: React.FC = () => {
  const { publicProducts, settings } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);

  const featuredHeroProduct = useMemo(() => {
    return (
      publicProducts.find((p) => p.bentoSize === 'featured') || publicProducts[0]
    );
  }, [publicProducts]);

  const filteredProducts = useMemo(() => {
    return publicProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.specs.beadMaterial.toLowerCase().includes(q) ||
        product.specs.patronSaint.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [publicProducts, selectedCategory, searchQuery]);

  return (
    <main className="relative z-10">
      {/* 1. Hero Section Tech-Sacro */}
      <HeroSection
        featuredProduct={featuredHeroProduct}
        onInspectProduct={(product) => setInspectedProduct(product)}
      />

      {/* 2. Seção de Vitrine Principal em Bento Grid Assimétrico */}
      <section
        id="acervo"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Cabeçalho da Vitrine & Filtros */}
        <div className="flex flex-col justify-between gap-6 border-b border-atelie-rose-200/80 pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-atelie-rose-700 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>CATÁLOGO ARTESANAL • PEÇAS DE FÉ</span>
            </div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-atelie-brown-900">
              Acervo de Peças <span className="text-gold-shimmer">{settings.brandName}</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-atelie-brown-600">
              Clique em qualquer terço para abrir a Lente de Detalhes com especificações completas ou encomende diretamente pelo WhatsApp com mensagem personalizada.
            </p>
          </div>

          {/* Busca Instantânea */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-atelie-rose-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pedra, santo, modelo..."
              className="w-full rounded-2xl border border-atelie-rose-300 bg-white pl-10 pr-4 py-2.5 text-xs text-atelie-brown-800 placeholder-atelie-brown-400 shadow-2xs focus:border-atelie-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Barra de Filtro Rápido por Coleção */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
          <span className="inline-flex items-center gap-1.5 pr-2 font-mono text-[11px] uppercase tracking-wider text-atelie-brown-500 font-semibold">
            <SlidersHorizontal className="h-3.5 w-3.5 text-atelie-rose-600" />
            <span>Coleções:</span>
          </span>
          {COLLECTION_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 font-mono text-xs transition-all ${
                  active
                    ? 'bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 font-bold text-white shadow-gold-glow'
                    : 'border border-atelie-rose-200/90 bg-white text-atelie-brown-700 hover:border-atelie-rose-400 hover:text-atelie-rose-700 shadow-2xs'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Grade Assimétrica Bento Grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-white border border-atelie-rose-300/70 p-12 text-center shadow-atelie-soft">
            <p className="font-display text-lg text-atelie-brown-800">
              Nenhuma peça encontrada para o filtro selecionado.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-4 rounded-xl border border-atelie-rose-400 bg-atelie-rose-100 px-4 py-2 font-mono text-xs font-semibold text-atelie-rose-800 hover:bg-atelie-rose-200 shadow-2xs"
            >
              Limpar filtros e ver todo o acervo
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12"
          >
            {filteredProducts.map((product, index) => (
              <BentoProductCard
                key={product.id}
                product={product}
                globalWhatsapp={settings.whatsappNumber}
                onInspect={(p) => setInspectedProduct(p)}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* 3. Seção Engenharia Sacra & Cuidado Artesanal */}
      <section
        id="engenharia-sacra"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white border border-atelie-rose-300/70 p-7 shadow-atelie-soft"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-atelie-rose-300/80 bg-atelie-rose-100 text-atelie-rose-700">
              <Gem className="h-6 w-6" />
            </div>
            <span className="mt-4 block font-mono text-[10px] uppercase font-bold tracking-[0.22em] text-atelie-rose-700">
              01 • PEDRAS SELECIONADAS
            </span>
            <h3 className="mt-1 font-display text-xl font-bold text-atelie-brown-900">
              Gemas Autênticas de Alta Qualidade
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-atelie-brown-600">
              Trabalhamos exclusivamente com pedras de beleza única — Ônix, Lápis-Lazúli, Granada facetada e Madrepérola legítima — garantindo toque suave e sensação agradável durante os momentos de oração.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white border border-atelie-rose-300/70 p-7 shadow-atelie-soft"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-atelie-rose-300/80 bg-atelie-rose-100 text-atelie-rose-700">
              <Cpu className="h-6 w-6" />
            </div>
            <span className="mt-4 block font-mono text-[10px] uppercase font-bold tracking-[0.22em] text-atelie-rose-700">
              02 • MONTAGEM RESISTENTE
            </span>
            <h3 className="mt-1 font-display text-xl font-bold text-atelie-brown-900">
              Construção Firme & Duradoura
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-atelie-brown-600">
              Cada elo e conta é fixado manualmente com precisão artesanal ou trançado reforçado, garantindo que o terço permaneça intacto para ser rezado por muitos e muitos anos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-white border border-atelie-rose-300/70 p-7 shadow-atelie-soft"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-atelie-rose-300/80 bg-atelie-rose-100 text-atelie-rose-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="mt-4 block font-mono text-[10px] uppercase font-bold tracking-[0.22em] text-atelie-rose-700">
              03 • SIMBOLISMO SAGRADO
            </span>
            <h3 className="mt-1 font-display text-xl font-bold text-atelie-brown-900">
              Medalhas & Crucifixos Detalhados
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-atelie-brown-600">
              Entremeios e crucifixos selecionados com alto padrão de relevo e devoção — São Bento, Medalha Milagrosa, Sagrado Coração — unindo reverência religiosa e arte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. Configurador Interativo de Encomenda Personalizada */}
      <BespokeConfigurator />

      {/* Modal de Inspeção 360 / Ficha Técnica */}
      <ProductInspectionModal
        product={inspectedProduct}
        globalWhatsapp={settings.whatsappNumber}
        onClose={() => setInspectedProduct(null)}
      />
    </main>
  );
};
