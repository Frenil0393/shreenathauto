/* Releases arrive through normal navigation and versioned asset URLs.
   Never fetch release.json or reload an open page: that interrupted language
   choices and could repeat InfinityFree's browser verification challenge. */
(() => {
  'use strict';
  const version = document.querySelector('meta[name="site-release"]')?.content;
  if (version) document.documentElement.dataset.siteRelease = version;
})();
