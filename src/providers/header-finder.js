export function findInjectionPoint(strategies) {
  for (const strategy of strategies) {
    const el = strategy();
    if (el && isVisible(el) && isInViewport(el)) return el;
  }
  return null;
}

function isVisible(el) {
  if (!el) return false;
  const style = getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetHeight > 0;
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 50;
}

export function findHeaderByScoring(candidates) {
  let best = null;
  let bestScore = -1;

  for (const el of candidates) {
    if (!isVisible(el)) continue;
    const rect = el.getBoundingClientRect();
    let score = 0;

    if (rect.top < 100) score += 5;
    if (rect.height > 20 && rect.height < 120) score += 3;
    if (rect.width > window.innerWidth * 0.4) score += 3;

    const buttons = el.querySelectorAll('button');
    score += Math.min(buttons.length, 5);

    if (el.tagName === 'HEADER') score += 3;
    if (el.getAttribute('role') === 'banner') score += 2;

    const hasSticky = getComputedStyle(el).position === 'sticky' || getComputedStyle(el).position === 'fixed';
    if (hasSticky) score += 2;

    if (score > bestScore) {
      bestScore = score;
      best = el;
    }
  }

  return best;
}
