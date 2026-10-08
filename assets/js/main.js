/* Progressive enhancement: the pages, navigation and FAQs work without JS. */
(() => {
  'use strict';
  const root = document.documentElement;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const narrowScreen = matchMedia('(max-width: 760px)');
  root.classList.add('js');

  // The compact menu uses ordinary navigation links and never traps scrolling.
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const preferenceDialogOpen = () => Boolean(document.querySelector('#appearance-settings[open], #language-settings[open]'));
  function closeMenu(restoreFocus = false) {
    if (!menu || !nav) return;
    nav.classList.remove('is-open');
    nav.inert = narrowScreen.matches;
    menu.setAttribute('aria-expanded', 'false');
    menu.innerHTML = 'Menu <span aria-hidden="true">+</span>';
    if (restoreFocus) menu.focus();
  }
  if (menu && nav) {
    menu.hidden = false;
    nav.inert = narrowScreen.matches;
    nav.querySelectorAll('a').forEach((link, index) => {
      link.style.setProperty('--nav-order', String(index));
      link.dataset.navNumber = String(index + 1).padStart(2, '0');
    });
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      nav.inert = narrowScreen.matches && !open;
      menu.setAttribute('aria-expanded', String(open));
      menu.innerHTML = open ? 'Close <span aria-hidden="true">−</span>' : 'Menu <span aria-hidden="true">+</span>';
    });
    nav.addEventListener('click', event => {
      if (root.classList.contains('is-page-navigation')) return;
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (preferenceDialogOpen()) return;
      if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (root.classList.contains('is-page-navigation')) return;
      // Dialog clicks, including the closing click, belong to the settings layer.
      if (preferenceDialogOpen() || event.target.closest('#appearance-settings, #language-settings')) return;
      if (!event.target.closest('.site-header')) closeMenu();
    });
    nav.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (!root.classList.contains('is-page-navigation') && !preferenceDialogOpen() && !document.activeElement?.closest('.site-header')) closeMenu();
      });
    });
    narrowScreen.addEventListener('change', () => closeMenu());
  }

  // Only hide offscreen content, and only after the observer exists.
  let revealObserver;
  if ('IntersectionObserver' in window && !motionPreference.matches) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.classList.remove('is-waiting');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
    root.classList.add('motion-enabled');
    document.querySelectorAll('.reveal').forEach(element => {
      // A photo must not be decoded, promoted into a fading layer, and revealed
      // in the same frame. Keep photographic surfaces in the ordinary paint flow.
      if (element.querySelector('picture.responsive-photo, img[data-prepare-image]') || element.matches('.story-image')) return;
      if (element.getBoundingClientRect().top > innerHeight) {
        element.classList.add('is-waiting');
        revealObserver.observe(element);
      }
    });
  }

  // Lenis enhances desktop wheel scrolling; touch uses native browser scrolling.
  let lenis;
  let lenisLoading = false;
  async function updateSmoothScroll() {
    if (motionPreference.matches || narrowScreen.matches) {
      lenis?.destroy();
      lenis = undefined;
      return;
    }
    if (lenis || lenisLoading) return;
    lenisLoading = true;
    try {
      const { default: Lenis } = await import('https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs');
      if (!motionPreference.matches && !narrowScreen.matches) {
        lenis = new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true, syncTouch: false, anchors: { offset: -105 } });
      }
    } catch {
      // Network restrictions must never stop native scrolling.
    } finally {
      lenisLoading = false;
    }
  }
  updateSmoothScroll();
  addEventListener('shreenath:scroll-to', event => {
    const top = event.detail?.top;
    if (!Number.isFinite(top)) return;
    event.preventDefault();
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo({ top, behavior: 'instant' });
  });
  narrowScreen.addEventListener('change', updateSmoothScroll);
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
      revealObserver?.disconnect();
      document.querySelectorAll('.is-waiting').forEach(el => el.classList.remove('is-waiting'));
      root.classList.remove('motion-enabled');
    }
    updateSmoothScroll();
  });

  const readingProgress = document.querySelector('.reading-progress');
  const journey = document.querySelector('.journey');
  let scrollPending = false;
  function updateScroll() {
    const height = root.scrollHeight - innerHeight;
    const position = scrollY;
    let routeProgress;
    if (journey) {
      const rect = journey.getBoundingClientRect();
      routeProgress = motionPreference.matches ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.8 - rect.top) / (rect.height * 0.7)));
    }
    // Read geometry first, then write styles; avoid a write/read layout flush.
    if (readingProgress) readingProgress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, position / height)) : 0})`;
    if (journey) journey.style.setProperty('--route-progress', routeProgress.toFixed(3));
    scrollPending = false;
  }
  function scheduleScroll() {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateScroll);
    }
  }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  updateScroll();
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date());
  });

  const form = document.querySelector('#inquiry-form');
  if (form) {
    const select = form.querySelector('#service');
    const requested = new URLSearchParams(location.search).get('service');
    if ([...select.options].some(option => option.value === requested)) select.value = requested;
    let preparedText = '';
    let draftUrl = '';
    const result = form.querySelector('.prepared-message');
    const status = form.querySelector('.form-status');
    const draftLink = form.querySelector('#email-draft');
    const copyFallback = form.querySelector('.copy-fallback');
    function clearDraft() {
      result.hidden = true;
      copyFallback.hidden = true;
      status.textContent = '';
      preparedText = '';
      draftUrl = '';
    }
    form.addEventListener('input', clearDraft);
    addEventListener('shreenath:language', clearDraft);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('name')).trim();
      const phone = String(data.get('phone')).trim();
      const message = String(data.get('message')).trim();
      if (!name || message.length < 5 || !/^[+0-9() .\-]{7,25}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
        status.textContent = 'Please add your name, a valid phone number, and a short message.';
        return;
      }
      const service = String(data.get('service'));
      const branch = String(data.get('branch'));
      const translate = value => window.ShreenathLanguage?.text(value) ?? value;
      preparedText = `${translate('Hello Shreenath Auto Advisers,')}\n\n${translate('I would like help with:')} ${translate(service)}\n${translate('Preferred branch:')} ${translate(branch)}\n\n${message}\n\n${translate('Name:')} ${name}\n${translate('Phone:')} ${phone}\n${translate('Email:')} ${String(data.get('email') || '').trim() || translate('Not provided')}`;
      const subject = `${translate('RTO enquiry')} — ${translate(service)} — ${translate(branch)}`;
      const email = window.SHREENATH_CONFIG?.email || 'shreenath.auto3930@gmail.com';
      // Keep enquiry contents out of link attributes and automatic link tracking.
      draftUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedText)}`;
      draftLink.href = `mailto:${email}`;
      result.hidden = false;
      status.textContent = 'Your message is prepared. It has not been sent yet.';
      draftLink.focus({ preventScroll: true });
      window.dispatchEvent(new CustomEvent('shreenath:enquiry-prepared', { detail: { service, branch } }));
    });
    draftLink.addEventListener('click', event => {
      event.preventDefault();
      if (draftUrl) location.href = draftUrl;
    });
    form.querySelector('.copy-enquiry').addEventListener('click', async () => {
      if (!preparedText) return;
      try {
        await navigator.clipboard.writeText(preparedText);
        status.textContent = 'Message copied. Paste it into your email app and send it to our team.';
      } catch {
        copyFallback.hidden = false;
        copyFallback.value = preparedText;
        copyFallback.focus();
        copyFallback.select();
        status.textContent = 'Select and copy the message below, then paste it into your email app.';
      }
    });
  }
  addEventListener('pageshow', () => { closeMenu(); updateScroll(); });
})();
