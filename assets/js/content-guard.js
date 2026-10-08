/* Casual copying deterrents only. Browser-delivered assets are never secret. */
(() => {
  'use strict';
  const usable = 'input,textarea,select,[contenteditable],a[href^="tel:"],a[href^="mailto:"],address,.legal-copy,[data-allow-copy]';
  const allowed = target => target instanceof Element && Boolean(target.closest(usable));
  document.documentElement.classList.add('content-guard');
  document.addEventListener('contextmenu', event => { if (!allowed(event.target)) event.preventDefault(); });
  document.addEventListener('selectstart', event => { if (!allowed(event.target)) event.preventDefault(); });
  document.addEventListener('dragstart', event => {
    if (event.target instanceof Element && event.target.closest('img,canvas') && !allowed(event.target)) event.preventDefault();
  });
  // Do not intercept keyboard shortcuts, clipboard tools, zoom or accessibility APIs.
})();
