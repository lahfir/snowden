export function showToast(message, type = 'error') {
  const toast = document.createElement('div');
  toast.className = `snowden-toast snowden-toast-${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('snowden-toast-show'), 100);

  setTimeout(() => {
    toast.classList.remove('snowden-toast-show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 4000);
}
