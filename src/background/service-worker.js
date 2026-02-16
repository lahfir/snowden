chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.includes('claude.ai')) {
    chrome.tabs.sendMessage(details.tabId, { type: 'URL_CHANGED' }).catch(() => {});
  }
});
