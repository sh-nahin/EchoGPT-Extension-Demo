import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { models } from '../data/catalog';
import { useRoute } from '../hooks/useRoute';
import { requestDemo } from '../services/ai';
import { readData, STORAGE_KEY, uid } from '../utils/storage';
import type { AppData, Conversation, Message, Route, Settings } from '../types';

interface AppContextValue {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  route: Route;
  navigate: (route: Route) => void;
  notify: (message: string) => void;
  toast: string;
  updateSettings: (settings: Partial<Settings>) => void;
  draft: string;
  setDraft: (value: string) => void;
  activeId: string | null;
  conversation: Conversation | undefined;
  sending: boolean;
  send: (text: string) => Promise<void>;
  stop: () => void;
  newChat: () => void;
  openChat: (id: string) => void;
  usePrompt: (content: string) => void;
}
const Context = createContext<AppContextValue | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(readData);
  const { route, navigate } = useRoute();
  const [draft, setDraft] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ephemeral, setEphemeral] = useState<Conversation>();
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const conversation =
    ephemeral?.id === activeId ? ephemeral : data.conversations.find((c) => c.id === activeId);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      setToast('Your browser storage is full or unavailable. Changes are kept for this session.');
    }
  }, [data]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setData(readData());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = data.settings.theme;
    document.documentElement.dataset.motion = data.settings.reduceMotion ? 'reduce' : 'auto';
  }, [data.settings.theme, data.settings.reduceMotion]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => () => controller.current?.abort(), []);
  const stop = () => {
    controller.current?.abort();
  };
  const newChat = () => {
    stop();
    setActiveId(null);
    setDraft('');
    setEphemeral(undefined);
    navigate('chat');
  };
  const openChat = (id: string) => {
    stop();
    setActiveId(id);
    setDraft('');
    navigate('chat');
  };
  const usePrompt = (content: string) => {
    stop();
    setActiveId(null);
    setDraft(content);
    navigate('chat');
  };
  const send = async (text: string) => {
    if (!text.trim() || busy.current) return;
    busy.current = true;
    setSending(true);
    const model = models.find((m) => m.id === data.settings.model) ?? models[0];
    const next: Conversation = {
      id: conversation?.id ?? uid(),
      title: conversation?.title ?? text.trim().slice(0, 64),
      messages: [
        ...(conversation?.messages ?? []),
        { id: uid(), role: 'user', content: text.trim() },
      ],
      pinned: conversation?.pinned ?? false,
      updatedAt: Date.now(),
    };
    const persist = data.settings.saveHistory;
    const save = (value: Conversation) => {
      setEphemeral(persist ? undefined : value);
      if (persist)
        setData((d) => ({
          ...d,
          conversations: [value, ...d.conversations.filter((c) => c.id !== value.id)],
        }));
    };
    save(next);
    setActiveId(next.id);
    setDraft('');
    navigate('chat');
    controller.current = new AbortController();
    try {
      const content = await requestDemo(
        { prompt: text, model: model.name },
        controller.current.signal,
      );
      const answer: Message = { id: uid(), role: 'assistant', content, model: model.name };
      save({ ...next, messages: [...next.messages, answer], updatedAt: Date.now() });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setToast('The response could not be loaded. Please try again.');
    } finally {
      busy.current = false;
      setSending(false);
      controller.current = null;
    }
  };
  return (
    <Context.Provider
      value={{
        data,
        setData,
        route,
        navigate,
        toast,
        notify: setToast,
        updateSettings: (settings) =>
          setData((d) => ({ ...d, settings: { ...d.settings, ...settings } })),
        draft,
        setDraft,
        activeId,
        conversation,
        sending,
        send,
        stop,
        newChat,
        openChat,
        usePrompt,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
