import React, { useState } from 'react';
import {
  Gem,
  Sparkles,
  Shield,
  Cross,
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
} from 'lucide-react';
import { BespokeCustomizerSettings, BespokeOptionItem } from '../../types';
import { useCatalog } from '../../context/CatalogContext';
import { formatCurrencyBRL } from '../../utils/whatsapp';

type CategoryKey = 'stones' | 'metals' | 'beadSizes' | 'medals' | 'crucifixes';

interface CategoryMeta {
  key: CategoryKey;
  label: string;
  singular: string;
  icon: React.ElementType;
  description: string;
  exampleName: string;
  exampleDetail: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: 'stones',
    label: 'Pedras & Contas',
    singular: 'Pedra / Matéria-Prima',
    icon: Gem,
    description: 'Minerais nobres, madeiras sagradas e gemas naturais para as dezenas e mistérios.',
    exampleName: 'Ametista Roxa Imperial',
    exampleDetail: 'Lapidação facetada com reflexos violeta profundo',
  },
  {
    key: 'metals',
    label: 'Acabamentos Metálicos',
    singular: 'Acabamento Metálico',
    icon: Sparkles,
    description: 'Banhos e tratamentos dos metais, tulipas, correntes e elos de ligação.',
    exampleName: 'Ouro Branco 18k Rodinado',
    exampleDetail: 'Alto brilho com tripla camada e verniz antialérgico',
  },
  {
    key: 'beadSizes',
    label: 'Tamanhos das Contas',
    singular: 'Tamanho / Calibre',
    icon: Compass,
    description: 'Diâmetros das contas que definem o comprimento total e imponência da peça.',
    exampleName: '6mm',
    exampleDetail: 'Perfil ultra delicado para bolso ou noivas (aprox. 42cm)',
  },
  {
    key: 'medals',
    label: 'Entremeios & Medalhas',
    singular: 'Entremeio de Devoção',
    icon: Shield,
    description: 'Medalhas centrais, relicários e invocações de santos e Nossa Senhora.',
    exampleName: 'Nossa Senhora Aparecida',
    exampleDetail: 'Manto cravejado em relevo escultórico',
  },
  {
    key: 'crucifixes',
    label: 'Crucifixos & Cruzes',
    singular: 'Estilo de Crucifixo',
    icon: Cross,
    description: 'Cruzes principais de encerramento com design clássico ou contemporâneo.',
    exampleName: 'Crucifixo Gótico Esculpido',
    exampleDetail: 'Pátina manual com detalhes tridimensionais',
  },
];

interface OptionModalState {
  isOpen: boolean;
  category: CategoryKey;
  item: BespokeOptionItem | null; // null se criando nova
}

interface BespokeOptionsManagerProps {
  onShowToast: (msg: string) => void;
}

