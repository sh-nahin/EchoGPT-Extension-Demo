import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  ChevronRight,
  Command,
  Menu,
  PanelRightOpen,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { navigation } from '../../data/catalog';
import { isExtension, openSidePanel, openWorkspace } from '../../services/extension';
import { Badge, Button, IconButton, Modal, Toast } from '../ui';

export function AppShell({ children }: { children: ReactNode }) {
  const { route, navigate, newChat, data, openChat, notify } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const main = useRef<HTMLElement>(null);
  const current = navigation.find((n) => n.id === route)!;
  useEffect(() => {
    setMobileOpen(false);
    main.current?.scrollTo(0, 0);
    document.title = `${current.label} · EchoGPT`;
  }, [route, current.label]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const sidebar = (
    <>
      <button
        className="brand"
        onClick={() => {
          navigate('home');
          setMobileOpen(false);
        }}
        aria-label="EchoGPT overview"
      >
        <span className="brand-icon">
          <span />
          <span />
          <span />
        </span>
        <span>
          Echo<span className="brand-light">GPT</span>
          <small>YOUR AI EXTENSION</small>
        </span>
      </button>
      <Button
        variant="primary"
        className="new-chat"
        onClick={() => {
          newChat();
          setMobileOpen(false);
        }}
        aria-label="New chat"
      >
        <Plus size={18} />
        New chat<span className="keyhint">↵</span>
      </Button>
      <nav aria-label="Main navigation">
        {['Workspace', 'Tools', 'Library', 'Preferences'].map((group) => (
          <div className="nav-group" key={group}>
            <span className="nav-label">{group}</span>
            {navigation
              .filter((n) => n.group === group)
              .map((n) => (
                <a
                  key={n.id}
                  className={`nav-item ${route === n.id ? 'active' : ''}`}
                  href={`#/${n.id}`}
                  aria-label={n.label}
                  title={n.label}
                  onClick={() => setMobileOpen(false)}
                  aria-current={route === n.id ? 'page' : undefined}
                >
                  <n.icon size={18} />
                  <span>{n.label}</span>
                  {route === n.id && <span className="nav-indicator" />}
                </a>
              ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button
          className="profile"
          onClick={() => {
            navigate('settings');
            setMobileOpen(false);
          }}
          aria-label="Workspace settings"
        >
          <span className="avatar">{data.settings.name.trim().charAt(0).toUpperCase() || 'S'}</span>
          <span>
            <strong>{data.settings.name || 'Safayet Hossain Nahin'}</strong>
            <small>workspace</small>
          </span>
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className="sidebar">{sidebar}</aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="mobile-menu">
              <IconButton label="Open navigation" onClick={() => setMobileOpen(true)}>
                <Menu size={20} />
              </IconButton>
            </span>
            <span className="breadcrumb-parent">EXTENSION</span>
            <ChevronRight className="breadcrumb-parent" size={14} />
            <span>{current.label}</span>
          </div>
          <div className="header-actions">
            <Badge color="demo-badge">Demo Extention</Badge>
            <button
              className="search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Search workspace"
            >
              <Search size={16} />
              <span>Search anything</span>
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} ref={main} className={`main-content route-${route}`}>
          {children}
          <footer className="workspace-footer">
            <span>
              <span className="tiny-logo">@</span> A little less busywork. A little more
              possibility.
            </span>
            <button onClick={() => setSearchOpen(true)}>
              <Command size={12} />  <span>to jump anywhere</span>
            </button>
          </footer>
        </main>
      </div>
      <Modal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Navigation"
        className="mobile-navigation"
      >
        <div className="mobile-sidebar">{sidebar}</div>
      </Modal>
      <Modal
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setQuery('');
        }}
        title="Jump to anything"
        className="command-modal"
      >
        <div className="search-input">
          <Search size={19} />
          <input
            autoFocus
            placeholder="Search tools, pages, conversations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search tools and conversations"
          />
          {query && (
            <IconButton label="Clear search" onClick={() => setQuery('')}>
              <X size={16} />
            </IconButton>
          )}
        </div>
        <div className="command-results">
          <span className="eyebrow">Pages & tools</span>
          {navigation
            .filter((n) => n.label.toLowerCase().includes(query.toLowerCase()))
            .map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  navigate(n.id);
                  setSearchOpen(false);
                }}
              >
                <n.icon size={18} />
                <span>{n.label}</span>
                <ChevronRight size={15} />
              </button>
            ))}
          {data.conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
            .length > 0 && <span className="eyebrow">Conversations</span>}
          {data.conversations
            .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
            .map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  openChat(c.id);
                  setSearchOpen(false);
                }}
              >
                <Sparkles size={18} />
                <span>{c.title}</span>
              </button>
            ))}
          {!navigation.some((n) => n.label.toLowerCase().includes(query.toLowerCase())) &&
            !data.conversations.some((c) =>
              c.title.toLowerCase().includes(query.toLowerCase()),
            ) && <p className="muted">No matches. Try “write” or “settings”.</p>}
        </div>
      </Modal>
      <Toast />
    </div>
  );
}
