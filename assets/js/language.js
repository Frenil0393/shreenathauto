/* Shared language enhancement. Translate existing nodes without rebuilding scenes,
   forms or disclosures. Keep English source copy for a lossless switch back. */
(() => {
  'use strict';
  const dictionary = window.SHREENATH_GU;
  const root = document.documentElement;
  const header = document.querySelector('.header-inner');
  if (!dictionary || !header) { delete root.dataset.languagePending; return; }
  const key = 'shreenath_language_v1';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const originals = new WeakMap();
  const attributes = new WeakMap();
  const attributeNames = ['aria-label', 'aria-valuetext', 'placeholder', 'title', 'alt'];
  const excluded = 'script,style,noscript,code,pre,[data-no-translate]';
  let current = window.SHREENATH_LANGUAGE_INITIAL || 'en';
  let chosen = Boolean(window.SHREENATH_LANGUAGE_INITIAL);
  let busy = false;
  let closing = false;
  let dismissOnBackdrop = false;
  let dialogAnimation;
  const activeAnimations = new Set();
  const normalise = value => value.replace(/\s+/g, ' ').trim();
  function text(value) {
    if (current !== 'gu') return value;
    const normal = normalise(value);
    const progress = normal.match(/^(\d+)% of page$/);
    const translated = dictionary[normal] ?? (progress ? `પાનાનું ${progress[1]}%` : undefined);
    return translated === undefined ? value : value.replace(/\S[\s\S]*\S|\S/, translated);
  }
  function translateNode(node) {
    if (!node.parentElement || node.parentElement.closest(excluded + ',textarea,input')) return;
    let record = originals.get(node);
    if (!record || node.data !== record.last) record = { english: node.data, last: node.data };
    let translated = text(record.english);
    // This fragment has different grammar in the accessibility heading.
    if (current === 'gu' && document.body.dataset.page === 'accessibility' && node.parentElement.matches('h1') && normalise(record.english) === 'to') translated = '';
    if (current === 'gu' && node.parentElement.closest('.editorial-hero--privacy') && normalise(record.english) === 'personal.') translated = 'ખાનગી.';
    if (node.data !== translated) node.data = translated;
    record.last = translated;
    originals.set(node, record);
  }
  function translateAttributes(element) {
    if (element.closest(excluded)) return;
    let records = attributes.get(element);
    if (!records) { records = {}; attributes.set(element, records); }
    attributeNames.forEach(name => {
      const value = element.getAttribute(name);
      if (value === null) { delete records[name]; return; }
      let record = records[name];
      if (!record || record.last !== value) record = { english: value, last: value };
      const translated = text(record.english);
      if (translated !== value) element.setAttribute(name, translated);
      record.last = translated;
      records[name] = record;
    });
  }
  function translateTree(node) {
    if (node.nodeType === Node.TEXT_NODE) { translateNode(node); return; }
    if (node.nodeType !== Node.ELEMENT_NODE || node.closest(excluded)) return;
    // Native option values otherwise change when their visible labels change.
    if (node.matches('option:not([value])')) node.setAttribute('value', node.value);
    translateAttributes(node);
    for (const child of node.childNodes) translateTree(child);
  }
  const observer = new MutationObserver(records => {
    observer.disconnect();
    try {
      records.forEach(record => {
        if (record.type === 'attributes') translateAttributes(record.target);
        else if (record.type === 'characterData') translateNode(record.target);
        else record.addedNodes.forEach(translateTree);
      });
    } finally { observe(); }
  });
  function observe() {
    // Never observe animation styles, frame updates, values or user-typed input.
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributeNames });
  }
  const trigger = header.querySelector('.language-trigger') || document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'language-trigger';
  if(!trigger.querySelector('svg'))trigger.innerHTML = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.4"/><ellipse cx="12" cy="12" rx="3.5" ry="8" stroke="currentColor" stroke-width="1.2"/><path d="M4 12h16" stroke="currentColor" stroke-width="1.2"/></svg><span class="header-control-copy"><span class="header-control-label" data-language-label></span><span class="header-control-value" data-language-value></span></span>';
  trigger.setAttribute('data-no-translate', '');
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'language-settings');
  if(!trigger.isConnected)header.insertBefore(trigger, header.querySelector('.menu-toggle'));
  const dialog = document.createElement('dialog');
  dialog.id = 'language-settings';
  dialog.className = 'language-dialog';
  dialog.lang = 'en';
  dialog.setAttribute('data-no-translate', '');
  dialog.setAttribute('data-lenis-prevent', '');
  dialog.setAttribute('aria-labelledby', 'language-title');
  dialog.setAttribute('aria-describedby', 'language-description');
  dialog.innerHTML = `<div class="language-heading"><span class="micro">A familiar voice / <span lang="gu">પોતાની ભાષામાં</span></span><button type="button" class="dialog-close" aria-label="Close / બંધ કરો">×</button></div>
    <h2 id="language-title">Make yourself at home.<span lang="gu">તમારી ભાષામાં સ્વાગત છે.</span></h2>
    <p id="language-description">Choose your language. You can change it anytime.<span lang="gu">તમારી ભાષા પસંદ કરો. ગમે ત્યારે બદલી શકશો.</span></p>
    <div class="language-options"><button type="button" data-language="en" lang="en"><span class="language-symbol" aria-hidden="true">Aa</span><span><strong>English</strong><small lang="gu">અંગ્રેજી</small></span><span class="language-check" aria-hidden="true">✓</span></button><button type="button" data-language="gu" lang="gu"><span class="language-symbol" aria-hidden="true">અ</span><span><strong>ગુજરાતી</strong><small lang="en">Gujarati</small></span><span class="language-check" aria-hidden="true">✓</span></button></div>
    <p class="language-memory">Your choice stays on this device.<span lang="gu">આ ઉપકરણ પર તમારી પસંદગી યાદ રહેશે.</span></p><button class="language-continue" type="button">Continue in English / <span lang="gu">અંગ્રેજીમાં આગળ વધો</span></button>`;
  document.body.append(dialog);
  const status = document.createElement('p');
  status.className = 'language-status';
  status.setAttribute('role', 'status');
  status.setAttribute('data-no-translate', '');
  document.body.append(status);
  let statusTimer;
  function announce(message) {
    clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add('is-visible');
    statusTimer = setTimeout(() => { status.classList.remove('is-visible'); }, 5500);
  }
  function sync() {
    trigger.querySelector('[data-language-label]').textContent = current === 'gu' ? 'ભાષા' : 'Language';
    trigger.querySelector('[data-language-value]').textContent = current === 'gu' ? 'ગુજરાતી' : 'English';
    trigger.lang = current;
    trigger.setAttribute('aria-label', current === 'gu' ? 'ભાષા બદલો — હાલમાં ગુજરાતી' : 'Change language — currently English');
    trigger.title = 'English / ગુજરાતી';
    dialog.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(chosen && button.dataset.language === current));
      button.disabled = busy;
    });
    dialog.querySelector('.language-continue').hidden = chosen;
    dialog.querySelector('.dialog-close').hidden = !chosen;
  }
  function save(language) {
    let local = false;
    try { localStorage.setItem(key, language); local = true; } catch { /* Try the tab's session next. */ }
    try {
      if (local) sessionStorage.removeItem(key);
      else { sessionStorage.setItem(key, language); return 'session'; }
    } catch { /* The choice still works in memory on this page. */ }
    return local ? 'local' : 'page';
  }
  let fontPromise;
  function fonts() {
    if (!document.fonts) return Promise.resolve();
    return fontPromise ||= Promise.all([
      document.fonts.load('400 16px "Hind Vadodara"', 'ગુજરાતી'),
      document.fonts.load('500 40px "Hind Vadodara"', 'ગુજરાતી'),
      document.fonts.load('600 40px "Hind Vadodara"', 'ગુજરાતી')
    ]).catch(() => {}).then(() => dispatchEvent(new Event('shreenath:language-fonts')));
  }
  const fontWait = () => Promise.race([fonts(), new Promise(resolve => setTimeout(resolve, 1200))]);
  async function animate(element, frames, duration) {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(frames, { duration, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'forwards' });
    activeAnimations.add(animation);
    try { await animation.finished; } catch { /* Reduced motion interrupts animation. */ }
    activeAnimations.delete(animation);
    animation.cancel();
  }
  function apply() {
    observer.disconnect();
    root.lang = current;
    root.dataset.language = current;
    translateTree(root);
    sync();
    observe();
    dispatchEvent(new CustomEvent('shreenath:language', { detail: { language: current } }));
  }
  async function set(language, persist = true) {
    if (!['en', 'gu'].includes(language) || busy) return;
    busy = true;
    const different = current !== language;
    const saved = persist ? save(language) : 'local';
    chosen = true;
    sync();
    const veil = document.createElement('div');
    veil.className = 'language-transition';
    veil.setAttribute('aria-hidden', 'true');
    veil.setAttribute('data-no-translate', '');
    try {
      if (different) {
        if (language === 'gu') await fontWait();
        const anchor = [...document.querySelectorAll('main > section, main > div')].find(el => el.getBoundingClientRect().bottom > 120);
        const top = anchor?.getBoundingClientRect().top;
        if (!reduced.matches) {
          document.body.append(veil);
          await animate(veil, [{ opacity: 0 }, { opacity: 1 }], 140);
          veil.style.opacity = '1';
        }
        current = language;
        apply();
        if (anchor && scrollY > 120) {
          const next = scrollY + anchor.getBoundingClientRect().top - top;
          const event = new CustomEvent('shreenath:scroll-to', { cancelable: true, detail: { top: next } });
          if (dispatchEvent(event)) window.scrollTo({ top: next, behavior: 'instant' });
        }
        await animate(veil, [{ opacity: 1 }, { opacity: 0 }], 230);
      }
    } finally {
      veil.remove();
      busy = false;
      sync();
    }
    const confirmation = current === 'gu' ? 'ગુજરાતી પસંદ કરેલી છે.' : 'English selected.';
    const storageMessage = saved === 'local' ? '' : saved === 'session'
      ? (current === 'gu' ? ' પસંદગી આ બ્રાઉઝર સેશન સુધી યાદ રહેશે.' : ' Your choice is saved for this browser session only.')
      : (current === 'gu' ? ' બ્રાઉઝર પસંદગી સાચવી શકતું નથી; તે માત્ર આ પાના પર લાગુ છે.' : ' Browser storage is unavailable; this choice applies to this page only.');
    announce(confirmation + storageMessage);
  }
  async function close() {
    if (!dialog.open || closing || busy) return;
    closing = true;
    dialogAnimation?.cancel();
    await animate(dialog, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(7px)' }], 160);
    dialog.close();
    root.classList.remove('language-choosing');
    closing = false;
    // A cookie dialog opened by a direct #preferences link stays underneath.
    const other = document.querySelector('dialog[open]');
    if (other) other.querySelector('button')?.focus({ preventScroll: true });
    else {
      const collapsedMobile = matchMedia('(max-width: 760px)').matches && !header.querySelector('.main-nav.is-open');
      (collapsedMobile ? header.querySelector('.menu-toggle') : trigger)?.focus({ preventScroll: true });
    }
  }
  function open(fromHeader = false) {
    if (dialog.open || busy || closing) return;
    dismissOnBackdrop = fromHeader === true;
    sync();
    if (typeof dialog.showModal !== 'function') { set(current === 'en' ? 'gu' : 'en'); return; }
    if (!chosen) root.classList.add('language-choosing');
    dialog.showModal();
    if (!reduced.matches) dialogAnimation = dialog.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.22,.75,.25,1)' });
    dialog.querySelector(`[data-language="${current}"]`).focus({ preventScroll: true });
  }
  trigger.addEventListener('click', () => open(true));
  // Only a deliberate press and release outside the panel dismisses it.
  // Dragging from a language option into the backdrop must not select or close.
  const outsidePanel = event => {
    const rect = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  };
  let backdropPress = false;
  dialog.addEventListener('pointerdown', event => { backdropPress = dismissOnBackdrop && outsidePanel(event); });
  dialog.addEventListener('pointercancel', () => { backdropPress = false; });
  dialog.addEventListener('click', event => {
    const dismiss = dismissOnBackdrop && backdropPress && outsidePanel(event);
    backdropPress = false;
    if (dismiss) close();
  });
  dialog.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', async () => {
    if (busy || closing) return;
    await set(button.dataset.language);
    await close();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', close);
  dialog.querySelector('.language-continue').addEventListener('click', async () => { await set('en'); await close(); });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    // On a first visit, Escape dismisses the prompt without saving a choice.
    close();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { dialogAnimation?.cancel(); activeAnimations.forEach(animation => animation.cancel()); }
  });
  addEventListener('storage', event => {
    if (event.key === key && ['en', 'gu'].includes(event.newValue)) {
      set(event.newValue, false).then(() => { if (dialog.open) close(); });
    }
  });
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    let saved;
    for (const name of ['sessionStorage', 'localStorage']) {
      try { const value = window[name].getItem(key); if (['en', 'gu'].includes(value)) saved = value; } catch { /* Preserve the in-memory choice. */ }
    }
    if (saved && saved !== current) set(saved, false);
  });
  window.ShreenathLanguage = Object.freeze({ get: () => current, text, set: language => set(language), open });
  apply();
  // Translation is synchronous here. Font loading must not hide the whole page
  // for another 1.2 seconds on every navigation; explicit language changes still wait.
  clearTimeout(window.SHREENATH_LANGUAGE_REVEAL); delete root.dataset.languagePending;
  if (current === 'gu') fonts();
  if (!chosen) open();
})();
