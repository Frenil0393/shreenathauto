/* Revalidate releases without unregistering the installable website's worker.
   Preferences, cookies and unsent enquiry contents are never cleared. */
(() => {
  'use strict';
  if (!['https:', 'http:'].includes(location.protocol)) return;
  const base = new URL('../../', document.currentScript.src);
  const version = document.querySelector('meta[name="site-release"]')?.content;
  let pendingVersion, lastCheck = 0, checking = false;
  function hasDraft() {
    return [...document.querySelectorAll('#inquiry-form input:not([type="hidden"]), #inquiry-form textarea')].some(field => field.value.trim());
  }
  function refreshIfSafe() {
    if (!pendingVersion || document.hidden || hasDraft() || document.querySelector('dialog[open]')) return;
    const url = new URL(location.href);
    if (url.searchParams.get('_site') === pendingVersion) return;
    url.searchParams.set('_site', pendingVersion);
    location.replace(url.href);
  }
  async function check(force = false) {
    if (checking || document.hidden || (!force && Date.now() - lastCheck < 60000)) return;
    checking = true; lastCheck = Date.now();
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 5000);
    try {
      const url = new URL('release.json', base); url.searchParams.set('_check', String(Date.now()));
      const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin', signal: abort.signal });
      if (!response.ok) return;
      const release = await response.json();
      if (typeof release.version !== 'string' || !/^[a-zA-Z0-9._-]{1,64}$/.test(release.version)) return;
      if (release.version !== version) pendingVersion = release.version;
      refreshIfSafe();
    } catch { /* Offline or a hosting challenge must never prevent page use. */ }
    finally { clearTimeout(timer); checking = false; }
  }
  check(true);
  addEventListener('pageshow', event => { if (event.persisted) check(true); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { refreshIfSafe(); check(); } });
  document.addEventListener('close', refreshIfSafe, true);
})();
