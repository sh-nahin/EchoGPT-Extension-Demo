import { useState } from 'react';
import { ArrowUpRight, Braces, Check, Database, FileText, Plug, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, DemoNote, IconButton, Modal, PageHeading } from '../components/ui';
import { useApp } from '../context/AppContext';
import { uid } from '../utils/storage';

export default function McpPage() {
  const { data, setData, notify } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [remove, setRemove] = useState<string>();
  const presets = [
    {
      name: 'Documentation',
      icon: FileText,
      color: 'blue',
      description: 'Give your conversations the context of your docs.',
    },
    {
      name: 'Developer tools',
      icon: Braces,
      color: 'violet',
      description: 'Bring your development workflow into one place.',
    },
    {
      name: 'Data sources',
      icon: Database,
      color: 'orange',
      description: 'Keep useful information within easy reach.',
    },
  ];
  return (
    <div className="page">
      <PageHeading
        eyebrow="MCP CONNECTIONS"
        title="Your tools, in the conversation."
        description="Organize the services you want to connect to EchoGPT."
        action={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus size={17} />
            Add server
          </Button>
        }
      />
      <div className="connection-callout">
        <span className="tool-icon violet">
          <Plug size={26} />
        </span>
        <div>
          <h2>A workspace that works with yours.</h2>
          <p>Model Context Protocol connects AI apps to external tools and information.</p>
        </div>
        <a
          className="text-button"
          href="https://modelcontextprotocol.io/"
          target="_blank"
          rel="noreferrer"
        >
          About MCP
          <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="section-title">
        <h2>
          Server configurations <span className="count">{data.connections.length}</span>
        </h2>
        <Badge>Stored locally</Badge>
      </div>
      <div className="connections-grid">
        {data.connections.map((c) => (
          <article className="panel connection-card" key={c.id}>
            <div className="section-title">
              <span className="tool-icon green">
                <Plug size={20} />
              </span>
              <IconButton label={`Delete ${c.name}`} onClick={() => setRemove(c.id)}>
                <Trash2 size={16} />
              </IconButton>
            </div>
            <h3>{c.name}</h3>
            <p className="connection-url">{c.url}</p>
            <Badge>Not connected</Badge>
          </article>
        ))}
        <button className="add-connection" onClick={() => setOpen(true)}>
          <Plus size={25} />
          <strong>Add an MCP server</strong>
          <span>Name it. Add the endpoint. Keep it ready.</span>
        </button>
      </div>
      <div className="section-title section-spaced">
        <h2>Build around your workflow</h2>
      </div>
      <div className="connections-grid">
        {presets.map((p) => (
          <article className="panel connection-card" key={p.name}>
            <span className={`tool-icon ${p.color}`}>
              <p.icon size={22} />
            </span>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <Button
              variant="ghost"
              onClick={() => {
                setName(p.name);
                setOpen(true);
              }}
            >
              Configure
              <ArrowUpRight size={15} />
            </Button>
          </article>
        ))}
      </div>
      <DemoNote>
        Server configurations are saved locally. This frontend does not contact servers,
        authenticate accounts, or execute MCP tools.
      </DemoNote>
      <Modal open={open} onClose={() => setOpen(false)} title="Add an MCP server">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              const parsed = new URL(url);
              if (
                parsed.protocol !== 'https:' &&
                !(
                  parsed.protocol === 'http:' &&
                  ['localhost', '127.0.0.1'].includes(parsed.hostname)
                )
              )
                throw new Error();
              if (parsed.username || parsed.password) {
                notify('Keep credentials out of the server URL.');
                return;
              }
              setData((d) => ({
                ...d,
                connections: [...d.connections, { id: uid(), name: name.trim(), url: parsed.href }],
              }));
              setOpen(false);
              setName('');
              setUrl('');
              notify('Server configuration saved. It is not connected yet.');
            } catch {
              notify('Use an HTTPS server URL, or HTTP for localhost.');
            }
          }}
        >
          <label className="field">
            <span>Server name</span>
            <input
              autoFocus
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My documentation server"
            />
          </label>
          <label className="field">
            <span>Server endpoint</span>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-server.com/mcp"
            />
          </label>
          <p className="muted small-text">
            Use a public endpoint without credentials. Authentication belongs in your backend
            integration.
          </p>
          <div className="modal-actions">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={!name.trim() || !url.trim()}>
              <Check size={16} />
              Save configuration
            </Button>
          </div>
        </form>
      </Modal>
      <Modal open={!!remove} onClose={() => setRemove(undefined)} title="Remove this server?">
        <p>The saved configuration will be removed from this browser.</p>
        <div className="modal-actions">
          <Button onClick={() => setRemove(undefined)}>Keep server</Button>
          <Button
            variant="danger"
            onClick={() => {
              setData((d) => ({ ...d, connections: d.connections.filter((c) => c.id !== remove) }));
              setRemove(undefined);
              notify('Server configuration removed');
            }}
          >
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
}
