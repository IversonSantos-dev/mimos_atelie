import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  BespokeCustomizerSettings,
  Product,
  StoreSettings,
  SupabaseConnectionConfig,
} from '../types';
import {
  DEFAULT_BESPOKE_SETTINGS,
  DEFAULT_STORE_SETTINGS,
  INITIAL_PRODUCTS,
} from './seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'mimos_atelie_products_v1',
  SETTINGS: 'mimos_atelie_settings_v1',
  SUPABASE_CONFIG: 'mimos_atelie_supabase_config_v1',
  BESPOKE_SETTINGS: 'mimos_atelie_bespoke_settings_v1',
};

let supabaseClientInstance: SupabaseClient | null = null;
let currentConfigSignature = '';

// Credenciais oficiais do projeto Supabase Mimos Ateliê (Chave pública 'anon' para acesso client-side)
const DEFAULT_SUPABASE_URL = 'https://uavsedvxsgdbbjggezzi.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_sFgjporz8S_NiTE7-5cCwQ__WCYXyVt';

/**
 * Obtém a configuração de conexão do Supabase (do .env, padrão do projeto ou configurada via Painel Admin)
 */
export function getSupabaseConfig(): SupabaseConnectionConfig {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

  try {
    const savedRaw = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (savedRaw) {
      const parsed = JSON.parse(savedRaw) as Partial<SupabaseConnectionConfig>;
      const url = (parsed.url || envUrl).trim();
      const anonKey = (parsed.anonKey || envKey).trim();
      if (url && anonKey) {
        return {
          url,
          anonKey,
          // Se as chaves foram configuradas, habilita por padrão a menos que explicitamente desligado
          enabled: parsed.enabled !== false,
        };
      }
    }
  } catch {
    // Ignorar erro de leitura do localStorage
  }

  return {
    url: envUrl,
    anonKey: envKey,
    enabled: Boolean(envUrl && envKey),
  };
}

export function isServiceRoleKey(key: string): boolean {
  try {
    const parts = key.trim().split('.');
    if (parts.length === 3) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.role === 'service_role';
    }
  } catch {
    // ignore
  }
  return false;
}

/**
 * Salva as credenciais do Supabase informadas pelo administrador no painel
 */
export function saveSupabaseConfig(config: SupabaseConnectionConfig): void {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
  supabaseClientInstance = null;
  currentConfigSignature = '';
}

