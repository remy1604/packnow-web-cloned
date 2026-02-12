'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type UnitSystem = 'imperial' | 'metric';

interface UnitContextValue {
  unit: UnitSystem;
  setUnit: (u: UnitSystem) => void;
}

const UnitContext = createContext<UnitContextValue>({
  unit: 'metric',
  setUnit: () => {},
});

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  return <UnitContext.Provider value={{ unit, setUnit }}>{children}</UnitContext.Provider>;
}

export function useUnit() {
  return useContext(UnitContext);
}

export function mmToInch(mm: number): string {
  const inches = mm / 25.4;
  const whole = Math.floor(inches);
  const frac = inches - whole;
  if (frac < 0.0625) return `${whole}`;
  if (Math.abs(frac - 0.25) < 0.06) return whole > 0 ? `${whole} 1/4` : '1/4';
  if (Math.abs(frac - 0.5) < 0.06) return whole > 0 ? `${whole} 1/2` : '1/2';
  if (Math.abs(frac - 0.75) < 0.06) return whole > 0 ? `${whole} 3/4` : '3/4';
  return inches.toFixed(1);
}

export function mmToInchDecimal(mm: number): number {
  return Math.round((mm / 25.4) * 100) / 100;
}

export function formatDimensions(w: number, h: number, g: number, system: UnitSystem): string {
  if (system === 'imperial') {
    return `${mmToInch(w)}" × ${mmToInch(h)}" × ${mmToInch(g)}"`;
  }
  return `${w} × ${h} × ${g} mm`;
}

export function formatSingleDim(mm: number, system: UnitSystem): string {
  if (system === 'imperial') {
    return `${mmToInch(mm)}"`;
  }
  return `${mm} mm`;
}

export function dimUnitLabel(system: UnitSystem): string {
  return system === 'imperial' ? 'in' : 'mm';
}
