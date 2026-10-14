import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  MessageCircle,
  Database,
  CheckCircle2,
  LogOut,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Shield,
  Save,
  Compass,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import {
  buildProductWhatsAppUrl,
  formatCurrencyBRL,
  formatPhoneDisplay,
} from '../utils/whatsapp';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { BespokeOptionsManager } from '../components/admin/BespokeOptionsManager';
import { isServiceRoleKey } from '../services/supabaseService';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    publicProducts,
    settings,
    bespokeSettings,
    dataSource,
    supabaseConfig,
    saveProduct,
    deleteProduct,
    toggleProductVisibility,
    quickUpdatePrice,
    updateSettings,
    updateSupabaseConnection,
    syncCatalogToCloud,
    resetDemoCatalog,
  } = useCatalog();

  const { adminEmail, logout, updateAdminCredentials } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'catalog' | 'bespoke' | 'whatsapp' | 'supabase'
  >('catalog');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [inlinePrices, setInlinePrices] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalBespokeOptions =
    (bespokeSettings?.stones?.length || 0) +
    (bespokeSettings?.metals?.length || 0) +
    (bespokeSettings?.beadSizes?.length || 0) +
    (bespokeSettings?.medals?.length || 0) +
    (bespokeSettings?.crucifixes?.length || 0);

  // Estado do formulário de Configurações Globais / WhatsApp
  const [brandName, setBrandName] = useState(settings.brandName);
  const [brandTagline, setBrandTagline] = useState(settings.brandTagline);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [heroBadge, setHeroBadge] = useState(settings.heroBadge);

  // Estado de Conexão Supabase
  const [sbUrl, setSbUrl] = useState(supabaseConfig.url);
  const [sbAnonKey, setSbAnonKey] = useState(supabaseConfig.anonKey);
  const [sbEnabled, setSbEnabled] = useState(supabaseConfig.enabled);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Estado de alteração de senha do Admin
  const [newAdminEmail, setNewAdminEmail] = useState(adminEmail);
  const [newAdminPassword, setNewAdminPassword] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProduct = async (product: Product) => {
    const res = await saveProduct(product);
    if (res.syncedCloud) {
      showToast(`✅ Peça "${product.name}" salva e sincronizada instantaneamente no Supabase!`);
    } else if (res.error) {
      showToast(`⚠️ Salvo localmente. Supabase: ${res.error}`);
    } else {
      showToast(`Peça "${product.name}" atualizada em tempo real no catálogo local!`);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir permanentemente "${product.name}" do catálogo?`
    );
    if (!confirmed) return;
    const res = await deleteProduct(product.id);
    if (res.syncedCloud) {
      showToast(`✅ Peça "${product.name}" excluída e sincronizada no Supabase.`);
    } else {
      showToast(`Peça "${product.name}" removida do acervo local.`);
    }
  };

  const handleInlinePriceBlur = async (product: Product) => {
    const raw = inlinePrices[product.id];
    if (raw === undefined) return;
    const numeric = Number(raw.replace(',', '.'));
    if (!Number.isNaN(numeric) && numeric >= 0 && numeric !== product.price) {
      const res = await quickUpdatePrice(product.id, numeric);
      if (res && 'syncedCloud' in res && res.syncedCloud) {
        showToast(`✅ Preço de "${product.name}" atualizado e salvo no Supabase: ${formatCurrencyBRL(numeric)}!`);
      } else {
        showToast(`Preço de "${product.name}" atualizado para ${formatCurrencyBRL(numeric)}!`);
      }
    }
  };

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateSettings({
      ...settings,
      brandName: brandName.trim() || 'Mimos Ateliê',
      brandTagline: brandTagline.trim(),
      whatsappNumber: whatsappNumber.replace(/\D/g, '') || '5532988847689',
      heroBadge: heroBadge.trim(),
    });
    if (res.syncedCloud) {
      showToast('✅ Configurações globais e WhatsApp salvos instantaneamente no Supabase!');
    } else if (res.error) {
      showToast(`⚠️ Salvo localmente. Supabase: ${res.error}`);
    } else {
      showToast('WhatsApp e configurações globais atualizados em tempo real localmente!');
    }
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = sbUrl.trim();
    const cleanKey = sbAnonKey.trim();
    const shouldEnable = Boolean(cleanUrl && cleanKey);
    setSbEnabled(shouldEnable);
    await updateSupabaseConnection({
      url: cleanUrl,
      anonKey: cleanKey,
      enabled: shouldEnable,
    });
    showToast(shouldEnable ? '✅ Conexão Supabase ativada e sincronização configurada!' : 'Configuração do Supabase atualizada!');
  };

  const handleSyncToCloud = async () => {
    setSyncStatus('Sincronizando acervo com o Supabase...');
    const res = await syncCatalogToCloud();
    setSyncStatus(res.message);
    if (res.ok) showToast('Sincronização com Supabase concluída!');
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Notificação Flutuante (Toast) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-400/50 bg-slate-900/95 px-5 py-3.5 text-xs font-semibold text-amber-200 shadow-gold-glow-lg backdrop-blur-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho do Painel Admin */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white border border-atelie-rose-300/80 p-6 shadow-atelie-soft sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 rounded-full border-2 border-atelie-rose-300 bg-white p-0.5 shadow-md overflow-hidden">
            <img
              src="/images/logo.jpg"
              alt={settings.brandName}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {supabaseConfig.enabled && supabaseConfig.url ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-50 px-3 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sincronização em Nuvem Ativa (Supabase)
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('supabase')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-50 px-3 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Modo Local / Offline (Clique para conectar Supabase)
                </button>
              )}
            </div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-atelie-brown-900">
              Painel de Gestão — <span className="text-gold-shimmer">{settings.brandName}</span>
            </h1>
            <p className="mt-0.5 font-mono text-xs text-atelie-brown-600">
              Logado como <span className="font-bold text-atelie-brown-800">{adminEmail}</span> • WhatsApp Ativo:{' '}
              <span className="font-bold text-atelie-rose-700">{formatPhoneDisplay(settings.whatsappNumber)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow transition hover:brightness-105"
          >
            <Plus className="h-4 w-4" />
            <span>Cadastrar Novo Terço</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-atelie-rose-200 bg-white px-4 py-3 text-xs font-semibold text-atelie-brown-700 transition hover:border-red-400 hover:text-red-700 shadow-2xs"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Cards de Indicadores (KPIs) */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-white border border-atelie-rose-200/90 p-4 shadow-2xs">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-500">
            Total de Peças
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-atelie-brown-900">{products.length} peças</p>
        </div>

        <div className="rounded-2xl bg-white border border-atelie-rose-200/90 p-4 shadow-2xs">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-500">
            Visíveis no Site
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-700">
            {publicProducts.length} ativas
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-atelie-rose-200/90 p-4 shadow-2xs">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-500">
            Terço Sob Medida
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`font-mono text-2xl font-bold ${
                bespokeSettings.enabled ? 'text-atelie-rose-700' : 'text-slate-400'
              }`}
            >
              {bespokeSettings.enabled ? 'Ativo' : 'Pausado'}
            </span>
            <span className="font-mono text-xs text-atelie-brown-500 font-medium">
              ({totalBespokeOptions} opções)
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-atelie-rose-200/90 p-4 shadow-2xs">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-500">
            WhatsApp Principal
          </span>
          <p className="mt-1 font-mono text-sm font-bold text-atelie-rose-800 truncate">
            {formatPhoneDisplay(settings.whatsappNumber)}
          </p>
        </div>
      </div>

      {/* Abas de Navegação do Dashboard */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-atelie-rose-200/80 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'catalog'
              ? 'bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 text-white shadow-gold-glow'
              : 'border border-atelie-rose-200 bg-white text-atelie-brown-700 hover:border-atelie-rose-400 shadow-2xs'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Catálogo de Terços ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bespoke')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'bespoke'
              ? 'bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 text-white shadow-gold-glow'
              : 'border border-atelie-rose-200 bg-white text-atelie-brown-700 hover:border-atelie-rose-400 shadow-2xs'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Terço Sob Medida ({totalBespokeOptions})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'whatsapp'
              ? 'bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 text-white shadow-gold-glow'
              : 'border border-atelie-rose-200 bg-white text-atelie-brown-700 hover:border-atelie-rose-400 shadow-2xs'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp & Dados da Marca</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('supabase')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'supabase'
              ? 'bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 text-white shadow-gold-glow'
              : 'border border-atelie-rose-200 bg-white text-atelie-brown-700 hover:border-atelie-rose-400 shadow-2xs'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Conexão Nuvem (Supabase)</span>
        </button>
      </div>

      {/* ABA 1: GESTÃO DE PRODUTOS EM TEMPO REAL */}
      {activeTab === 'catalog' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <p>
              Dica: Você pode alterar o preço diretamente na caixa numérica de cada linha para atualização instantânea.
            </p>
            <button
              type="button"
              onClick={async () => {
                if (
                  window.confirm(
                    'Deseja restaurar as 6 peças originais de demonstração do Mimos Ateliê?'
                  )
                ) {
                  await resetDemoCatalog();
                  showToast('Catálogo inicial restaurado com sucesso!');
                }
              }}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-amber-300"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Restaurar Catálogo Demo Original</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white border border-atelie-rose-300 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-atelie-rose-200 bg-atelie-cream-200/90 font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-700">
                    <th className="py-3.5 px-4">Peça / Terço</th>
                    <th className="py-3.5 px-4">Coleção / Categoria</th>
                    <th className="py-3.5 px-4">Preço (Edição Rápida)</th>
                    <th className="py-3.5 px-4">Status Público</th>
                    <th className="py-3.5 px-4">Link WhatsApp</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-atelie-rose-100 text-sm">
                  {products.map((product) => {
                    const priceValue =
                      inlinePrices[product.id] !== undefined
                        ? inlinePrices[product.id]
                        : String(product.price);

                    return (
                      <tr
                        key={product.id}
                        className={`transition hover:bg-atelie-cream-100/50 ${
                          !product.visible ? 'opacity-60' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-14 w-16 shrink-0 rounded-xl border border-atelie-rose-200 object-cover bg-atelie-cream-200"
                            />
                            <div>
                              <p className="font-display font-bold text-atelie-brown-900">
                                {product.name}
                              </p>
                              <p className="font-mono text-[11px] text-atelie-brown-600">
                                {product.specs.beadMaterial} • {product.specs.beadSizeMm}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono text-xs">
                          <span className="block font-bold text-atelie-rose-800">{product.category}</span>
                          <span className="text-[11px] text-atelie-brown-500 truncate max-w-[160px] block">
                            {product.subtitle || 'Série Artesanal'}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-atelie-brown-600 font-semibold">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={priceValue}
                              onChange={(e) =>
                                setInlinePrices((prev) => ({
                                  ...prev,
                                  [product.id]: e.target.value,
                                }))
                              }
                              onBlur={() => handleInlinePriceBlur(product)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="w-28 rounded-lg border border-atelie-rose-300 bg-atelie-cream-200/80 px-2.5 py-1.5 font-mono text-xs font-bold text-atelie-brown-900 focus:border-atelie-rose-500 focus:outline-none"
                            />
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <button
                            type="button"
                            onClick={async () => {
                              await toggleProductVisibility(product.id);
                              showToast(
                                product.visible
                                  ? `"${product.name}" ocultado da vitrine pública.`
                                  : `"${product.name}" publicado na vitrine!`
                              );
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium transition ${
                              product.visible
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {product.visible ? (
                              <>
                                <Eye className="h-3.5 w-3.5" />
                                <span>Visível</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3.5 w-3.5" />
                                <span>Oculto</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-4 px-4">
                          <a
                            href={buildProductWhatsAppUrl(product, settings.whatsappNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-amber-300 hover:underline"
                          >
                            <span>Testar Encomenda</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(product)}
                              className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
                              title="Editar Informações e Foto"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
                              title="Excluir Peça"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: PERSONALIZAÇÃO DO TERÇO SOB MEDIDA */}
      {activeTab === 'bespoke' && (
        <div className="mt-6">
          <BespokeOptionsManager onShowToast={showToast} />
        </div>
      )}

      {/* ABA 3: CONFIGURAÇÃO DO WHATSAPP GLOBAL & MARCA */}
      {activeTab === 'whatsapp' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleSaveGlobalSettings}
            className="rounded-3xl bg-white border border-atelie-rose-300/80 p-6 sm:p-8 lg:col-span-7 space-y-5 shadow-sm"
          >
            <h2 className="font-display text-xl font-bold text-atelie-brown-900">
              WhatsApp Oficial de Atendimento & Identidade
            </h2>
            <p className="text-xs text-atelie-brown-600">
              Este número recebe todas as encomendas dos botões de WhatsApp do catálogo e do configurador.
            </p>

            <div>
              <label className="block font-mono text-xs uppercase font-bold text-atelie-rose-800">
                Número do WhatsApp com DDI + DDD (Apenas números) *
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ex: 5532988847689"
                className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-atelie-cream-200/80 px-4 py-3 font-mono text-base font-bold text-atelie-brown-900 focus:border-atelie-rose-500 focus:outline-none"
              />
              <span className="mt-1 block font-mono text-[11px] text-atelie-brown-500 font-semibold">
                Formatado: {formatPhoneDisplay(whatsappNumber)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs uppercase font-semibold text-atelie-brown-700">
                  Nome do Ateliê / Marca
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 text-sm text-atelie-brown-900"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-semibold text-atelie-brown-700">
                  Slogan / Subtítulo da Marca
                </label>
                <input
                  type="text"
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 text-sm text-atelie-brown-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase font-semibold text-atelie-brown-700">
                Badge Superior da Hero Section
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 font-mono text-xs text-atelie-rose-800 font-bold"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow hover:brightness-105"
            >
              <Save className="h-4 w-4" />
              <span>Salvar WhatsApp & Identidade</span>
            </button>
          </form>

          {/* Alteração de Credenciais de Administrador */}
          <div className="rounded-3xl bg-white border border-atelie-rose-300/80 p-6 sm:p-8 lg:col-span-5 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 text-atelie-rose-700">
              <Shield className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold text-atelie-brown-900">
                Segurança do Administrador
              </h3>
            </div>
            <p className="text-xs text-atelie-brown-600">
              Atualize o e-mail e a senha de acesso ao painel administrativo.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAdminPassword.trim()) return;
                updateAdminCredentials(newAdminEmail, newAdminPassword);
                setNewAdminPassword('');
                showToast('Credenciais de administrador atualizadas com sucesso!');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-mono text-xs uppercase font-semibold text-atelie-brown-700">
                  Novo E-mail de Login
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 text-sm text-atelie-brown-900"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-semibold text-atelie-brown-700">
                  Nova Senha
                </label>
                <input
                  type="password"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="mt-1 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 text-sm text-atelie-brown-900"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl border border-atelie-rose-400 bg-atelie-rose-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-atelie-rose-800 hover:bg-atelie-rose-200"
              >
                Atualizar Senha de Acesso
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ABA 3: CONEXÃO SUPABASE HÍBRIDA */}
      {activeTab === 'supabase' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleSaveSupabaseConfig}
            className="rounded-3xl bg-white border border-atelie-rose-300/80 p-6 sm:p-8 lg:col-span-7 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-atelie-brown-900">
                Integração Nuvem Supabase (PostgreSQL)
              </h2>
              <span className="rounded-full border border-atelie-rose-300 bg-atelie-rose-100 px-3 py-1 font-mono text-[10px] font-bold text-atelie-rose-800">
                @supabase/supabase-js
              </span>
            </div>

            <p className="text-xs leading-relaxed text-atelie-brown-600">
              O sistema opera em <strong>Modo Híbrido Inteligente</strong>: funciona imediatamente com persistência local e sincroniza na nuvem quando configurado com a URL e chave do seu projeto.
            </p>

            <div>
              <label className="block font-mono text-xs uppercase font-bold text-atelie-rose-800">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                placeholder="https://seu-projeto.supabase.co"
                className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-4 py-2.5 font-mono text-xs text-atelie-brown-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block font-mono text-xs uppercase font-bold text-atelie-rose-800">
                  Supabase Anon Public Key (Chave Pública 'anon')
                </label>
                <span className="font-mono text-[10px] text-atelie-brown-500">
                  Role: anon (public)
                </span>
              </div>
              <input
                type="text"
                value={sbAnonKey}
                onChange={(e) => setSbAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-2.5 font-mono text-xs text-atelie-brown-900 ${
                  isServiceRoleKey(sbAnonKey)
                    ? 'border-red-500 bg-red-50 focus:border-red-600'
                    : 'border-atelie-rose-300'
                }`}
              />
              {isServiceRoleKey(sbAnonKey) ? (
                <div className="mt-2.5 rounded-2xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-800">
                  <p className="font-bold flex items-center gap-1.5">
                    <span>⚠️ Chave Secreta Detectada (service_role)</span>
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Você colou a chave <strong>service_role (secret)</strong>. O Supabase proíbe o uso dessa chave no navegador por segurança.
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-red-900">
                    👉 Vá em <strong>Project Settings → API</strong> no Supabase e copie a chave rotulada como <strong>anon public</strong> (não a secret).
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-[11px] text-atelie-brown-500">
                  Certifique-se de copiar a chave rotulada como <strong>anon public</strong> (e não a service_role secret).
                </p>
              )}
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sbEnabled}
                onChange={(e) => setSbEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-atelie-rose-300 text-atelie-rose-600"
              />
              <span className="text-xs text-atelie-brown-800 font-medium">
                Ativar sincronização em nuvem com este projeto Supabase
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow hover:brightness-105"
              >
                Salvar Chaves Supabase
              </button>

              <button
                type="button"
                onClick={handleSyncToCloud}
                className="rounded-xl border border-atelie-rose-300 bg-atelie-rose-100 px-4 py-2.5 text-xs font-bold text-atelie-rose-800 hover:bg-atelie-rose-200"
              >
                Enviar Catálogo Local para o Supabase Agora
              </button>
            </div>

            {syncStatus && (
              <div className="rounded-xl border border-atelie-rose-300 bg-atelie-cream-200 p-3 font-mono text-xs text-atelie-brown-900 font-semibold">
                {syncStatus}
              </div>
            )}
          </form>

          <div className="rounded-3xl bg-white border border-atelie-rose-300/80 p-6 sm:p-8 lg:col-span-5 space-y-4 shadow-sm">
            <h3 className="font-display text-lg font-bold text-atelie-brown-900">
              Como preparar o banco no Supabase
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs text-atelie-brown-700 leading-relaxed">
              <li>Crie um projeto gratuito em <strong>supabase.com</strong>.</li>
              <li>
                Abra o menu <strong>SQL Editor</strong> e cole o conteúdo do arquivo{' '}
                <code className="text-atelie-rose-800 font-bold">supabase/schema.sql</code> incluso na raiz deste projeto.
              </li>
              <li>
                Copie a <strong>Project URL</strong> e a chave pública <strong>anon (public)</strong> em{' '}
                <em>Project Settings → API</em> e cole ao lado (<strong>não utilize</strong> a chave service_role secret).
              </li>
              <li>
                Clique em <strong>Enviar Catálogo Local para o Supabase Agora</strong> para subir todas as peças com 1 clique.
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Modal de Criar ou Editar Produto */}
      {(isCreating || editingProduct) && (
        <ProductFormModal
          initialProduct={editingProduct}
          globalWhatsapp={settings.whatsappNumber}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
