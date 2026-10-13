import { BespokeConfiguration, Product } from '../types';

/**
 * Remove caracteres não numéricos de um telefone, mantendo apenas dígitos.
 */
export function sanitizePhoneNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '5532988847689';
  return digits;
}

/**
 * Formata um número de WhatsApp para exibição amigável: +55 (32) 98884-7689
 */
export function formatPhoneDisplay(rawPhone: string): string {
  const digits = sanitizePhoneNumber(rawPhone);
  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const part1 = digits.slice(4, 9);
    const part2 = digits.slice(9);
    return `+55 (${ddd}) ${part1}-${part2}`;
  }
  return `+${digits}`;
}

/**
 * Gera exatamente a frase obrigatória solicitada pelo cliente:
 * "Oi, fiquei interessado no produto [Nome do Terço], gostaria de fazer uma encomenda."
 */
export function buildProductWhatsAppMessage(productName: string): string {
  return `Oi, fiquei interessado no produto ${productName.trim()}, gostaria de fazer uma encomenda.`;
}

/**
 * Gera a URL completa de redirecionamento para o WhatsApp (wa.me).
 * Caso o produto possua um link completo customizado ou número próprio, respeita o override.
 */
export function buildProductWhatsAppUrl(
  product: Pick<Product, 'name' | 'customWhatsapp'>,
  globalWhatsappNumber: string
): string {
  const message = buildProductWhatsAppMessage(product.name);
  const encodedMessage = encodeURIComponent(message);

  // Se o administrador cadastrou um link externo direto no produto
  if (
    product.customWhatsapp &&
    (product.customWhatsapp.startsWith('http://') || product.customWhatsapp.startsWith('https://'))
  ) {
    const hasQuery = product.customWhatsapp.includes('?');
    if (product.customWhatsapp.includes('text=')) {
      return product.customWhatsapp;
    }
    return `${product.customWhatsapp}${hasQuery ? '&' : '?'}text=${encodedMessage}`;
  }

  const targetPhone = sanitizePhoneNumber(
    product.customWhatsapp && product.customWhatsapp.trim().length > 0
      ? product.customWhatsapp
      : globalWhatsappNumber
  );

  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
}

/**
 * Gera o link de WhatsApp para o Configurador Bespoke (Encomenda Personalizada).
 */
export function buildBespokeWhatsAppUrl(
  config: BespokeConfiguration,
  estimatedTotal: number,
  globalWhatsappNumber: string
): string {
  const customProductName = `Terço Personalizado (${config.stone.name} ${config.beadSize.name} + ${config.metal.name} • ${config.devotionMedal.name}${
    config.customEngraving ? ` • Gravação: "${config.customEngraving}"` : ''
  } — Estimativa ${formatCurrencyBRL(estimatedTotal)})`;

  const message = buildProductWhatsAppMessage(customProductName);
  const targetPhone = sanitizePhoneNumber(globalWhatsappNumber);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Formata valores numéricos em Reais (R$)
 */
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
