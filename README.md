# 🕊️ Mimos Ateliê — Alta Joalheria Sacra & Devoção Artesanal

<div align="center">

![Mimos Ateliê Logo](public/images/logo.jpg)

**Plataforma de alta precisão e catálogo digital exclusivo para exposição, customização sob medida e gestão de terços artesanais e artigos sacros nobres.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Deploy%20Ready-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

[Demonstração](#-visão-geral) • [Funcionalidades](#-funcionalidades) • [Arquitetura](#-arquitetura-e-design-system) • [Como Executar](#-guia-de-instalação-e-execução) • [Painel Admin](#-painel-administrativo) • [Banco de Dados](#-configuração-do-supabase)

</div>

---

## 📖 Visão Geral

O **Mimos Ateliê** é uma aplicação web moderna projetada para elevar a experiência de apresentação e aquisição de artigos religiosos e alta joalheria sacra. Unindo estética solene com engenharia web de ponta, a plataforma oferece:

- **Vitrine Sensorial Bento Grid:** Disposição moderna dos produtos com fichas técnicas de orfebraria e história devocional de cada peça.
- **Configurador "Terço Sob Medida" (*Bespoke*):** Permite ao fiel ou colecionador customizar pedra natural, liga de metal, tamanho de contas, medalha devocional, crucifixo e gravação a laser com orçamento instantâneo em tempo real.
- **Fechamento e Atendimento via WhatsApp:** Envio automatizado de pedidos detalhados e estruturados direto para o WhatsApp oficial do ateliê.
- **Painel Administrativo Completo:** Gestão de acervo, ajuste ágil de preços, ativação/desativação de itens, customizador de opções e credenciais seguras.
- **Modo Híbrido Inteligente (Offline-First + Nuvem):** Opera perfeitamente apenas com `localStorage` do navegador e integra-se instantaneamente ao **Supabase (PostgreSQL + RLS)** para persistência multiusuário e backup.

---

## ✨ Funcionalidades

### 🏛️ Vitrine Pública & Acervo
- **Layout Equilibrado em Pares (2 a 2 no PC):** Disposição harmoniosa lado a lado de 2 em 2 peças no desktop e tablets, garantindo simetria perfeita mesmo ao adicionar novas peças.
- **Filtro por Categorias:** Navegação fluida entre *Pedras Naturais*, *Edição Imperial*, *Madeira Nobre*, *Noivas & Relicários* e *Artigos Sacros*.
- **Modal de Inspeção Detalhada:**
  - Imagens em alta definição com zoom sutil.
  - Especificações minuciosas: diâmetro das contas, material, peso em gramas, comprimento, banho de metal, entremeio e crucifixo.
  - História da devoção e significado espiritual.
  - Botão de atendimento direto no WhatsApp com mensagem personalizada referenciando o produto.

### 📿 Configurador Interativo "Terço Sob Medida" (Bespoke)
- Personalização de **6 etapas essenciais**:
  1. **Pedras Naturais:** Ônix Fosco, Lápis-Lazúli Afegão, Hematita Magnética, Quartzo Rosa, Madeira de Oliveira de Belém, etc.
  2. **Acabamento Metálico:** Ouro 18k Escovado, Prata Envelhecida 925, Ouro Nobre Rosé, Ródio Negro.
  3. **Calibre das Contas:** 8mm, 10mm ou 12mm.
  4. **Medalha Central / Entremeio:** São Bento, Nossa Senhora das Graças, Sagrado Coração, Relicário com Foto, etc.
  5. **Estilo do Crucifixo:** Barroco Forjado, Renascentista com Cristais, Minimalista Reto, São Bento Tradicional.
  6. **Gravação Personalizada:** Gravação opcional de nomes, datas ou jaculatórias no verso da cruz/medalha com cálculo automático do adicional.
- **Cálculo de Preço em Tempo Real:** Atualização dinâmica do valor total conforme cada escolha.
- **Checkout via WhatsApp:** Montagem automática de mensagem formatada contendo todas as especificações da encomenda pronta para envio.

### 🛡️ Painel Administrativo (`/admin` ou `#/admin`)
- **Autenticação Segura:** Sessão local com credenciais configuráveis e integração com **Supabase Auth**.
- **Gestão do Acervo (CRUD):**
  - Cadastro e edição completa de peças com formulário guiado.
  - Edição rápida de preços diretamente na listagem sem abrir modais.
  - Alternância imediata de visibilidade no catálogo público (`visível` / `oculto`).
  - Exclusão com confirmação de segurança.
- **Gerenciador de Opções do Configurador Sob Medida:**
  - Adição, edição de valores e deltas de preço (+R$), detalhes e exclusão de qualquer componente (pedras, metais, contas, medalhas e crucifixos).
- **Configurações Gerais da Marca:**
  - Nome da loja, slogan, número oficial do WhatsApp, perfil do Instagram e badge da hero.
  - Alteração da senha de acesso do administrador.
- **Hub de Conexão Supabase:**
  - Teste de conexão em tempo real com indicador visual.
  - Sincronização em lote do catálogo local para a nuvem.
  - Botão de restauração rápida para dados de demonstração (*Seed Data*).
  - Sincronização entre abas em tempo real via API `BroadcastChannel`.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) (v5.6) | Tipagem estática rigorosa para segurança e manutenção |
