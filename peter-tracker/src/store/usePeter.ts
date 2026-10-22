import { useEffect, useState } from 'react';
import { create } from 'zustand';
import * as Location from 'expo-location';
import { colors } from '../theme/tokens';
import * as api from '../services/api';
import type { Coords, PeterStatus } from '../services/api';

export const MOODS = {
  bem:        { label: 'Tudo bem',                icon: 'sentiment-satisfied', color: colors.green },
  correndo:   { label: 'Correndo contra o tempo', icon: 'directions-run',      color: colors.blue },
  balancando: { label: 'Balançando pela cidade',  icon: 'swap-calls',          color: colors.blue },
  focado:     { label: 'Focado',                  icon: 'center-focus-strong', color: colors.blue },
  cansado:    { label: 'Cansado',                 icon: 'bedtime',             color: colors.textMuted },
  tenso:      { label: 'Tenso',                   icon: 'priority-high',       color: colors.redSoft },
} as const;

export const INACTIVE_MIN = 5;

type Peter = {
  status: PeterStatus | null;
  refresh: () => Promise<void>;
  subscribe: () => () => void;
};

export const usePeter = create<Peter>((set) => ({
  status: null,
  async refresh() {
    set({ status: await api.getPeterStatus() });
  },
  subscribe: () => api.subscribeLocation((status) => set({ status })),
}));

// Re-renderiza periodicamente para atualizar tempos relativos.
export function useNow(ms = 30000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

// Reverse geocoding real, com fallback para o endereço da API.
export function useAddress(coords: Coords | undefined, fallback = '') {
  const [address, setAddress] = useState('');
  useEffect(() => {
    if (!coords) return;
    (async () => {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) return;
        const [a] = await Location.reverseGeocodeAsync(coords);
        if (!a) return;
        const street = a.street && `${a.street}${a.streetNumber ? ', ' + a.streetNumber : ''}`;
        setAddress([street, a.district ?? a.city].filter(Boolean).join(' · '));
      } catch {
        // mantém o fallback
      }
    })();
  }, [coords?.latitude, coords?.longitude]);
  return address || fallback;
}

export const minutesSince = (iso: string, now = Date.now()) =>
  Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));

export const relTime = (iso: string, now = Date.now()) => {
  const m = minutesSince(iso, now);
  if (m < 1) return 'agora';
  if (m < 60) return `há ${m} min`;
  return `há ${Math.floor(m / 60)} h`;
};

export const hhmm = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
