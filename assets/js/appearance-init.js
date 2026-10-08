/* Runs before styles: restore appearance before the first painted frame. */
(() => {
  'use strict';
  const root = document.documentElement;
  // Establish the compact navigation state before the first layout, not in defer.
  root.classList.add('js');
  const key = 'shreenath_appearance_v1';
  const system = matchMedia('(prefers-color-scheme: dark)');
  const defaults = { mode: 'system', accent: 'original' };
  const normalise = value => ({
    mode: ['light', 'dark', 'system'].includes(value?.mode) ? value.mode : 'system',
    accent: /^#[0-9a-f]{6}$/i.test(value?.accent) ? value.accent.toLowerCase() : 'original'
  });
  let preference = { ...defaults };
  try { preference = normalise(JSON.parse(localStorage.getItem(key))); } catch { /* Storage is optional. */ }
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const hex = values => '#' + values.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, amount) => a.map((v, i) => v * (1 - amount) + b[i] * amount);
  const luminance = values => values.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  function apply() {
    const dark = preference.mode === 'dark' || (preference.mode === 'system' && system.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    root.dataset.appearance = preference.mode;
    root.dataset.accent = preference.accent === 'original' ? 'original' : 'custom';
    root.style.colorScheme = dark ? 'dark' : 'light';
    const paper = rgb(dark ? '#181b18' : '#f5f3ed');
    if (preference.accent !== 'original') {
      const chosen = rgb(preference.accent);
      const soft = mix(paper, chosen, dark ? .15 : .12);
      const surfaces = [paper, soft, rgb(dark ? '#222921' : '#e4e7dd'), rgb(dark ? '#20251f' : '#fffefa')];
      let accessible = chosen;
      for (let i = 0; i <= 100; i++) {
        accessible = mix(chosen, dark ? [255, 255, 255] : [0, 0, 0], i / 100);
        if (surfaces.every(surface => contrast(accessible, surface) >= 4.6)) break;
      }
      root.style.setProperty('--accent', hex(accessible));
      root.style.setProperty('--accent-light', hex(soft));
      root.style.setProperty('--accent-ink', contrast(accessible, [0, 0, 0]) > contrast(accessible, [255, 255, 255]) ? '#111611' : '#ffffff');
    } else {
      ['--accent', '--accent-light', '--accent-ink'].forEach(name => root.style.removeProperty(name));
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', hex(paper));
    window.dispatchEvent(new CustomEvent('shreenath:appearance', { detail: { ...preference, theme: root.dataset.theme } }));
  }
  window.ShreenathAppearance = Object.freeze({
    get: () => ({ ...preference }),
    set(value) {
      preference = normalise(value);
      let saved = true;
      try { localStorage.setItem(key, JSON.stringify(preference)); } catch { saved = false; }
      apply();
      return saved;
    },
    reset() {
      preference = { ...defaults };
      let saved = true;
      try { localStorage.removeItem(key); } catch { saved = false; }
      apply();
      return saved;
    }
  });
  system.addEventListener('change', () => { if (preference.mode === 'system') apply(); });
  addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    try { preference = normalise(event.newValue ? JSON.parse(event.newValue) : defaults); } catch { preference = { ...defaults }; }
    apply();
  });
  apply();
})();
