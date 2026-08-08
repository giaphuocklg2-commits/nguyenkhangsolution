export const VAT_RATE = 0.1;
export const VAT_PERCENT = VAT_RATE * 100;

/**
 * Product prices stored by the admin are VAT-exclusive. Customer-facing prices
 * and order item snapshots are rounded to whole VND after VAT is applied.
 */
export function addVat(price: number): number {
  return Math.round(price * (1 + VAT_RATE));
}

/**
 * Converts a customer-facing (VAT-inclusive) filter value back to the stored
 * VAT-exclusive value.
 */
export function removeVat(priceWithVat: number): number {
  return priceWithVat / (1 + VAT_RATE);
}
