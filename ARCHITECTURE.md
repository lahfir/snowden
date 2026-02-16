# Architecture

## Overview

Snowden AI is a Chrome extension that exports conversations from Claude, ChatGPT, and Grok. It uses a **provider pattern** where each platform gets a provider module implementing a common interface. Everything is processed client-side using cookie-based authentication.

## Directory Structure

```
snowden-ai/
├── src/
│   ├── providers/          # Platform providers (common interface)
│   │   ├── index.js        # detectProvider(hostname) → provider
│   │   ├── claude.js       # Claude.ai provider
│   │   ├── chatgpt.js      # ChatGPT provider
│   │   ├── grok.js         # Grok provider
│   │   └── header-finder.js # Shared header detection utilities
│   ├── content/            # Content script (runs on all platform pages)
│   │   ├── index.js        # Main entry point, provider detection
│   │   ├── ui/             # UI injection
│   │   │   ├── inject.js   # Button injection (provider-aware)
│   │   │   └── dropdown.js # Export dropdown + handlers (provider-aware)
│   │   └── observers/      # DOM monitoring
│   │       ├── dom-ready.js # Wait for elements
│   │       └── navigation.js # SPA navigation detection
│   ├── core/               # Claude-specific API logic (used by claude provider)
│   │   ├── auth.js         # Extract org ID from cookies
│   │   ├── api.js          # Fetch conversation from Claude API
│   │   └── tree.js         # Message tree traversal
│   ├── exporters/          # Format converters (platform-agnostic)
│   │   ├── markdown.js     # Markdown formatter
│   │   └── pdf.js          # PDF generator (jsPDF)
│   ├── utils/              # Helpers (platform-agnostic)
│   │   ├── download.js     # File download trigger
│   │   ├── sanitize.js     # Filename sanitization
│   │   └── toast.js        # Toast notifications
│   └── background/
│       └── service-worker.js # Navigation listener (all platforms)
├── public/                 # Static assets
│   ├── manifest.json       # Extension manifest (all platform hosts)
│   ├── icons/              # Extension icons
│   └── styles/             # Injected CSS (per-platform theming)
└── dist/                   # Built extension (generated)
```

## Provider Interface

Each provider implements:

```js
{
  id: 'claude',                    // CSS theming via data-snowden-platform
  name: 'Claude',                  // Display name
  hostnames: ['claude.ai'],        // For platform detection
  chatPathPattern: /^\/chat\/.../, // URL pattern for chat pages

  findHeader() → HTMLElement,      // Where to inject the button
  getConversationId() → string,    // Extract conversation ID from URL
  async fetchThread(id) → {        // Auth + API + normalize
    conversation: { name },
    thread: [{ sender: 'human'|'assistant', content: string }]
  }
}
```

## Smart Header Detection

Instead of brittle CSS selectors, providers use a scoring-based heuristic system (`header-finder.js`) that:

1. **Tries multiple strategies** in priority order (specific → general)
2. **Validates visibility** — skips hidden or off-screen elements
3. **Scores candidates** based on position (top of page), size (toolbar-like), child buttons, semantic tags, and sticky/fixed positioning
4. **Excludes sidebars** — filters out nav/sidebar elements

This makes injection resilient to DOM structure changes across platform updates.

## Data Flow

### 1. Initialization

```
Page Load → content/index.js
  ↓
detectProvider(hostname) → Select platform provider
  ↓
provider.chatPathPattern.test(pathname) → Guard: am I on a chat page?
  ↓
waitForElement(provider.findHeader, 15s) → Wait for chat UI
  ↓
injectExportButton(provider) → Add themed Export button to header
```

### 2. Export Flow

```
User clicks "Export" button
  ↓
showDropdown(button, provider) → Display format options (MD/PDF)
  ↓
User selects format
  ↓
handleExport(format, provider)
  ↓
provider.getConversationId() → Extract ID from URL
  ↓
provider.fetchThread(id) → Fetch + normalize conversation
  ↓
formatAs[Markdown|PDF](conversation, thread) → Convert to format
  ↓
downloadFile(content, filename, mimeType) → Trigger download
  ↓
showToast('Export successful!') → User feedback
```

## Platform Details

### Claude

- **URL**: `/chat/{uuid}`
- **API**: `GET /api/organizations/{org}/chat_conversations/{id}?tree=True`
- **Auth**: `lastActiveOrg` cookie → org ID
- **Tree**: Walk from `current_leaf_message_uuid` backward via `parent_message_uuid`

### ChatGPT

- **URL**: `/c/{uuid}`
- **API**: `GET /backend-api/conversation/{id}`
- **Response**: `{ mapping, current_node, title }`
- **Tree**: Walk from `current_node` backward via `mapping[nodeId].parent`

### Grok

- **URL**: `/chat/{id}`
- **Primary**: `GET /rest/app-chat/conversations/{id}`
- **Fallback**: DOM scraping (message elements by class names)

## Key Technical Decisions

### Why the provider pattern?

- **Extensible**: Adding a new platform = one new file + register in index.js
- **Isolated**: Each provider handles its own auth, API, and DOM quirks
- **Clean separation**: Content scripts, exporters, and utils stay platform-agnostic

### Why scoring-based header detection?

- DOM structures change frequently across platform updates
- Multiple fallback strategies ensure the button always finds a home
- Position/size/semantic heuristics are more stable than class names

### Why cookie-based auth?

- Content scripts run on the platform's origin → cookies sent automatically
- No credential storage or transmission needed
- All providers use `credentials: 'include'`

## Per-Platform Button Theming

Styling uses `data-snowden-platform` attribute selectors:

- **Claude**: Default base styles (rounded corners, subtle border)
- **ChatGPT**: Pill-shaped (`border-radius: 20px`), dark mode via `prefers-color-scheme`
- **Grok**: Fully rounded (`border-radius: 9999px`), X/Twitter dark theme

## Security

- **No data transmission**: All processing client-side
- **Origin-scoped cookies**: Each provider only accesses its own origin
- **No external requests**: Only to the platform's own API

## Browser Compatibility

- Chrome/Chromium, Edge, Brave, Opera
