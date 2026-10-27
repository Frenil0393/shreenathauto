/* Prepare photos without allowing one failed decode to block the next.
   A failed WebP candidate gets one ordinary JPEG request, never a page reload. */
(() => {
  'use strict';
  const images = [...document.querySelectorAll('img[data-prepare-image]')];
  if (!images.length) return;
  images.forEach((image) => {
    const fallback = image.getAttribute('src');
    let recovered = false;
    function recover() {
      if (recovered || !fallback) return;
      recovered = true;
      image
        .closest('picture')
        ?.querySelectorAll('source')
        .forEach((source) => {
          source.removeAttribute('srcset');
        });
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
      image.loading = 'eager';
      const url = new URL(fallback, document.baseURI);
      url.searchParams.set('v', '20261026-r32');
      image.src = url.href;
    }
    image.addEventListener('error', recover);
    if (image.complete && image.currentSrc && !image.naturalWidth) recover();
  });
  if (!('IntersectionObserver' in window)) return;
  const queue = [];
  const seen = new WeakSet();
  let working = false;
  async function prepareNext() {
    if (working || !queue.length || document.hidden) return;
    working = true;
    const image = queue.shift();
    image.loading = 'eager';
    let timeout;
    try {
      if (image.decode) {
        await Promise.race([
          image.decode(),
          new Promise((resolve) => {
            timeout = setTimeout(resolve, 1500);
          })
        ]);
      }
    } catch {
      // The error listener handles fallback; later images still get prepared.
    } finally {
      clearTimeout(timeout);
      working = false;
    }
    if (queue.length) {
      if ('requestIdleCallback' in window) requestIdleCallback(prepareNext, { timeout: 250 });
      else setTimeout(prepareNext, 24);
    }
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        observer.unobserve(entry.target);
        queue.push(entry.target);
      });
      prepareNext();
    },
    { rootMargin: '1400px 0px', threshold: 0 }
  );
  images.forEach((image) => observer.observe(image));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) prepareNext();
  });
})();
