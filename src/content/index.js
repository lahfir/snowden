import { waitForElement } from './observers/dom-ready.js';
import { observeNavigation } from './observers/navigation.js';
import { injectExportButton, findChatHeader } from './ui/inject.js';
import { showDropdown } from './ui/dropdown.js';

async function initialize() {
  if (!location.pathname.startsWith('/chat/')) {
    return;
  }

  try {
    await waitForElement(findChatHeader, 5000);
    injectExportButton(showDropdown);
  } catch (error) {
    console.log('Could not inject export button:', error.message);
  }
}

observeNavigation(() => {
  initialize();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'URL_CHANGED') {
    initialize();
  }
});

initialize();
