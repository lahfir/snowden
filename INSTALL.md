# Installation Instructions

## Quick Start

1. **Build the extension:**

   ```bash
   cd /Users/lahfir/Documents/Projects/snowden-ai
   bun install
   bun run build
   ```

2. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" using the toggle in the top-right corner
   - Click the "Load unpacked" button
   - Navigate to and select the `dist/` folder inside the project directory
   - The extension should now appear in your extensions list

3. **Verify installation:**
   - You should see "Snowden AI - Chat Exporter" in the extensions list
   - The extension should be enabled (toggle switch is blue)
   - Icon should be visible (blue square with "S")

4. **Test it:**
   - Navigate to any supported platform (claude.ai, chatgpt.com, grok.com)
   - Log in to your account
   - Open any conversation
   - Look for the "Export" button in the chat header
   - Click it and try exporting as Markdown or PDF

## Troubleshooting

### Export button doesn't appear

- Refresh the page after installing the extension
- Make sure you're on a conversation page (e.g., `claude.ai/chat/{id}`, `chatgpt.com/c/{id}`)
- Check the browser console for errors (F12 → Console tab)
- Verify the extension is enabled in chrome://extensions/

### Export fails with error

- Make sure you're logged in to the platform
- Check your network connection
- Open browser console and look for error messages
- Try a different conversation

### "Could not determine organization ID" error (Claude only)

- Clear your browser cookies for claude.ai
- Log out and log back in to Claude.ai
- Check that cookies are enabled in Chrome

### Files not downloading

- Check Chrome's download settings (chrome://settings/downloads)
- Verify you have permission to save files to the download directory

## Uninstallation

1. Go to `chrome://extensions/`
2. Find "Snowden AI - Chat Exporter"
3. Click "Remove"
4. Confirm removal

## Updating

If you make changes to the code:

1. Rebuild:

   ```bash
   bun run build
   ```

2. Reload in Chrome:
   - Go to `chrome://extensions/`
   - Find the extension
   - Click the refresh icon (circular arrow)

## Browser Compatibility

Confirmed working on:

- Google Chrome (v120+)
- Microsoft Edge (Chromium-based)
- Brave Browser
- Opera