/**
 * Retorna a instância ativa do SupabaseClient caso esteja configurado e habilitado
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.enabled || !config.url || !config.anonKey) {
    return null;
  }

  const signature = `${config.url}::${config.anonKey}`;
  if (!supabaseClientInstance || currentConfigSignature !== signature) {
    try {
      supabaseClientInstance = createClient(config.url, config.anonKey);
      currentConfigSignature = signature;
    } catch (err) {
      console.error('Erro ao inicializar cliente Supabase:', err);
      return null;
    }
  }
  return supabaseClientInstance;
}

// ============================================================================
// MAPEAMENTO ENTRE FORMATO DO BANCO (SNAKE_CASE) E APLICAÇÃO (CAMELCASE)
// ============================================================================

function mapRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    subtitle: String(row.subtitle || ''),
    category: (row.category as Product['category']) || 'Pedras Naturais',
    description: String(row.description || ''),
    devotionHistory: String(row.devotion_history || ''),
    price: Number(row.price || 0),
    imageUrl: String(row.image_url || ''),
    bentoSize: (row.bento_size as Product['bentoSize']) || 'standard',
    visible: row.visible !== false,
    badge: row.badge ? String(row.badge) : undefined,
    customWhatsapp: row.custom_whatsapp ? String(row.custom_whatsapp) : undefined,
    specs: (row.specs as Product['specs']) || {
      beadMaterial: '',
      metalFinish: '',
      beadSizeMm: '10mm',
      weightGrams: '65g',
      lengthCm: '50cm',
      centerpiece: '',
      crucifix: '',
      patronSaint: '',
    },
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}

function mapProductToRow(product: Product) {
  return {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    category: product.category,
    description: product.description,
    devotion_history: product.devotionHistory,
    price: product.price,
    image_url: product.imageUrl,
    bento_size: product.bentoSize,
    visible: product.visible,
    badge: product.badge || null,
    custom_whatsapp: product.customWhatsapp || null,
    specs: product.specs,
    created_at: product.createdAt,
    updated_at: new Date().toISOString(),
  };
}

// ============================================================================
// OPERAÇÕES DE PRODUTOS E CONFIGURAÇÕES (MODO HÍBRIDO INTELIGENTE)
// ============================================================================

export function loadLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveLocalProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function loadLocalSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_STORE_SETTINGS));
      return DEFAULT_STORE_SETTINGS;
    }
    return { ...DEFAULT_STORE_SETTINGS, ...(JSON.parse(raw) as Partial<StoreSettings>) };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveLocalSettings(settings: StoreSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function loadLocalBespokeSettings(): BespokeCustomizerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BESPOKE_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BESPOKE_SETTINGS, JSON.stringify(DEFAULT_BESPOKE_SETTINGS));
      return DEFAULT_BESPOKE_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<BespokeCustomizerSettings>;
    return {
      ...DEFAULT_BESPOKE_SETTINGS,
      ...parsed,
      stones: parsed.stones && parsed.stones.length > 0 ? parsed.stones : DEFAULT_BESPOKE_SETTINGS.stones,
      metals: parsed.metals && parsed.metals.length > 0 ? parsed.metals : DEFAULT_BESPOKE_SETTINGS.metals,
      beadSizes: parsed.beadSizes && parsed.beadSizes.length > 0 ? parsed.beadSizes : DEFAULT_BESPOKE_SETTINGS.beadSizes,
      medals: parsed.medals && parsed.medals.length > 0 ? parsed.medals : DEFAULT_BESPOKE_SETTINGS.medals,
      crucifixes: parsed.crucifixes && parsed.crucifixes.length > 0 ? parsed.crucifixes : DEFAULT_BESPOKE_SETTINGS.crucifixes,
    };
  } catch {
    return DEFAULT_BESPOKE_SETTINGS;
  }
}

export function saveLocalBespokeSettings(settings: BespokeCustomizerSettings): void {
  localStorage.setItem(STORAGE_KEYS.BESPOKE_SETTINGS, JSON.stringify(settings));
}

/**
 * Busca todos os produtos (do Supabase se ativo, com fallback automático para armazenamento local)
 */
export async function fetchAllProducts(): Promise<{
  products: Product[];
  source: 'supabase' | 'local';
}> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRowToProduct);
        saveLocalProducts(mapped);
        return { products: mapped, source: 'supabase' };
      }

      // Se a tabela no Supabase estiver vazia na primeira vez, faz o seed automático!
      if (!error && data && data.length === 0) {
        const localSeed = loadLocalProducts();
        await client.from('products').upsert(localSeed.map(mapProductToRow));
        return { products: localSeed, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Fallback para banco local (Supabase indisponível ou tabela não criada):', err);
    }
  }

  return { products: loadLocalProducts(), source: 'local' };
}

/**
 * Salva ou atualiza um produto no Supabase (se conectado) e também localmente
 */
