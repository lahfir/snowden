const SUPPORTED_HOSTS = ['claude.ai', 'chatgpt.com', 'grok.com'];

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (SUPPORTED_HOSTS.some(host => details.url.includes(host))) {
    chrome.tabs.sendMessage(details.tabId, { type: 'URL_CHANGED' }).catch(() => {});
  }
});
