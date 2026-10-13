-- ============================================================================
-- MIMOS ATELIÊ — SCHEMA SQL PARA SUPABASE (POSTGRESQL)
-- Execute este script no SQL Editor do seu projeto Supabase para criar as
-- tabelas e políticas de acesso (RLS) do portfólio e painel administrativo.
-- ============================================================================

-- 1. Tabela de Configurações Globais da Loja
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  brand_name TEXT NOT NULL DEFAULT 'Mimos Ateliê',
  brand_tagline TEXT NOT NULL DEFAULT 'Alta Joalheria Sacra & Devoção Artesanal',
  whatsapp_number TEXT NOT NULL DEFAULT '5532988847689',
  instagram_handle TEXT DEFAULT '@mimosatelie',
  hero_badge TEXT DEFAULT 'COLEÇÃO IMPERIAL • FEITO À MÃO',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.store_settings (id, brand_name, brand_tagline, whatsapp_number, instagram_handle)
VALUES ('global', 'Mimos Ateliê', 'Alta Joalheria Sacra & Devoção Artesanal', '5532988847689', '@mimosatelie')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabela de Produtos (Terços e Artigos Religiosos)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL DEFAULT 'Pedras Naturais',
  description TEXT NOT NULL,
  devotion_history TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  bento_size TEXT NOT NULL DEFAULT 'standard', -- 'featured' | 'wide' | 'tall' | 'standard'
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  badge TEXT,
  custom_whatsapp TEXT,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Opções Sob Medida (Configurador Bespoke)
CREATE TABLE IF NOT EXISTS public.bespoke_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar Row Level Security (RLS) e Políticas para Acesso da Aplicação
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bespoke_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública das configurações"
  ON public.store_settings FOR SELECT USING (true);

CREATE POLICY "Permitir atualização das configurações pelo painel"
  ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura pública dos produtos"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Permitir gestão completa dos produtos pelo painel"
  ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura pública das opções sob medida"
  ON public.bespoke_settings FOR SELECT USING (true);

CREATE POLICY "Permitir gestão completa das opções sob medida pelo painel"
  ON public.bespoke_settings FOR ALL USING (true) WITH CHECK (true);
