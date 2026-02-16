# Testing Checklist

## Installation Testing

- [ ] Run `bun install` - all dependencies install successfully
- [ ] Run `bun run build` - build completes without errors
- [ ] `dist/` directory contains: content.js, service-worker.js, manifest.json, icons/, styles/
- [ ] Load unpacked extension in Chrome from `dist/` folder
- [ ] Extension appears in chrome://extensions/ with correct name and icon

## Claude.ai

- [ ] Navigate to https://claude.ai and login
- [ ] Open any existing conversation
- [ ] Export button appears in the chat header
- [ ] Click Export button - dropdown appears
- [ ] Export as Markdown - `.md` file downloads with correct content
- [ ] Export as PDF - `.pdf` file downloads with correct content
- [ ] Navigate to different conversation - button re-appears

## ChatGPT

- [ ] Navigate to https://chatgpt.com and login
- [ ] Open any existing conversation (`/c/{id}`)
- [ ] Export button appears with pill-shaped styling
- [ ] Export as Markdown - correct user/assistant formatting
- [ ] Export as PDF - paginated correctly
- [ ] Dark mode - button adapts to dark theme

## Grok

- [ ] Navigate to https://grok.com and login
- [ ] Open any conversation (`/chat/{id}`)
- [ ] Export button appears with X-style rounded styling
- [ ] Export as Markdown - correct content
- [ ] Export as PDF - readable output

## Cross-Platform

- [ ] Navigate between platforms - button styling matches each site
- [ ] Export on one platform, then another - both work correctly
- [ ] SPA navigation within each platform - button re-injects

## Edge Cases

- [ ] Test on conversation with edited messages (Claude/ChatGPT) - only active branch exports
- [ ] Test on very long conversation (50+ messages) - PDF paginates correctly
- [ ] Test on conversation with special characters in title - filename sanitized correctly
- [ ] Test rapid clicking Export button - dropdown opens/closes correctly

## Error Handling

- [ ] Try exporting on non-chat page - no button injected or shows appropriate message
- [ ] Test with network offline - shows error toast
- [ ] Test on conversation with no messages - shows "No messages to export"
