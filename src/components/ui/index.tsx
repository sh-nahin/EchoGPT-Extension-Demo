import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ArrowUpRight, Check, Copy, LoaderCircle, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { models } from '../../data/catalog';

export function Button({
  children,
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  return (
    <button type="button" className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function IconButton({
  label,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" className="icon-button" title={label} aria-label={label} {...props}>
      {children}
    </button>
  );
}
export function Badge({ children, color = '' }: { children: ReactNode; color?: string }) {
  return <span className={`badge ${color}`}>{children}</span>;
}
export function ModelMark({ id, small = false }: { id: string; small?: boolean }) {
  const model = models.find((m) => m.id === id) ?? models[0];
  return (
    <span aria-hidden="true" className={`model-mark ${model.color} ${small ? 'small' : ''}`}>
      {model.id === 'echo' ? <Sparkles size={small ? 14 : 22} /> : model.letter}
    </span>
  );
}
export function ModelSelect({
  value,
  onChange,
  label = 'AI model',
  exclude,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  exclude?: string;
  disabled?: boolean;
}) {
  return (
    <label className="model-select">
      <ModelMark id={value} small />
      <span className="sr-only">{label}</span>
      <select disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)}>
        {models
          .filter((m) => m.id !== exclude)
          .map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
      </select>
    </label>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    else if (!open && ref.current?.open) ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      aria-label={title}
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <IconButton label="Close dialog" onClick={onClose}>
          <X size={20} />
        </IconButton>
      </div>
      {children}
    </dialog>
  );
}
export function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="field">
      <legend>{label}</legend>
      <div className="chips">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`chip ${value === option ? 'selected' : ''}`}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="toggle-row">
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle" aria-hidden="true" />
    </label>
  );
}
export function CopyButton({ text }: { text: string }) {
  const { notify } = useApp();
  return (
    <IconButton
      label="Copy text"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          notify('Copied to clipboard');
        } catch {
          notify('Clipboard is unavailable. Select the text to copy it.');
        }
      }}
    >
      <Copy size={16} />
    </IconButton>
  );
}
export function ResultPanel({
  title = 'Your result',
  text,
  loading,
  children,
}: {
  title?: string;
  text?: string;
  loading?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="panel result-panel" aria-live="polite">
      <div className="section-title">
        <h2>{title}</h2>
        {text && <CopyButton text={text} />}
      </div>
      {loading ? (
        <div className="loading-state">
          <LoaderCircle className="spin" size={24} />
          <span>Preparing your preview…</span>
        </div>
      ) : text ? (
        <div className="prose">{text}</div>
      ) : (
        (children ?? (
          <EmptyState
            icon={<Sparkles />}
            title="A little input. A fresh perspective."
            description="Your result will appear here."
          />
        ))
      )}
    </section>
  );
}
export function SectionLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="text-button" onClick={onClick}>
      {children}
      <ArrowUpRight size={15} />
    </button>
  );
}
export function Toast() {
  const { toast } = useApp();
  return (
    <div role="status" aria-live="polite" className={`toast ${toast ? 'visible' : ''}`}>
      {toast && (
        <>
          <Check size={17} />
          <span>{toast}</span>
        </>
      )}
    </div>
  );
}
export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <div className="demo-note">
      <Sparkles size={15} />
      <p>
        {children ?? 'Demo workspace · AI responses are examples. Your work stays in this browser.'}
      </p>
    </div>
  );
}