| **Framework UI** | [React 18](https://react.dev/) | Componentização reativa e hooks customizados |
| **Build Tool** | [Vite](https://vitejs.dev/) (v6.0) | Bundler ultrarrápido com Hot Module Replacement (HMR) |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) (v3.4) | Design system refinado com paleta de tons sacros e clássicos |
| **Animações** | [Framer Motion](https://www.framer.com/motion/) | Transições suaves, efeitos magnéticos e modais fluidos |
| **Ícones** | [Lucide React](https://lucide.dev/) | Conjunto de ícones vetoriais modernos |
| **Backend & Banco** | [Supabase](https://supabase.com/) | Banco PostgreSQL com Row Level Security (RLS) e client JS |
| **Hospedagem & SPA** | [Netlify](https://www.netlify.com/) | Configuração nativa de roteamento em `netlify.toml` e `_redirects` |

---

## 🎨 Paleta de Cores & Design System

A identidade visual do projeto foi desenvolvida para refletir a nobreza e pureza da alta joalheria sacra:

- **Marfim & Linho (`atelie-cream`):** `#FAF7F2` — Tom acolhedor e clássico para o fundo da aplicação.
- **Marrom Nobre (`atelie-brown`):** `#382013` e `#2A160C` — Tipografia com forte contraste, elegância e legibilidade.
- **Rosé & Blush (`atelie-rose`):** `#ECCBC0` e `#B86D5B` — Acentos refinados, botões e destaque visual suave.
- **Dourado & Luz:** Gradientes dourados acetinados com efeitos de brilho suave (*glow*).
- **Tipografias:**
  - `Cinzel`: Títulos majestosos e numerais clássicos.
  - `Cormorant Garamond`: Poesia e descrições devocionais.
  - `Plus Jakarta Sans`: Interface do usuário e dados de alta legibilidade.
  - `JetBrains Mono`: Especificações técnicas, gramaturas e dimensões.

---

## 📂 Estrutura do Projeto

```text
mimos-atelie/
├── public/
│   ├── _redirects               # Redirecionamento de rotas para deploy no Netlify
│   └── images/                  # Logotipo oficial e fotografias em alta resolução
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── BespokeOptionsManager.tsx   # Gestão de opções do terço sob medida
│   │   │   └── ProductFormModal.tsx        # Modal de criação/edição de produtos
│   │   ├── catalog/
│   │   │   ├── BentoProductCard.tsx        # Card Bento interativo do produto
│   │   │   ├── BespokeConfigurator.tsx     # Configurador interativo sob medida
│   │   │   ├── HeroSection.tsx             # Banner principal de boas-vindas
│   │   │   └── ProductInspectionModal.tsx  # Ficha técnica e história devocional
│   │   ├── layout/
│   │   │   ├── Footer.tsx                  # Rodapé institucional com link admin
│   │   │   ├── Navbar.tsx                  # Barra superior com logo e atalho WhatsApp
│   │   │   └── SacredGeometryBg.tsx        # Fundo vetorial com geometrias sacras
│   │   └── ui/
│   │       └── MagneticButton.tsx          # Botão com microinteração magnética
│   ├── context/
│   │   ├── AuthContext.tsx                 # Estado e lógica de autenticação admin
│   │   └── CatalogContext.tsx              # Gerenciador global de produtos e configurações
│   ├── pages/
│   │   ├── AdminDashboardPage.tsx          # Painel de controle completo
│   │   ├── AdminLoginPage.tsx              # Tela de login administrativo
│   │   └── PublicPortfolioPage.tsx         # Página pública da vitrine
│   ├── services/
│   │   ├── seedData.ts                     # Dados iniciais ricos de demonstração
│   │   └── supabaseService.ts              # Conexão híbrida e chamadas à API Supabase
│   ├── types/
│   │   └── index.ts                        # Interfaces TypeScript do domínio
│   ├── utils/
│   │   └── whatsapp.ts                     # Formatadores e geradores de links WhatsApp
│   ├── App.tsx                             # Roteamento e orquestração do layout
│   ├── index.css                           # Configurações globais e fontes
│   └── main.tsx                            # Ponto de entrada React
├── supabase/
│   └── schema.sql                          # Script DDL completo de tabelas e políticas RLS
├── .env.example                            # Modelo de variáveis de ambiente
├── netlify.toml                            # Configuração de build e redirects Netlify
├── tailwind.config.js                      # Configurações do tema e paleta de cores
├── tsconfig.json                           # Configuração do TypeScript
└── vite.config.ts                          # Configuração do bundler Vite
```

---

## 🚀 Guia de Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm` ou `yarn`

### 1. Clonar o Repositório
```bash
git clone https://github.com/IversonSantos-dev/mimos_atelie.git
cd mimos-atelie
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente (Opcional)
Copie o arquivo de exemplo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas informações:
```env
# Conexão Opcional do Supabase (Modo Híbrido)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
VITE_DEFAULT_WHATSAPP=5532988847689
```

> **Nota:** A aplicação funciona imediatamente em **modo local**, persistindo tudo no `localStorage` do navegador mesmo se nenhuma variável for configurada!

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Abra o navegador em `http://localhost:5173`.

### 5. Compilar para Produção
```bash
npm run build
```
Os arquivos otimizados serão gerados no diretório `dist/`.

Para testar o build localmente:
```bash
npm run preview
```

---

## 🔐 Painel Administrativo

Para acessar o painel administrativo:
1. Clique no link **"Acesso Administrativo"** no rodapé do site ou acesse diretamente pela rota `#/admin` (ex: `http://localhost:5173/#/admin`).
2. Utilize as credenciais padrão do administrador:
   - **E-mail:** `eversonpaiva87@gmail.com`
   - **Senha:** `Mimosatelie@2026`
3. Você pode alterar seu e-mail e senha a qualquer momento na aba **"Identidade & WhatsApp"** dentro do próprio painel.

---

## 🗄️ Configuração do Supabase

Caso deseje persistência centralizada na nuvem com PostgreSQL:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Acesse o **SQL Editor** do projeto.
3. Copie e cole todo o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
4. O script criará:
   - Tabela `store_settings` (identidade da marca, telefones, redes).
   - Tabela `products` (acervo de terços, especificações técnicas e visibilidade).
   - Tabela `bespoke_settings` (configurações das opções do terço sob medida).
   - Políticas de segurança **Row Level Security (RLS)** para leitura e gravação da aplicação.
5. Pegue a **Project URL** e a **Anon Key** no menu *Project Settings > API* do Supabase.
6. Insira-as no seu arquivo `.env` ou configure diretamente pela interface do painel em `/admin` > **Aba "Nuvem & Supabase"**.
7. Clique em **"Sincronizar Acervo Local com a Nuvem"** para migrar o catálogo instantaneamente.

---

## 🌐 Deploy em Produção

### Netlify
O projeto já inclui `netlify.toml` e `public/_redirects` configurados para aplicações Single Page Application (SPA):
1. Conecte seu repositório no [Netlify](https://www.netlify.com/).
2. Defina as configurações de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Adicione as variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DEFAULT_WHATSAPP`) nas configurações do site no Netlify.
4. Conclua o deploy.

---

## 🤝 Contribuição

Contribuições, sugestões e melhorias são sempre bem-vindas!
1. Faça um Fork do projeto.
2. Crie uma branch para a sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas alterações (`git commit -m 'feat: adicionar nova funcionalidade'`).
4. Envie para o branch remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request detalhado.

---

## 📜 Licença

Desenvolvido para **Mimos Ateliê**. Todos os direitos reservados.
Feito com amor, fé e dedicação artesanal.
