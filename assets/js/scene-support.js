/* ES5 by design: decorative artwork must survive a missing graphics engine. */
(function () {
  'use strict';
  var root = document.documentElement, live = false, probe, context;
  try {
    var script = document.createElement('script');
    var media = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if ('noModule' in script && window.Promise && window.fetch && window.ResizeObserver && window.IntersectionObserver && media && media.addEventListener && window.WebGL2RenderingContext) {
      probe = document.createElement('canvas');
      context = probe.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
      live = !!context;
      if (context) {
        var release = context.getExtension('WEBGL_lose_context');
        if (release) release.loseContext();
      }
    }
  } catch (ignore) { live = false; }
  root.setAttribute('data-scene-mode', live ? 'live' : 'still');
  function announce() {
    var event = document.createEvent('Event');
    event.initEvent('shreenath:hero-ready', false, false);
    window.dispatchEvent(event);
  }
  function show(stage) {
    if (!stage) return;
    stage.classList.add('is-fallback');
    stage.setAttribute('aria-busy', 'false');
    var status = stage.querySelector('.scene-status');
    if (status) status.textContent = '';
    var button = stage.querySelector('.object-motion-toggle');
    if (stage.id === 'road-scene') button = document.querySelector('.motion-toggle');
    if (button) button.hidden = true;
    announce();
  }
  function ready(stage) {
    stage.classList.remove('is-fallback');
    stage.setAttribute('aria-busy', 'false');
  }
  window.ShreenathSceneSupport = { live: live, show: show, ready: ready };
  document.addEventListener('DOMContentLoaded', function () {
    var stages = document.querySelectorAll('#road-scene, [data-object]');
    for (var i = 0; i < stages.length; i++) {
      if (!live) show(stages[i]);
      else (function (stage) {
        // Includes script parsing, blocked CDN and shader-compilation failures.
        window.setTimeout(function () {
          if (!stage.classList.contains('is-ready')) show(stage);
        }, 9000);
      })(stages[i]);
    }
  });
})();
