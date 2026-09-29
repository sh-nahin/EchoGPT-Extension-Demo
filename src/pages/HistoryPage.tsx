import { useState } from 'react';
import { Download, History, MessageSquare, Pencil, Pin, Plus, Search, Trash2 } from 'lucide-react';
import { Button, EmptyState, IconButton, Modal, PageHeading } from '../components/ui';
import { useApp } from '../context/AppContext';
import { downloadText, relativeDate } from '../utils/storage';

export default function HistoryPage() {
  const { data, setData, newChat, openChat, notify } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All conversations');
  const [remove, setRemove] = useState<string>();
  const [rename, setRename] = useState<string>();
  const [title, setTitle] = useState('');
  const filtered = data.conversations
    .filter(
      (c) =>
        (filter !== 'Pinned' || c.pinned) && c.title.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
  return (
    <div className="page">
      <PageHeading
        eyebrow="CONVERSATION HISTORY"
        title="Good thinking is worth keeping."
        description="Find a thought, revisit an answer, or keep a conversation going."
        action={
          <Button variant="primary" onClick={newChat}>
            <Plus size={17} />
            New chat
          </Button>
        }
      />
      <div className="list-toolbar">
        <div className="search-input">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your conversations…"
            aria-label="Search conversation history"
          />
        </div>
        <select
          aria-label="Filter conversations"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All conversations</option>
          <option>Pinned</option>
        </select>
        <Button
          disabled={!data.conversations.length}
          onClick={() =>
            downloadText(
              'echogpt-history.json',
              JSON.stringify(data.conversations, null, 2),
              'application/json',
            )
          }
        >
          <Download size={17} />
          <span>Export</span>
        </Button>
      </div>
      <section className="panel history-list">
        {filtered.length ? (
          filtered.map((c) => (
            <article className="history-row" key={c.id}>
              <button className="history-open" onClick={() => openChat(c.id)}>
                <span className="list-icon">
                  <MessageSquare size={19} />
                </span>
                <span>
                  <strong>
                    {c.pinned && <Pin size={13} />}
                    {c.title}
                  </strong>
                  <small>
                    {c.messages.length} messages · {relativeDate(c.updatedAt)}
                  </small>
                </span>
              </button>
              <div className="row-actions">
                <IconButton
                  label={c.pinned ? `Unpin ${c.title}` : `Pin ${c.title}`}
                  aria-pressed={c.pinned}
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      conversations: d.conversations.map((item) =>
                        item.id === c.id ? { ...item, pinned: !item.pinned } : item,
                      ),
                    }))
                  }
                >
                  <Pin size={16} fill={c.pinned ? 'currentColor' : 'none'} />
                </IconButton>
                <IconButton
                  label={`Rename ${c.title}`}
                  onClick={() => {
                    setRename(c.id);
                    setTitle(c.title);
                  }}
                >
                  <Pencil size={16} />
                </IconButton>
                <IconButton label={`Delete ${c.title}`} onClick={() => setRemove(c.id)}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            icon={<History size={28} />}
            title={
              query || filter === 'Pinned'
                ? 'No conversations found.'
                : 'Make room for your next good idea.'
            }
            description={
              query || filter === 'Pinned'
                ? 'Try a different search or filter.'
                : 'Start a chat and your saved conversations will appear here.'
            }
            action={
              <Button onClick={newChat}>
                <Plus size={16} />
                Start a conversation
              </Button>
            }
          />
        )}
      </section>
      <p className="small-text muted">
        {data.settings.saveHistory
          ? 'History is saved on this device. You control what stays.'
          : 'Saving new conversations is paused. You can turn it on in Settings.'}
      </p>
      <Modal open={!!remove} onClose={() => setRemove(undefined)} title="Delete this conversation?">
        <p>This removes the conversation and its messages from this browser.</p>
        <div className="modal-actions">
          <Button onClick={() => setRemove(undefined)}>Keep conversation</Button>
          <Button
            variant="danger"
            onClick={() => {
              setData((d) => ({
                ...d,
                conversations: d.conversations.filter((c) => c.id !== remove),
              }));
              setRemove(undefined);
              notify('Conversation deleted');
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
      <Modal open={!!rename} onClose={() => setRename(undefined)} title="Rename conversation">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setData((d) => ({
              ...d,
              conversations: d.conversations.map((c) =>
                c.id === rename ? { ...c, title: title.trim() } : c,
              ),
            }));
            setRename(undefined);
            notify('Conversation renamed');
          }}
        >
          <label className="field">
            <span>Conversation title</span>
            <input
              autoFocus
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <div className="modal-actions">
            <Button onClick={() => setRename(undefined)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={!title.trim()}>
              Save name
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
