import {
  BookOpen,
  Image,
  Languages,
  MessageSquare,
  PenLine,
  Columns2,
  Plug,
  Video,
  House,
  History,
  Bookmark,
  Cpu,
  Settings,
} from 'lucide-react';
import type { Model, Prompt, Route, Settings as Preferences } from '../types';

export const tools = [
  {
    id: 'write',
    name: 'Write',
    description: 'Find the right words.',
    detail: 'From first drafts to final edits.',
    icon: PenLine,
    color: 'violet',
    tag: 'Popular',
  },
  {
    id: 'read',
    name: 'Read & summarize',
    description: 'Less reading. More insight.',
    detail: 'Turn pages and files into takeaways.',
    icon: BookOpen,
    color: 'green',
  },
  {
    id: 'translate',
    name: 'Translate',
    description: 'Make yourself understood.',
    detail: 'Bring your words across languages.',
    icon: Languages,
    color: 'blue',
  },
  {
    id: 'image',
    name: 'Image studio',
    description: 'Give your ideas a picture.',
    detail: 'Shape your next visual concept.',
    icon: Image,
    color: 'pink',
  },
  {
    id: 'video',
    name: 'Video studio',
    description: 'Set your story in motion.',
    detail: 'Plan a scene, shot by shot.',
    icon: Video,
    color: 'orange',
  },
  {
    id: 'compare',
    name: 'Compare models',
    description: 'One prompt. Two perspectives.',
    detail: 'Explore responses side by side.',
    icon: Columns2,
    color: 'cyan',
  },
  {
    id: 'mcp',
    name: 'Connect tools',
    description: 'Bring your workflow together.',
    detail: 'Manage your MCP connections.',
    icon: Plug,
    color: 'yellow',
  },
] as const;
export const navigation: { id: Route; label: string; icon: typeof House; group: string }[] = [
  { id: 'home', label: 'Overview', icon: House, group: 'Workspace' },
  { id: 'chat', label: 'AI chat', icon: MessageSquare, group: 'Workspace' },
  ...tools.map((t) => ({ id: t.id, label: t.name, icon: t.icon, group: 'Tools' })),
  { id: 'history', label: 'History', icon: History, group: 'Library' },
  { id: 'prompts', label: 'Prompt library', icon: Bookmark, group: 'Library' },
  { id: 'models', label: 'AI models', icon: Cpu, group: 'Library' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'Preferences' },
];
export const models: Model[] = [
  {
    id: 'echo',
    name: 'EchoGPT',
    provider: 'Echo',
    description: 'Your everyday thinking and writing companion.',
    letter: 'E',
    color: 'violet',
    tags: ['Everyday', 'Writing'],
  },
  {
    id: 'gpt',
    name: 'GPT',
    provider: 'OpenAI',
    description: 'A versatile choice for writing and problem solving.',
    letter: 'G',
    color: 'green',
    tags: ['General', 'Code'],
  },
  {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    description: 'Explore longer documents and considered responses.',
    letter: 'C',
    color: 'orange',
    tags: ['Writing', 'Analysis'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    description: 'Explore ideas across text and visual workflows.',
    letter: 'G',
    color: 'blue',
    tags: ['General', 'Ideas'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    description: 'Work through technical questions and code.',
    letter: 'D',
    color: 'cyan',
    tags: ['Code', 'Reasoning'],
  },
];
export const defaultSettings: Preferences = {
  theme: 'dark',
  model: 'echo',
  saveHistory: true,
  enterToSend: true,
  reduceMotion: false,
  language: 'English',
  name: '',
};
export const starterPrompts: Prompt[] = [
  {
    id: 'p1',
    title: 'Make it sound like me',
    category: 'Writing',
    content:
      'Rewrite the following text in a warm, clear, natural voice. Keep my meaning and remove jargon:\n\n',
    saved: true,
  },
  {
    id: 'p2',
    title: 'Find the key takeaways',
    category: 'Research',
    content:
      'Summarize the text below in five key takeaways. End with one practical next step:\n\n',
    saved: false,
  },
  {
    id: 'p3',
    title: 'Untangle an idea',
    category: 'Learning',
    content: 'Explain this concept in simple terms, using a practical example and an analogy:\n\n',
    saved: true,
  },
  {
    id: 'p4',
    title: 'A better first draft',
    category: 'Writing',
    content:
      'Write a concise first draft about the topic below. Start with the main point and use specific examples:\n\n',
    saved: false,
  },
  {
    id: 'p5',
    title: 'Review my code',
    category: 'Code',
    content:
      'Review this code for correctness, readability, and performance. Explain your suggested changes:\n\n',
    saved: false,
  },
  {
    id: 'p6',
    title: 'Turn notes into next steps',
    category: 'Productivity',
    content:
      'Turn these meeting notes into a concise summary and an action list with owners and deadlines where provided:\n\n',
    saved: true,
  },
];
export const languages = [
  'English', 'Bengali',  'Hindi',
];
