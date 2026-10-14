import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Check,
  MessageCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { BentoSize, Product, ProductCategory } from '../../types';
import { uploadProductImage, processUploadedImageFile } from '../../services/supabaseService';
import { buildProductWhatsAppMessage, buildProductWhatsAppUrl } from '../../utils/whatsapp';

interface ProductFormModalProps {
  initialProduct?: Product | null;
  globalWhatsapp: string;
  onSave: (product: Product) => Promise<void>;
  onClose: () => void;
}

const CATEGORIES: Exclude<ProductCategory, 'Todos'>[] = [
  'Edição Imperial',
  'Pedras Naturais',
  'Madeira Nobre',
  'Noivas & Relicários',
  'Artigos Sacros',
];

const BENTO_SIZES: { value: BentoSize; label: string; desc: string }[] = [
  { value: 'featured', label: 'Destaque Imperial (2x2)', desc: 'Card amplo principal no Bento Grid' },
  { value: 'wide', label: 'Panorâmico (2x1)', desc: 'Card horizontal largo' },
  { value: 'standard', label: 'Clássico (1x1)', desc: 'Proporção equilibrada padrão' },
  { value: 'tall', label: 'Vertical (1x2)', desc: 'Card vertical alongado' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  initialProduct,
  globalWhatsapp,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(initialProduct);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(initialProduct?.name || '');
  const [subtitle, setSubtitle] = useState(
    initialProduct?.subtitle || 'Série Artesanal • Mimos Ateliê'
  );
  const [category, setCategory] = useState<Exclude<ProductCategory, 'Todos'>>(
    initialProduct?.category || 'Pedras Naturais'
  );
  const [price, setPrice] = useState<string>(
    initialProduct ? String(initialProduct.price) : '389.00'
  );
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [devotionHistory, setDevotionHistory] = useState(
    initialProduct?.devotionHistory || ''
  );
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imageUrl || '/images/rosary-obsidian-gold.jpg'
  );
  const [bentoSize, setBentoSize] = useState<BentoSize>(
    initialProduct?.bentoSize || 'standard'
  );
  const [visible, setVisible] = useState<boolean>(
    initialProduct ? initialProduct.visible : true
  );
  const [badge, setBadge] = useState(initialProduct?.badge || 'FEITO À MÃO');
  const [customWhatsapp, setCustomWhatsapp] = useState(
    initialProduct?.customWhatsapp || ''
  );

  // Especificações Técnicas
  const [beadMaterial, setBeadMaterial] = useState(
    initialProduct?.specs.beadMaterial || 'Pedras Naturais Calibradas'
  );
  const [metalFinish, setMetalFinish] = useState(
    initialProduct?.specs.metalFinish || 'Banho de Ouro 18k Escovado'
  );
  const [beadSizeMm, setBeadSizeMm] = useState(initialProduct?.specs.beadSizeMm || '10mm');
  const [weightGrams, setWeightGrams] = useState(
    initialProduct?.specs.weightGrams || '72g'
  );
  const [lengthCm, setLengthCm] = useState(initialProduct?.specs.lengthCm || '52cm');
  const [centerpiece, setCenterpiece] = useState(
    initialProduct?.specs.centerpiece || 'Medalha Sacra Cunhada em Alto-Relevo'
  );
  const [crucifix, setCrucifix] = useState(
    initialProduct?.specs.crucifix || 'Crucifixo Barroco Forjado'
  );
  const [patronSaint, setPatronSaint] = useState(
    initialProduct?.specs.patronSaint || 'São Bento'
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      setImageUrl(uploadedUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao processar e enviar imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    const parsedPrice = Number(String(price).replace(',', '.')) || 0;

    const productPayload: Product = {
      id:
        initialProduct?.id ||
        `terco-${name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      subtitle: subtitle.trim(),
      category,
      description: description.trim(),
      devotionHistory: devotionHistory.trim(),
      price: parsedPrice,
      imageUrl: imageUrl.trim() || '/images/rosary-obsidian-gold.jpg',
      bentoSize,
      visible,
      badge: badge.trim() || undefined,
      customWhatsapp: customWhatsapp.trim() || undefined,
      specs: {
        beadMaterial: beadMaterial.trim(),
        metalFinish: metalFinish.trim(),
        beadSizeMm: beadSizeMm.trim(),
        weightGrams: weightGrams.trim(),
        lengthCm: lengthCm.trim(),
        centerpiece: centerpiece.trim(),
        crucifix: crucifix.trim(),
        patronSaint: patronSaint.trim(),
      },
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(productPayload);
    setIsSaving(false);
    onClose();
  };

  const previewWhatsappMessage = buildProductWhatsAppMessage(
    name || 'Nome do Terço'
  );
  const previewWhatsappLink = buildProductWhatsAppUrl(
    { name: name || 'Nome do Terço', customWhatsapp },
    globalWhatsapp
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#382013]/60 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative my-auto w-full max-w-4xl rounded-3xl bg-white border border-[#ECCBC0] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-[#382013]"
        >
          {/* Cabeçalho do Modal */}
          <div className="flex items-center justify-between border-b border-[#ECCBC0]/40 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-[#B86D5B]" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#382013]">
                {isEditing ? 'Editar Peça do Acervo' : 'Cadastrar Novo Terço ou Artigo Sacro'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#DFB2A3]/50 bg-[#FAF7F2] p-2 text-[#7A4B3A] hover:border-[#B86D5B] hover:text-[#382013]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Dados Principais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
              <div className="sm:col-span-8">
                <label className="block font-mono text-xs uppercase tracking-wider text-[#7A4B3A]">
                  Nome do Terço / Peça *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Terço Imperial São Bento em Ônix & Ouro 18k"
                  className="mt-1.5 w-full rounded-xl border border-[#DFB2A3]/60 bg-[#FAF7F2]/60 px-4 py-2.5 text-sm text-[#382013] placeholder-[#A88B7D] focus:border-[#B86D5B] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block font-mono text-xs uppercase tracking-wider text-[#7A4B3A]">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#DFB2A3]/60 bg-[#FAF7F2]/60 px-4 py-2.5 font-mono text-sm font-bold text-[#B86D5B] focus:border-[#B86D5B] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block font-mono text-xs uppercase tracking-wider text-[#7A4B3A]">
                  Coleção / Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Exclude<ProductCategory, 'Todos'>)
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#DFB2A3]/60 bg-[#FAF7F2]/60 px-3.5 py-2.5 text-sm text-[#382013] focus:border-[#B86D5B] focus:bg-white focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block font-mono text-xs uppercase tracking-wider text-[#7A4B3A]">
                  Subtítulo Editorial
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ex: Série Assinatura • Proteção"
                  className="mt-1.5 w-full rounded-xl border border-[#DFB2A3]/60 bg-[#FAF7F2]/60 px-3.5 py-2.5 text-sm text-[#382013] placeholder-[#A88B7D] focus:border-[#B86D5B] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block font-mono text-xs uppercase tracking-wider text-[#7A4B3A]">
                  Selo / Badge de Destaque
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ex: EDIÇÃO LIMITADA"
                  className="mt-1.5 w-full rounded-xl border border-[#DFB2A3]/60 bg-[#FAF7F2]/60 px-3.5 py-2.5 font-mono text-xs text-[#B86D5B] font-semibold focus:border-[#B86D5B] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Imagem da Peça: URL Externa OU Upload do Dispositivo */}
            <div className="rounded-2xl border border-[#ECCBC0] bg-[#FAF7F2]/70 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="font-mono text-xs font-semibold uppercase tracking-wider text-[#382013] flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#B86D5B]" />
                  <span>Fotografia da Peça (URL ou Upload do Computador/Celular)</span>
                </label>

                <div className="inline-flex rounded-xl border border-[#DFB2A3]/40 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      imageMode === 'url'
                        ? 'bg-[#382013] text-white font-semibold'
                        : 'text-[#7A4B3A] hover:text-[#382013]'
                    }`}
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span>Colar URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      imageMode === 'upload'
                        ? 'bg-[#382013] text-white font-semibold'
                        : 'text-[#7A4B3A] hover:text-[#382013]'
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Enviar Arquivo</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12 items-center">
                <div className="sm:col-span-8 space-y-3">
                  {imageMode === 'url' ? (
                    <div>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Cole o link da foto (https://...) ou escolha uma foto abaixo"
                        className="w-full rounded-xl border border-[#DFB2A3]/60 bg-white px-4 py-2.5 font-mono text-xs text-[#382013] placeholder-[#A88B7D] focus:border-[#B86D5B] focus:outline-none"
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {[
                          { label: 'Ônix & Ouro', path: '/images/rosary-obsidian-gold.jpg' },
                          { label: 'Madrepérola', path: '/images/rosary-imperial-pearl.jpg' },
                          { label: 'Lápis-Lazúli', path: '/images/rosary-lapis-lazuli.jpg' },
                          { label: 'Oliveira', path: '/images/rosary-olive-wood.jpg' },
                          { label: 'Granada', path: '/images/rosary-garnet-reliquary.jpg' },
                          { label: 'Hematita', path: '/images/rosary-gold-hematite.jpg' },
                        ].map((preset) => (
                          <button
                            key={preset.path}
                            type="button"
                            onClick={() => setImageUrl(preset.path)}
                            className="rounded-lg border border-[#DFB2A3]/40 bg-white px-2.5 py-1 font-mono text-[10px] text-[#7A4B3A] hover:border-[#B86D5B] hover:text-[#382013]"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#B86D5B]/40 bg-white/70 p-5 text-center transition hover:border-[#B86D5B] hover:bg-white"
                      >
                        <Upload className="h-6 w-6 text-[#B86D5B]" />
                        <span className="text-xs font-medium text-[#382013]">
                          {isUploading
                            ? 'Otimizando imagem em alta resolução...'
                            : 'Clique para selecionar uma foto do seu computador ou celular'}
                        </span>
                        <span className="font-mono text-[10px] text-[#7A4B3A]">
                          JPG, PNG ou WEBP • Compressão inteligente automática
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Preview da Imagem */}
                <div className="sm:col-span-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#ECCBC0] bg-white shadow-sm">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/rosary-obsidian-gold.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição e História Devocional */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#7A4B3A]">
                  Descrição Técnica e Visual *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva os materiais, pedras naturais, acabamento e diferenciais da peça..."
                  className="mt-1.5 w-full rounded-xl border border-[#DFB2A3]/60 bg-[#FAF7F2]/60 p-3 text-sm text-[#382013] placeholder-[#A88B7D] focus:border-[#B86D5B] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#7A4B3A]">
                  História / Simbolismo Devocional (Modal de Inspeção)
                </label>
                <textarea
                  rows={3}
                  value={devotionHistory}
                  onChange={(e) => setDevotionHistory(e.target.value)}
                  placeholder="História espiritual ou inspiração sacra exibida no modal de inspeção..."
                  className="mt-1.5 w-full rounded-xl border border-[#DFB2A3]/60 bg-[#FAF7F2]/60 p-3 text-sm text-[#382013] placeholder-[#A88B7D] focus:border-[#B86D5B] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Ficha Técnica Estruturada */}
            <div className="rounded-2xl border border-[#ECCBC0]/70 bg-[#FAF7F2]/70 p-4 sm:p-5">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#382013] mb-3">
                Ficha Técnica da Joia Sacra
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase text-[#7A4B3A]">
                    Material das Contas / Pedra
                  </label>
                  <input
                    type="text"
                    value={beadMaterial}
                    onChange={(e) => setBeadMaterial(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFB2A3]/60 bg-white px-3 py-2 text-xs text-[#382013]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase text-[#7A4B3A]">
                    Acabamento Metálico
                  </label>
                  <input
                    type="text"
                    value={metalFinish}
                    onChange={(e) => setMetalFinish(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFB2A3]/60 bg-white px-3 py-2 text-xs text-[#382013]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#7A4B3A]">
                    Tamanho (mm)
                  </label>
                  <input
                    type="text"
                    value={beadSizeMm}
                    onChange={(e) => setBeadSizeMm(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFB2A3]/60 bg-white px-3 py-2 font-mono text-xs text-[#382013]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#7A4B3A]">
                    Peso (g)
                  </label>
                  <input
                    type="text"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFB2A3]/60 bg-white px-3 py-2 font-mono text-xs text-[#382013]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#7A4B3A]">
                    Comprimento (cm)
                  </label>
                  <input
                    type="text"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFB2A3]/60 bg-white px-3 py-2 font-mono text-xs text-[#382013]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#7A4B3A]">
                    Devoção / Padroeiro
                  </label>
                  <input
                    type="text"
                    value={patronSaint}
                    onChange={(e) => setPatronSaint(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFB2A3]/60 bg-white px-3 py-2 text-xs text-[#382013]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase text-[#7A4B3A]">
                    Entremeio / Medalha Central
                  </label>
                  <input
                    type="text"
                    value={centerpiece}
                    onChange={(e) => setCenterpiece(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFB2A3]/60 bg-white px-3 py-2 text-xs text-[#382013]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase text-[#7A4B3A]">
                    Crucifixo
                  </label>
                  <input
                    type="text"
                    value={crucifix}
                    onChange={(e) => setCrucifix(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFB2A3]/60 bg-white px-3 py-2 text-xs text-[#382013]"
                  />
                </div>
              </div>
            </div>

            {/* Formato no Bento Grid + Configuração do WhatsApp */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#ECCBC0]/70 bg-[#FAF7F2]/70 p-4">
                <label className="block font-mono text-xs font-semibold uppercase text-[#382013] mb-2">
                  Proporção no Bento Grid
                </label>
                <div className="space-y-2">
                  {BENTO_SIZES.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setBentoSize(b.value)}
                      className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition ${
                        bentoSize === b.value
                          ? 'border-[#B86D5B] bg-[#ECCBC0]/30 shadow-sm'
                          : 'border-[#DFB2A3]/40 bg-white hover:border-[#B86D5B]'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-semibold text-[#382013]">
                          {b.label}
                        </span>
                        <span className="block text-[10px] text-[#7A4B3A]">{b.desc}</span>
                      </div>
                      {bentoSize === b.value && (
                        <Check className="h-4 w-4 text-[#B86D5B] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#ECCBC0]/70 bg-[#FAF7F2]/70 p-4 flex flex-col justify-between">
                <div>
                  <label className="block font-mono text-xs font-semibold uppercase text-[#382013]">
                    WhatsApp Específico (Opcional)
                  </label>
                  <p className="mt-1 text-[11px] text-[#7A4B3A]">
                    Deixe em branco para usar o WhatsApp global do Mimos Ateliê (
                    <span className="font-mono text-[#B86D5B] font-bold">+{globalWhatsapp}</span>) ou informe outro número/link.
                  </p>
                  <input
                    type="text"
                    value={customWhatsapp}
                    onChange={(e) => setCustomWhatsapp(e.target.value)}
                    placeholder={`Padrão global: ${globalWhatsapp}`}
                    className="mt-2.5 w-full rounded-xl border border-[#DFB2A3]/60 bg-white px-3.5 py-2 font-mono text-xs text-[#382013]"
                  />

                  <div className="mt-3 rounded-xl border border-[#ECCBC0] bg-[#ECCBC0]/20 p-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-[#382013] font-semibold">
                      <MessageCircle className="h-3.5 w-3.5 text-[#B86D5B]" />
                      <span>Preview da Mensagem Dinâmica:</span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-[#382013] italic">
                      “{previewWhatsappMessage}”
                    </p>
                    <a
                      href={previewWhatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-mono text-[10px] text-[#B86D5B] font-semibold underline hover:text-[#7A4B3A]"
                    >
                      Testar link do WhatsApp desta peça →
                    </a>
                  </div>
                </div>

                <label className="mt-4 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DFB2A3] text-[#B86D5B] focus:ring-[#B86D5B]"
                  />
                  <span className="text-xs font-medium text-[#382013]">
                    Exibir imediatamente no catálogo público
                  </span>
                </label>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-end gap-3 border-t border-[#ECCBC0]/40 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#DFB2A3]/60 bg-[#FAF7F2] px-5 py-2.5 text-xs font-medium text-[#7A4B3A] hover:border-[#B86D5B] hover:text-[#382013]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B86D5B] via-[#A85846] to-[#7A4B3A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:brightness-105 transition"
              >
                <Check className="h-4 w-4" />
                <span>{isSaving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Terço'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
