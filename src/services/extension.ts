export const isExtension = () => typeof chrome !== 'undefined' && !!chrome.runtime?.id;
export function openWorkspace() {
  if (isExtension()) chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
  else window.open(`${location.origin}${location.pathname}`, '_blank', 'noopener,noreferrer');
}
export async function openSidePanel() {
  if (!isExtension()) throw new Error('Install the extension to open the Chrome side panel.');
  const current = await chrome.windows.getCurrent();
  if (!current.id) throw new Error('No active browser window.');
  await chrome.sidePanel.open({ windowId: current.id });
  window.close();
}
export async function readActivePage(): Promise<{ title: string; url: string; text: string }> {
  if (!isExtension())
    throw new Error(
      'Page capture is available in the Chrome extension. Paste text or upload a file here.',
    );
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith('http'))
    throw new Error('Open a regular website, then open EchoGPT from the extension toolbar.');
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      title: document.title,
      url: location.href,
      text: document.body.innerText.slice(0, 50000),
    }),
  });
  if (!result?.result) throw new Error('This page could not be read. Paste the text instead.');
  return result.result;
}
