import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { STORAGE_KEY } from '../src/utils/storage';

const mount = () => render(<App />);
const go = async (route: string) => {
  fireEvent.click(screen.getByRole('link', { name: route, exact: true }));
  await waitFor(() => expect(document.title).toContain(route));
  const headings: Record<string, string> = {
    History: 'Good thinking is worth keeping.',
    Settings: 'Make yourself at home.',
    'AI chat': 'Room for every thought.',
    'Prompt library': 'Never start from scratch.',
    'Read & summarize': 'Get to the good parts.',
    Write: 'The right words, a little easier.',
    'Video studio': 'Every story starts with a scene.',
  };
  if (route !== 'AI chat') await screen.findByRole('heading', { name: headings[route] });
  else await screen.findByLabelText('Your prompt');
};
const readSaved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);

describe('EchoGPT workspace flows', () => {
  it('shows every core tool on the overview and opens its page', async () => {
    mount();
    for (const text of [
      'Read & summarize',
      'Translate',
      'Image studio',
      'Video studio',
      'Compare models',
      'Connect tools',
    ]) {
      expect(screen.getByRole('heading', { name: text })).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole('button', { name: /Popular Write Find the right words/ }));
    await screen.findByRole('heading', { name: 'The right words, a little easier.' });
    expect(screen.getByRole('button', { name: 'Generate preview' })).toBeDisabled();
  });

  it('sends, persists, reopens, renames, and removes a conversation', async () => {
    mount();
    fireEvent.change(screen.getByLabelText('Your prompt'), {
      target: { value: 'Help me plan a focused workday' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    await screen.findByText(/This is an example response from the EchoGPT demo adapter/);
    await waitFor(() => expect(readSaved().conversations[0].messages).toHaveLength(2));
    await go('History');
    fireEvent.click(screen.getByRole('button', { name: 'Rename Help me plan a focused workday' }));
    fireEvent.change(screen.getByLabelText('Conversation title'), {
      target: { value: 'My focus plan' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }));
    await waitFor(() => expect(readSaved().conversations[0].title).toBe('My focus plan'));
    fireEvent.click(screen.getByRole('button', { name: 'Pin My focus plan' }));
    expect(readSaved().conversations[0].pinned).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /My focus plan 2 messages/ }));
    await screen.findByRole('heading', { name: 'My focus plan' });
    await go('History');
    fireEvent.click(screen.getByRole('button', { name: 'Delete My focus plan' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete this conversation?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete', exact: true }));
    expect(readSaved().conversations).toHaveLength(0);
    await go('AI chat');
    expect(
      screen.queryByText(/This is an example response from the EchoGPT demo adapter/),
    ).not.toBeInTheDocument();
  });

  it('keeps new chats out of persisted history when saving is off', async () => {
    mount();
    await go('Settings');
    fireEvent.click(screen.getByRole('switch', { name: /Save conversation history/ }));
    await go('AI chat');
    fireEvent.change(screen.getByLabelText('Your prompt'), {
      target: { value: 'An unsaved thought' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    await screen.findByText(/This is an example response from the EchoGPT demo adapter/);
    expect(readSaved().conversations).toHaveLength(0);
    expect(screen.getByText(/You asked: “An unsaved thought”/)).toBeInTheDocument();
  });

  it('persists a selected model and theme after remounting', async () => {
    const view = mount();
    await go('Settings');
    fireEvent.change(screen.getByRole('combobox', { name: 'AI model' }), {
      target: { value: 'claude' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Light', exact: true }));
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('light'));
    view.unmount();
    mount();
    expect(await screen.findByRole('combobox', { name: 'AI model' })).toHaveValue('claude');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('creates a reusable prompt and inserts it into a fresh chat', async () => {
    mount();
    await go('Prompt library');
    fireEvent.click(screen.getByRole('button', { name: 'Create prompt', exact: true }));
    fireEvent.change(screen.getByLabelText('Name', { exact: true }), {
      target: { value: 'Release notes' },
    });
    fireEvent.change(screen.getByLabelText('Prompt', { exact: true }), {
      target: { value: 'Turn these changes into clear release notes.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save prompt' }));
    const card = screen.getByRole('heading', { name: 'Release notes' }).closest('article')!;
    fireEvent.click(within(card).getByRole('button', { name: 'Use prompt' }));
    await waitFor(() =>
      expect(screen.getByLabelText('Your prompt')).toHaveValue(
        'Turn these changes into clear release notes.',
      ),
    );
    expect(readSaved().prompts.some((p: { title: string }) => p.title === 'Release notes')).toBe(
      true,
    );
  });

  it('reads supplied text as exact excerpts and prepares a writing preview', async () => {
    mount();
    await go('Read & summarize');
    fireEvent.change(screen.getByLabelText('Your reading material'), {
      target: { value: 'The first fact is here. The second fact is useful.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create reading preview' }));
    expect(screen.getByText(/• The first fact is here./)).toBeInTheDocument();
    await go('Write');
    fireEvent.change(screen.getByLabelText(/What are you writing about/), {
      target: { value: 'A launch update for my team' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Generate preview' }));
    await screen.findByText(/Example writing outline/);
  });

  it('saves creative briefs with correct video defaults', async () => {
    mount();
    await go('Video studio');
    expect(screen.getByRole('button', { name: '5 sec' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.change(screen.getByLabelText('Describe your scene'), {
      target: { value: 'A calm city at sunrise' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save video brief' }));
    expect(readSaved().briefs[0]).toMatchObject({
      kind: 'video',
      count: '5 sec',
      ratio: '16:9',
      prompt: 'A calm city at sunrise',
    });
  });

  it('opens keyboard search and navigates to a matching tool', async () => {
    mount();
    const user = userEvent.setup();
    await user.keyboard('{Control>}k{/Control}');
    const search = screen.getByRole('dialog', { name: 'Jump to anything' });
    fireEvent.change(within(search).getByLabelText('Search tools and conversations'), {
      target: { value: 'translate' },
    });
    fireEvent.click(within(search).getByRole('button', { name: 'Translate' }));
    await screen.findByRole('heading', { name: 'Good ideas cross borders.' });
  });
});
