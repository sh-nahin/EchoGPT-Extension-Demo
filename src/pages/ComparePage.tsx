import { useEffect, useRef, useState } from 'react';
import { Columns2 } from 'lucide-react';
import { Button, DemoNote, ModelSelect, PageHeading, ResultPanel } from '../components/ui';
import { requestDemo } from '../services/ai';
import { models } from '../data/catalog';
import { useApp } from '../context/AppContext';

export default function ComparePage() {
  const [left, setLeft] = useState('echo');
  const [right, setRight] = useState('claude');
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const { notify } = useApp();
  useEffect(() => () => abort.current?.abort(), []);
  const compare = async () => {
    abort.current?.abort();
    abort.current = new AbortController();
    setLoading(true);
    try {
      setResults(
        await Promise.all(
          [left, right].map((id) =>
            requestDemo(
              { prompt, model: models.find((m) => m.id === id)!.name },
              abort.current!.signal,
            ),
          ),
        ),
      );
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError'))
        notify('The comparison could not load. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="COMPARE MODELS"
        title="A second perspective changes things."
        description="Put one prompt in front of two models, side by side."
      />
      <form
        className="panel compare-prompt"
        onSubmit={(e) => {
          e.preventDefault();
          void compare();
        }}
      >
        <label className="field">
          <span>Your prompt</span>
          <textarea
            required
            rows={4}
            maxLength={10000}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What makes a great product onboarding experience?"
          />
        </label>
        <div className="form-actions">
          <span className="muted">Same prompt. Two points of view.</span>
          <Button variant="primary" type="submit" disabled={!prompt.trim() || loading}>
            <Columns2 size={17} />
            {loading ? 'Comparing…' : 'Compare previews'}
          </Button>
        </div>
      </form>
      <div className="compare-grid">
        {[left, right].map((value, i) => (
          <div key={i} className="compare-column">
            <div className="compare-model">
              <ModelSelect
                disabled={loading}
                value={value}
                onChange={(v) => {
                  i === 0 ? setLeft(v) : setRight(v);
                  setResults([]);
                }}
                exclude={i === 0 ? right : left}
                label={i === 0 ? 'First comparison model' : 'Second comparison model'}
              />
              <span>MODEL {i === 0 ? 'A' : 'B'}</span>
            </div>
            <ResultPanel
              title={models.find((m) => m.id === value)!.name}
              text={results[i]}
              loading={loading}
            />
          </div>
        ))}
      </div>
      <DemoNote>
        Both columns use the same local demo adapter. These previews do not evaluate real model
        quality.
      </DemoNote>
    </div>
  );
}
