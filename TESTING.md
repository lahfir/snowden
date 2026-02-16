# Testing Checklist

## Installation Testing

- [ ] Run `bun install` - all dependencies install successfully
- [ ] Run `bun run build` - build completes without errors
- [ ] `dist/` directory contains: content.js, service-worker.js, manifest.json, icons/, styles/
- [ ] Load unpacked extension in Chrome from `dist/` folder
- [ ] Extension appears in chrome://extensions/ with correct name and icon

## Basic Functionality

- [ ] Navigate to https://claude.ai
- [ ] Login to your account
- [ ] Open any existing conversation
- [ ] Export button appears in the chat header
- [ ] Click Export button - dropdown appears with "Export as Markdown" and "Export as PDF"

## Markdown Export

- [ ] Click "Export as Markdown"
- [ ] `.md` file downloads with conversation title as filename
- [ ] Open the file - contains `# Title` heading
- [ ] Messages formatted as `## User` and `## Assistant`
- [ ] Content matches what's visible in the chat

## PDF Export

- [ ] Click "Export as PDF"
- [ ] `.pdf` file downloads with conversation title as filename
- [ ] Open the file - shows title at top
- [ ] User/Assistant messages are clearly labeled and readable
- [ ] Multi-page conversations paginate correctly
- [ ] No text overflow or cutoff

## Navigation Testing

- [ ] Export a conversation
- [ ] Navigate to a different conversation (click another chat)
- [ ] Export button re-appears in the new chat
- [ ] Export the new conversation - correct content exports
- [ ] Use browser back button - export button still works

## Edge Cases

- [ ] Test on a conversation with edited messages (regenerate/edit) - only active branch exports
- [ ] Test on a very long conversation (50+ messages) - PDF paginates correctly
- [ ] Test on a conversation with special characters in title - filename sanitized correctly
- [ ] Test export immediately after page load - waits for DOM and works
- [ ] Test rapid clicking Export button - dropdown opens/closes correctly

## Error Handling

- [ ] Try exporting on non-chat page (e.g., claude.ai/home) - shows appropriate message
- [ ] Test with network offline - shows error toast
- [ ] Test on conversation with no messages - shows "No messages to export"

## Browser Compatibility

- [ ] Chrome/Chromium - all features work
- [ ] Edge - all features work
- [ ] Brave - all features work
- [ ] Opera - all features work

## Files to Manually Inspect

After successful test, verify:
- Exported Markdown has clean formatting
- Exported PDF is professional and readable
- Filenames are properly sanitized (no weird characters)
- Toast notifications appear and dismiss correctly
