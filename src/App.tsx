import { lazy, Suspense } from 'react';
import { LoaderCircle } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import HomePage from './pages/HomePage';
const pages = {
  home: HomePage,
  chat: lazy(() => import('./pages/ChatPage')),
  write: lazy(() => import('./pages/WritePage')),
  read: lazy(() => import('./pages/ReadPage')),
  translate: lazy(() => import('./pages/TranslatePage')),
  image: lazy(() => import('./pages/ImagePage')),
  video: lazy(() => import('./pages/VideoPage')),
  compare: lazy(() => import('./pages/ComparePage')),
  mcp: lazy(() => import('./pages/McpPage')),
  history: lazy(() => import('./pages/HistoryPage')),
  prompts: lazy(() => import('./pages/PromptsPage')),
  models: lazy(() => import('./pages/ModelsPage')),
  settings: lazy(() => import('./pages/SettingsPage')),
};
function Workspace() {
  const { route } = useApp();
  const Page = pages[route];
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="page-loading" role="status">
            <LoaderCircle className="spin" />
            <span>Opening your workspace…</span>
          </div>
        }
      >
        <Page />
      </Suspense>
    </AppShell>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Workspace />
      </AppProvider>
    </ErrorBoundary>
  );
}
