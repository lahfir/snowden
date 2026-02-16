import claude from './claude.js';
import chatgpt from './chatgpt.js';
import grok from './grok.js';

const providers = [claude, chatgpt, grok];

export function detectProvider(hostname = location.hostname) {
  return providers.find(p => p.hostnames.some(h => hostname.includes(h))) || null;
}
