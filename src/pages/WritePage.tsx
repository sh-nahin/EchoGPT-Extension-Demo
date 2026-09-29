import { useState } from 'react';
import { ArrowUpRight, PenLine, Sparkles } from 'lucide-react';
import { Button, Chips, DemoNote, ModelSelect, PageHeading, ResultPanel } from '../components/ui';
import { useApp } from '../context/AppContext';
import { languages, models } from '../data/catalog';
import { useDemoTask } from '../hooks/useDemoTask';

export default function WritePage() {
  const { data, updateSettings, usePrompt } = useApp();
  const [tab, setTab] = useState('Compose');
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Automatic');
  const [tone, setTone] = useState('Natural');
  const [length, setLength] = useState('Medium');
  const [language, setLanguage] = useState(data.settings.language);
  const { result, loading, run } = useDemoTask();
  return (
    <div className="page">
      <PageHeading
        eyebrow="WRITE"
        title="The right words, a little easier."
        description="Draft, reply, or polish. Make every word feel like you."
      />
      <div className="editor-layout">
        <section className="panel form-panel">
          <div className="segmented" role="group" aria-label="Writing task">
            {['Compose', 'Reply', 'Grammar'].map((t) => (
              <button
                aria-pressed={tab === t}
                className={tab === t ? 'active' : ''}
                key={t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(
                `${tab} · ${format} · ${tone} · ${length} · ${language}\n\n${topic}`,
                models.find((m) => m.id === data.settings.model)?.name ?? 'EchoGPT',
                tab === 'Grammar' ? 'grammar' : 'write',
              );
            }}
          >
            <label className="field">
              <span>
                {tab === 'Compose'
                  ? 'What are you writing about?'
                  : tab === 'Reply'
                    ? 'Paste the message you’re replying to'
                    : 'Text to improve'}
              </span>
              <textarea
                required
                rows={7}
                value={topic}
                maxLength={15000}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  tab === 'Compose'
                    ? 'An email to my team about our next big idea…'
                    : 'Add your text here…'
                }
              />
              <small>{topic.length.toLocaleString()} / 15,000 characters</small>
            </label>
            {tab !== 'Grammar' && (
              <>
                <Chips
                  label="Format"
                  options={[
                    'Automatic',
                    'Email',
                    'Message',
                    'Paragraph',
                    'Outline',
                    'Blog post',
                    'Article',
                    'Social post',
                  ]}
                  value={format}
                  onChange={setFormat}
                />
                <Chips
                  label="Tone of voice"
                  options={['Natural', 'Professional', 'Friendly', 'Confident', 'Casual', 'Funny']}
                  value={tone}
                  onChange={setTone}
                />
                <Chips
                  label="Length"
                  options={['Short', 'Medium', 'Long']}
                  value={length}
                  onChange={setLength}
                />
              </>
            )}
            <label className="field">
              <span>Output language</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
            <div className="form-actions">
              <ModelSelect
                value={data.settings.model}
                onChange={(model) => updateSettings({ model })}
              />
              <Button type="submit" variant="primary" disabled={!topic.trim() || loading}>
                <Sparkles size={17} />
                {loading ? 'Preparing…' : tab === 'Grammar' ? 'Preview edits' : 'Generate preview'}
              </Button>
            </div>
          </form>
          <DemoNote>
            Preview the writing workflow with a sample outline. Live drafting needs an AI backend.
          </DemoNote>
        </section>
        <div>
          <ResultPanel title="Your writing preview" text={result} loading={loading}>
            <div className="writing-empty">
              <span className="paper-icon">
                <PenLine size={29} />
              </span>
              <h3>
                From “where do I start?”
                <br />
                to words on the page.
              </h3>
              <p>Tell us what’s on your mind.</p>
            </div>
          </ResultPanel>
          {result && (
            <Button
              className="continue-button"
              onClick={() => usePrompt(`Help me develop this writing outline:\n\n${result}`)}
            >
              Continue in chat
              <ArrowUpRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
