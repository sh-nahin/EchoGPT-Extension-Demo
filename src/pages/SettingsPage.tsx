import { useState } from 'react';
import {
  Check,
  Download,
  Keyboard,
  Moon,
  Shield,
  SlidersHorizontal,
  Sun,
  Trash2,
} from 'lucide-react';
import { Button, DemoNote, Modal, ModelSelect, PageHeading, Toggle } from '../components/ui';
import { useApp } from '../context/AppContext';
import { languages } from '../data/catalog';
import { downloadText } from '../utils/storage';

export default function SettingsPage() {
  const { data, setData, updateSettings, notify, stop } = useApp();
  const [clear, setClear] = useState(false);
  const settings = data.settings;
  return (
    <div className="page settings-page">
      <PageHeading
        eyebrow="SETTINGS"
        title="Make yourself at home."
        description="A few small preferences. A workspace that feels like yours."
        action={
          <span className="autosaved">
            <Check size={15} />
            Changes save automatically
          </span>
        }
      />
      <div className="settings-layout">
        <section className="panel settings-section">
          <div className="section-title">
            <h2>
              <SlidersHorizontal size={19} />
              General
            </h2>
          </div>
          <label className="field">
            <span>What should we call you?</span>
            <input
              value={settings.name}
              maxLength={40}
              placeholder="Your name"
              onChange={(e) => updateSettings({ name: e.target.value })}
            />
          </label>
          <div className="setting-row">
            <div>
              <strong>Default model</strong>
              <small>Your starting point for a new conversation.</small>
            </div>
            <ModelSelect value={settings.model} onChange={(model) => updateSettings({ model })} />
          </div>
          <label className="setting-row">
            <span>
              <strong>Preferred output language</strong>
              <small>Used as the default in the writing tool.</small>
            </span>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
            >
              {languages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </section>
        <section className="panel settings-section">
          <div className="section-title">
            <h2>
              <Moon size={19} />
              Appearance
            </h2>
          </div>
          <div className="theme-options">
            {(['dark', 'light'] as const).map((theme) => (
              <button
                aria-pressed={settings.theme === theme}
                className={`theme-option ${settings.theme === theme ? 'selected' : ''}`}
                key={theme}
                onClick={() => updateSettings({ theme })}
              >
                <div className={`theme-preview ${theme}`}>
                  <span />
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <span>
                  {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === 'dark' ? 'Dark' : 'Light'}
                  {settings.theme === theme && <Check size={16} />}
                </span>
              </button>
            ))}
          </div>
          <Toggle
            checked={settings.reduceMotion}
            onChange={(reduceMotion) => updateSettings({ reduceMotion })}
            label="Reduce motion"
            description="Keep transitions and animations to a minimum."
          />
        </section>
        <section className="panel settings-section">
          <div className="section-title">
            <h2>
              <Keyboard size={19} />
              Chat & shortcuts
            </h2>
          </div>
          <Toggle
            checked={settings.enterToSend}
            onChange={(enterToSend) => updateSettings({ enterToSend })}
            label="Enter to send"
            description="Use Shift + Enter to add a new line."
          />
          <div className="shortcut-row">
            <span>Search your workspace</span>
            <span>
              <kbd>Ctrl / ⌘</kbd> + <kbd>K</kbd>
            </span>
          </div>
          <div className="shortcut-row">
            <span>Close a dialog</span>
            <kbd>Esc</kbd>
          </div>
        </section>
        <section className="panel settings-section">
          <div className="section-title">
            <h2>
              <Shield size={19} />
              Your data
            </h2>
          </div>
          <Toggle
            checked={settings.saveHistory}
            onChange={(saveHistory) => updateSettings({ saveHistory })}
            label="Save conversation history"
            description="Keep new conversations in this browser."
          />
          <div className="setting-row">
            <div>
              <strong>Export workspace</strong>
              <small>Download chats, prompts, preferences, and briefs as JSON.</small>
            </div>
            <Button
              onClick={() =>
                downloadText(
                  'echogpt-workspace.json',
                  JSON.stringify(data, null, 2),
                  'application/json',
                )
              }
            >
              <Download size={16} />
              Export
            </Button>
          </div>
          <div className="setting-row">
            <div>
              <strong>Clear conversation history</strong>
              <small>Permanently remove all saved conversations.</small>
            </div>
            <Button
              variant="danger"
              disabled={!data.conversations.length}
              onClick={() => setClear(true)}
            >
              <Trash2 size={16} />
              Clear
            </Button>
          </div>
        </section>
      </div>
      <DemoNote>
        EchoGPT frontend concept · Version 1.0.0 · No account, billing, or AI provider is connected.
      </DemoNote>
      <Modal open={clear} onClose={() => setClear(false)} title="Clear all conversation history?">
        <p>
          This deletes {data.conversations.length} saved{' '}
          {data.conversations.length === 1 ? 'conversation' : 'conversations'} from this browser.
          Export your workspace first if you want a copy.
        </p>
        <div className="modal-actions">
          <Button onClick={() => setClear(false)}>Keep history</Button>
          <Button
            variant="danger"
            onClick={() => {
              stop();
              setData((d) => ({ ...d, conversations: [] }));
              setClear(false);
              notify('Conversation history cleared');
            }}
          >
            Delete all conversations
          </Button>
        </div>
      </Modal>
    </div>
  );
}
