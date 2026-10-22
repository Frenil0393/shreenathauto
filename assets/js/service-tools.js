/* No enquiry is sent by this page: the visitor reviews and sends in WhatsApp.
   Checkbox state is held only in memory; documents and personal data are not collected. */
(() => {
  'use strict';
  const data = window.ShreenathServiceChecklists;
  const triggers = [...document.querySelectorAll('[data-service-action]')];
  if (!data || !triggers.length) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // This destination is used only in the outgoing WhatsApp URL, never in copy.
  const whatsappDestination = '919313192013';
  const branches = {
    jamkandorana: { en: 'Jamkandorana', gu: 'જામકંડોરણા' },
    dhoraji: { en: 'Dhoraji', gu: 'ધોરાજી' }
  };
  const copy = {
    eyebrow: ['Your next step', 'તમારું આગળનું પગલું'],
    whatsapp: ['WhatsApp enquiry', 'WhatsApp પૂછપરછ'],
    checklist: ['Document checklist', 'દસ્તાવેજોની યાદી'],
    close: ['Close service details', 'સેવાની વિગતો બંધ કરો'],
    variant: ['What would you like help with?', 'કયા કામમાં મદદ જોઈએ છે?'],
    branch: ['Preferred branch for your enquiry', 'પૂછપરછ માટે પસંદગીની શાખા'],
    choose: ['Choose a branch', 'શાખા પસંદ કરો'],
    message: ['Your message', 'તમારો સંદેશ'],
    send: ['Continue to WhatsApp ↗', 'WhatsApp પર આગળ વધો ↗'],
    sendNote: [
      'Choose a branch, then review and send your message in WhatsApp.',
      'શાખા પસંદ કરો, પછી WhatsAppમાં સંદેશ તપાસીને મોકલો.'
    ],
    intro: [
      'Tick what you have ready. Download a copy in either language for your visit.',
      'તૈયાર હોય તે દસ્તાવેજ પર નિશાની કરો. મુલાકાત માટે કોઈપણ ભાષામાં યાદી ડાઉનલોડ કરો.'
    ],
    download: ['Download checklist (.txt)', 'યાદી ડાઉનલોડ કરો (.txt)'],
    guideNote: [
      'A preparation guide, not a final application requirement list. Documents vary by vehicle, application and Gujarat RTO. Confirm with your adviser before visiting.',
      'આ તૈયારી માટેનું માર્ગદર્શન છે, અરજી માટેની અંતિમ યાદી નથી. વાહન, અરજી અને ગુજરાત RTO મુજબ દસ્તાવેજો બદલાઈ શકે છે. મુલાકાત પહેલાં સલાહકાર સાથે ખાતરી કરો.'
    ],
    sources: ['Reference / application portal', 'સંદર્ભ / અરજીનું પોર્ટલ'],
    date: ['Reviewed: 11 October 2026', 'સમીક્ષા: 11 ઑક્ટોબર 2026'],
    status: ['Checklist download started.', 'યાદીનું ડાઉનલોડ શરૂ થયું.'],
    blankBranch: ['Not selected', 'પસંદ કરેલ નથી'],
    branchError: ['Please choose your preferred branch.', 'કૃપા કરીને પસંદગીની શાખા પસંદ કરો.']
  };
  const language = () => (window.ShreenathLanguage?.get() === 'gu' ? 'gu' : 'en');
  const words = (key, lang = language()) => copy[key][lang === 'gu' ? 1 : 0];
  let serviceId = 'registration',
    guideId = 'registration',
    branchId = '',
    mode = 'checklist',
    returnFocus;
  let closing = false,
    animation,
    backdrop;
  const checked = new Map();
  const chosen = () => {
    if (!checked.has(guideId)) checked.set(guideId, new Set());
    return checked.get(guideId);
  };
  const dialog = document.createElement('dialog');
  dialog.id = 'service-tools-dialog';
  dialog.className = 'service-tools-dialog';
  dialog.setAttribute('aria-labelledby', 'service-tools-title');
  dialog.setAttribute('data-no-translate', '');
  dialog.setAttribute('data-lenis-prevent', '');
  dialog.setAttribute('data-allow-copy', '');
  dialog.innerHTML = `<div class="service-tools-dialog-head"><div><span class="micro" data-copy="eyebrow"></span><h2 id="service-tools-title"></h2></div><button type="button" class="dialog-close" data-service-close>×</button></div>
    <div class="service-tools-body"><div class="service-tools-tabs"><button type="button" data-mode="whatsapp" data-copy="whatsapp"></button><button type="button" data-mode="checklist" data-copy="checklist"></button></div>
    <label class="service-tools-field" data-variant-field><span data-copy="variant"></span><select id="service-tools-variant"></select></label>
    <label class="service-tools-field"><span data-copy="branch"></span><select id="service-tools-branch" required></select></label>
    <section data-whatsapp-panel aria-labelledby="service-message-label"><p id="service-message-label" class="service-tools-copy" data-copy="message"></p><p class="service-tools-preview" data-message></p></section>
    <section data-checklist-panel><p class="service-tools-copy" data-copy="intro"></p><p class="service-tools-progress" role="status" aria-live="polite" data-progress></p><ul class="service-tools-list"></ul><p class="service-tools-note" data-guide-note></p><p class="service-tools-copy" data-copy="guideNote"></p>
    <p class="service-tools-copy" data-copy="download"></p><div class="service-tools-downloads"><button type="button" class="service-tool-download" data-download="en" lang="en">English ↓</button><button type="button" class="service-tool-download" data-download="gu" lang="gu">ગુજરાતી ↓</button></div><div class="service-tools-sources" data-sources></div></section>
    <div class="service-tools-footer"><a class="service-tools-whatsapp" href="#" target="_blank" rel="noopener noreferrer" data-whatsapp data-copy="send"></a><p data-copy="sendNote"></p></div><p class="service-tools-status" role="status" aria-live="polite" data-status></p></div>`;
  document.body.append(dialog);
  const variant = dialog.querySelector('#service-tools-variant');
  const branch = dialog.querySelector('#service-tools-branch');
  const list = dialog.querySelector('.service-tools-list');
  const whatsapp = dialog.querySelector('[data-whatsapp]');
  function message(lang = language()) {
    const service = data.guides[guideId].name[lang];
    const office = branches[branchId]?.[lang] || words('blankBranch', lang);
    return lang === 'gu'
      ? `નમસ્તે શ્રીનાથ ઓટો એડવાઇઝર્સ,\nમને ${service} માટે મદદ જોઈએ છે.\nમારી પસંદગીની શાખા: ${office}.\nકૃપા કરીને જરૂરી દસ્તાવેજો અને આગળનાં પગલાં જણાવશો.`
      : `Hello Shreenath Auto Advisers,\nI would like help with ${service}.\nMy preferred branch: ${office}.\nPlease guide me on the documents needed and the next steps.`;
  }
  function updateMessage() {
    dialog.querySelector('[data-message]').textContent = message();
    whatsapp.href = branchId
      ? `https://wa.me/${whatsappDestination}?text=${encodeURIComponent(message())}`
      : '#';
  }
  function progress() {
    const ready = chosen().size,
      total = data.guides[guideId].items.length;
    dialog.querySelector('[data-progress]').textContent =
      language() === 'gu' ? `${total}માંથી ${ready} તૈયાર` : `${ready} of ${total} ready`;
  }
  function render() {
    const lang = language(),
      guide = data.guides[guideId];
    dialog.lang = lang;
    dialog.querySelectorAll('[data-copy]').forEach((el) => {
      el.textContent = words(el.dataset.copy);
    });
    dialog.querySelector('[data-service-close]').setAttribute('aria-label', words('close'));
    dialog.querySelector('#service-tools-title').textContent = guide.name[lang];
    dialog
      .querySelectorAll('[data-mode]')
      .forEach((button) =>
        button.setAttribute('aria-pressed', String(button.dataset.mode === mode))
      );
    dialog.querySelector('[data-whatsapp-panel]').hidden = mode !== 'whatsapp';
    dialog.querySelector('[data-checklist-panel]').hidden = mode !== 'checklist';
    variant.replaceChildren(
      ...data.services[serviceId].map((id) => new Option(data.guides[id].name[lang], id))
    );
    variant.value = guideId;
    dialog.querySelector('[data-variant-field]').hidden = data.services[serviceId].length < 2;
    branch.replaceChildren(
      new Option(words('choose'), ''),
      ...Object.entries(branches).map(([id, name]) => new Option(name[lang], id))
    );
    branch.value = branchId;
    branch.setCustomValidity('');
    list.replaceChildren(
      ...guide.items.map((item, i) => {
        const li = document.createElement('li'),
          label = document.createElement('label');
        const input = document.createElement('input'),
          text = document.createElement('span');
        input.type = 'checkbox';
        input.checked = chosen().has(i);
        text.textContent = item[lang];
        input.addEventListener('change', () => {
          input.checked ? chosen().add(i) : chosen().delete(i);
          progress();
        });
        label.append(input, text);
        li.append(label);
        return li;
      })
    );
    dialog.querySelector('[data-guide-note]').textContent = guide.note[lang];
    const sources = dialog.querySelector('[data-sources]');
    sources.replaceChildren();
    const caption = document.createElement('p');
    caption.textContent = `${words('sources')} · ${words('date')}`;
    sources.append(caption);
    guide.sources.forEach((source, i) => {
      const a = document.createElement('a');
      a.href = source.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent =
        lang === 'gu' ? `સંદર્ભ ${i + 1} — ${new URL(source.url).hostname} ↗` : source.label + ' ↗';
      sources.append(a);
    });
    dialog.querySelector('[data-status]').textContent = '';
    progress();
    updateMessage();
  }
  function syncTriggers() {
    triggers.forEach((button) => {
      const key = button.dataset.serviceAction === 'whatsapp' ? 'whatsapp' : 'checklist';
      button.textContent = words(key) + (key === 'whatsapp' ? ' ↗' : ' +');
      button.setAttribute(
        'aria-label',
        `${words(key)} — ${document.getElementById(button.dataset.service)?.querySelector('h3')?.textContent || ''}`
      );
    });
  }
  async function animate(frames, duration) {
    animation?.cancel();
    if (reduced.matches || !dialog.animate) return;
    const current = dialog.animate(frames, {
      duration,
      easing: 'cubic-bezier(.22,1,.36,1)',
      fill: 'both'
    });
    animation = current;
    try {
      await current.finished;
    } catch {
      /* Motion setting changed. */
    }
    current.cancel();
    if (animation === current) animation = null;
  }
  function open(button) {
    if (closing || dialog.open || !data.services[button.dataset.service]) return;
    returnFocus = button;
    serviceId = button.dataset.service;
    guideId = data.services[serviceId][0];
    mode = button.dataset.serviceAction;
    render();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else {
      backdrop = document.createElement('div');
      backdrop.className = 'service-tools-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.addEventListener('click', close);
      document.body.append(backdrop);
      dialog.setAttribute('open', '');
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
    }
    root.classList.add('service-tools-open');
    dialog.scrollTop = 0;
    dialog.querySelector('[data-service-close]').focus({ preventScroll: true });
    animate(
      [
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'none' }
      ],
      260
    );
  }
  async function close() {
    if (!dialog.open || closing) return;
    closing = true;
    await animate(
      [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: 'translateY(8px)' }
      ],
      180
    );
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    backdrop?.remove();
    backdrop = null;
    root.classList.remove('service-tools-open');
    closing = false;
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  }
  triggers.forEach((button) => button.addEventListener('click', () => open(button)));
  variant.addEventListener('change', () => {
    guideId = variant.value;
    render();
  });
  branch.addEventListener('change', () => {
    branchId = branch.value;
    branch.setCustomValidity('');
    updateMessage();
  });
  dialog.querySelectorAll('[data-mode]').forEach((button) =>
    button.addEventListener('click', () => {
      mode = button.dataset.mode;
      render();
    })
  );
  dialog.querySelector('[data-service-close]').addEventListener('click', close);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  let backdropPress = false;
  const outside = (event) => {
    const rect = dialog.getBoundingClientRect();
    return (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    );
  };
  dialog.addEventListener('pointerdown', (event) => {
    backdropPress = outside(event);
  });
  dialog.addEventListener('pointercancel', () => {
    backdropPress = false;
  });
  dialog.addEventListener('click', (event) => {
    if (backdropPress && outside(event)) close();
    backdropPress = false;
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button,a[href],select,input')].filter(
      (el) => !el.disabled && el.getClientRects().length
    );
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  whatsapp.addEventListener('click', (event) => {
    if (!branches[branchId]) {
      event.preventDefault();
      branch.setCustomValidity(words('branchError'));
      branch.reportValidity();
      branch.focus();
    }
  });
  dialog.querySelectorAll('[data-download]').forEach((button) =>
    button.addEventListener('click', () => {
      const lang = button.dataset.download,
        guide = data.guides[guideId];
      const lines = [
        'Shreenath Auto Advisers',
        guide.name[lang],
        words('date', lang),
        '',
        words('branch', lang) + ': ' + (branches[branchId]?.[lang] || words('blankBranch', lang)),
        '',
        ...guide.items.map((item, i) => `${chosen().has(i) ? '[x]' : '[ ]'} ${item[lang]}`),
        '',
        guide.note[lang],
        '',
        words('guideNote', lang),
        '',
        words('sources', lang),
        ...guide.sources.map((source) => source.label + ': ' + source.url),
        '',
        'https://shreenathauto.live/services'
      ];
      const url = URL.createObjectURL(
        new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/plain;charset=utf-8' })
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = `shreenath-${guideId}-checklist-${lang}.txt`;
      // Keep the download action inside the active modal, outside inert page content.
      dialog.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      dialog.querySelector('[data-status]').textContent = words('status');
    })
  );
  addEventListener('shreenath:language', () => {
    syncTriggers();
    if (dialog.open) render();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) animation?.cancel();
  });
  syncTriggers();
})();
