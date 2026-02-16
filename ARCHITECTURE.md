# Architecture

## Overview

Snowden AI is a Chrome extension that exports Claude.ai conversations using the official Claude API. It uses cookie-based authentication and processes everything client-side.

## Directory Structure

```
snowden-ai/
├── src/
│   ├── content/          # Content script (runs in claude.ai pages)
│   │   ├── index.js      # Main entry point
│   │   ├── ui/           # UI injection
│   │   │   ├── inject.js # Button injection logic
│   │   │   └── dropdown.js # Export dropdown + handlers
│   │   └── observers/    # DOM monitoring
│   │       ├── dom-ready.js # Wait for elements
│   │       └── navigation.js # SPA navigation detection
│   ├── core/             # Core API logic
│   │   ├── auth.js       # Extract org ID from cookies
│   │   ├── api.js        # Fetch conversation from Claude API
│   │   └── tree.js       # Message tree traversal
│   ├── exporters/        # Format converters
│   │   ├── markdown.js   # Markdown formatter
│   │   └── pdf.js        # PDF generator (jsPDF)
│   ├── utils/            # Helpers
│   │   ├── download.js   # File download trigger
│   │   ├── sanitize.js   # Filename sanitization
│   │   └── toast.js      # Toast notifications
│   └── background/
│       └── service-worker.js # Navigation listener
├── public/               # Static assets
│   ├── manifest.json     # Extension manifest
│   ├── icons/            # Extension icons
│   └── styles/           # Injected CSS
└── dist/                 # Built extension (generated)
```

## Data Flow

### 1. Initialization
```
Page Load → content/index.js
  ↓
waitForElement(findChatHeader) → Wait for chat UI
  ↓
injectExportButton() → Add Export button to header
```

### 2. Export Flow
```
User clicks "Export" button
  ↓
showDropdown() → Display format options (MD/PDF)
  ↓
User selects format
  ↓
handleExport(format)
  ↓
Extract conversationId from URL
  ↓
getOrgId() → Parse lastActiveOrg cookie
  ↓
fetchConversation(orgId, conversationId) → GET /api/.../chat_conversations/{id}
  ↓
getActiveThread(conversation) → Traverse message tree (leaf→root)
  ↓
formatAs[Markdown|PDF](conversation, thread) → Convert to format
  ↓
downloadFile(content, filename, mimeType) → Trigger download
  ↓
showToast('Export successful!') → User feedback
```

### 3. Navigation Handling
```
User navigates to different chat (SPA)
  ↓
MutationObserver detects URL change
  ↓
observeNavigation callback fires
  ↓
Re-run initialize() → Inject button in new chat
```

## Key Technical Decisions

### Why API over DOM scraping?
- **Reliability**: DOM structure changes frequently
- **Completeness**: API returns full conversation including metadata
- **Branching**: API includes message tree structure for handling edits/regenerations

### Why cookie-based auth?
- **No credentials needed**: Extension runs on claude.ai origin, cookies sent automatically
- **No backend**: Everything client-side
- **Security**: No credential storage or transmission

### Why IIFE bundle format?
- **MV3 requirement**: Content scripts can't use ES modules
- **Single file**: Easier to inject

### Why jsPDF?
- **Offline**: No server required
- **Client-side**: Privacy-preserving
- **Full control**: Custom formatting, pagination

### Message tree traversal algorithm
```javascript
// Conversations can branch when user edits/regenerates
// We want only the active branch (current_leaf_message_uuid → root)

function getActiveThread(conversation) {
  const messageMap = new Map();
  for (const msg of conversation.chat_messages) {
    messageMap.set(msg.uuid, msg);
  }

  const thread = [];
  let currentUuid = conversation.current_leaf_message_uuid;

  while (currentUuid) {
    const message = messageMap.get(currentUuid);
    if (!message) break;

    thread.unshift(message); // Build thread backward
    currentUuid = message.parent_message_uuid;
  }

  return thread;
}
```

## API Endpoint

```
GET https://claude.ai/api/organizations/{org_id}/chat_conversations/{conversation_id}
  ?tree=True
  &rendering_mode=messages
  &render_all_tools=true
```

**Authentication**: Cookie-based (session cookies automatically sent)

**Response structure**:
```json
{
  "uuid": "conversation-id",
  "name": "Conversation Title",
  "current_leaf_message_uuid": "uuid-of-latest-message",
  "chat_messages": [
    {
      "uuid": "message-uuid",
      "sender": "human" | "assistant",
      "content": [...],
      "text": "message text",
      "parent_message_uuid": "parent-uuid"
    }
  ]
}
```

## Extension Lifecycle

### Installation
1. User loads unpacked extension from `dist/`
2. Service worker registers
3. Content script injected on claude.ai pages

### Runtime
1. Content script waits for chat UI to appear
2. Injects Export button
3. Listens for navigation events (SPA)
4. Re-injects button on URL changes

### Export
1. User clicks Export → format selection
2. Fetch conversation via API
3. Process locally (MD/PDF)
4. Download file
5. Show toast notification

## Performance Considerations

- **Lazy loading**: Button only injected when chat UI exists
- **Debouncing**: Navigation observer prevents duplicate injections
- **Minimal bundle**: ~1.3MB (mostly jsPDF)
- **No background processing**: All work on-demand

## Security

- **No data transmission**: All processing client-side
- **Cookie access**: Limited to claude.ai origin
- **No external requests**: Only to claude.ai API
- **Content Security Policy**: Compatible with MV3 CSP

## Browser Compatibility

- Chrome/Chromium ✅
- Edge ✅
- Brave ✅
- Opera ✅
- Firefox ❌ (manifest needs adjustment for MV2)
