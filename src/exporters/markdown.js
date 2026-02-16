export function formatAsMarkdown(conversation, thread) {
  const title = conversation.name || 'Untitled Conversation';
  let markdown = `# ${title}\n\n`;

  for (const message of thread) {
    const role = message.sender === 'human' ? 'User' : 'Assistant';
    const content = Array.isArray(message.content)
      ? message.content.map(c => c.text || '').join('\n')
      : (message.text || message.content || '');

    markdown += `---\n\n## ${role}\n${content}\n\n`;
  }

  return markdown;
}
