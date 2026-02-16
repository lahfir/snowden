# Snowden AI - Claude.ai Chat Exporter

Export your Claude.ai conversations as Markdown or PDF with one click.

## Features

- **One-Click Export**: Export button integrated directly into Claude.ai chat interface
- **Markdown Format**: Clean, readable `.md` files with proper User/Assistant formatting
- **PDF Format**: Professional, paginated PDF documents
- **API-Based**: Uses Claude.ai's official API for reliable conversation extraction
- **Smart Thread Detection**: Exports only the active conversation branch (handles edits/regenerations)
- **No Server Required**: All processing happens client-side

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

1. Navigate to any conversation on [claude.ai](https://claude.ai)
2. Click the "Export" button in the chat header
3. Choose "Export as Markdown" or "Export as PDF"
4. File downloads automatically

## How It Works

The extension:
1. Extracts your organization ID from cookies
2. Fetches the full conversation JSON via Claude.ai's API
3. Traverses the message tree to get the active thread (leaf → root)
4. Formats as Markdown or PDF using jsPDF
5. Downloads the file with a sanitized filename

## Development

```bash
bun install           # Install dependencies
bun run build        # Build extension to dist/
```

## Permissions

- `webNavigation`: Detect SPA navigation on claude.ai
- `cookies`: Read organization ID from session cookies
- `https://claude.ai/*`: Access Claude.ai API

## Tech Stack

- **Runtime**: Bun
- **Bundler**: Bun's built-in bundler
- **PDF Generation**: jsPDF
- **Manifest**: Chrome Extension Manifest V3

## License

MIT
