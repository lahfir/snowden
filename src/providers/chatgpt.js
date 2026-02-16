import { findInjectionPoint, findHeaderByScoring } from './header-finder.js';

const chatgpt = {
  id: 'chatgpt',
  name: 'ChatGPT',
  hostnames: ['chatgpt.com'],
  chatPathPattern: /^\/c\/[a-f0-9-]+/,

  findHeader() {
    return findInjectionPoint([
      () => document.getElementById('page-header'),

      () => document.querySelector('header.draggable'),

      () => {
        const main = document.querySelector('main#main') || document.querySelector('main');
        return main?.querySelector('header');
      },

      () => {
        const headers = document.querySelectorAll('header');
        for (const h of headers) {
          if (h.closest('nav') || h.closest('[class*="sidebar"]')) continue;
          const rect = h.getBoundingClientRect();
          if (rect.top < 80 && rect.width > window.innerWidth * 0.3) return h;
        }
        return null;
      },

      () => {
        const candidates = Array.from(document.querySelectorAll('header, [role="banner"]'));
        return findHeaderByScoring(candidates);
      }
    ]);
  },

  getConversationId() {
    const match = location.pathname.match(/\/c\/([a-f0-9-]+)/);
    return match ? match[1] : null;
  },

  async fetchThread(id) {
    const response = await fetch(`https://chatgpt.com/backend-api/conversation/${id}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`Failed to fetch conversation: ${response.status}`);

    const data = await response.json();
    const title = data.title || 'Untitled Conversation';
    const thread = walkTree(data.mapping, data.current_node);

    return {
      conversation: { name: title },
      thread
    };
  }
};

function walkTree(mapping, currentNode) {
  const messages = [];
  let nodeId = currentNode;

  while (nodeId && mapping[nodeId]) {
    const node = mapping[nodeId];
    const msg = node.message;

    if (msg && msg.content && (msg.author?.role === 'user' || msg.author?.role === 'assistant')) {
      const text = (msg.content.parts || [])
        .filter(p => typeof p === 'string')
        .join('\n');

      if (text) {
        messages.unshift({
          sender: msg.author.role === 'user' ? 'human' : 'assistant',
          content: text
        });
      }
    }

    nodeId = node.parent;
  }

  return messages;
}

export default chatgpt;
