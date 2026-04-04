import { TaxBracket, BracketDetail } from './types';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateBracketTax(income: number, brackets: TaxBracket[]): { totalTax: number; details: BracketDetail[]; marginalRate: number } {
  let totalTax = 0;
  const details: BracketDetail[] = [];
  let marginalRate = 0;

  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const upper = bracket.max === null ? income : Math.min(income, bracket.max);
    const taxableInThisBracket = upper - bracket.min;
    const taxInThisBracket = taxableInThisBracket * bracket.rate;
    totalTax += taxInThisBracket;
    marginalRate = bracket.rate;
    details.push({ bracket, taxableInThisBracket, taxInThisBracket });
  }

  return { totalTax, details, marginalRate };
}

export function formatCurrency(amount: number, currency: 'INR' | 'USD' | 'GBP'): string {
  const rounded = Math.round(amount);
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rounded);
  }
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rounded);
  }
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(rounded);
}

export function roundTo(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
