/* CSS hides the viewport rail from first paint; this adds the draggable control. */
(() => {
  'use strict';
  const root = document.documentElement;
  const contrast = matchMedia('(forced-colors: active)');
  const rail = document.createElement('div');
  rail.className = 'site-scrollbar';
  rail.tabIndex = 0;
  rail.setAttribute('role', 'scrollbar');
  rail.setAttribute('aria-label', 'Page scroll position');
  rail.setAttribute('aria-orientation', 'vertical');
  rail.setAttribute('aria-controls', 'main');
  rail.setAttribute('aria-valuemin', '0');
  const thumb = document.createElement('span');
  thumb.className = 'site-scrollbar-thumb'; thumb.setAttribute('aria-hidden', 'true'); rail.append(thumb);
  document.body.append(rail);
  let frame = 0, maximum = 0, track = 0, size = 28, offset = 0, drag = null;
  function update() {
    frame = 0;
    const viewport = root.clientHeight;
    maximum = Math.max(0, root.scrollHeight - viewport);
    if (rail.hidden && maximum > 1 && !contrast.matches) rail.hidden = false;
    track = rail.clientHeight;
    size = Math.min(track, Math.max(28, track * viewport / Math.max(viewport, root.scrollHeight)));
    const progress = maximum ? Math.min(1, Math.max(0, scrollY / maximum)) : 0;
    offset = progress * (track - size);
    rail.hidden = maximum <= 1 || contrast.matches;
    thumb.style.height = size + 'px'; thumb.style.transform = `translateY(${offset}px)`;
    rail.setAttribute('aria-valuemax', String(Math.round(maximum)));
    rail.setAttribute('aria-valuenow', String(Math.round(progress * maximum)));
    rail.setAttribute('aria-valuetext', Math.round(progress * 100) + '% of page');
    root.classList.toggle('custom-scrollbar', !contrast.matches);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function go(value) {
    const top = Math.max(0, Math.min(maximum, value));
    // main.js synchronises Lenis; without it, retain ordinary browser scrolling.
    const event = new CustomEvent('shreenath:scroll-to', { detail: { top }, cancelable: true });
    if (dispatchEvent(event)) window.scrollTo({ top, behavior: 'instant' });
    schedule();
  }
  rail.addEventListener('pointerdown', event => {
    if (event.button !== 0 || contrast.matches || document.querySelector('dialog[open]')) return;
    event.preventDefault(); update();
    const y = event.clientY - rail.getBoundingClientRect().top;
    const grab = y >= offset && y <= offset + size ? y - offset : size / 2;
    drag = { id: event.pointerId, grab };
    rail.setPointerCapture(event.pointerId); rail.classList.add('is-dragging'); root.classList.add('is-dragging-scrollbar');
    rail.focus({ preventScroll: true });
    go((y - grab) / Math.max(1, track - size) * maximum);
  });
  rail.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const y = event.clientY - rail.getBoundingClientRect().top;
    go((y - drag.grab) / Math.max(1, track - size) * maximum);
  });
  function release() {
    const id = drag?.id; drag = null;
    if (id !== undefined && rail.hasPointerCapture(id)) rail.releasePointerCapture(id);
    rail.classList.remove('is-dragging'); root.classList.remove('is-dragging-scrollbar');
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name => rail.addEventListener(name, release));
  rail.addEventListener('keydown', event => {
    const targets = { ArrowDown: scrollY + 60, ArrowUp: scrollY - 60, PageDown: scrollY + innerHeight * .85, PageUp: scrollY - innerHeight * .85, Home: 0, End: maximum, ' ': scrollY + innerHeight * (event.shiftKey ? -.85 : .85) };
    if (!(event.key in targets)) return;
    event.preventDefault(); go(targets[event.key]);
  });
  addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule); addEventListener('pagehide', release);
  contrast.addEventListener('change', () => { release(); schedule(); });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  update();
})();
