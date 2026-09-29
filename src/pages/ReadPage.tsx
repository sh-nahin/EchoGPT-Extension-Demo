import { useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, FileText, Link, Monitor, Upload } from 'lucide-react';
import { Button, DemoNote, PageHeading, ResultPanel } from '../components/ui';
import { useApp } from '../context/AppContext';
import { readActivePage } from '../services/extension';

export default function ReadPage() {
  const { notify, usePrompt } = useApp();
  const [mode, setMode] = useState('Paste text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const loadFile = async (selected?: File) => {
    if (!selected) return;
    if (!/\.(txt|md|csv|json)$/i.test(selected.name)) {
      notify('Choose a .txt, .md, .csv, or .json file.');
      return;
    }
    if (selected.size > 1000000) {
      notify('Choose a text file smaller than 1 MB.');
      return;
    }
    try {
      setText(await selected.text());
      setName(selected.name);
      notify('File ready to read');
    } catch {
      notify('This file could not be read. Please try another file.');
    }
  };
  const summarize = () => {
    const sentences =
      text
        .replace(/\s+/g, ' ')
        .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
        ?.map((s) => s.trim())
        .filter(Boolean) ?? [];
    const words = text.trim().split(/\s+/).length;
    setResult(
      `Local reading preview\n\n${words.toLocaleString()} words · About ${Math.max(1, Math.ceil(words / 200))} min to read\n\nOpening excerpts\n\n${sentences
        .slice(0, 5)
        .map((s) => `• ${s}`)
        .join(
          '\n\n',
        )}\n\nThese are exact opening excerpts, not an AI summary. Connect an AI backend for semantic summaries.`,
    );
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="READ & SUMMARIZE"
        title="Get to the good parts."
        description="Bring a page, a file, or a wall of text into focus."
      />
      <div className="editor-layout">
        <section className="panel form-panel">
          <div className="segmented read-tabs" role="group" aria-label="Content source">
            {[
              { label: 'Paste text', icon: FileText },
              { label: 'Upload file', icon: Upload },
              { label: 'Link', icon: Link },
            ].map((m) => (
              <button
                key={m.label}
                aria-pressed={mode === m.label}
                className={mode === m.label ? 'active' : ''}
                onClick={() => setMode(m.label)}
              >
                <m.icon size={16} />
                {m.label}
              </button>
            ))}
          </div>
          {mode === 'Link' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                try {
                  const parsed = new URL(url);
                  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
                  setResult(
                    `Link added to your reading request\n\n${parsed.href}\n\nThis frontend does not fetch external pages. Open this page and use “Read current page” in the Chrome extension, or paste its text to get a local reading preview.`,
                  );
                } catch {
                  notify('Enter a valid http or https URL.');
                }
              }}
            >
              <label className="field">
                <span>Page URL</span>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/an-interesting-read"
                />
              </label>
              <Button type="submit" variant="primary">
                <Link size={16} />
                Add link
              </Button>
            </form>
          ) : (
            <>
              {mode === 'Upload file' && (
                <button
                  className="dropzone"
                  onClick={() => file.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    void loadFile(e.dataTransfer.files[0]);
                  }}
                >
                  <span className="tool-icon green">
                    <Upload size={25} />
                  </span>
                  <strong>{name || 'Drop a file or click to browse'}</strong>
                  <span>TXT, Markdown, CSV, JSON · Up to 1 MB</span>
                </button>
              )}
              <label className="field">
                <span>{name ? `Content · ${name}` : 'Your reading material'}</span>
                <textarea
                  value={text}
                  maxLength={100000}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  placeholder="Paste an article, meeting notes, or something you’d like to understand…"
                />
              </label>
              <Button variant="primary" onClick={summarize} disabled={!text.trim()}>
                <BookOpen size={17} />
                Create reading preview
              </Button>
            </>
          )}
          <div className="or-divider">
            <span>or bring in your browser</span>
          </div>
          <Button
            className="full-width"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const page = await readActivePage();
                setText(page.text);
                setName(page.title);
                setMode('Paste text');
                notify('Current page added. Create a reading preview when ready.');
              } catch (error) {
                notify(error instanceof Error ? error.message : 'Unable to read this page.');
              } finally {
                setLoading(false);
              }
            }}
          >
            <Monitor size={17} />
            {loading ? 'Reading page…' : 'Read current page'}
            <ArrowUpRight size={16} />
          </Button>
          <DemoNote>
            Page access happens only when you request it. Uploaded text stays in your browser.
          </DemoNote>
          <input
            ref={file}
            type="file"
            accept=".txt,.md,.csv,.json"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              void loadFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </section>
        <div>
          <ResultPanel title="The bigger picture, condensed" text={result} />
          {text && (
            <Button
              className="continue-button"
              onClick={() => usePrompt(`Help me understand this text:\n\n${text.slice(0, 30000)}`)}
            >
              Ask questions about this
              <ArrowUpRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
