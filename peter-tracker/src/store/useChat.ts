import { create } from 'zustand';
import * as api from '../services/api';
import type { Message } from '../services/api';

const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString();

type Chat = {
  messages: Message[];
  unread: number;
  send: (text: string) => Promise<void>;
  markRead: () => void;
};

export const useChat = create<Chat>((set, get) => ({
  messages: [
    { id: '1', from: 'me', text: 'Peter, você vem pro jantar hoje?', at: ago(50), read: true },
    { id: '2', from: 'peter', text: 'Vou sim! Só preciso resolver uma coisa no centro antes.', at: ago(47) },
    { id: '3', from: 'me', text: 'Toma cuidado, tá? 💙', at: ago(46), read: true },
    { id: '4', from: 'peter', text: 'Sempre! Te aviso quando estiver chegando.', at: ago(12) },
  ],
  unread: 1,
  async send(text) {
    const msg = await api.sendMessage(text);
    set({ messages: [...get().messages, msg] });
    const reply = await api.fakeReply();
    set({
      messages: [...get().messages.map((m) => (m.from === 'me' ? { ...m, read: true } : m)), reply],
      unread: get().unread + 1,
    });
  },
  markRead: () => set({ unread: 0 }),
}));
