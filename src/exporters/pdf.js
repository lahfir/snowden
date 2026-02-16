import { jsPDF } from 'jspdf';

export function formatAsPDF(conversation, thread) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  let y = margin;

  function ensureSpace(needed) {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  const title = conversation.name || 'Untitled Conversation';
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  const titleLines = doc.splitTextToSize(title, maxWidth);
  ensureSpace(titleLines.length * 10);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 10 + 10;

  doc.setFontSize(11);

  for (const message of thread) {
    const role = message.sender === 'human' ? 'User' : 'Assistant';
    const content = Array.isArray(message.content)
      ? message.content.map(c => c.text || '').join('\n')
      : (message.text || message.content || '');

    ensureSpace(20);
    doc.setFont(undefined, 'bold');
    doc.text(role, margin, y);
    y += 8;

    doc.setFont(undefined, 'normal');
    const contentLines = doc.splitTextToSize(content || '(empty)', maxWidth);

    for (let i = 0; i < contentLines.length; i++) {
      ensureSpace(7);
      doc.text(contentLines[i], margin, y);
      y += 7;
    }

    y += 8;
  }

  return doc.output('arraybuffer');
}
