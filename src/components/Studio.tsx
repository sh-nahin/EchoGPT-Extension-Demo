import { useState } from 'react';
import { ArrowDownToLine, Image, Plus, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { downloadText, uid } from '../utils/storage';
import { Button, Chips, CopyButton, DemoNote, EmptyState, PageHeading } from './ui';

export function Studio({ kind }: { kind: 'image' | 'video' }) {
  const { data, setData, notify } = useApp();
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState(kind === 'image' ? '1:1' : '16:9');
  const [style, setStyle] = useState(kind === 'image' ? 'Natural' : 'Cinematic');
  const [count, setCount] = useState(kind === 'image' ? '1' : '5 sec');
  const isImage = kind === 'image';
  const Icon = isImage ? Image : Video;
  const briefs = data.briefs.filter((b) => b.kind === kind);
  const save = () => {
    const brief = {
      id: uid(),
      kind,
      prompt: prompt.trim(),
      ratio,
      style,
      count,
      createdAt: Date.now(),
    };
    setData((d) => ({ ...d, briefs: [brief, ...d.briefs] }));
    notify(`${isImage ? 'Image' : 'Video'} brief saved`);
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow={isImage ? 'IMAGE STUDIO' : 'VIDEO STUDIO'}
        title={isImage ? 'Make the imagined visible.' : 'Every story starts with a scene.'}
        description={
          isImage
            ? 'Give your next visual a clear creative direction.'
            : 'Shape the mood, movement, and moment.'
        }
      />
      <div className="studio-layout">
        <section className="panel form-panel">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <label className="field">
              <span>{isImage ? 'Describe your image' : 'Describe your scene'}</span>
              <textarea
                rows={6}
                value={prompt}
                maxLength={5000}
                onChange={(e) => setPrompt(e.target.value)}
                required
                placeholder={
                  isImage
                    ? 'A sunlit reading nook, soft linen, a well-loved book. Warm afternoon light, editorial photography…'
                    : 'A slow camera move through a quiet city at sunrise. Warm light on the buildings, a cinematic mood…'
                }
              />
            </label>
            <Chips
              label="Aspect ratio"
              options={isImage ? ['1:1', '3:2', '2:3', '16:9', '9:16'] : ['16:9', '9:16', '1:1']}
              value={ratio}
              onChange={setRatio}
            />
            <Chips
              label="Visual style"
              options={
                isImage
                  ? ['Natural', 'Editorial', 'Illustration', '3D', 'Cinematic']
                  : ['Cinematic', 'Documentary', 'Animation', 'Product']
              }
              value={style}
              onChange={setStyle}
            />
            <Chips
              label={isImage ? 'Number of images' : 'Duration'}
              options={isImage ? ['1', '2', '3', '4'] : ['5 sec', '10 sec', '15 sec']}
              value={count}
              onChange={setCount}
            />
            <Button
              type="submit"
              variant="primary"
              className="full-width"
              disabled={!prompt.trim()}
            >
              <Plus size={17} />
              Save {kind} brief
            </Button>
          </form>
          <DemoNote>
            This studio prepares creative briefs. Image and video generation require a connected
            media service.
          </DemoNote>
        </section>
        <section className={`studio-canvas ${kind}`}>
          <div className="canvas-header">
            <span>COMPOSITION PREVIEW</span>
            <span>{ratio}</span>
          </div>
          <div className="aspect-preview" style={{ aspectRatio: ratio.replace(':', '/') }}>
            <Icon size={40} strokeWidth={1} />
            <span>
              {isImage ? 'A little imagination goes a long way.' : 'Your next scene starts here.'}
            </span>
          </div>
          <div className="canvas-footer">
            <span>{style}</span>
            <span>{isImage ? `${count} ${count === '1' ? 'image' : 'images'}` : count}</span>
          </div>
        </section>
      </div>
      <section className="saved-briefs">
        <div className="section-title">
          <h2>
            Your creative briefs <span className="count">{briefs.length}</span>
          </h2>
          {briefs.length > 0 && (
            <Button
              onClick={() =>
                downloadText(
                  `echogpt-${kind}-briefs.json`,
                  JSON.stringify(briefs, null, 2),
                  'application/json',
                )
              }
            >
              <ArrowDownToLine size={16} />
              Export
            </Button>
          )}
        </div>
        {briefs.length ? (
          <div className="brief-grid">
            {briefs.map((b) => (
              <article className="panel brief-card" key={b.id}>
                <div className="section-title">
                  <span className={`tool-icon ${isImage ? 'pink' : 'orange'}`}>
                    <Icon size={19} />
                  </span>
                  <CopyButton text={JSON.stringify(b, null, 2)} />
                </div>
                <p>{b.prompt}</p>
                <div className="brief-meta">
                  <span>{b.style}</span>
                  <span>{b.ratio}</span>
                  <button
                    className="text-button"
                    onClick={() => {
                      setPrompt(b.prompt);
                      setRatio(b.ratio);
                      setStyle(b.style);
                      setCount(b.count);
                      window.document
                        .querySelector('main')
                        ?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Use again
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel">
            <EmptyState
              icon={<Icon />}
              title="Your ideas deserve a place to land."
              description="Save your first brief and build your creative collection."
            />
          </div>
        )}
      </section>
    </div>
  );
}
