/* Standalone ES5 form controller: works even if decorative scripts cannot run. */
(function () {
  'use strict';
  var form = document.getElementById('inquiry-form');
  if (!form || !window.FormData || !window.XMLHttpRequest) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('[type="submit"]');
  var label = button.querySelector('.enquiry-label');
  var pending = false, state = 'idle', message = '', locked = [];
  var labels = { idle: 'Submit enquiry', sending: 'Sending enquiry…', success: 'Enquiry sent', error: 'Try again' };
  var config = window.SHREENATH_CONFIG || {}, keys = config.web3formsKeys || {};
  var keyInput = form.querySelector('[name="access_key"]');
  var key = keys[location.hostname.toLowerCase()] || keys.default || keyInput.value;
  keyInput.value = key;
  var select = form.querySelector('#service');
  if (window.URLSearchParams && select) {
    var requested = new URLSearchParams(location.search).get('service');
    for (var i = 0; i < select.options.length; i++) if (select.options[i].value === requested) select.value = requested;
  }
  function translate(text) {
    return window.ShreenathLanguage ? window.ShreenathLanguage.text(text) : text;
  }
  function paint() {
    form.setAttribute('data-submit-state', state);
    label.textContent = translate(labels[state]);
    status.textContent = translate(message);
    status.setAttribute('data-success', state === 'success' ? 'true' : 'false');
  }
  function setState(next, text) { state = next; message = text; paint(); }
  function unlock() {
    pending = false;
    for (var i = 0; i < locked.length; i++) locked[i].disabled = false;
    locked = [];
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
  form.addEventListener('input', function () {
    if (!pending && state !== 'idle') setState('idle', '');
  });
  window.addEventListener('shreenath:language', paint);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (pending) return;
    if (form.reportValidity ? !form.reportValidity() : !form.checkValidity()) return;
    var name = form.querySelector('[name="name"]').value.trim();
    var phone = form.querySelector('[name="phone"]').value.trim();
    var text = form.querySelector('[name="message"]').value.trim();
    if (!name || text.length < 5 || !/^[+0-9() .\-]{7,25}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
      setState('error', 'Please add your name, a valid phone number, and a short message.');
      return;
    }
    keyInput.value = key;
    var data = new FormData(form), service = select.value, branch = form.querySelector('[name="branch"]').value;
    var request = new XMLHttpRequest();
    pending = true;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    var fields = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].disabled) { locked.push(fields[i]); fields[i].disabled = true; }
    }
    setState('sending', 'Sending your enquiry securely. Please keep this page open.');
    function failed(uncertain) {
      unlock();
      setState('error', uncertain
        ? 'We could not confirm delivery. Your message is still here. Please call us before retrying to avoid a duplicate enquiry.'
        : 'Your enquiry was not accepted. Your message is still here. Please try again or contact us directly.');
    }
    request.onload = function () {
      var result;
      try { result = JSON.parse(request.responseText); } catch (ignore) { failed(true); return; }
      if (request.status >= 200 && request.status < 300 && result.success === true) {
        unlock(); form.reset(); keyInput.value = key;
        setState('success', 'Thank you! Your enquiry has been sent successfully. We will get back to you shortly.');
        var sent = document.createEvent('CustomEvent');
        sent.initCustomEvent('shreenath:enquiry-sent', false, false, { service: service, branch: branch });
        window.dispatchEvent(sent);
      } else { failed(result.success !== false); }
    };
    request.onerror = request.ontimeout = request.onabort = function () { failed(true); };
    try {
      request.open('POST', form.action, true);
      request.timeout = 30000;
      request.setRequestHeader('Accept', 'application/json');
      request.send(data);
    } catch (ignore) { failed(false); }
  });
  paint();
})();
