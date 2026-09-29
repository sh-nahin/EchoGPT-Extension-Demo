import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Clock3,
  MessageSquare,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tools } from '../data/catalog';
import { relativeDate } from '../utils/storage';
import { Badge, Button, SectionLink } from '../components/ui';
import { Composer } from '../components/chat/Composer';

export default function HomePage() {
  const { data, navigate, usePrompt, openChat, newChat } = useApp();
  const recent = data.conversations.slice(0, 3);
  const featured = data.prompts.filter((p) => p.saved).slice(0, 3);
  return (
    <div className="page home-page">
      <section className="home-intro">
        <div className="welcome-line">
          <span className="welcome-symbol">
            <Sparkles size={16} />
          </span>
          YOUR SPACE TO THINK BIGGER
        </div>
        <h1>
          What can I help you <span>create?</span>
        </h1>
        <p>One workspace. Your favorite AI tools. Endless possibilities.</p>
      </section>
      <Composer large />
      <div className="quick-prompts">
        <span>Try a little inspiration</span>
        {['Help me write an email', 'Explain a complex idea', 'Brainstorm something new'].map(
          (text) => (
            <button key={text} onClick={() => usePrompt(text)}>
              {text}
              <ArrowUpRight size={13} />
            </button>
          ),
        )}
      </div>
      <section className="tools-section">
        <div className="section-title">
          <h2>
            Your everyday superpowers <span className="count">07</span>
          </h2>
          <span className="section-meta">A tool for every train of thought</span>
        </div>
        <div className="tool-grid">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-card tool-${tool.color}`}
              onClick={() => navigate(tool.id)}
            >
              <div className="tool-card-top">
                <span className={`tool-icon ${tool.color}`}>
                  <tool.icon size={22} strokeWidth={1.7} />
                </span>
                {'tag' in tool && <Badge>{tool.tag}</Badge>}
                <ArrowUpRight className="tool-arrow" size={17} />
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </button>
          ))}
          <button className="tool-card all-models-card" onClick={() => navigate('models')}>
            <div className="model-stack">
              <span className="violet">E</span>
              <span className="green">G</span>
              <span className="orange">C</span>
            </div>
            <h3>Your model. Your choice.</h3>
            <p>
              Meet your AI lineup <ArrowRight size={14} />
            </p>
          </button>
        </div>
      </section>
      <div className="home-bottom">
        <section className="panel recent-panel">
          <div className="section-title">
            <h2>
              <Clock3 size={17} />
              Pick up where you left off
            </h2>
            <SectionLink onClick={() => navigate('history')}>View all</SectionLink>
          </div>
          {recent.length ? (
            <div className="recent-list">
              {recent.map((c) => (
                <button key={c.id} className="recent-item" onClick={() => openChat(c.id)}>
                  <span className="list-icon">
                    <MessageSquare size={17} />
                  </span>
                  <span>
                    <strong>{c.title}</strong>
                    <small>
                      {c.messages.length} messages · {relativeDate(c.updatedAt)}
                    </small>
                  </span>
                  <Chevron />
                </button>
              ))}
            </div>
          ) : (
            <div className="home-empty">
              <span className="list-icon">
                <MessageSquare size={20} />
              </span>
              <div>
                <h3>Your next conversation starts here.</h3>
                <p>Chats you save will be waiting right here.</p>
              </div>
              <Button variant="ghost" onClick={newChat}>
                <Plus size={16} />
                Start a chat
              </Button>
            </div>
          )}
        </section>
        <section className="panel prompt-preview">
          <div className="section-title">
            <h2>
              <Bookmark size={17} />A head start, saved
            </h2>
            <SectionLink onClick={() => navigate('prompts')}>Library</SectionLink>
          </div>
          {featured.length ? (
            featured.map((p) => (
              <button className="saved-prompt" key={p.id} onClick={() => usePrompt(p.content)}>
                <span>
                  <strong>{p.title}</strong>
                  <small>{p.category}</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))
          ) : (
            <p className="muted">Save a prompt from the library to keep it close.</p>
          )}
        </section>
      </div>
    </div>
  );
}
function Chevron() {
  return <ArrowUpRight size={15} />;
}
