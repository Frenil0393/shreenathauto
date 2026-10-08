/* Request appropriately sized photos early and decode one at a time.
   Native image loading remains fully functional if this enhancement is absent. */
(() => {
  'use strict';
  const images = [...document.querySelectorAll('img[data-prepare-image]')];
  if (!images.length || !('IntersectionObserver' in window)) return;
  const queue = [];
  const seen = new WeakSet();
  let working = false;
  async function prepareNext() {
    if (working || !queue.length || document.hidden) return;
    working = true;
    const image = queue.shift();
    image.loading = 'eager';
    // The browser chooses a srcset candidate. decode() prepares that candidate
    // off the presentation path; it doesn't swap sources as the user scrolls.
    try { if (image.decode) await image.decode(); } catch { /* Native fallback remains. */ }
    working = false;
    if (queue.length) {
      if ('requestIdleCallback' in window) requestIdleCallback(prepareNext, { timeout: 250 });
      else setTimeout(prepareNext, 24);
    }
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      observer.unobserve(entry.target);
      queue.push(entry.target);
    });
    prepareNext();
  }, { rootMargin: '1400px 0px', threshold: 0 });
  images.forEach(image => observer.observe(image));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) prepareNext(); });
})();
