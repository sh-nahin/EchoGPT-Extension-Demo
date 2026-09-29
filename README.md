# EchoGPT — AI Workspace

A responsive React + TypeScript frontend for the EchoGPT Chrome extension concept. The overview brings every tool into one workspace, with dedicated pages for Chat, Write, Read, Translate, Image, Video, Compare, MCP, History, Prompts, Models, and Settings.

Dark mode is the default. Light mode, reduced motion, and keyboard shortcuts are available in Settings.

## Start the project

Use Node.js 22 or newer and npm.

```bash
npm ci
npm run dev
```

Open the local address printed by Vite. The app also runs as a regular responsive web frontend.

```bash
npm run build       # TypeScript validation and optimized production build
npm run preview     # Serve the production build locally
npm run typecheck   # Strict TypeScript validation
npm test            # Component and workflow tests
npm run format      # Format source and configuration
```

## Load in Chrome

The included `dist/` is a ready-to-load production build. Rebuild after changing the source.

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and choose this project's `dist` folder.
4. Pin EchoGPT, then click its toolbar icon to open the 420 × 600 popup.
5. Use **Open side panel** in the popup header to move into Chrome's side panel, or **Open full workspace in new tab** for the desktop layout.

The extension requires Chrome 116 or newer. Settings can also be opened from the extension's **Options** action. Chrome extensions are a desktop browser feature; the normal web frontend provides the mobile and tablet experience.

No background service, remote script, or external font is required. The manifest requests `sidePanel`, `activeTab`, and `scripting`. Page capture runs only when the user selects **Read current page**. Chrome internal pages, the Web Store, and other restricted pages cannot be captured.

## What works

| Area           | Included behavior                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Overview       | All seven tools, model library, composer, quick prompts, recent chats, and saved prompts                                     |
| Chat           | Model selection, Enter/Shift+Enter behavior, text attachments, loading/stop state, copying, and Markdown export              |
| Write          | Compose/Reply/Grammar modes, format, tone, length, language, and sample writing output                                       |
| Read           | Paste text, drag/drop or select a text file, add a URL, capture an active browser page, and exact local excerpts             |
| Translate      | Language selection, swapping, tone, built-in greeting examples, and request previews for custom text                         |
| Image & Video  | Creative direction, ratio/style/count or duration controls, saved briefs, reuse, copying, and JSON export                    |
| Compare        | Two distinct model selections with concurrent demo responses                                                                 |
| MCP            | Validated server configuration, local saving, and removal confirmation                                                       |
| History        | Search, pin, rename, reopen, export, and confirmed deletion                                                                  |
| Prompt library | Categories, search, favorites, custom prompts, deletion, and use in a new chat                                               |
| Models         | Search and persistent default model selection                                                                                |
| Settings       | Name, model, language, dark/light theme, reduced motion, Enter-to-send, history preference, data export, and history removal |
| Navigation     | Dedicated hash routes, browser back/forward, responsive sidebar/drawer, and Ctrl/⌘ + K search                                |

## Frontend scope

This is a frontend project, without a live AI backend, authentication, payment processing, or connected MCP execution.

- Chat, writing, and comparison return **clearly labeled example responses** from `src/services/ai.ts`.
- Model names represent provider choices in the concept, not verified live model IDs or availability.
- Reading produces exact opening excerpts and a word count. It does not claim to produce semantic AI summaries. URL submission prepares a reading request; it does not fetch external pages.
- Translation includes a built-in greeting in eleven languages to demonstrate the result state. Arbitrary text prepares a request and is not falsely labeled as translated.
- The creative studios save briefs, not generated images or video.
- MCP configurations remain **Not connected**. No authentication request or network call is made.

To enable live AI, replace the adapter in `src/services/ai.ts` with requests to an authenticated backend and pass the full conversation when implementing multi-turn chat. Add separate provider endpoints for translation, reading, image generation, video, and MCP as needed. Keep API keys on the server; never ship secret provider keys in extension source, Vite environment variables, localStorage, or the production bundle.

## Project structure

| Path                        | Responsibility                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `src/main.tsx`              | React entry point and popup sizing                                                    |
| `src/App.tsx`               | Lazy-loaded page map and app shell                                                    |
| `src/components/layout/`    | Sidebar, header, mobile navigation, and command search                                |
| `src/components/chat/`      | Shared prompt composer and file attachment UI                                         |
| `src/components/ui/`        | Buttons, badges, dialogs, toggles, model selection, result states, and error boundary |
| `src/components/Studio.tsx` | Shared image/video studio workflow                                                    |
| `src/pages/`                | One component file per page                                                           |
| `src/context/`              | App state, conversation lifecycle, settings, and persistence                          |
| `src/hooks/`                | Hash routing and cancelable demo requests                                             |
| `src/services/`             | AI adapter and Chrome extension API boundary                                          |
| `src/data/`                 | Tool navigation, provider choices, languages, and starter prompts                     |
| `src/types/`                | Shared TypeScript models                                                              |
| `src/utils/`                | Storage, IDs, date labels, and downloads                                              |
| `src/styles/`               | Theme tokens, base rules, components, pages, and responsive rules                     |
| `public/`                   | Manifest, favicon, and extension icons                                                |
| `tests/`                    | Component workflow tests and browser responsive smoke tests                           |
| `dist/`                     | Prebuilt production web app and unpacked extension                                    |

There was no existing project or retrievable earlier folder specification available with the attachments. This structure preserves the referenced tool organization while separating UI, state, services, and styles.

## State and privacy

Preferences, saved conversations, prompts, briefs, and MCP endpoint configurations use `localStorage` under `echogpt.workspace.v1`. Changes sync between same-origin open views through the storage event. Data remains in the current browser profile; this is not an account-synced service. Web and extension origins have separate storage.

Disabling history prevents subsequent chat submissions from being persisted. Existing history is retained until deleted. Unsaved messages stay available only in the current session. Uploaded file contents become part of a conversation if you attach and send them with history enabled. Browser storage is not encrypted by this app; do not store credentials in prompts or MCP URLs.

## Accessibility and performance

- Semantic controls and visible keyboard focus; labeled icon buttons and model choices.
- Native modal dialogs provide focus containment and Escape behavior in supporting browsers.
- Skip link, reduced-motion support, status announcements, and explicit disabled/loading states.
- Responsive grids and compact navigation for desktop, tablet, mobile, popup, and side-panel widths.
- Route-level code splitting, local assets, no remote fonts, and no third-party requests during normal demo use.

These are accessibility provisions, not a claim of a completed WCAG conformance audit. Test with your target browsers and assistive technology before release.

## Browser smoke tests

```bash
npx playwright install chromium
npm run test:e2e
```

The browser suite covers all pages at 1440, 768, 390, and 320 pixels, checks overflow and runtime errors, and exercises the mobile navigation drawer. See `QA.md` for checks performed in the delivery environment and remaining validation.

## Extension documentation

- [Chrome manifest reference](https://developer.chrome.com/docs/extensions/reference/manifest)
- [Chrome popup guide](https://developer.chrome.com/docs/extensions/develop/ui/add-popup)
- [Chrome Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
