/* Move the same preference controls into the mobile menu; keep their state and listeners. */
(() => {
  'use strict';
  const header = document.querySelector('.header-inner');
  const nav = header?.querySelector('.main-nav');
  const menu = header?.querySelector('.menu-toggle');
  if (!header || !nav || !menu) return;
  const compact = matchMedia('(max-width: 760px)');
  const appearance = header.querySelector('.appearance-trigger');
  const language = header.querySelector('.language-trigger');
  const contact = header.querySelector('.header-contact');
  const tools = header.querySelector('.header-tools') || document.createElement('div');
  tools.className = 'header-tools';
  if(!tools.isConnected)header.insertBefore(tools, menu);
  if (contact && contact.parentElement!==tools) tools.append(contact);
  const preferences = document.createElement('div');
  preferences.className = 'nav-preferences';
  preferences.setAttribute('role', 'group');
  preferences.setAttribute('aria-label', 'Appearance and language');
  preferences.setAttribute('data-no-translate', '');
  nav.append(preferences);
  if (appearance && !appearance.querySelector('.header-control-copy')) {
    const copy = document.createElement('span');
    copy.className = 'header-control-copy';
    copy.innerHTML = '<span class="header-control-label"></span><span class="header-control-value"></span>';
    appearance.append(copy);
    appearance.setAttribute('data-no-translate', '');
  }
  function sync() {
    const gu = window.ShreenathLanguage?.get() === 'gu';
    preferences.setAttribute('aria-label', gu ? 'દેખાવ અને ભાષા' : 'Appearance and language');
    if (appearance) {
      const mode = window.ShreenathAppearance?.get().mode || 'system';
      appearance.querySelector('.header-control-label').textContent = gu ? 'દેખાવ' : 'Appearance';
      appearance.querySelector('.header-control-value').textContent = gu ? { system: 'સિસ્ટમ', light: 'લાઇટ', dark: 'ડાર્ક' }[mode] : { system: 'System', light: 'Light', dark: 'Dark' }[mode];
      appearance.setAttribute('aria-label', gu ? 'દેખાવ બદલો' : 'Change appearance');
    }
  }
  function layout() {
    const focused = document.activeElement;
    const destination = compact.matches ? preferences : tools;
    [appearance, language].forEach(button => { if (button && button.parentElement!==destination) destination.append(button); });
    preferences.hidden = !compact.matches;
    if (compact.matches && (focused === appearance || focused === language) && !nav.classList.contains('is-open')) menu.focus({ preventScroll: true });
  }
  compact.addEventListener('change', layout);
  addEventListener('shreenath:language', sync);
  addEventListener('shreenath:appearance', sync);
  layout(); sync();
  header.classList.add('header-ready');
})();
