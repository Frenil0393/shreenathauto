/* Restore the choice before paint. English HTML remains the no-JavaScript fallback. */
(() => {
  'use strict';
  const key = 'shreenath_language_v1';
  const valid = value => value === 'en' || value === 'gu';
  let saved = null;
  for (const name of ['sessionStorage', 'localStorage']) {
    try { const value = window[name].getItem(key); if (valid(value)) saved = value; } catch { /* Storage can be unavailable. */ }
  }
  const root = document.documentElement;
  window.SHREENATH_LANGUAGE_INITIAL = saved;
  // Until translation is ready the document still contains English.
  if (saved === 'gu') {
    root.dataset.languagePending = 'true';
    window.SHREENATH_LANGUAGE_REVEAL = setTimeout(() => { delete root.dataset.languagePending; }, 1800);
  }
})();
