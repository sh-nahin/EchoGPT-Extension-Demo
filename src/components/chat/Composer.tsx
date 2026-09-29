import { useRef, useState } from 'react';
import { ArrowUp, BookOpen, FileText, Paperclip, Square, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IconButton, ModelSelect } from '../ui';

export function Composer({ large = false }: { large?: boolean }) {
  const { draft, setDraft, send, sending, stop, data, updateSettings, navigate, notify } = useApp();
  const [attachment, setAttachment] = useState<{ name: string; text: string }>();
  const file = useRef<HTMLInputElement>(null);
  const submit = () => {
    if (draft.trim() && !sending) {
      void send(
        `${draft}${attachment ? `\n\nAttached file (${attachment.name}):\n${attachment.text}` : ''}`,
      );
      setAttachment(undefined);
    }
  };
  return (
    <div className={`composer-wrap ${large ? 'large' : ''}`}>
      <div className="composer">
        <textarea
          id="prompt-input"
          aria-label="Your prompt"
          placeholder="Ask anything. Make something great."
          value={draft}
          maxLength={20000}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              data.settings.enterToSend
            ) {
              e.preventDefault();
              submit();
            }
          }}
          rows={large ? 3 : 2}
        />
        {attachment && (
          <div className="attachment-chip">
            <FileText size={14} />
            <span>{attachment.name}</span>
            <IconButton label="Remove attachment" onClick={() => setAttachment(undefined)}>
              <X size={13} />
            </IconButton>
          </div>
        )}
        <div className="composer-toolbar">
          <div className="composer-options">
            <ModelSelect
              value={data.settings.model}
              onChange={(model) => updateSettings({ model })}
            />
            <span className="toolbar-divider" />
            <IconButton
              label="Attach a text or Markdown file"
              onClick={() => file.current?.click()}
            >
              <Paperclip size={18} />
            </IconButton>
            <button
              className="context-button"
              onClick={() => navigate('read')}
              title="Read a page or document"
            >
              <BookOpen size={16} />
              <span>Add context</span>
            </button>
          </div>
          <button
            className={`send-button ${sending ? 'stopping' : ''}`}
            aria-label={sending ? 'Stop response' : 'Send message'}
            disabled={!sending && !draft.trim()}
            onClick={sending ? stop : submit}
          >
            {sending ? <Square size={16} /> : <ArrowUp size={20} />}
          </button>
        </div>
      </div>
      <div className="composer-caption">
        <span>Ideas welcome. Blank pages optional.</span>
        <span>
          {data.settings.enterToSend ? (
            <>
              <kbd>↵</kbd> Send <span className="caption-dot">·</span> <kbd>Shift ↵</kbd> New line
            </>
          ) : (
            'Click the arrow to send'
          )}
        </span>
      </div>
      <input
        ref={file}
        className="sr-only"
        type="file"
        accept=".txt,.md,.csv,.json"
        tabIndex={-1}
        onChange={async (e) => {
          const selected = e.target.files?.[0];
          if (selected) {
            if (selected.size > 1000000) notify('Choose a text file smaller than 1 MB.');
            else {
              try {
                setAttachment({
                  name: selected.name,
                  text: (await selected.text()).slice(0, 30000),
                });
              } catch {
                notify('This file could not be read. Try another text file.');
              }
            }
          }
          e.target.value = '';
        }}
      />
    </div>
  );
}
