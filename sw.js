/* Cloudflare deployment migration, prepared 20261027 from release 20261026-r32.
   Let the browser perform EVERY navigation and asset request directly.
   No fetch handler: fresh pages and assets are served by Cloudflare Pages.
   Installation/shortcuts remain browser-controlled; offline interception is
   intentionally disabled. Clear old site caches without reloading open tabs. */
'use strict';
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.startsWith('shreenath-auto-')).map((key) => caches.delete(key))
      );
      // Replace the old fetching worker without reloading any open tabs.
      await self.clients.claim();
    })()
  );
});
