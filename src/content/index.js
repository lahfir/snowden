import { waitForElement } from './observers/dom-ready.js';
import { observeNavigation } from './observers/navigation.js';
import { injectExportButton } from './ui/inject.js';
import { showDropdown } from './ui/dropdown.js';
import { detectProvider } from '../providers/index.js';

const provider = detectProvider();

async function initialize() {
  if (!provider) return;
  if (!provider.chatPathPattern.test(location.pathname)) return;

  try {
    await waitForElement(() => provider.findHeader(), 15000);
    injectExportButton(provider, (button) => showDropdown(button, provider));
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
