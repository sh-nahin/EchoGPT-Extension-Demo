import type { AppData } from '../types';
import { defaultSettings, starterPrompts } from '../data/catalog';

export const STORAGE_KEY = 'echogpt.workspace.v1';
export function emptyData(): AppData {
  return {
    version: 1,
    conversations: [],
    settings: { ...defaultSettings },
    prompts: starterPrompts.map((p) => ({ ...p })),
    connections: [],
    briefs: [],
  };
}
export function readData(): AppData {
  const fallback = emptyData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const data = JSON.parse(raw) as AppData;
    if (data.version !== 1) return fallback;
    return {
      ...fallback,
      settings: {
        ...defaultSettings,
        ...data.settings,
        theme: data.settings?.theme === 'light' ? 'light' : 'dark',
      },
      conversations: Array.isArray(data.conversations)
        ? data.conversations.filter(
            (c) =>
              typeof c.id === 'string' &&
              typeof c.title === 'string' &&
              Array.isArray(c.messages) &&
              c.messages.every(
                (m) => typeof m.content === 'string' && ['user', 'assistant'].includes(m.role),
              ),
          )
        : [],
      prompts: Array.isArray(data.prompts)
        ? data.prompts.filter(
            (p) =>
              typeof p.id === 'string' &&
              typeof p.title === 'string' &&
              typeof p.content === 'string',
          )
        : fallback.prompts,
      connections: Array.isArray(data.connections)
        ? data.connections.filter(
            (c) =>
              typeof c.id === 'string' && typeof c.name === 'string' && typeof c.url === 'string',
          )
        : [],
      briefs: Array.isArray(data.briefs)
        ? data.briefs.filter((b) => typeof b.id === 'string' && typeof b.prompt === 'string')
        : [],
    };
  } catch {
    return fallback;
  }
}
export const uid = () => crypto.randomUUID();
export function downloadText(name: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function relativeDate(timestamp: number) {
  const hours = Math.max(0, (Date.now() - timestamp) / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(timestamp);
}
