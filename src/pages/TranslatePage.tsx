import { useState } from 'react';
import { ArrowRightLeft, Languages } from 'lucide-react';
import { Button, Chips, CopyButton, DemoNote, IconButton, PageHeading } from '../components/ui';
import { languages } from '../data/catalog';

const examples: Record<string, string> = {
  English: 'Hello! How are you?',
  Bengali: 'হ্যালো! আপনি কেমন আছেন?',
  Spanish: '¡Hola! ¿Cómo estás?',
  French: 'Bonjour ! Comment allez-vous ?',
  German: 'Hallo! Wie geht es Ihnen?',
  Arabic: 'مرحبًا! كيف حالك؟',
  Hindi: 'नमस्ते! आप कैसे हैं?',
  Japanese: 'こんにちは！お元気ですか？',
  Korean: '안녕하세요! 어떻게 지내세요?',
  Chinese: '你好！你好吗？',
  Portuguese: 'Olá! Como você está?',
};
export default function TranslatePage() {
  const [source, setSource] = useState('English');
  const [target, setTarget] = useState('Bengali');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [tone, setTone] = useState('Natural');
  const translate = () => {
    const isExample = text.trim().toLowerCase() === examples[source]?.toLowerCase();
    setResult(
      isExample
        ? examples[target]
        : `Translation request prepared\n\nFrom: ${source}\nTo: ${target}\nTone: ${tone}\n\nSource text:\n${text}\n\nConnect an AI backend to translate your own text. “Try an example” previews the translated-result experience with a built-in greeting.`,
    );
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="TRANSLATE"
        title="Good ideas cross borders."
        description="Keep the meaning. Find the words."
      />
      <section className="panel translation-panel">
        <div className="translation-languages">
          <label>
            <span className="sr-only">Source language</span>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setResult('');
              }}
            >
              {languages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <IconButton
            label="Swap languages"
            onClick={() => {
              setSource(target);
              setTarget(source);
              setText(result && Object.values(examples).includes(result) ? result : text);
              setResult('');
            }}
          >
            <ArrowRightLeft size={18} />
          </IconButton>
          <label>
            <span className="sr-only">Target language</span>
            <select
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setResult('');
              }}
            >
              {languages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="translation-editors">
          <div>
            <label className="sr-only" htmlFor="source-text">
              Text to translate
            </label>
            <textarea
              id="source-text"
              rows={12}
              dir={source === 'Arabic' ? 'rtl' : 'auto'}
              value={text}
              maxLength={5000}
              onChange={(e) => {
                setText(e.target.value);
                setResult('');
              }}
              placeholder="Your words, in any language…"
            />
            <div className="translation-meta">
              <span>{text.length} / 5,000</span>
              <button
                className="text-button"
                onClick={() => {
                  setText(examples[source]);
                  setResult('');
                }}
              >
                Try an example
              </button>
            </div>
          </div>
          <div className="translation-output" aria-live="polite">
            <div
              className={`prose ${!result ? 'muted' : ''}`}
              dir={
                target === 'Arabic' && !!result && Object.values(examples).includes(result)
                  ? 'rtl'
                  : 'auto'
              }
            >
              {result || 'Your translation will appear here.'}
            </div>
            {result && <CopyButton text={result} />}
          </div>
        </div>
        <div className="translation-bottom">
          <Chips
            label="Tone"
            options={['Natural', 'Formal', 'Casual']}
            value={tone}
            onChange={setTone}
          />
          <Button
            variant="primary"
            disabled={!text.trim() || source === target}
            onClick={translate}
          >
            <Languages size={17} />
            Translate preview
          </Button>
        </div>
      </section>
      <DemoNote>
        Try the built-in greeting to preview translations. Other text prepares a request for your
        future AI backend.
      </DemoNote>
    </div>
  );
}
