export function bookingPrice(priceFrom: number, size: string): number {
  return priceFrom + (size === "Grande" ? 70000 : size === "Mediano" ? 30000 : 0);
}

export function depositFor(price: number): number {
  return Math.max(10000, Math.round((price * 0.2) / 1000) * 1000);
}
