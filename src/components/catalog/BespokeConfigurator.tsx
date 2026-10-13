import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Compass, Check, Gem, Shield, Cross } from 'lucide-react';
import { BespokeConfiguration, BespokeOptionItem } from '../../types';
import { useCatalog } from '../../context/CatalogContext';
import { DEFAULT_BESPOKE_SETTINGS } from '../../services/seedData';
import { buildBespokeWhatsAppUrl, formatCurrencyBRL } from '../../utils/whatsapp';

export const BespokeConfigurator: React.FC = () => {
  const { settings, bespokeSettings } = useCatalog();

  // Se o configurador foi desativado pelo administrador no painel, oculta a seção
  if (!bespokeSettings.enabled) {
    return null;
  }

  const stones: BespokeOptionItem[] =
    bespokeSettings.stones && bespokeSettings.stones.length > 0
      ? bespokeSettings.stones
      : DEFAULT_BESPOKE_SETTINGS.stones;

  const metals: BespokeOptionItem[] =
    bespokeSettings.metals && bespokeSettings.metals.length > 0
      ? bespokeSettings.metals
      : DEFAULT_BESPOKE_SETTINGS.metals;

  const beadSizes: BespokeOptionItem[] =
    bespokeSettings.beadSizes && bespokeSettings.beadSizes.length > 0
      ? bespokeSettings.beadSizes
      : DEFAULT_BESPOKE_SETTINGS.beadSizes;

  const medals: BespokeOptionItem[] =
    bespokeSettings.medals && bespokeSettings.medals.length > 0
      ? bespokeSettings.medals
      : DEFAULT_BESPOKE_SETTINGS.medals;

  const crucifixes: BespokeOptionItem[] =
    bespokeSettings.crucifixes && bespokeSettings.crucifixes.length > 0
      ? bespokeSettings.crucifixes
      : DEFAULT_BESPOKE_SETTINGS.crucifixes;

  // Estados de seleção por ID (com fallback seguro caso opções sejam editadas/removidas)
  const [selectedStoneId, setSelectedStoneId] = useState<string>(stones[0]?.id || '');
  const [selectedMetalId, setSelectedMetalId] = useState<string>(metals[0]?.id || '');
  const [selectedSizeId, setSelectedSizeId] = useState<string>(beadSizes[0]?.id || '');
  const [selectedMedalId, setSelectedMedalId] = useState<string>(medals[0]?.id || '');
  const [selectedCrucifixId, setSelectedCrucifixId] = useState<string>(crucifixes[0]?.id || '');
  const [customEngraving, setCustomEngraving] = useState<string>('');

  const currentStone = stones.find((s) => s.id === selectedStoneId) || stones[0];
  const currentMetal = metals.find((m) => m.id === selectedMetalId) || metals[0];
  const currentSize = beadSizes.find((b) => b.id === selectedSizeId) || beadSizes[0];
  const currentMedal = medals.find((m) => m.id === selectedMedalId) || medals[0];
  const currentCrucifix = crucifixes.find((c) => c.id === selectedCrucifixId) || crucifixes[0];

  const engravingPrice =
    bespokeSettings.engravingEnabled && customEngraving.trim().length > 0
      ? bespokeSettings.engravingPrice
      : 0;

  const estimatedTotal =
    (bespokeSettings.basePrice || 389) +
    (currentStone?.priceDelta || 0) +
    (currentMetal?.priceDelta || 0) +
    (currentSize?.priceDelta || 0) +
    (currentMedal?.priceDelta || 0) +
    (currentCrucifix?.priceDelta || 0) +
    engravingPrice;

  const currentConfig: BespokeConfiguration = {
    stone: currentStone,
    metal: currentMetal,
    beadSize: currentSize,
    devotionMedal: currentMedal,
    crucifixStyle: currentCrucifix,
    customEngraving,
  };

  const whatsappBespokeUrl = buildBespokeWhatsAppUrl(
    currentConfig,
    estimatedTotal,
    settings.whatsappNumber
  );

  const renderPriceBadge = (priceDelta: number) => {
    if (priceDelta > 0) {
      return (
        <span className="font-mono text-[10px] font-bold text-atelie-rose-700 bg-atelie-rose-100/90 rounded-md px-1.5 py-0.5 shrink-0">
          +{formatCurrencyBRL(priceDelta)}
        </span>
      );
    }
    if (priceDelta < 0) {
      return (
        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-md px-1.5 py-0.5 shrink-0">
          -{formatCurrencyBRL(Math.abs(priceDelta))}
        </span>
      );
    }
    return null;
  };

  return (
    <section
      id="atelier-bespoke"
      className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="rounded-3xl bg-white/95 border border-atelie-rose-300/80 shadow-atelie-soft p-6 sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-atelie-rose-300 bg-atelie-rose-100/80 px-3.5 py-1">
            <Compass className="h-3.5 w-3.5 text-atelie-rose-700" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-atelie-rose-800">
              {bespokeSettings.badge || 'ATELIÊ SOB MEDIDA • ENCOMENDA PERSONALIZADA'}
            </span>
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-atelie-brown-900">
            {bespokeSettings.title || 'Projete Seu Terço Exclusivo no'}{' '}
            <span className="text-gold-shimmer">{settings.brandName}</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-atelie-brown-600">
            {bespokeSettings.subtitle ||
              'Combine pedras naturais, tamanho das contas, entremeio de devoção e crucifixo. Ao finalizar, sua especificação completa é enviada automaticamente para o nosso WhatsApp.'}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Seletores Artesanais Dinâmicos */}
          <div className="space-y-8 lg:col-span-8">
            {/* 1. Escolha da Pedra / Matéria-Prima */}
            <div>
              <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-atelie-rose-800">
                <Gem className="h-4 w-4 text-atelie-rose-600" />
                <span>1. Selecione a Pedra ou Madeira das Contas</span>
              </label>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {stones.map((item) => {
                  const active = currentStone?.id === item.id || currentStone?.name === item.name;
                  return (
                    <button
                      key={item.id || item.name}
                      type="button"
                      onClick={() => setSelectedStoneId(item.id)}
                      className={`flex items-start justify-between rounded-2xl border p-3.5 text-left transition gap-2 ${
                        active
                          ? 'border-atelie-rose-500 bg-atelie-rose-100/90 shadow-xs'
                          : 'border-atelie-rose-200/90 bg-white hover:border-atelie-rose-400'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-xs sm:text-sm text-atelie-brown-900">
                            {item.name}
                          </p>
                          {renderPriceBadge(item.priceDelta)}
                        </div>
                        {item.detail && (
                          <p className="mt-0.5 text-[11px] text-atelie-brown-600">{item.detail}</p>
                        )}
                      </div>
                      {active && <Check className="h-4 w-4 text-atelie-rose-700 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Banho Metálico & Calibre */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-atelie-rose-800">
                  <Sparkles className="h-4 w-4 text-atelie-rose-600" />
                  <span>2. Acabamento dos Metais</span>
                </label>
                <div className="mt-3 space-y-2.5">
                  {metals.map((item) => {
                    const active = currentMetal?.id === item.id || currentMetal?.name === item.name;
                    return (
                      <button
                        key={item.id || item.name}
                        type="button"
                        onClick={() => setSelectedMetalId(item.id)}
                        className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition gap-2 ${
                          active
                            ? 'border-atelie-rose-500 bg-atelie-rose-100/90 shadow-xs'
                            : 'border-atelie-rose-200/90 bg-white hover:border-atelie-rose-400'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-atelie-brown-900">{item.name}</p>
                            {renderPriceBadge(item.priceDelta)}
                          </div>
                          {item.detail && (
                            <p className="text-[11px] text-atelie-brown-600">{item.detail}</p>
                          )}
                        </div>
                        {active && <Check className="h-4 w-4 text-atelie-rose-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-atelie-rose-800">
                  <Compass className="h-4 w-4 text-atelie-rose-600" />
                  <span>3. Tamanho das Contas</span>
                </label>
                <div className="mt-3 space-y-2.5">
                  {beadSizes.map((item) => {
                    const active = currentSize?.id === item.id || currentSize?.name === item.name;
                    return (
                      <button
                        key={item.id || item.name}
                        type="button"
                        onClick={() => setSelectedSizeId(item.id)}
                        className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition gap-2 ${
                          active
                            ? 'border-atelie-rose-500 bg-atelie-rose-100/90 shadow-xs'
                            : 'border-atelie-rose-200/90 bg-white hover:border-atelie-rose-400'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-mono text-xs font-bold text-atelie-rose-800">
                              {item.name}
                            </p>
                            {renderPriceBadge(item.priceDelta)}
                          </div>
                          {item.detail && (
                            <p className="text-[11px] text-atelie-brown-600">{item.detail}</p>
                          )}
                        </div>
                        {active && <Check className="h-4 w-4 text-atelie-rose-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Entremeio / Devoção & Crucifixo */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-atelie-rose-800">
                  <Shield className="h-4 w-4 text-atelie-rose-600" />
                  <span>4. Entremeio de Devoção</span>
                </label>
                <div className="mt-3 space-y-2">
                  {medals.map((item) => {
                    const active =
                      currentMedal?.id === item.id || currentMedal?.name === item.name;
                    return (
                      <button
                        key={item.id || item.name}
                        type="button"
                        onClick={() => setSelectedMedalId(item.id)}
                        className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition gap-2 ${
                          active
                            ? 'border-atelie-rose-500 bg-atelie-rose-100/90 shadow-xs'
                            : 'border-atelie-rose-200/90 bg-white hover:border-atelie-rose-400'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-atelie-brown-900">{item.name}</p>
                            {renderPriceBadge(item.priceDelta)}
                          </div>
                          {item.detail && (
                            <p className="text-[11px] text-atelie-brown-600">{item.detail}</p>
                          )}
                        </div>
                        {active && <Check className="h-4 w-4 text-atelie-rose-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-atelie-rose-800">
                    <Cross className="h-4 w-4 text-atelie-rose-600" />
                    <span>5. Estilo do Crucifixo</span>
                  </label>
                  <div className="mt-3 space-y-2">
                    {crucifixes.map((item) => {
                      const active =
                        currentCrucifix?.id === item.id || currentCrucifix?.name === item.name;
                      return (
                        <button
                          key={item.id || item.name}
                          type="button"
                          onClick={() => setSelectedCrucifixId(item.id)}
                          className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition gap-2 ${
                            active
                              ? 'border-atelie-rose-500 bg-atelie-rose-100/90 shadow-xs'
                              : 'border-atelie-rose-200/90 bg-white hover:border-atelie-rose-400'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-atelie-brown-900">{item.name}</p>
                              {renderPriceBadge(item.priceDelta)}
                            </div>
                            {item.detail && (
                              <p className="text-[11px] text-atelie-brown-600">{item.detail}</p>
                            )}
                          </div>
                          {active && <Check className="h-4 w-4 text-atelie-rose-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gravação Opcional */}
                {bespokeSettings.engravingEnabled && (
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-atelie-brown-700">
                      Gravação de Iniciais / Data (Opcional{' '}
                      {bespokeSettings.engravingPrice > 0
                        ? `+${formatCurrencyBRL(bespokeSettings.engravingPrice)}`
                        : 'Incluso'}
                      )
                    </label>
                    <input
                      type="text"
                      maxLength={28}
                      value={customEngraving}
                      onChange={(e) => setCustomEngraving(e.target.value)}
                      placeholder="Ex: A & M • 12.10.2026"
                      className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 font-mono text-xs text-atelie-brown-900 placeholder-atelie-brown-400 shadow-2xs focus:border-atelie-rose-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card de Resumo Técnico da Encomenda Sob Medida */}
          <motion.div
            layout
            className="flex flex-col justify-between rounded-2xl border border-atelie-rose-300/80 bg-atelie-cream-200/90 p-6 lg:col-span-4 shadow-sm"
          >
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-atelie-rose-800">
                RESUMO DA ENCOMENDA
              </span>
              <h3 className="mt-1 font-display text-xl font-bold text-atelie-brown-900">
                Sua Configuração
              </h3>

              <div className="mt-5 space-y-3 border-t border-atelie-rose-200/80 pt-4 font-mono text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-atelie-brown-600">Gema/Conta:</span>
                  <span className="text-right font-bold text-atelie-brown-900">
                    {currentStone?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-atelie-brown-600">Acabamento:</span>
                  <span className="text-right font-bold text-atelie-rose-800">
                    {currentMetal?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-atelie-brown-600">Calibre:</span>
                  <span className="text-right font-bold text-atelie-brown-900">
                    {currentSize?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-atelie-brown-600">Entremeio:</span>
                  <span className="text-right font-bold text-atelie-brown-900">
                    {currentMedal?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-atelie-brown-600">Crucifixo:</span>
                  <span className="text-right font-bold text-atelie-brown-900">
                    {currentCrucifix?.name}
                  </span>
                </div>
                {customEngraving.trim() && (
                  <div className="flex justify-between gap-2">
                    <span className="text-atelie-brown-600">Gravação:</span>
                    <span className="text-right font-bold text-atelie-rose-700">
                      “{customEngraving.trim()}”
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4 border-t border-atelie-rose-200/80 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase font-semibold text-atelie-brown-600">
                  Valor Estimado
                </span>
                <span className="font-mono text-3xl font-bold text-atelie-brown-900">
                  {formatCurrencyBRL(estimatedTotal)}
                </span>
              </div>

              <a
                href={whatsappBespokeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-5 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow transition hover:brightness-105"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enviar Pedido para o WhatsApp</span>
              </a>

              <p className="text-center font-mono text-[10px] text-atelie-brown-500">
                Você será redirecionado para o WhatsApp do {settings.brandName} com todas as especificações prontas.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
