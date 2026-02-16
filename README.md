# Snowden AI - Chat Exporter

Export conversations from **Claude**, **ChatGPT**, and **Grok** as Markdown or PDF with one click.

## Features

- **Multi-Platform**: Works on Claude.ai, ChatGPT, and Grok
- **One-Click Export**: Export button integrated directly into each platform's chat interface
- **Markdown Format**: Clean, readable `.md` files with proper User/Assistant formatting
- **PDF Format**: Professional, paginated PDF documents
- **Platform-Themed UI**: Button styling adapts to match each site's visual design
- **No Server Required**: All processing happens client-side

## Supported Platforms

| Platform | URL Pattern | Data Source |
|----------|------------|-------------|
| Claude | `claude.ai/chat/{id}` | Claude API |
| ChatGPT | `chatgpt.com/c/{id}` | Backend API |
| Grok | `grok.com/chat/{id}` | REST API + DOM fallback |

## Installation

1. Build the extension:
```bash
bun install
bun run build
```

2. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist/` folder

## Usage

1. Navigate to any conversation on a supported platform
2. Click the "Export" button in the chat header
3. Choose "Export as Markdown" or "Export as PDF"
4. File downloads automatically

## Development

```bash
bun install           # Install dependencies
bun run build        # Build extension to dist/
```

## Permissions

- `webNavigation`: Detect SPA navigation across platforms
- `https://claude.ai/*`, `https://chatgpt.com/*`, `https://grok.com/*`: Access platform APIs

## Tech Stack

- **Runtime**: Bun
- **Bundler**: Bun's built-in bundler
- **PDF Generation**: jsPDF
- **Manifest**: Chrome Extension Manifest V3

## License

MIT
