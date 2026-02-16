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
   - You should see "Snowden AI - Claude Chat Exporter" in the extensions list
   - The extension should be enabled (toggle switch is blue)
   - Icon should be visible (blue square with "S")

4. **Test it:**
   - Navigate to https://claude.ai
   - Log in to your account
   - Open any conversation
   - Look for the "Export" button in the chat header
   - Click it and try exporting as Markdown or PDF

## Troubleshooting

### Export button doesn't appear

- Refresh the page after installing the extension
- Make sure you're on a conversation page (URL should be `claude.ai/chat/{id}`)
- Check the browser console for errors (F12 → Console tab)
- Verify the extension is enabled in chrome://extensions/

### Export fails with error

- Make sure you're logged in to Claude.ai
- Check your network connection
- Open browser console and look for error messages
- Try a different conversation

### "Could not determine organization ID" error

- Clear your browser cookies for claude.ai
- Log out and log back in to Claude.ai
- Check that cookies are enabled in Chrome

### Files not downloading

- Check Chrome's download settings (chrome://settings/downloads)
- Verify you have permission to save files to the download directory
- Try a different browser if the issue persists

## Uninstallation

1. Go to `chrome://extensions/`
2. Find "Snowden AI - Claude Chat Exporter"
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

## Development Mode

For development with auto-rebuild:

```bash
# Install dependencies
bun install

# Build once
bun run build

# Make changes to source files in src/

# Rebuild after changes
bun run build

# Reload extension in Chrome
# (Use the refresh button in chrome://extensions/)
```

## File Locations

- Source code: `src/`
- Built extension: `dist/`
- Static assets: `public/`
- Documentation: `*.md` files in root

## Browser Compatibility

Confirmed working on:

- ✅ Google Chrome (v120+)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Opera

Not tested on:

- ❌ Firefox (requires Manifest V2 conversion)
- ❌ Safari (requires different extension format)

## Support

For issues or questions:

- Check TESTING.md for common test scenarios
- Review ARCHITECTURE.md for technical details
- Check browser console for error messages