export const BespokeOptionsManager: React.FC<BespokeOptionsManagerProps> = ({ onShowToast }) => {
  const { bespokeSettings, updateBespokeSettings, resetBespokeSettings } = useCatalog();

  // Estado local do formulário para permitir edição antes de salvar
  const [formData, setFormData] = useState<BespokeCustomizerSettings>(bespokeSettings);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('stones');
  const [modalState, setModalState] = useState<OptionModalState>({
    isOpen: false,
    category: 'stones',
    item: null,
  });

  // Campos do modal de criação / edição de opção
  const [modalName, setModalName] = useState('');
  const [modalDetail, setModalDetail] = useState('');
  const [modalPriceDelta, setModalPriceDelta] = useState<number>(0);
  const [modalError, setModalError] = useState<string | null>(null);

  // Sincroniza o estado local quando os dados do contexto forem alterados remotamente
  React.useEffect(() => {
    setFormData(bespokeSettings);
  }, [bespokeSettings]);

  const activeMeta = CATEGORIES.find((c) => c.key === activeCategory)!;
  const currentOptionsList = formData[activeCategory];

  // Abertura do modal para Criar
  const handleOpenCreateModal = () => {
    setModalName('');
    setModalDetail('');
    setModalPriceDelta(0);
    setModalError(null);
    setModalState({
      isOpen: true,
      category: activeCategory,
      item: null,
    });
  };

  // Abertura do modal para Editar
  const handleOpenEditModal = (item: BespokeOptionItem) => {
    setModalName(item.name);
    setModalDetail(item.detail);
    setModalPriceDelta(item.priceDelta);
    setModalError(null);
    setModalState({
      isOpen: true,
      category: activeCategory,
      item,
    });
  };

  // Confirmação do modal de Opção
  const handleSaveOptionModal = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = modalName.trim();
    const trimmedDetail = modalDetail.trim();

    if (!trimmedName) {
      setModalError('O nome da opção é obrigatório.');
      return;
    }

    const { category, item } = modalState;
    let updatedList: BespokeOptionItem[];

    if (item) {
      // Editando existente
      updatedList = formData[category].map((opt) =>
        opt.id === item.id
          ? {
              ...opt,
              name: trimmedName,
              detail: trimmedDetail,
              priceDelta: Number(modalPriceDelta) || 0,
            }
          : opt
      );
    } else {
      // Criando nova
      const newOption: BespokeOptionItem = {
        id: `${category}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: trimmedName,
        detail: trimmedDetail,
        priceDelta: Number(modalPriceDelta) || 0,
      };
      updatedList = [...formData[category], newOption];
    }

    setFormData((prev) => ({
      ...prev,
      [category]: updatedList,
    }));

    setModalState({ isOpen: false, category: 'stones', item: null });
    onShowToast(
      item
        ? `Opção "${trimmedName}" atualizada na lista!`
        : `Nova opção "${trimmedName}" adicionada à categoria!`
    );
  };

  // Exclusão de Opção
  const handleDeleteOption = (item: BespokeOptionItem) => {
    if (formData[activeCategory].length <= 1) {
      alert(
        `A categoria deve conter pelo menos 1 opção disponível para os clientes configurarem o terço.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Tem certeza que deseja remover a opção "${item.name}" das escolhas de ${activeMeta.label}?`
    );
    if (!confirmed) return;

    setFormData((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].filter((opt) => opt.id !== item.id),
    }));

    onShowToast(`Opção "${item.name}" removida.`);
  };

  // Reordenação de opções (Mover para cima)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const list = [...formData[activeCategory]];
    const temp = list[index - 1];
    list[index - 1] = list[index];
    list[index] = temp;
    setFormData((prev) => ({ ...prev, [activeCategory]: list }));
  };

  // Reordenação de opções (Mover para baixo)
  const handleMoveDown = (index: number) => {
    if (index === formData[activeCategory].length - 1) return;
    const list = [...formData[activeCategory]];
    const temp = list[index + 1];
    list[index + 1] = list[index];
    list[index] = temp;
    setFormData((prev) => ({ ...prev, [activeCategory]: list }));
  };

  // Salvar tudo no contexto e persistência (localStorage + Supabase)
  const handleSaveAll = async () => {
    const { syncedCloud } = await updateBespokeSettings(formData);
    onShowToast(
      syncedCloud
        ? 'Todas as opções do Terço Sob Medida foram salvas e sincronizadas na nuvem Supabase!'
        : 'Opções do Terço Sob Medida salvas com sucesso em tempo real!'
    );
  };

  // Restaurar opções de fábrica
  const handleResetToDefaults = async () => {
    const confirmed = window.confirm(
      'Deseja restaurar todas as opções e valores padrão de fábrica do Ateliê Sob Medida?'
    );
    if (!confirmed) return;

    await resetBespokeSettings();
    onShowToast('Opções e valores originais do Sob Medida restaurados com sucesso!');
  };

  return (
    <div className="space-y-8">
      {/* Barra de Ação Superior & Status */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white border border-atelie-rose-300/80 p-6 shadow-atelie-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-atelie-rose-300 bg-atelie-rose-100/90 px-3 py-0.5">
            <Compass className="h-3.5 w-3.5 text-atelie-rose-700" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-atelie-rose-800">
              Personalização de Terços Sob Medida
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-atelie-brown-900">
            Gerenciador do Configurador Interativo
          </h2>
          <p className="text-xs text-atelie-brown-600">
            Edite pedras, acabamentos metálicos, calibres, medalhas e crucifixos. Altere preços
            adicionais ou adicione materiais exclusivos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-2 rounded-xl border border-atelie-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-atelie-brown-700 hover:border-atelie-rose-400 hover:text-atelie-rose-800 shadow-2xs"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Restaurar Padrões</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow hover:brightness-105"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Todas as Opções</span>
          </button>
        </div>
      </div>

      {/* 1. Card de Parâmetros Gerais do Terço Sob Medida */}
      <div className="rounded-3xl bg-white border border-atelie-rose-300/80 p-6 sm:p-8 shadow-sm">
        <h3 className="font-display text-lg font-bold text-atelie-brown-900">
          Configurações Globais do Configurador
        </h3>
        <p className="mt-1 text-xs text-atelie-brown-600">
          Defina o valor inicial base, visibilidade pública e gravação personalizada.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Toggle de Ativação no Site */}
          <div className="rounded-2xl border border-atelie-rose-200 bg-atelie-cream-100/60 p-4">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-600">
              Disponibilidade
            </span>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-atelie-brown-800">
                {formData.enabled ? 'Ativo no Site' : 'Pausado / Oculto'}
              </span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="h-6 w-11 rounded-full bg-slate-300 peer-focus:outline-none peer-checked:bg-atelie-rose-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <p className="mt-2 text-[11px] text-atelie-brown-500">
              Quando desativado, o configurador fica oculto aos visitantes.
            </p>
          </div>

          {/* Preço Base Inicial */}
          <div className="rounded-2xl border border-atelie-rose-200 bg-atelie-cream-100/60 p-4">
            <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-600">
              Preço Base do Terço (R$)
            </label>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-2.5 font-mono text-xs font-bold text-atelie-rose-700">
                R$
              </span>
              <input
                type="number"
                min={0}
                step="1"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    basePrice: Math.max(0, Number(e.target.value) || 0),
                  }))
                }
                className="w-full rounded-xl border border-atelie-rose-300 bg-white pl-9 pr-3 py-2 font-mono text-sm font-bold text-atelie-brown-900 focus:border-atelie-rose-500 focus:outline-none"
              />
            </div>
            <p className="mt-2 text-[11px] text-atelie-brown-500">
              Valor de partida ao qual somam-se as variações de cada componente.
            </p>
          </div>

          {/* Gravação Opcional: Ativação */}
          <div className="rounded-2xl border border-atelie-rose-200 bg-atelie-cream-100/60 p-4">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-600">
              Gravação de Iniciais / Data
            </span>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-atelie-brown-800">
                {formData.engravingEnabled ? 'Disponível' : 'Desativada'}
              </span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={formData.engravingEnabled}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, engravingEnabled: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="h-6 w-11 rounded-full bg-slate-300 peer-focus:outline-none peer-checked:bg-atelie-rose-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <p className="mt-2 text-[11px] text-atelie-brown-500">
              Permite ao cliente inserir texto para personalização.
            </p>
          </div>

          {/* Preço da Gravação */}
          <div className="rounded-2xl border border-atelie-rose-200 bg-atelie-cream-100/60 p-4">
            <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-600">
              Valor Adicional da Gravação (R$)
            </label>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-2.5 font-mono text-xs font-bold text-atelie-rose-700">
                R$
              </span>
              <input
                type="number"
                min={0}
                step="1"
                disabled={!formData.engravingEnabled}
                value={formData.engravingPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    engravingPrice: Math.max(0, Number(e.target.value) || 0),
                  }))
                }
                className="w-full rounded-xl border border-atelie-rose-300 bg-white pl-9 pr-3 py-2 font-mono text-sm font-bold text-atelie-brown-900 disabled:opacity-50 focus:border-atelie-rose-500 focus:outline-none"
              />
            </div>
            <p className="mt-2 text-[11px] text-atelie-brown-500">
              Cobrado apenas se o cliente preencher o campo de gravação.
            </p>
          </div>
        </div>

        {/* Título e Subtítulo customizáveis */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-xs uppercase font-semibold text-atelie-brown-700">
              Título da Seção Sob Medida
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Projete Seu Terço Exclusivo"
              className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 text-sm text-atelie-brown-900 focus:border-atelie-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-semibold text-atelie-brown-700">
              Badge Superior
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
              placeholder="ATELIÊ SOB MEDIDA • ENCOMENDA PERSONALIZADA"
              className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 font-mono text-xs text-atelie-rose-800 font-bold focus:border-atelie-rose-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Seleção de Categoria de Opções & Gestão */}
      <div className="rounded-3xl bg-white border border-atelie-rose-300/80 shadow-sm overflow-hidden">
        {/* Barra de Abas das 5 Categorias */}
        <div className="flex overflow-x-auto border-b border-atelie-rose-200 bg-atelie-cream-100/80 p-2 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            const count = formData[cat.key].length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 text-white shadow-gold-glow'
                    : 'text-atelie-brown-700 hover:bg-white hover:text-atelie-brown-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'border border-atelie-rose-300 bg-atelie-rose-100 text-atelie-rose-800'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cabeçalho da Categoria Ativa */}
        <div className="p-6 sm:p-8 border-b border-atelie-rose-200/80 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <activeMeta.icon className="h-5 w-5 text-atelie-rose-700" />
              <h3 className="font-display text-xl font-bold text-atelie-brown-900">
                Opções de {activeMeta.label}
              </h3>
            </div>
            <p className="mt-1 text-xs text-atelie-brown-600 max-w-2xl">
              {activeMeta.description}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow hover:brightness-105 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar {activeMeta.singular}</span>
          </button>
        </div>

        {/* Lista de Opções da Categoria */}
        <div className="divide-y divide-atelie-rose-100">
          {currentOptionsList.length === 0 ? (
            <div className="p-12 text-center text-atelie-brown-500">
              <AlertCircle className="mx-auto h-8 w-8 text-atelie-rose-400" />
              <p className="mt-2 text-sm font-semibold">Nenhuma opção cadastrada nesta categoria.</p>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="mt-3 text-xs font-bold text-atelie-rose-700 underline"
              >
                Clique aqui para cadastrar a primeira opção
              </button>
            </div>
          ) : (
            currentOptionsList.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === currentOptionsList.length - 1;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-atelie-cream-100/50 transition gap-4"
                >
                  {/* Informações da Opção */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Botões de Reordenação */}
                    <div className="flex flex-col gap-1 shrink-0 pt-0.5 sm:pt-0">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMoveUp(index)}
                        title="Mover para cima"
                        className="rounded p-1 text-atelie-brown-400 hover:text-atelie-brown-900 disabled:opacity-20 hover:bg-atelie-rose-100"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMoveDown(index)}
                        title="Mover para baixo"
                        className="rounded p-1 text-atelie-brown-400 hover:text-atelie-brown-900 disabled:opacity-20 hover:bg-atelie-rose-100"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-sm text-atelie-brown-900">
                          {item.name}
                        </span>
                        {/* Variação de Preço */}
                        {item.priceDelta > 0 && (
                          <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800">
                            +{formatCurrencyBRL(item.priceDelta)}
                          </span>
                        )}
                        {item.priceDelta < 0 && (
                          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                            -{formatCurrencyBRL(Math.abs(item.priceDelta))}
                          </span>
                        )}
                        {item.priceDelta === 0 && (
                          <span className="rounded-full border border-atelie-rose-200 bg-atelie-cream-200 px-2 py-0.5 font-mono text-[10px] font-bold text-atelie-brown-600">
                            Preço Base (R$ 0)
                          </span>
                        )}
                      </div>
                      {item.detail && (
                        <p className="mt-0.5 text-xs text-atelie-brown-600">{item.detail}</p>
                      )}
                    </div>
                  </div>

                  {/* Ações da Opção */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-atelie-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-atelie-brown-700 hover:border-atelie-rose-400 hover:text-atelie-rose-800 shadow-2xs"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteOption(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-atelie-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-atelie-brown-700 hover:border-red-300 hover:text-red-700 shadow-2xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé com botão de salvar */}
        <div className="p-4 sm:p-6 border-t border-atelie-rose-200 bg-atelie-cream-100/50 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-atelie-brown-600">
            Total de {currentOptionsList.length} opções configuradas nesta categoria.
          </span>

          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow hover:brightness-105"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Todas as Opções</span>
          </button>
        </div>
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE OPÇÃO */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-atelie-rose-300 shadow-2xl p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setModalState({ isOpen: false, category: 'stones', item: null })}
              className="absolute top-5 right-5 rounded-full p-2 text-atelie-brown-400 hover:bg-atelie-rose-100 hover:text-atelie-brown-800 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 text-atelie-rose-700">
              <activeMeta.icon className="h-5 w-5" />
              <h3 className="font-display text-xl font-bold text-atelie-brown-900">
                {modalState.item ? 'Editar Opção' : `Nova Opção de ${activeMeta.singular}`}
              </h3>
            </div>
            <p className="mt-1 text-xs text-atelie-brown-600">
              Preencha os dados da opção que aparecerá no configurador interativo para os clientes.
            </p>

            <form onSubmit={handleSaveOptionModal} className="mt-6 space-y-4">
              {modalError && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Nome da Opção */}
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-atelie-brown-700">
                  Nome da Opção *
                </label>
                <input
                  type="text"
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder={`Ex: ${activeMeta.exampleName}`}
                  className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-atelie-brown-900 focus:border-atelie-rose-500 focus:outline-none"
                />
              </div>

              {/* Detalhe / Subtítulo */}
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-atelie-brown-700">
                  Detalhe / Subtítulo Explicativo
                </label>
                <input
                  type="text"
                  value={modalDetail}
                  onChange={(e) => setModalDetail(e.target.value)}
                  placeholder={`Ex: ${activeMeta.exampleDetail}`}
                  className="mt-1.5 w-full rounded-xl border border-atelie-rose-300 bg-white px-3.5 py-2.5 text-xs text-atelie-brown-800 focus:border-atelie-rose-500 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-atelie-brown-500">
                  Breve descrição da virtude, qualidade ou acabamento deste item.
                </p>
              </div>

              {/* Variação de Preço (R$) */}
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-atelie-brown-700">
                  Variação de Preço (R$)
                </label>
                <div className="mt-1.5 relative">
                  <span className="absolute left-3.5 top-2.5 font-mono text-xs font-bold text-atelie-rose-700">
                    R$
                  </span>
                  <input
                    type="number"
                    step="1"
                    value={modalPriceDelta}
                    onChange={(e) => setModalPriceDelta(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full rounded-xl border border-atelie-rose-300 bg-white pl-10 pr-3.5 py-2.5 font-mono text-sm font-bold text-atelie-brown-900 focus:border-atelie-rose-500 focus:outline-none"
                  />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-atelie-brown-500">
                  <span>Dica: Use <strong>0</strong> para preço padrão base;</span>
                  <span>Use valores positivos (ex: <strong>80</strong>) para acréscimo;</span>
                  <span>Use valores negativos (ex: <strong>-20</strong>) para desconto.</span>
                </div>
              </div>

              {/* Pré-visualização do Botão como aparecerá no site */}
              <div className="rounded-2xl border border-atelie-rose-200 bg-atelie-cream-100/70 p-4">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-atelie-brown-500">
                  Pré-visualização do Botão no Site
                </span>
                <div className="mt-2.5 flex items-start justify-between rounded-xl border border-atelie-rose-500 bg-atelie-rose-100/90 p-3 shadow-xs">
                  <div>
                    <p className="text-xs font-bold text-atelie-brown-900">
                      {modalName || 'Nome da Opção'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-atelie-brown-600">
                      {modalDetail || 'Detalhe ou subtítulo explicativo'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {modalPriceDelta > 0 && (
                      <span className="font-mono text-[11px] font-bold text-atelie-rose-800">
                        +{formatCurrencyBRL(modalPriceDelta)}
                      </span>
                    )}
                    {modalPriceDelta < 0 && (
                      <span className="font-mono text-[11px] font-bold text-emerald-700">
                        -{formatCurrencyBRL(Math.abs(modalPriceDelta))}
                      </span>
                    )}
                    {modalPriceDelta === 0 && (
                      <span className="font-mono text-[10px] text-atelie-brown-500">Base</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalState({ isOpen: false, category: 'stones', item: null })}
                  className="rounded-xl border border-atelie-rose-300 bg-white px-4 py-2.5 text-xs font-semibold text-atelie-brown-700 hover:bg-atelie-cream-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-gold-glow hover:brightness-105"
                >
                  {modalState.item ? 'Atualizar Opção' : 'Adicionar Opção'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
