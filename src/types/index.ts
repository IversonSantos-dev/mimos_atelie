export type BentoSize = 'featured' | 'wide' | 'tall' | 'standard';

export type ProductCategory =
  | 'Todos'
  | 'Pedras Naturais'
  | 'Edição Imperial'
  | 'Madeira Nobre'
  | 'Noivas & Relicários'
  | 'Artigos Sacros';

export interface TechnicalSpecs {
  beadMaterial: string;      // Ex: "Ônix Preto Fosco Natural"
  metalFinish: string;       // Ex: "Ouro 18k Escovado sobre Latão Nobre"
  beadSizeMm: string;        // Ex: "10mm"
  weightGrams: string;       // Ex: "74g"
  lengthCm: string;          // Ex: "52cm"
  centerpiece: string;       // Ex: "Medalha de São Bento Dupla Face"
  crucifix: string;          // Ex: "Crucifixo Barroco Forjado"
  patronSaint: string;       // Ex: "São Bento de Núrsia"
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<ProductCategory, 'Todos'>;
  description: string;
  devotionHistory: string;
  price: number;
  imageUrl: string;
  bentoSize: BentoSize;
  visible: boolean;
  badge?: string;
  customWhatsapp?: string; // Opcional: número ou link específico do produto
  specs: TechnicalSpecs;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSettings {
  brandName: string;
  brandTagline: string;
  whatsappNumber: string; // Ex: "5532988847689"
  instagramHandle: string;
  heroBadge: string;
}

export interface SupabaseConnectionConfig {
  url: string;
  anonKey: string;
  enabled: boolean;
}

export interface BespokeOptionItem {
  id: string;
  name: string;
  detail: string;
  priceDelta: number;
}

export interface BespokeCustomizerSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  badge: string;
  basePrice: number;
  engravingPrice: number;
  engravingEnabled: boolean;
  stones: BespokeOptionItem[];
  metals: BespokeOptionItem[];
  beadSizes: BespokeOptionItem[];
  medals: BespokeOptionItem[];
  crucifixes: BespokeOptionItem[];
}

export interface BespokeConfiguration {
  stone: BespokeOptionItem;
  metal: BespokeOptionItem;
  beadSize: BespokeOptionItem;
  devotionMedal: BespokeOptionItem;
  crucifixStyle: BespokeOptionItem;
  customEngraving: string;
}