export async function upsertProductRecord(
  product: Product,
  currentList: Product[]
): Promise<{ updatedList: Product[]; syncedCloud: boolean; error?: string }> {
  const exists = currentList.some((p) => p.id === product.id);
  const updatedList = exists
    ? currentList.map((p) => (p.id === product.id ? product : p))
    : [...currentList, product];

  saveLocalProducts(updatedList);

  const client = getSupabaseClient();
  if (!client) {
    return {
      updatedList,
      syncedCloud: false,
      error: 'Supabase não conectado ou desabilitado. Salvo apenas no armazenamento local.',
    };
  }

  try {
    const row = mapProductToRow(product);
    const { error } = await client
      .from('products')
      .upsert(row, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('[Supabase upsertProductRecord Error]', error);
      return {
        updatedList,
        syncedCloud: false,
        error: `Erro no Supabase: ${error.message} (Código: ${error.code || 'RLS/Constraint'})`,
      };
    }

    return { updatedList, syncedCloud: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão com Supabase';
    console.error('[Supabase upsertProductRecord Exception]', err);
    return { updatedList, syncedCloud: false, error: msg };
  }
}

/**
 * Remove um produto do Supabase (se conectado) e do armazenamento local
 */
export async function deleteProductRecord(
  productId: string,
  currentList: Product[]
): Promise<{ updatedList: Product[]; syncedCloud: boolean; error?: string }> {
  const updatedList = currentList.filter((p) => p.id !== productId);
  saveLocalProducts(updatedList);

  const client = getSupabaseClient();
  if (!client) {
    return {
      updatedList,
      syncedCloud: false,
      error: 'Supabase não conectado. Produto removido apenas localmente.',
    };
  }

  try {
    const { error } = await client.from('products').delete().eq('id', productId);
    if (error) {
      console.error('[Supabase deleteProductRecord Error]', error);
      return {
        updatedList,
        syncedCloud: false,
        error: `Erro ao excluir no Supabase: ${error.message}`,
      };
    }
    return { updatedList, syncedCloud: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão com Supabase';
    console.error('[Supabase deleteProductRecord Exception]', err);
    return { updatedList, syncedCloud: false, error: msg };
  }
}

/**
 * Busca as configurações globais da loja (WhatsApp, Nome do Ateliê, etc.)
 */
export async function fetchStoreSettings(): Promise<StoreSettings> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('store_settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (!error && data) {
        const mapped: StoreSettings = {
          brandName: data.brand_name || DEFAULT_STORE_SETTINGS.brandName,
          brandTagline: data.brand_tagline || DEFAULT_STORE_SETTINGS.brandTagline,
          whatsappNumber: data.whatsapp_number || DEFAULT_STORE_SETTINGS.whatsappNumber,
          instagramHandle: data.instagram_handle || DEFAULT_STORE_SETTINGS.instagramHandle,
          heroBadge: data.hero_badge || DEFAULT_STORE_SETTINGS.heroBadge,
        };
        saveLocalSettings(mapped);
        return mapped;
      }
    } catch {
      // Usa configuração local caso a tabela ainda não exista
    }
  }
  return loadLocalSettings();
}

/**
 * Salva as configurações globais no Supabase (se ativo) e localmente
 */
export async function updateStoreSettingsRecord(
  settings: StoreSettings
): Promise<{ syncedCloud: boolean; error?: string }> {
  saveLocalSettings(settings);

  const client = getSupabaseClient();
  if (!client) {
    return { syncedCloud: false, error: 'Supabase não conectado' };
  }

  try {
    const { error } = await client.from('store_settings').upsert({
      id: 'global',
      brand_name: settings.brandName,
      brand_tagline: settings.brandTagline,
      whatsapp_number: settings.whatsappNumber,
      instagram_handle: settings.instagramHandle,
      hero_badge: settings.heroBadge,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' }).select();

    if (error) {
      console.error('[Supabase updateStoreSettingsRecord Error]', error);
      return { syncedCloud: false, error: error.message };
    }
    return { syncedCloud: true };
  } catch (err) {
    return { syncedCloud: false, error: err instanceof Error ? err.message : 'Erro no Supabase' };
  }
}

/**
 * Busca as opções do Configurador Sob Medida (pedras, metais, crucifixos, etc.)
 */
export async function fetchBespokeSettings(): Promise<BespokeCustomizerSettings> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('bespoke_settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (!error && data && data.settings) {
        const parsed = data.settings as Partial<BespokeCustomizerSettings>;
        const mapped: BespokeCustomizerSettings = {
          ...DEFAULT_BESPOKE_SETTINGS,
          ...parsed,
          stones: parsed.stones && parsed.stones.length > 0 ? parsed.stones : DEFAULT_BESPOKE_SETTINGS.stones,
          metals: parsed.metals && parsed.metals.length > 0 ? parsed.metals : DEFAULT_BESPOKE_SETTINGS.metals,
          beadSizes: parsed.beadSizes && parsed.beadSizes.length > 0 ? parsed.beadSizes : DEFAULT_BESPOKE_SETTINGS.beadSizes,
          medals: parsed.medals && parsed.medals.length > 0 ? parsed.medals : DEFAULT_BESPOKE_SETTINGS.medals,
          crucifixes: parsed.crucifixes && parsed.crucifixes.length > 0 ? parsed.crucifixes : DEFAULT_BESPOKE_SETTINGS.crucifixes,
        };
        saveLocalBespokeSettings(mapped);
        return mapped;
      }
    } catch {
      // Fallback para armazenamento local caso a tabela bespoke_settings ainda não tenha sido criada
    }
  }
  return loadLocalBespokeSettings();
}

