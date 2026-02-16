# Project Summary: Snowden AI Chrome Extension

## What Was Built

A Chrome extension that adds one-click export functionality to conversations on **Claude.ai**, **ChatGPT**, and **Grok**, supporting both Markdown and PDF formats.

## Implementation Completed

### Core Features
- Provider pattern for multi-platform support
- API-based conversation fetching with DOM scraping fallbacks
- Cookie-based authentication (credentials: 'include' on each origin)
- Message tree traversal for active branch detection (Claude, ChatGPT)
- Markdown export with proper User/Assistant formatting
- PDF export with pagination and professional layout
- Filename sanitization
- Toast notifications for user feedback
- File download mechanism

### Platform Providers
- **Claude**: API-based with org ID cookie auth + tree traversal
- **ChatGPT**: Backend API with mapping tree walk from current_node
- **Grok**: REST API with DOM scraping fallback

### UI Components
- Export button injection into each platform's chat header
- Per-platform button theming via `data-snowden-platform` attribute
- Format selection dropdown (Markdown/PDF)
- CSS styling for all components with dark mode support
- Toast notification system

### Navigation Handling
- SPA route change detection via MutationObserver
- Service worker for webNavigation events (all 4 platforms)
- Automatic button re-injection on navigation

### Build System
- Bun-based build script
- IIFE bundling for content scripts
- Public asset copying
- Manifest V3 configuration

### Documentation
- README.md - Installation and usage guide
- ARCHITECTURE.md - Technical design, provider interface, and data flow
- TESTING.md - Comprehensive test checklist
- INSTALL.md - Detailed installation instructions

## File Count

### Source Files
- src/providers/index.js
- src/providers/claude.js
- src/providers/chatgpt.js
- src/providers/grok.js
- src/providers/header-finder.js
- src/content/index.js
- src/content/ui/inject.js
- src/content/ui/dropdown.js
- src/content/observers/dom-ready.js
- src/content/observers/navigation.js
- src/core/auth.js
- src/core/api.js
- src/core/tree.js
- src/exporters/markdown.js
- src/exporters/pdf.js
- src/utils/download.js
- src/utils/sanitize.js
- src/utils/toast.js
- src/background/service-worker.js
- public/styles/content.css

### Config/Build
- package.json
- build.js
- public/manifest.json
- public/icons/icon16.png
- public/icons/icon48.png
- public/icons/icon128.png

## Dependencies

- jsPDF ^2.5.2 (PDF generation)
- Bun (build system and runtime)

## Permissions Required

- `webNavigation` - Detect SPA navigation
- `https://claude.ai/*`, `https://chatgpt.com/*`, `https://grok.com/*`

## Browser Support

- Chrome, Chromium, Edge, Brave, Opera

## Status: Ready for Testing
