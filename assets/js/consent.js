/* First-party choices. Optional analytics requires affirmative consent. */
(() => {
  'use strict';
  const key = 'shreenath_consent_v1', version = 1, lifetime = 180 * 86400000;
  const id = window.SHREENATH_CONFIG?.analyticsId || '';
  const configured = /^G-[A-Z0-9]+$/.test(id);
  const hosted = /^https?:$/.test(location.protocol);
  const page = name => window.ShreenathURLs?.page(name) || (hosted ? '/'+name : name+'.html');
  const available = configured && hosted;
  const scope = available ? id : 'disabled';
  const privacySignal = Boolean(navigator.globalPrivacyControl || navigator.doNotTrack === '1');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let memory = null, storageWorks = true, expiryTimer, toastTimer, returnFocus, closing, bannerClosing;
  function read() {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { storageWorks = false; return memory; }
  }
  function valid(record) {
    return record && record.version === version && record.scope === scope &&
      typeof record.analytics === 'boolean' && Number.isFinite(record.savedAt) &&
      Number.isFinite(record.expiresAt) && record.savedAt <= Date.now() &&
      record.expiresAt > Date.now() && record.expiresAt - record.savedAt <= lifetime;
  }
  let choice = read();
  if (!valid(choice)) {
    choice = null;
    try { localStorage.removeItem(key); } catch {}
  }
  const allowed = () => Boolean(valid(choice) && choice.analytics && available && !privacySignal);
  window.ShreenathConsent = Object.freeze({
    analyticsAllowed: allowed,
    getChoice: () => choice ? { ...choice } : null,
    open: () => openSettings()
  });
  const container = document.createElement('div');
  container.innerHTML = `
  <section class="cookie-banner" aria-label="Cookie choices" hidden data-lenis-prevent>
    <div><h2>A little choice. A clearer experience.</h2><p>We save your privacy choice on this device. Optional analytics helps us understand how the site is used, only if you agree. Change your choice anytime. <a href="${page('cookies')}">Cookie details</a></p></div>
    <div class="cookie-actions"><button class="consent-button" data-consent="reject" type="button">Reject optional</button><button class="consent-button" data-consent="accept" type="button">Accept analytics</button><button class="consent-button" data-consent="settings" type="button">Preferences</button></div>
  </section>
  <dialog class="cookie-dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description" data-lenis-prevent>
    <div class="dialog-heading"><h2 id="cookie-title">Your cookie<br><em>preferences.</em></h2><button class="dialog-close" type="button" aria-label="Close cookie preferences">×</button></div>
    <p id="cookie-description">Choose what you’re comfortable with. Optional analytics is off until you choose it. These settings do not affect access to our services.</p>
    <div class="cookie-option"><div><h3>Essential preferences</h3><p>Remembers this choice for up to 180 days in your browser’s local storage. No advertising or tracking identifier.</p></div><span class="micro">Always on</span></div>
    <div class="cookie-option"><div><h3><label for="cookie-analytics">Optional analytics</label></h3><p id="analytics-description">Google Analytics measures page visits and general service interactions. Your enquiry text and contact details are not included in our custom tracking events.</p></div><input type="checkbox" id="cookie-analytics" aria-describedby="analytics-description analytics-availability"></div>
    <p class="consent-status" id="analytics-availability"></p>
    <details><summary>What about other website services?</summary><p>Fonts and visual libraries are requested from Google Fonts and jsDelivr. Those providers receive connection information when resources load. This setting controls optional analytics; it does not block those resource requests. Maps and email open when you select their links. Read the <a href="${page('privacy')}">privacy policy</a>.</p></details>
    <div class="cookie-actions"><button class="consent-button" data-consent="reject" type="button">Reject optional</button><button class="consent-button" data-consent="accept" type="button">Accept analytics</button><button class="consent-button primary" data-consent="save" type="button">Save preferences</button></div>
    <p class="consent-status" role="status" id="cookie-storage-note"></p>
  </dialog><p class="cookie-toast" role="status" aria-live="polite" hidden></p>`;
  document.body.append(container);
  const banner = container.querySelector('.cookie-banner');
  const dialog = container.querySelector('.cookie-dialog');
  const checkbox = container.querySelector('#cookie-analytics');
  const availability = container.querySelector('#analytics-availability');
  const storageNote = container.querySelector('#cookie-storage-note');
  const toast = container.querySelector('.cookie-toast');
  checkbox.disabled = !available || privacySignal;
  availability.textContent = privacySignal ? 'Your browser’s privacy signal is respected. Analytics stays off.' : !configured ? 'Analytics is not currently configured on this site. No analytics cookies are being set.' : !hosted ? 'Analytics is off in this local file preview. Open the hosted website to choose optional analytics.' : 'Turn this off again at any time using Cookie settings in the footer.';
  container.querySelectorAll('[data-consent="accept"]').forEach(button => {
    button.disabled = !available || privacySignal;
    button.textContent = !available ? 'Analytics unavailable' : privacySignal ? 'Analytics blocked' : 'Accept analytics';
  });
  function animate(element, frames, duration = 240) {
    if (reduced.matches || !element.animate) return null;
    return element.animate(frames, { duration, easing: 'cubic-bezier(.22,.75,.25,1)' });
  }
  function refreshBanner() {
    bannerClosing?.cancel();
    bannerClosing = null;
    const wasHidden = banner.hidden;
    banner.hidden = Boolean(choice);
    banner.inert = Boolean(choice);
    if (!choice && wasHidden) animate(banner, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }]);
  }
  function closeBanner() {
    if (banner.hidden) return;
    bannerClosing?.cancel();
    banner.inert = true;
    bannerClosing = animate(banner, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px)' }], 180);
    if (bannerClosing) bannerClosing.onfinish = () => { banner.hidden = true; bannerClosing = null; };
    else banner.hidden = true;
  }
  function notify(text) {
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 6500);
  }
  function openSettings() {
    if (closing) { closing.cancel(); closing = null; }
    returnFocus = document.activeElement;
    checkbox.checked = allowed();
    storageNote.textContent = storageWorks ? '' : 'Your browser is not saving preferences. Your choice will apply only on this page.';
    if (!dialog.open) {
      if (typeof dialog.showModal !== 'function') { location.href = page('cookies'); return; }
      dialog.showModal();
      animate(dialog, [{ opacity: 0, transform: 'translateY(12px) scale(.98)' }, { opacity: 1, transform: 'none' }]);
    }
    dialog.querySelector('.dialog-close').focus({ preventScroll: true });
  }
  function closeSettings() {
    if (!dialog.open || closing) return;
    function finish() {
      dialog.close();
      closing = null;
      if (returnFocus?.isConnected && !returnFocus.closest('[hidden]')) returnFocus.focus({ preventScroll: true });
      else document.querySelector('[data-cookie-settings]')?.focus({ preventScroll: true });
    }
    closing = animate(dialog, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px) scale(.99)' }], 180);
    if (closing) closing.onfinish = finish;
    else finish();
  }
  function clearAnalyticsCookies() {
    const names = document.cookie.split(';').map(part => part.trim().split('=')[0]).filter(name => /^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name));
    const parts = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'), '.' + parts.slice(i).join('.'));
    const paths = new Set(['/']);
    const segments = location.pathname.split('/');
    for (let i = 1; i < segments.length; i++) paths.add(segments.slice(0, i).join('/') || '/');
    names.forEach(name => domains.forEach(domain => paths.forEach(path => {
      document.cookie = name + '=; Max-Age=0; path=' + path + ';' + (domain ? ' domain=' + domain + ';' : '') + ' SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    })));
  }
  function broadcast() {
    window.dispatchEvent(new CustomEvent('shreenath:consent', { detail: { analytics: allowed() } }));
    if (!allowed()) clearAnalyticsCookies();
  }
  function scheduleExpiry() {
    clearTimeout(expiryTimer);
    if (choice) expiryTimer = setTimeout(refreshStoredChoice, Math.min(Math.max(1, choice.expiresAt - Date.now()), 86400000));
  }
  function save(analytics) {
    const now = Date.now();
    choice = { version, scope, analytics: Boolean(analytics && available && !privacySignal), savedAt: now, expiresAt: now + lifetime };
    memory = choice;
    try { localStorage.setItem(key, JSON.stringify(choice)); storageWorks = true; }
    catch { storageWorks = false; }
    broadcast();
    const previousFocus = document.activeElement;
    closeBanner();
    if (dialog.open) closeSettings();
    else if (banner.contains(previousFocus)) document.querySelector('[data-cookie-settings]')?.focus({ preventScroll: true });
    notify(storageWorks ? (allowed() ? 'Preferences saved. Optional analytics is on.' : 'Preferences saved. Optional analytics is off.') : 'Choice applied on this page. Your browser could not save it for future visits.');
    scheduleExpiry();
  }
  function refreshStoredChoice() {
    const record = storageWorks ? read() : memory;
    choice = valid(record) ? record : null;
    if (!choice && record) { try { localStorage.removeItem(key); } catch {} }
    if (dialog.open) checkbox.checked = allowed();
    broadcast();
    refreshBanner();
    scheduleExpiry();
  }
  document.addEventListener('click', event => {
    if (event.target.closest('[data-cookie-settings]')) { event.preventDefault(); openSettings(); }
  });
  container.addEventListener('click', event => {
    const button = event.target.closest('[data-consent]');
    if (!button || button.disabled) return;
    const action = button.dataset.consent;
    if (action === 'settings') openSettings();
    if (action === 'accept') save(true);
    if (action === 'reject') save(false);
    if (action === 'save') save(checkbox.checked);
  });
  dialog.querySelector('.dialog-close').addEventListener('click', closeSettings);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeSettings(); });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeSettings();
  });
  addEventListener('storage', event => { if (event.key === key || event.key === null) refreshStoredChoice(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshStoredChoice(); });
  addEventListener('pageshow', event => { if (event.persisted) refreshStoredChoice(); });
  refreshBanner();
  scheduleExpiry();
  if (!allowed()) clearAnalyticsCookies();
  if (location.hash === '#preferences') openSettings();
})();
