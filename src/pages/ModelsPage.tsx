import { useState } from 'react';
import { Check, Search, Sparkles } from 'lucide-react';
import { Badge, Button, DemoNote, ModelMark, PageHeading } from '../components/ui';
import { models } from '../data/catalog';
import { useApp } from '../context/AppContext';

export default function ModelsPage() {
  const { data, updateSettings, notify, navigate } = useApp();
  const [query, setQuery] = useState('');
  const filtered = models.filter((m) =>
    `${m.name} ${m.provider} ${m.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="page">
      <PageHeading
        eyebrow="AI MODELS"
        title="Different minds. One workspace."
        description="Choose the companion that fits the way you work."
        action={<Button onClick={() => navigate('compare')}>Compare models</Button>}
      />
      <div className="search-input standalone-search">
        <Search size={18} />
        <input
          aria-label="Search models"
          placeholder="Search models or capabilities…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="models-grid">
        {filtered.map((m) => (
          <article
            className={`panel model-card ${data.settings.model === m.id ? 'chosen' : ''}`}
            key={m.id}
          >
            <div className="section-title">
              <ModelMark id={m.id} />
              {data.settings.model === m.id && (
                <Badge color="violet">
                  <Check size={12} />
                  Default
                </Badge>
              )}
            </div>
            <h2>{m.name}</h2>
            <span className="provider">{m.provider}</span>
            <p>{m.description}</p>
            <div className="model-tags">
              {m.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <Button
              variant={data.settings.model === m.id ? 'secondary' : 'primary'}
              disabled={data.settings.model === m.id}
              onClick={() => {
                updateSettings({ model: m.id });
                notify(`${m.name} is your default model`);
              }}
            >
              {data.settings.model === m.id ? (
                <>
                  <Check size={16} />
                  Selected
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Set as default
                </>
              )}
            </Button>
            <small>Demo adapter · No live connection</small>
          </article>
        ))}
      </div>
      {!filtered.length && <p className="muted">No matching models. Try “writing” or “code”.</p>}
      <DemoNote>
        These are provider choices for the interface concept. Configure model IDs and an AI service
        before enabling live responses.
      </DemoNote>
    </div>
  );
}
