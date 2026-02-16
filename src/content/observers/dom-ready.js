export function waitForElement(selectorFn, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = selectorFn();
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = selectorFn();
      if (element) {
        observer.disconnect();
        clearTimeout(timeoutId);
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timeout waiting for element'));
    }, timeout);
  });
}
