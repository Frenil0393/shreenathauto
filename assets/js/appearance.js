/* A small, keyboard-accessible appearance panel shared by every page. */
(() => {
  'use strict';
  const appearance = window.ShreenathAppearance;
  const header = document.querySelector('.header-inner');
  if (!appearance || !header || !window.HTMLDialogElement) return;
  const palettes = [['original', 'Terracotta', '#c34b2e'], ['#486b51', 'Forest', '#486b51'], ['#365fb1', 'Cobalt', '#365fb1'], ['#855171', 'Mulberry', '#855171']];
  const trigger = header.querySelector('.appearance-trigger') || document.createElement('button');
  trigger.className = 'appearance-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Change appearance');
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'appearance-settings');
  if(!trigger.querySelector('svg'))trigger.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg>';
  if(!trigger.isConnected)header.insertBefore(trigger, header.querySelector('.menu-toggle'));
  const dialog = document.createElement('dialog');
  dialog.id = 'appearance-settings';
  dialog.className = 'appearance-dialog';
  dialog.setAttribute('aria-labelledby', 'appearance-title');
  dialog.setAttribute('data-lenis-prevent', '');
  dialog.innerHTML = `<div class="appearance-heading"><div><span class="micro">Make yourself at home</span><h2 id="appearance-title">Your point of view.</h2></div><button type="button" class="dialog-close" aria-label="Close appearance settings">×</button></div>
    <fieldset><legend>Appearance</legend><div class="appearance-modes">${[['system', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([value, label]) => `<label><input type="radio" name="appearance-mode" value="${value}"><span>${label}</span></label>`).join('')}</div></fieldset>
    <fieldset><legend>Accent colour</legend><div class="appearance-swatches">${palettes.map(([value, label, colour]) => `<label><input type="radio" name="appearance-accent" value="${value}"><span class="appearance-swatch" style="--swatch:${colour}" aria-hidden="true"></span><span>${label}</span></label>`).join('')}</div><div class="appearance-custom"><label for="appearance-colour">Choose your own</label><input id="appearance-colour" type="color" value="#c34b2e" aria-describedby="appearance-colour-help"></div><p id="appearance-colour-help">Your colour is balanced for readable text in both modes.</p></fieldset>
    <p class="appearance-status" role="status" aria-live="polite"></p><div class="appearance-footer"><button type="button" class="appearance-reset">Reset to system & original colours</button><button type="button" class="button appearance-done">Done <span aria-hidden="true">↗</span></button></div>`;
  document.body.append(dialog);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const status = dialog.querySelector('.appearance-status');
  let transition, closing = false;
  function sync() {
    const value = appearance.get();
    dialog.querySelectorAll('[name="appearance-mode"]').forEach(input => { input.checked = input.value === value.mode; });
    dialog.querySelectorAll('[name="appearance-accent"]').forEach(input => { input.checked = input.value === value.accent; });
    dialog.querySelector('#appearance-colour').value = value.accent === 'original' ? '#c34b2e' : value.accent;
    status.textContent = value.mode === 'system' ? 'Following your device’s appearance.' : `${value.mode === 'dark' ? 'Dark' : 'Light'} appearance selected.`;
  }
  function open() {
    if (dialog.open) return;
    sync(); dialog.showModal();
    if (!reduced.matches) transition = dialog.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.2,.75,.25,1)' });
  }
  async function close() {
    if (!dialog.open || closing) return;
    closing = true;
    transition?.cancel();
    if (!reduced.matches) {
      transition = dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' });
      try { await transition.finished; } catch { /* Reduced motion can cancel this. */ }
    }
    dialog.close(); transition?.cancel(); closing = false;
    const collapsedMobile = matchMedia('(max-width: 760px)').matches && !header.querySelector('.main-nav.is-open');
    (collapsedMobile ? header.querySelector('.menu-toggle') : trigger)?.focus({ preventScroll: true });
  }
  function save(value) {
    const saved = appearance.set({ ...appearance.get(), ...value });
    if (!saved) status.textContent = 'Applied for this page. Your browser is not allowing preferences to be saved.';
  }
  trigger.addEventListener('click', open);
  dialog.querySelector('.dialog-close').addEventListener('click', close);
  dialog.querySelector('.appearance-done').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  let backdropStart = false;
  dialog.addEventListener('pointerdown', event => { backdropStart = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog || !backdropStart) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('change', event => {
    if (event.target.name === 'appearance-mode') save({ mode: event.target.value });
    if (event.target.name === 'appearance-accent') save({ accent: event.target.value });
  });
  dialog.querySelector('#appearance-colour').addEventListener('input', event => save({ accent: event.target.value }));
  dialog.querySelector('.appearance-reset').addEventListener('click', () => {
    if (!appearance.reset()) status.textContent = 'Reset for this page. Saved preferences could not be cleared.';
  });
  reduced.addEventListener('change', () => { if (reduced.matches) transition?.cancel(); });
  addEventListener('shreenath:appearance', sync);
  addEventListener('pagehide', () => { transition?.cancel(); if (dialog.open) dialog.close(); closing = false; });
  sync();
})();
