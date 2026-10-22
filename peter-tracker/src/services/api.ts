// ponytail: API mock em memória; trocar por fetch/WebSocket quando houver backend.
export type MoodKey = 'bem' | 'correndo' | 'balancando' | 'focado' | 'cansado' | 'tenso';
export type Coords = { latitude: number; longitude: number };
export type PeterStatus = {
  mood: MoodKey; moodSince: string;
  coords: Coords; address: string; updatedAt: string; online: boolean;
};
export type Message = { id: string; from: 'peter' | 'me'; text: string; at: string; read?: boolean };
export type EmergencyTarget = '911' | 'delegacia';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString();

let status: PeterStatus = {
  mood: 'balancando',
  moodSince: ago(42),
  coords: { latitude: 40.7181, longitude: -73.8448 },
  address: '20 Ingram St, Forest Hills, Queens',
  updatedAt: ago(1),
  online: true,
};

export async function login(user: string, pass: string) {
  await wait(600);
  if (user.trim().toLowerCase() === 'mj' && pass === 'peter123') return { token: 'mock-token' };
  throw new Error('Usuário ou senha incorretos.');
}

export async function getPeterStatus() {
  await wait(400);
  return { ...status };
}

// Simula Peter se movendo a cada 15s.
export function subscribeLocation(cb: (s: PeterStatus) => void) {
  const id = setInterval(() => {
    status = {
      ...status,
      coords: {
        latitude: status.coords.latitude + (Math.random() - 0.5) * 0.002,
        longitude: status.coords.longitude + (Math.random() - 0.5) * 0.002,
      },
      updatedAt: new Date().toISOString(),
    };
    cb({ ...status });
  }, 15000);
  return () => clearInterval(id);
}

const REPLIES = [
  'Tô bem, MJ! Só resolvendo uma coisinha aqui 🕷️',
  'Já já te ligo, tô no meio de um balanço.',
  'Relaxa, chego antes do jantar.',
  'Sinal ruim por aqui, mas tá tudo sob controle.',
];

export async function sendMessage(text: string): Promise<Message> {
  await wait(300);
  return { id: String(Date.now()), from: 'me', text, at: new Date().toISOString(), read: false };
}

export async function fakeReply(): Promise<Message> {
  await wait(2500);
  return {
    id: String(Date.now()),
    from: 'peter',
    text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
    at: new Date().toISOString(),
  };
}

export async function triggerEmergency(_: { target: EmergencyTarget; coords: Coords }) {
  await wait(800);
  return {
    protocol: `NYPD-${Math.floor(100000 + Math.random() * 900000)}`,
    sentAt: new Date().toISOString(),
    status: 'Unidade a caminho',
  };
}
