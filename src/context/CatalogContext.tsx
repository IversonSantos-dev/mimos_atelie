import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  BespokeCustomizerSettings,
  Product,
  StoreSettings,
  SupabaseConnectionConfig,
} from '../types';
import { DEFAULT_BESPOKE_SETTINGS, INITIAL_PRODUCTS } from '../services/seedData';
import {
  deleteProductRecord,
  fetchAllProducts,
  fetchBespokeSettings,
  fetchStoreSettings,
  getSupabaseClient,
  getSupabaseConfig,
  loadLocalBespokeSettings,
  loadLocalProducts,
  loadLocalSettings,
  saveLocalBespokeSettings,
  saveLocalProducts,
  saveSupabaseConfig,
  syncAllLocalToSupabase,
  updateBespokeSettingsRecord,
  updateStoreSettingsRecord,
  upsertProductRecord,
} from '../services/supabaseService';

interface CatalogContextValue {
  products: Product[];
  publicProducts: Product[];
  settings: StoreSettings;
  bespokeSettings: BespokeCustomizerSettings;
  dataSource: 'supabase' | 'local';
  isLoading: boolean;
  supabaseConfig: SupabaseConnectionConfig;
  saveProduct: (product: Product) => Promise<{ syncedCloud: boolean }>;
  deleteProduct: (id: string) => Promise<{ syncedCloud: boolean }>;
  toggleProductVisibility: (id: string) => Promise<void>;
  quickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  updateSettings: (newSettings: StoreSettings) => Promise<{ syncedCloud: boolean }>;
  updateBespokeSettings: (
    newSettings: BespokeCustomizerSettings
  ) => Promise<{ syncedCloud: boolean }>;
  resetBespokeSettings: () => Promise<void>;
  updateSupabaseConnection: (config: SupabaseConnectionConfig) => Promise<void>;
  syncCatalogToCloud: () => Promise<{ ok: boolean; message: string }>;
  resetDemoCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

const BROADCAST_CHANNEL_NAME = 'mimos_atelie_realtime_sync';

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => loadLocalProducts());
  const [settings, setSettings] = useState<StoreSettings>(() => loadLocalSettings());
  const [bespokeSettings, setBespokeSettings] = useState<BespokeCustomizerSettings>(() =>
    loadLocalBespokeSettings()
  );
  const [dataSource, setDataSource] = useState<'supabase' | 'local'>('local');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConnectionConfig>(() =>
    getSupabaseConfig()
  );

  const notifyOtherTabs = useCallback(() => {
    try {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: 'CATALOG_UPDATED', timestamp: Date.now() });
      bc.close();
    } catch {
      // BroadcastChannel não suportado no navegador
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    const [{ products: fetchedProducts, source }, fetchedSettings, fetchedBespoke] =
      await Promise.all([
        fetchAllProducts(),
        fetchStoreSettings(),
        fetchBespokeSettings(),
      ]);
    setProducts(fetchedProducts);
    setSettings(fetchedSettings);
    setBespokeSettings(fetchedBespoke);
    setDataSource(source);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Escuta alterações em tempo real entre abas do navegador e evento storage
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.onmessage = () => {
        setProducts(loadLocalProducts());
        setSettings(loadLocalSettings());
        setBespokeSettings(loadLocalBespokeSettings());
      };
    } catch {
      // ignore
    }

    const handleStorage = () => {
      setProducts(loadLocalProducts());
      setSettings(loadLocalSettings());
      setBespokeSettings(loadLocalBespokeSettings());
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Se o Supabase estiver conectado, assina atualizações Realtime da tabela products
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    const channel = client
      .channel('public:products_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          refreshAll();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [supabaseConfig, refreshAll]);

  const saveProduct = async (product: Product) => {
    const { updatedList, syncedCloud } = await upsertProductRecord(product, products);
    setProducts(updatedList);
    if (syncedCloud) setDataSource('supabase');
    notifyOtherTabs();
    return { syncedCloud };
  };

  const deleteProduct = async (id: string) => {
    const { updatedList, syncedCloud } = await deleteProductRecord(id, products);
    setProducts(updatedList);
    notifyOtherTabs();
    return { syncedCloud };
  };

  const toggleProductVisibility = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const updatedProduct: Product = {
      ...target,
      visible: !target.visible,
      updatedAt: new Date().toISOString(),
    };
    await saveProduct(updatedProduct);
  };

  const quickUpdatePrice = async (id: string, newPrice: number) => {
    const target = products.find((p) => p.id === id);
    if (!target || Number.isNaN(newPrice) || newPrice < 0) return;
    const updatedProduct: Product = {
      ...target,
      price: newPrice,
      updatedAt: new Date().toISOString(),
    };
    await saveProduct(updatedProduct);
  };

  const updateSettings = async (newSettings: StoreSettings) => {
    setSettings(newSettings);
    const result = await updateStoreSettingsRecord(newSettings);
    notifyOtherTabs();
    return result;
  };

  const updateBespokeSettings = async (newSettings: BespokeCustomizerSettings) => {
    setBespokeSettings(newSettings);
    const result = await updateBespokeSettingsRecord(newSettings);
    notifyOtherTabs();
    return result;
  };

  const resetBespokeSettings = async () => {
    saveLocalBespokeSettings(DEFAULT_BESPOKE_SETTINGS);
    setBespokeSettings(DEFAULT_BESPOKE_SETTINGS);
    notifyOtherTabs();
  };

  const updateSupabaseConnection = async (config: SupabaseConnectionConfig) => {
    saveSupabaseConfig(config);
    setSupabaseConfigState(config);
    await refreshAll();
  };

  const syncCatalogToCloud = async () => {
    const res = await syncAllLocalToSupabase(products, settings, bespokeSettings);
    if (res.ok) {
      setDataSource('supabase');
    }
    return res;
  };

  const resetDemoCatalog = async () => {
    saveLocalProducts(INITIAL_PRODUCTS);
    setProducts(INITIAL_PRODUCTS);
    notifyOtherTabs();
  };

  const publicProducts = products.filter((p) => p.visible);

  return (
    <CatalogContext.Provider
      value={{
        products,
        publicProducts,
        settings,
        bespokeSettings,
        dataSource,
        isLoading,
        supabaseConfig,
        saveProduct,
        deleteProduct,
        toggleProductVisibility,
        quickUpdatePrice,
        updateSettings,
        updateBespokeSettings,
        resetBespokeSettings,
        updateSupabaseConnection,
        syncCatalogToCloud,
        resetDemoCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog deve ser usado dentro de um CatalogProvider');
  }
  return ctx;
}
