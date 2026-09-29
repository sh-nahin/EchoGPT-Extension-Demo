import { useEffect, useRef } from 'react';
import { ArrowDownToLine, MessageSquare, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, CopyButton, DemoNote, ModelMark, PageHeading } from '../components/ui';
import { Composer } from '../components/chat/Composer';
import { models } from '../data/catalog';
import { downloadText } from '../utils/storage';

export default function ChatPage() {
  const { conversation, sending, data, newChat, usePrompt } = useApp();
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({
      behavior: data.settings.reduceMotion ? 'instant' : 'smooth',
      block: 'end',
    });
  }, [conversation?.messages.length, sending, data.settings.reduceMotion]);
  return (
    <div className="page chat-page">
      <PageHeading
        eyebrow="A little clarity starts with a conversation"
        title={conversation?.title ?? 'Room for every thought.'}
        action={
          <div className="inline-actions">
            {conversation && (
              <Button
                onClick={() =>
                  downloadText(
                    'echogpt-conversation.md',
                    `# ${conversation.title}\n\n${conversation.messages.map((m) => `## ${m.role === 'user' ? 'You' : `${m.model} · Demo`}\n\n${m.content}`).join('\n\n')}`,
                  )
                }
                aria-label="Export conversation"
              >
                <ArrowDownToLine size={16} />
                <span>Export</span>
              </Button>
            )}
            <Button onClick={newChat}>
              <Plus size={16} />
              <span>New chat</span>
            </Button>
          </div>
        }
      />
      <div className="messages">
        {conversation?.messages.length ? (
          conversation.messages.map((message) => (
            <article className={`message message-${message.role}`} key={message.id}>
              <div className="message-avatar">
                {message.role === 'user' ? (
                  <span className="avatar">
                    {data.settings.name.charAt(0).toUpperCase() || 'Y'}
                  </span>
                ) : (
                  <ModelMark id={models.find((m) => m.name === message.model)?.id ?? 'echo'} />
                )}
              </div>
              <div className="message-content">
                <div className="message-meta">
                  <strong>{message.role === 'user' ? 'You' : message.model}</strong>
                  {message.role === 'assistant' && <span>Demo response</span>}
                  <CopyButton text={message.content} />
                </div>
                <div className="prose">{message.content}</div>
              </div>
            </article>
          ))
        ) : (
          <div className="chat-welcome">
            <span className="hero-symbol">
              <Sparkles size={32} />
            </span>
            <h2>Good questions open doors.</h2>
            <p>Ask something, explore an idea, or pick a place to start.</p>
            <div className="chat-starters">
              {data.prompts.slice(0, 4).map((p) => (
                <button key={p.id} onClick={() => usePrompt(p.content)}>
                  <MessageSquare size={17} />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {sending && (
          <div className="thinking" role="status">
            <Sparkles size={17} />
            <span>Preparing a demo response</span>
            <span className="thinking-dots">•••</span>
          </div>
        )}
        <div ref={bottom} />
      </div>
      <div className="chat-composer">
        <Composer />
        <DemoNote />
      </div>
    </div>
  );
}
