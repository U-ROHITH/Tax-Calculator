'use client';

import { create } from 'zustand';
import { TaxInput, TaxResult, Country } from '@/engine/types';

interface CalculatorState {
  country: Country;
  input: Partial<TaxInput>;
  result: TaxResult | null;
  isCalculating: boolean;
  setCountry: (country: Country) => void;
  setInput: (input: Partial<TaxInput>) => void;
  setResult: (result: TaxResult | null) => void;
  setIsCalculating: (v: boolean) => void;
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  country: 'IN',
  input: {},
  result: null,
  isCalculating: false,
  setCountry: (country) => set({ country, input: {}, result: null }),
  setInput: (input) => set((state) => ({ input: { ...state.input, ...input } })),
  setResult: (result) => set({ result }),
  setIsCalculating: (isCalculating) => set({ isCalculating }),
  reset: () => set({ input: {}, result: null }),
}));
