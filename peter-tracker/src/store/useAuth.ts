import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import * as api from '../services/api';

const KEY = 'peter-tracker-creds';
const MAX_ATTEMPTS = 5;

type Auth = {
  token: string | null;
  error: string | null;
  attemptsLeft: number;
  loading: boolean;
  login: (user: string, pass: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
};

export const useAuth = create<Auth>((set, get) => ({
  token: null,
  error: null,
  attemptsLeft: MAX_ATTEMPTS,
  loading: false,
  async login(user, pass, remember) {
    if (get().attemptsLeft <= 0) return false;
    set({ loading: true });
    try {
      const { token } = await api.login(user, pass);
      if (remember) await SecureStore.setItemAsync(KEY, JSON.stringify({ user, pass }));
      else await SecureStore.deleteItemAsync(KEY);
      set({ token, error: null, attemptsLeft: MAX_ATTEMPTS, loading: false });
      return true;
    } catch (e: any) {
      const left = get().attemptsLeft - 1;
      set({
        error: left > 0 ? e.message : 'Conta bloqueada. Tente novamente mais tarde.',
        attemptsLeft: left,
        loading: false,
      });
      return false;
    }
  },
  logout: () => set({ token: null }),
}));

export async function loadSavedCreds(): Promise<{ user: string; pass: string } | null> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
