/* Basic consent: no Google tag request before optional analytics is accepted. */
(() => {
  'use strict';
  const id = window.SHREENATH_CONFIG?.analyticsId;
  if (!/^G-[A-Z0-9]+$/.test(id || '') || !/^https?:$/.test(location.protocol)) return;
  let loaded = false, enabled = false;
  const allowed = () => Boolean(window.ShreenathConsent?.analyticsAllowed() && !navigator.globalPrivacyControl && navigator.doNotTrack !== '1');
  const disableKey = 'ga-disable-' + id;
  window[disableKey] = true;
  function syncConsent() {
    enabled = allowed();
    window[disableKey] = !enabled;
    if (!enabled) {
      if (loaded) window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      return;
    }
    if (loaded) { window.gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    const cleanLocation = location.origin + location.pathname;
    let cleanReferrer = '';
    try { const referrer = new URL(document.referrer); cleanReferrer = referrer.origin + referrer.pathname; } catch {}
    window.gtag('set', { page_location: cleanLocation, page_referrer: cleanReferrer });
    window.gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 180 * 86400,
      cookie_update: false,
      page_location: cleanLocation,
      page_referrer: cleanReferrer
    });
    window.gtag('event', 'page_view', { page_title: document.title, page_location: cleanLocation });
    const script = document.createElement('script');
    script.async = true;
    script.id = 'shreenath-google-analytics';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    script.onerror = () => {
      loaded = false;
      enabled = false;
      window[disableKey] = true;
      script.remove();
      window.dataLayer = [];
    };
    document.head.append(script);
  }
  window.addEventListener('shreenath:consent', syncConsent);
  syncConsent();
  document.addEventListener('click', event => {
    if (!enabled || !allowed()) return;
    const href = event.target.closest('a')?.getAttribute('href') || '';
    const method = href.startsWith('tel:') ? 'phone' : href.startsWith('mailto:') ? 'email' : href.includes('google.com/maps/') ? 'directions' : null;
    if (method) window.gtag('event', 'contact_click', { contact_method: method });
  });
  window.addEventListener('shreenath:enquiry-prepared', event => {
    if (!enabled || !allowed()) return;
    window.gtag('event', 'enquiry_prepared', { service: event.detail.service, branch: event.detail.branch });
  });
})();
