export type Route =
  | 'home'
  | 'chat'
  | 'write'
  | 'read'
  | 'translate'
  | 'image'
  | 'video'
  | 'compare'
  | 'mcp'
  | 'history'
  | 'prompts'
  | 'models'
  | 'settings';
export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  letter: string;
  color: string;
  tags: string[];
}
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  pinned: boolean;
  example?: boolean;
}
export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  saved: boolean;
  custom?: boolean;
}
export interface Settings {
  theme: 'dark' | 'light';
  model: string;
  saveHistory: boolean;
  enterToSend: boolean;
  reduceMotion: boolean;
  language: string;
  name: string;
}
export interface Connection {
  id: string;
  name: string;
  url: string;
}
export interface CreativeBrief {
  id: string;
  kind: 'image' | 'video';
  prompt: string;
  ratio: string;
  style: string;
  count: string;
  createdAt: number;
}
export interface AppData {
  version: 1;
  conversations: Conversation[];
  settings: Settings;
  prompts: Prompt[];
  connections: Connection[];
  briefs: CreativeBrief[];
}
