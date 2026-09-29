/** Frontend demo adapter. Replace this boundary with your authenticated backend.
 * Never bundle provider API keys into a Chrome extension or a browser build. */
export interface AIRequest {
  prompt: string;
  model: string;
  task?: string;
}
export async function requestDemo(
  { prompt, model, task = 'chat' }: AIRequest,
  signal?: AbortSignal,
): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Cancelled', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, 700);
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, { once: true });
  });
  const excerpt = prompt.length > 320 ? `${prompt.slice(0, 320)}…` : prompt;
  if (task === 'grammar')
    return `Example editing plan\n\nYour text: “${excerpt}”\n\n• Lead with the main point.\n• Keep one idea per sentence.\n• Replace vague terms with concrete details.\n• Read the result aloud to check the rhythm.\n\nThis is a local demonstration, not an AI grammar correction.`;
  if (task === 'write')
    return `Example writing outline\n\n${excerpt}\n\n1. Opening — introduce the main point in one clear sentence.\n2. Context — give the reader the details they need.\n3. Next step — end with a specific action or takeaway.\n\nThis sample demonstrates the writing flow. Connect an AI backend to generate a complete draft.`;
  return `Let’s work through it.\n\nYou asked: “${excerpt}”\n\nA useful way to start:\n\n1. Define the outcome you want.\n2. Gather the details that matter.\n3. Turn the idea into a clear next step.\n\nThis is an example response from the ${model} demo adapter. Live AI responses need a connected backend.`;
}
