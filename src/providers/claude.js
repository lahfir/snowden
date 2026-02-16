import { getOrgId, fetchOrgId } from '../core/auth.js';
import { fetchConversation } from '../core/api.js';
import { getActiveThread } from '../core/tree.js';

const claude = {
  id: 'claude',
  name: 'Claude',
  hostnames: ['claude.ai'],
  chatPathPattern: /^\/chat\/[a-f0-9-]+/,

  findHeader() {
    const selectors = [
      () => document.querySelector('[data-testid="chat-header"]'),
      () => document.querySelector('header[class*="chat"]'),
      () => document.querySelector('div[class*="ChatHeader"]'),
      () => document.querySelector('div[class*="header"] button'),
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const shareBtn = buttons.find(b => b.textContent.includes('Share'));
        return shareBtn?.parentElement;
      }
    ];

    for (const selector of selectors) {
      const element = selector();
      if (element) return element;
    }
    return null;
  },

  getConversationId() {
    const match = location.pathname.match(/\/chat\/([a-f0-9-]+)/);
    return match ? match[1] : null;
  },

  async fetchThread(id) {
    let orgId = getOrgId();
    if (!orgId) {
      orgId = await fetchOrgId();
      if (!orgId) throw new Error('Could not determine organization ID');
    }

    const conversation = await fetchConversation(orgId, id);
    const messages = getActiveThread(conversation);

    const thread = messages.map(msg => {
      const content = Array.isArray(msg.content)
        ? msg.content.map(c => c.text || '').join('\n')
        : (msg.text || msg.content || '');
      return { sender: msg.sender, content };
    });

    return {
      conversation: { name: conversation.name || 'Untitled Conversation' },
      thread
    };
  }
};

export default claude;
