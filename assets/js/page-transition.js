/* Head bootstrap: one coordinated mobile entry, including local file previews.
   Desktop keeps native document transitions; links still perform real navigation. */
(() => {
  'use strict';
  const root = document.documentElement;
  const mobile = matchMedia('(max-width: 760px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Begin the shared dependency request before parsing styles and page content.
  window.SHREENATH_THREE = import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js').catch(() => null);
  let domReady = false, heroReady = false, revealed = false, leaving = false;
  let entryTimer, recoveryTimer;
  const localPreview=location.protocol==='file:';
  if(localPreview)root.dataset.localNavigation='true';
  const enhanced = () => (mobile.matches || localPreview) && !reduced.matches;
  function reveal() {
    if (revealed) return;
    revealed = true; clearTimeout(entryTimer);
    if (!enhanced()) { delete root.dataset.mobileEntry; return; }
    // Two frames give the already laid-out content a stable opacity start.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.dataset.mobileEntry = 'ready';
      dispatchEvent(new CustomEvent('shreenath:page-visible'));
    }));
  }
  function resetExit() {
    clearTimeout(recoveryTimer); leaving = false;
    root.classList.remove('is-page-navigation', 'is-page-exiting');
  }
  if (enhanced()) {
    root.dataset.mobileEntry = 'pending';
    // Fail open even when a dependency is blocked or the 3D engine fails.
    entryTimer = setTimeout(reveal, 1500);
  }
  addEventListener('shreenath:hero-ready', () => {
    heroReady = true;
    if (domReady) reveal();
  });
  document.addEventListener('DOMContentLoaded', () => {
    domReady = true;
    const hero = document.querySelector('#road-scene,.editorial-hero [data-object],.error-page [data-object]');
    if (!hero || heroReady || hero.classList.contains('is-ready') || !enhanced()) reveal();
  }, { once: true });
  document.addEventListener('click', event => {
    if (!enhanced() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self') || link.matches('[data-cookie-settings]') || link.closest('dialog')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !['http:', 'https:', 'file:'].includes(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    // Only site documents: never delay an asset, phone link or mail handler.
    if (/\.[^/]+$/.test(url.pathname) && !/\.html?$/i.test(url.pathname)) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    root.classList.add('is-page-navigation', 'is-page-exiting');
    setTimeout(() => { location.assign(url.href); }, 140);
    recoveryTimer = setTimeout(resetExit, 4000);
  }, true);
  addEventListener('pageshow', event => {
    resetExit();
    if (event.persisted) {
      revealed = false;
      if (enhanced()) root.dataset.mobileEntry = 'pending';
      reveal();
    }
  });
  addEventListener('pagehide', () => { clearTimeout(entryTimer); clearTimeout(recoveryTimer); });
  reduced.addEventListener('change', () => { if (reduced.matches) { delete root.dataset.mobileEntry; resetExit(); } });
  mobile.addEventListener('change', () => { if (!enhanced()) { delete root.dataset.mobileEntry; resetExit(); } });
})();
