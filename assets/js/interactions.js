/* Shared disclosure and dimensional-detail choreography. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const running = new Set();

  // Keep native <details> semantics and keyboard handling. Measure actual content,
  // animate both directions, and restart at the visible height on rapid clicks.
  document.querySelectorAll('details').forEach((details, index) => {
    const summary = details.querySelector(':scope > summary');
    if (!summary) return;
    const panel = document.createElement('div');
    panel.className = 'disclosure-panel';
    panel.id = `disclosure-panel-${index}`;
    [...details.childNodes].forEach(node => { if (node !== summary) panel.append(node); });
    details.append(panel);
    summary.setAttribute('aria-controls', panel.id);
    let expanded = details.open;
    let animation = null;
    let generation = 0;
    function semantics() {
      summary.setAttribute('aria-expanded', String(expanded));
      details.dataset.expanded = String(expanded);
      panel.inert = !expanded;
    }
    function finish() {
      generation++;
      animation?.cancel();
      animation = null;
      details.open = expanded;
      details.style.removeProperty('height');
      details.style.removeProperty('overflow');
      semantics();
      running.delete(finish);
    }
    semantics();
    summary.addEventListener('click', event => {
      if (!details.animate) return; // Native disclosure remains the fallback.
      event.preventDefault();
      const start = details.getBoundingClientRect().height;
      generation++;
      animation?.cancel();
      expanded = !expanded;
      semantics();
      if (reduced.matches) { finish(); return; }
      // Measure the actual resting box, including padding, borders and wrapped
      // text. Adding summary + panel heights omitted the cookie row's 24px of
      // padding, so releasing the animated height produced a final visible jump.
      details.style.height = 'auto';
      details.open = expanded;
      const end = details.getBoundingClientRect().height;
      details.open = true;
      details.style.height = `${start}px`;
      details.style.overflow = 'hidden';
      const thisGeneration = generation;
      animation = details.animate([{ height: `${start}px` }, { height: `${end}px` }], {
        duration: expanded ? 420 : 320,
        easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'both'
      });
      running.add(finish);
      animation.onfinish = () => { if (thisGeneration === generation) finish(); };
    });
    details.addEventListener('toggle', () => {
      if (!animation) { expanded = details.open; semantics(); }
    });
  });
  addEventListener('resize', () => running.forEach(finish => finish()), { passive: true });
  addEventListener('shreenath:language', () => running.forEach(finish => finish()));
  reduced.addEventListener('change', () => running.forEach(finish => finish()));

  // One small shared sculpture per page; CSS renders real perspective and depth.
  const figures = [...document.querySelectorAll('.dimensional-art')];
  const active = new Set();
  let scheduled = false;
  function renderDepth() {
    scheduled = false;
    if (reduced.matches) return;
    active.forEach(figure => {
      const rect = figure.getBoundingClientRect();
      const progress = Math.min(1, Math.max(-1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
      figure.style.setProperty('--scroll-turn', `${progress * 12}deg`);
      figure.style.setProperty('--scroll-lift', `${progress * -13}px`);
    });
  }
  function scheduleDepth() {
    if (!scheduled && !reduced.matches && active.size) {
      scheduled = true;
      requestAnimationFrame(renderDepth);
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
      scheduleDepth();
    }, { rootMargin: '60px' });
    figures.forEach(figure => observer.observe(figure));
  }
  figures.forEach(figure => {
    figure.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
      const r = figure.getBoundingClientRect();
      figure.style.setProperty('--pointer-turn', `${((event.clientX - r.left) / r.width - .5) * 10}deg`);
      figure.style.setProperty('--pointer-tilt', `${((event.clientY - r.top) / r.height - .5) * -8}deg`);
    }, { passive: true });
    figure.addEventListener('pointerleave', () => {
      figure.style.setProperty('--pointer-turn', '0deg');
      figure.style.setProperty('--pointer-tilt', '0deg');
    });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) figures.forEach(figure => {
      ['--scroll-turn', '--scroll-lift', '--pointer-turn', '--pointer-tilt'].forEach(name => figure.style.removeProperty(name));
    });
    else scheduleDepth();
  });
  addEventListener('scroll', scheduleDepth, { passive: true });
  addEventListener('resize', scheduleDepth, { passive: true });

  // No sticky hover shifts on touchscreens. Delays only affect initial reveals.
  document.querySelectorAll('.service-list').forEach(list => {
    list.querySelectorAll('.service-row').forEach((row, index) => {
      row.style.setProperty('--arrival-delay', `${index * 65}ms`);
      row.addEventListener('transitionend', event => {
        if (event.propertyName === 'opacity' && row.classList.contains('is-visible')) row.style.setProperty('--arrival-delay', '0ms');
      });
    });
  });
})();
