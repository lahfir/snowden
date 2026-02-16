import { getOrgId, fetchOrgId } from '../../core/auth.js';
import { fetchConversation } from '../../core/api.js';
import { getActiveThread } from '../../core/tree.js';
import { formatAsMarkdown } from '../../exporters/markdown.js';
import { formatAsPDF } from '../../exporters/pdf.js';
import { downloadFile } from '../../utils/download.js';
import { sanitizeFilename } from '../../utils/sanitize.js';
import { showToast } from '../../utils/toast.js';

export function showDropdown(button) {
  const existing = document.getElementById('snowden-dropdown');
  if (existing) {
    existing.remove();
    return;
  }

  const dropdown = document.createElement('div');
  dropdown.id = 'snowden-dropdown';
  dropdown.className = 'snowden-dropdown';
  dropdown.innerHTML = `
    <button class="snowden-dropdown-item" data-format="markdown">
      Export as Markdown
    </button>
    <button class="snowden-dropdown-item" data-format="pdf">
      Export as PDF
    </button>
  `;

  dropdown.querySelectorAll('.snowden-dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const format = item.dataset.format;
      handleExport(format);
      dropdown.remove();
    });
  });

  document.addEventListener('click', function closeDropdown(e) {
    if (!dropdown.contains(e.target) && e.target !== button) {
      dropdown.remove();
      document.removeEventListener('click', closeDropdown);
    }
  });

  button.parentElement.appendChild(dropdown);

  const rect = button.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + 5}px`;
  dropdown.style.left = `${rect.left}px`;
}

async function handleExport(format) {
  try {
    const match = location.pathname.match(/\/chat\/([a-f0-9-]+)/);
    if (!match) {
      showToast('Not on a chat page');
      return;
    }

    const conversationId = match[1];
    let orgId = getOrgId();

    if (!orgId) {
      orgId = await fetchOrgId();
      if (!orgId) {
        showToast('Could not determine organization ID');
        return;
      }
    }

    const conversation = await fetchConversation(orgId, conversationId);
    const thread = getActiveThread(conversation);

    if (thread.length === 0) {
      showToast('No messages to export');
      return;
    }

    const title = sanitizeFilename(conversation.name || 'conversation');

    if (format === 'markdown') {
      const markdown = formatAsMarkdown(conversation, thread);
      downloadFile(markdown, `${title}.md`, 'text/markdown');
    } else if (format === 'pdf') {
      const pdfData = formatAsPDF(conversation, thread);
      downloadFile(pdfData, `${title}.pdf`, 'application/pdf');
    }

    showToast('Export successful!', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showToast(`Export failed: ${error.message}`);
  }
}
