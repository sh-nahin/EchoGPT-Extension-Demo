import { useState } from 'react';
import { ArrowUpRight, Bookmark, Plus, Search, Trash2 } from 'lucide-react';
import { Badge, Button, EmptyState, IconButton, Modal, PageHeading } from '../components/ui';
import { useApp } from '../context/AppContext';
import { uid } from '../utils/storage';

export default function PromptsPage() {
  const { data, setData, usePrompt, notify } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All prompts');
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Writing');
  const [remove, setRemove] = useState<string>();
  const prompts = data.prompts.filter(
    (p) =>
      (filter === 'All prompts' || (filter === 'Saved' ? p.saved : p.category === filter)) &&
      `${p.title} ${p.content}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="page">
      <PageHeading
        eyebrow="PROMPT LIBRARY"
        title="Never start from scratch."
        description="A few good words to get your best work going."
        action={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus size={17} />
            Create prompt
          </Button>
        }
      />
      <div className="search-input standalone-search">
        <Search size={18} />
        <input
          aria-label="Search prompts"
          placeholder="Find the right starting point…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="filter-tabs" role="group" aria-label="Prompt category">
        {['All prompts', 'Saved', 'Writing', 'Research', 'Learning', 'Code', 'Productivity'].map(
          (f) => (
            <button
              key={f}
              aria-pressed={f === filter}
              className={f === filter ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f === 'Saved' && <Bookmark size={14} />}
              {f}
            </button>
          ),
        )}
      </div>
      <div className="prompts-grid">
        {prompts.map((p) => (
          <article className="panel prompt-card" key={p.id}>
            <div className="section-title">
              <Badge>{p.category}</Badge>
              <div className="inline-actions">
                {p.custom && (
                  <IconButton label={`Delete prompt ${p.title}`} onClick={() => setRemove(p.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                )}
                <IconButton
                  label={p.saved ? `Unsave ${p.title}` : `Save ${p.title}`}
                  aria-pressed={p.saved}
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      prompts: d.prompts.map((item) =>
                        item.id === p.id ? { ...item, saved: !item.saved } : item,
                      ),
                    }))
                  }
                >
                  <Bookmark size={17} fill={p.saved ? 'currentColor' : 'none'} />
                </IconButton>
              </div>
            </div>
            <h2>{p.title}</h2>
            <p>{p.content}</p>
            <Button variant="ghost" onClick={() => usePrompt(p.content)}>
              Use prompt
              <ArrowUpRight size={16} />
            </Button>
          </article>
        ))}
      </div>
      {!prompts.length && (
        <EmptyState
          icon={<Bookmark />}
          title="No prompts here yet."
          description="Try another filter or create a prompt of your own."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus size={16} />
              Create prompt
            </Button>
          }
        />
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="Create your own prompt">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setData((d) => ({
              ...d,
              prompts: [
                ...d.prompts,
                {
                  id: uid(),
                  title: title.trim(),
                  content: content.trim(),
                  category,
                  saved: true,
                  custom: true,
                },
              ],
            }));
            setOpen(false);
            setTitle('');
            setContent('');
            notify('Prompt created and saved');
          }}
        >
          <label className="field">
            <span>Name</span>
            <input
              autoFocus
              required
              maxLength={80}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My go-to email prompt"
            />
          </label>
          <label className="field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {['Writing', 'Research', 'Learning', 'Code', 'Productivity'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Prompt</span>
            <textarea
              required
              maxLength={10000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Tell the AI what you need, and leave room for your context…"
            />
          </label>
          <div className="modal-actions">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={!title.trim() || !content.trim()}>
              Save prompt
            </Button>
          </div>
        </form>
      </Modal>
      <Modal open={!!remove} onClose={() => setRemove(undefined)} title="Delete this prompt?">
        <p>This removes your custom prompt from the library.</p>
        <div className="modal-actions">
          <Button onClick={() => setRemove(undefined)}>Keep prompt</Button>
          <Button
            variant="danger"
            onClick={() => {
              setData((d) => ({ ...d, prompts: d.prompts.filter((p) => p.id !== remove) }));
              setRemove(undefined);
              notify('Prompt deleted');
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
