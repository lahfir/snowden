export function injectExportButton(provider, onExport) {
  const existing = document.getElementById('snowden-export-btn');
  if (existing) existing.remove();

  const header = provider.findHeader();
  if (!header) {
    console.log('Chat header not found for injection');
    return null;
  }

  const button = document.createElement('button');
  button.id = 'snowden-export-btn';
  button.className = 'snowden-export-button';
  button.setAttribute('data-snowden-platform', provider.id);
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 12L3 7h3V2h4v5h3l-5 5z"/>
      <rect y="14" width="16" height="2"/>
    </svg>
    Export
  `;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onExport(button);
  });

  header.appendChild(button);
  return button;
}
