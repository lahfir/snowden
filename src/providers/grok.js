import { findInjectionPoint, findHeaderByScoring } from './header-finder.js';

const grok = {
  id: 'grok',
  name: 'Grok',
  hostnames: ['grok.com'],
  chatPathPattern: /^\/chat\/[a-zA-Z0-9_-]+/,

  findHeader() {
    return findInjectionPoint([
      () => {
        const main = document.querySelector('main');
        if (!main) return null;
        const navContainer = main.querySelector('[class*="@container/nav"], [class*="container\\/nav"]');
        if (navContainer) {
          const bar = navContainer.querySelector('[class*="h-16"], [class*="h-14"]');
          return bar || navContainer;
        }
        return null;
      },

      () => {
        const main = document.querySelector('main');
        if (!main) return null;
        const firstChild = main.children[0];
        if (!firstChild) return null;
        const rect = firstChild.getBoundingClientRect();
        if (rect.top < 80 && rect.height < 120 && rect.height > 10) {
          const innerBar = firstChild.children[0];
          if (innerBar) {
            const innerRect = innerBar.getBoundingClientRect();
            if (innerRect.height < 120 && innerRect.height > 10) return innerBar;
          }
          return firstChild;
        }
        return null;
      },

      () => {
        const main = document.querySelector('main');
        if (!main) return null;
        const candidates = Array.from(main.querySelectorAll(':scope > div > div')).slice(0, 10);
        return findHeaderByScoring(candidates);
      },

      () => {
        const candidates = Array.from(
          document.querySelectorAll('header, [role="banner"], [class*="header"], [class*="Header"]')
        ).filter(h => !h.closest('nav') && !h.closest('[class*="sidebar"]'));
        return findHeaderByScoring(candidates);
      }
    ]);
  },

  getConversationId() {
    const match = location.pathname.match(/\/chat\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  },

  async fetchThread(id) {
    try {
      return await fetchViaAPI(id);
    } catch {
      return scrapeFromDOM();
    }
  }
};

async function fetchViaAPI(id) {
  const response = await fetch(`https://grok.com/rest/app-chat/conversations/${id}`, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) throw new Error(`API failed: ${response.status}`);

  const data = await response.json();
  const title = data.title || data.name || 'Grok Conversation';

  const thread = (data.messages || [])
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      sender: m.role === 'user' ? 'human' : 'assistant',
      content: m.content || m.text || ''
    }));

  return { conversation: { name: title }, thread };
}

function scrapeFromDOM() {
  const messages = [];
  const messageEls = document.querySelectorAll('[class*="message"], [class*="Message"], [data-message-id]');

  for (const el of messageEls) {
    const isUser = el.classList.toString().match(/user|human/i) ||
                   el.querySelector('[class*="user"], [class*="User"]');
    const text = el.innerText?.trim();

    if (text) {
      messages.push({
        sender: isUser ? 'human' : 'assistant',
        content: text
      });
    }
  }

  if (messages.length === 0) {
    const allBlocks = document.querySelectorAll('div[class*="turn"], div[class*="response"], div[class*="query"]');
    for (const block of allBlocks) {
      const isUser = block.classList.toString().match(/query|user|human/i);
      const text = block.innerText?.trim();
      if (text) {
        messages.push({
          sender: isUser ? 'human' : 'assistant',
          content: text
        });
      }
    }
  }

  return {
    conversation: { name: document.title || 'Grok Conversation' },
    thread: messages
  };
}

export default grok;