/**
 * Salva as opções do Configurador Sob Medida no Supabase (se ativo) e localmente
 */
export async function updateBespokeSettingsRecord(
  settings: BespokeCustomizerSettings
): Promise<{ syncedCloud: boolean; error?: string }> {
  saveLocalBespokeSettings(settings);

  const client = getSupabaseClient();
  if (!client) {
    return { syncedCloud: false, error: 'Supabase não conectado' };
  }

  try {
    const { error } = await client.from('bespoke_settings').upsert({
      id: 'global',
      settings: settings,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' }).select();

    if (error) {
      console.error('[Supabase updateBespokeSettingsRecord Error]', error);
      return { syncedCloud: false, error: error.message };
    }
    return { syncedCloud: true };
  } catch (err) {
    return { syncedCloud: false, error: err instanceof Error ? err.message : 'Erro no Supabase' };
  }
}

/**
 * Sincroniza todo o catálogo local para o Supabase com 1 clique
 */
export async function syncAllLocalToSupabase(
  products: Product[],
  settings: StoreSettings,
  bespokeSettings?: BespokeCustomizerSettings
): Promise<{ ok: boolean; message: string }> {
  const config = getSupabaseConfig();
  if (isServiceRoleKey(config.anonKey)) {
    return {
      ok: false,
      message:
        'Chave Secreta Detectada: Você colou a chave "service_role" (secret). O Supabase não permite chaves secretas no navegador por segurança. No painel do Supabase, acesse Project Settings → API e copie a chave pública rotulada como "anon" (public).',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      message: 'Cliente Supabase não está configurado ou habilitado.',
    };
  }

  try {
    const { error: settingsError } = await client.from('store_settings').upsert({
      id: 'global',
      brand_name: settings.brandName,
      brand_tagline: settings.brandTagline,
      whatsapp_number: settings.whatsappNumber,
      instagram_handle: settings.instagramHandle,
      hero_badge: settings.heroBadge,
      updated_at: new Date().toISOString(),
    });

    if (settingsError) {
      return {
        ok: false,
        message: `Erro na tabela store_settings: ${settingsError.message}. Verifique se executou o script supabase/schema.sql.`,
      };
    }

    const { error: productsError } = await client
      .from('products')
      .upsert(products.map(mapProductToRow));

    if (productsError) {
      return {
        ok: false,
        message: `Erro na tabela products: ${productsError.message}. Verifique se executou o script supabase/schema.sql.`,
      };
    }

    const targetBespoke = bespokeSettings || loadLocalBespokeSettings();
    try {
      await client.from('bespoke_settings').upsert({
        id: 'global',
        settings: targetBespoke,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Tabela bespoke_settings opcional se ainda não migrada
    }

    return {
      ok: true,
      message: `${products.length} produtos, configurações e opções sob medida sincronizados com sucesso no Supabase!`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Falha de conexão com o Supabase.',
    };
  }
}

/**
 * Converte e otimiza um arquivo de imagem via Canvas para um tamanho ultraleve (~40KB-70KB)
 * preservando alta nitidez e resolução ideal para exibição web.
 */
export function processUploadedImageFile(file: File, maxWidth = 960): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(event.target?.result || ''));
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        // Otimizado para ~40KB-70KB (evita sobrecarga no banco de dados e tráfego)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Falha ao processar imagem selecionada.'));
      img.src = String(event.target?.result || '');
    };
    reader.onerror = () => reject(new Error('Falha ao ler arquivo do dispositivo.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Tenta fazer upload direto no Supabase Storage (bucket 'products').
 * Caso o bucket ainda não exista ou falhe, faz fallback automático para imagem otimizada em Canvas.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const fileName = `terco_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${cleanExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await client.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = client.storage
          .from('products')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch {
      // Ignora erro de storage e faz fallback suave para o processador canvas
    }
  }

  return processUploadedImageFile(file, 960);
}
