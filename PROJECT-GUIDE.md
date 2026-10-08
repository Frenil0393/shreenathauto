# Shreenath Auto Advisers — Project Guide

Updated 8 October 2026. This is the project's single owner document. It consolidates the former README, publishing instructions, launch checklist, readiness report, security notes and icon-generation notes.

## Current project and cleanup

- The project contains the public website pages, its active assets, hosting files and this guide.
- The obsolete V9 directory is absent. Its recovery copy is in the earlier external cleanup archive.
- Development utilities, icon source masters/previews and three unused original portrait JPEGs have been archived outside the project. The responsive portraits used by the website are retained.
- The original office images and logo are retained because search metadata and structured data still reference them.
- No business content or live design was removed. The current public release remains `20261008-r13`; this cleanup does not change public URLs or application code.
- The sections below preserve the earlier documents in full. They include historical release notes. References in those sections to separate Markdown files or a local tools directory are historical; those files are now consolidated here or stored in the recovery archive.

## Recovery archive

The removed source documents, maintenance tools, icon masters and unused originals are preserved at:

`C:/Users/HP/.codex/visualizations/2026/10/04/01a105b1-57e5-7df0-9815-9956d4c3554c/cleanup-archive/shreenath-project-final-cleanup-20261008.zip`

The earlier V9 and obsolete-asset archive is:

`C:/Users/HP/.codex/visualizations/2026/10/04/01a105b1-57e5-7df0-9815-9956d4c3554c/cleanup-archive/shreenath-unused-20261008-214157.zip`

To use a maintenance script again, restore its `tools/` directory into the project first. Image preparation also requires the archived original portraits; restore those to their original paths before regenerating responsive images. These sources are not needed to host the website.

## Publishing — current instructions

1. Back up the live site.
2. Upload the root HTML pages, `assets/`, `.htaccess`, `manifest.json`, `sw.js`, `robots.txt` and `sitemap.xml` to the domain's assigned `htdocs`.
3. Upload `release.json` last. Keep HTTPS enabled. Do not upload this guide or the external archives.
4. Check real hosted redirects, 404 responses, navigation, settings, forms and installation on your devices. Earlier static checks passed, but the local browser preview was blocked by browser-tool policy; full browser and InfinityFree behaviour are not verified.
5. Installed shortcuts may retain an old icon until removed and added again. InfinityFree's mandatory browser check can affect PWA installation and crawler access.

For a future public-content update without the optional release utility, use one new release ID in `release.json`, the page release markers and the worker cache name; update changed asset query versions and the worker's offline asset references together. Publish the release marker last.

## Consolidated source documents

These sections preserve the source notes and their original dates/statuses for reference. The current instructions above take precedence over historical deployment or cleanup instructions.

<a id="infinityfree-launch-md"></a>

## Source: INFINITYFREE-LAUNCH.md

## InfinityFree publishing and discovery

Updated 8 October 2026. Files have been edited locally and static publication checks have passed. Nothing has been deployed, and browser/hosting behaviour has not been verified. The production domain remains **https://shreenathauto.me**. Read **PUBLISH-READINESS.md** for the current check results and remaining launch steps.

### Publish this update

Current r13: browser favicons and regular app icons have rounded transparent corners. Apple and Android maskable sources stay opaque so their operating systems apply the correct mask. Replaced favicon/app references carry a new version. Unused old-site files, duplicate icons, abandoned SVGs and CSS, and unreferenced small image exports were archived outside the project and removed (53 files, about 2.7 MiB). Original photography and useful maintenance sources remain. Icon masters and the preview now live under `tools/icon-source/`, away from public assets. The 1,344 local checks passed again after cleanup.

**8 October release:** upload the updated `assets` folder, all root HTML pages (including `offline.html`), `.htaccess`, `manifest.json` and `sw.js` into this domain's `htdocs`; upload `release.json` last. The current release ID is `20261008-r13`. Keep your existing HTTPS certificate active. No build step is required.

#### Clear icons and search metadata — r12 (historical)

The new generated car-and-hands icon has solid dark forms on an opaque ivory background. It is a small-size adaptation; the header's original logo remains unchanged. Browser ICO/PNG, 180px Apple, 192px/512px app icons and separately padded maskable icons are in `assets/images/app-icon`. HTML, the manifest and the offline fallback use these files. Normal app icons maximise the mark; maskable icons retain space required by circular launchers. Existing installed shortcuts may retain an OS-cached icon; if they do, remove and add that shortcut again after deployment.

Each public page now has a focused keyword list plus relevant titles/descriptions consistent with its subject. Google ignores the meta-keywords tag; the actual SEO value is accurate visible service content, location information, descriptive metadata, clean canonicals and structured data. Error/offline pages remain noindex. No ranking position is promised. Static checks passed across all 12 pages and all 23 JavaScript files passed syntax checks. Browser access to the local file preview was blocked by the browser tool policy, so interactive checks were not completed. Earlier release entries below describe historical validation status.

#### Clean URLs and installation — r11 (historical)

Navigation links now go straight to `/`, `/services`, `/about`, `/contact` and the clean policy URLs. Old `.html` links permanently redirect while keeping query parameters. Apache internally serves the existing HTML files, so do not rename or remove them. `/index` redirects home and trailing slashes are normalised. Missing URLs retain a real 404 response and the error page's assets use absolute paths. Direct-file previews of the main pages map navigation back to local HTML through `urls.js`; installation requires a served secure origin.

`manifest.json` now declares standalone mode, a stable app identity, correct existing 192px/512px icons, and Services/Contact app shortcuts for browsers that support them. Every page has Apple app metadata and a footer **Install website** button. The button opens a translated English/Gujarati guide, with a native install action only when the browser supplies an installation event. The manifest request includes same-origin credentials for the host's verification cookie. This does not bypass host security or guarantee the browser will offer installation.

- Android Chrome and desktop Chrome/Edge: use the browser's install option or the site's button when available.
- iPhone/iPad: in Safari, Share → Add to Home Screen → Add. Keep Open as Web App enabled if offered.
- Mac with a recent Safari: File → Add to Dock.
- Other browsers: use their install, bookmark or shortcut feature when available. An identical native install prompt is not supported on every browser/OS.

The new root `sw.js` replaces the old retirement worker. It serves normal documents from the network and only stores a small offline contact page, its CSS/JS and icons. It does not cache full website pages, form drafts or analytics. It rejects unexpected challenge responses during offline setup. The update helper no longer unregisters the current worker, and existing consent/language/appearance choices are preserved. Do not restore the previous retirement worker or old site's cache-first worker. The full site and 3D scenes require an internet connection.

InfinityFree explicitly warns that its mandatory browser-security system can interfere with PWAs. Site code and `.htaccess` cannot remove that limitation. If your hosted installation check is blocked by that system, contact InfinityFree or move to hosting without the mandatory challenge. No deployment or testing was performed here. Use HTTPS on the real domain for your own install, redirect, offline/reconnect and update checks; `file://` previews cannot offer PWA installation.

Sources: [MDN installation requirements and browser support](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), [credentialed manifests](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/crossorigin), [Apple: web apps on Mac](https://support.apple.com/en-us/104996), [InfinityFree's PWA limitation](https://forum.infinityfree.com/t/how-do-i-get-pwa-to-work/69018/3).

#### Stable navigation and five new concepts — r10 (historical)

Every page now contains its complete header controls in HTML. The existing scripts reuse those buttons instead of creating and rearranging the desktop header after first paint. Desktop native transitions keep the header separate from the fading page content, and local file previews receive a content-only fade. The mobile menu and preference-dialog behaviour are retained.

The index scene's motion control reserves its final space before WebGL becomes ready. Scene containers retain their initial dimensions, and fonts use an optional loading strategy to avoid a late font swap moving visible text: a slow first visit can retain the fallback font for that document, with downloaded fonts available on subsequent visits. No homepage artwork has been redesigned in this release.

Services now shows a document atelier with a customer and adviser reviewing paperwork. Our Story illustrates the documented journey from Anupam Auto Advisers in Jamkandorana, through the Shreenath name, to Dhoraji, with a moving route marker and restrained gestures. These are symbolic scenes, not replicas of actual premises. Cancellations has a cash-return envelope and receipt; Copyright has an author's folio and maker's seal; Accessibility has a continuous ramp and human symbol. Policy objects remain quiet rather than continuously animated. Labels and descriptions support Gujarati. Contact and the remaining policy artwork are unchanged.

Upload all updated HTML pages and assets together, then `release.json` last. No browser, visual or automated tests were run; final testing remains with the owner.

#### Selective editorial scenes — r9 (historical)

The index street scene is unchanged. Only About, Services and Contact load the new `assets/js/editorial-scenes.js`: an adviser studio around a shared table, a service court with a timed stop/check/depart sequence, and a quiet reception lounge. These are newly built illustrative compositions, not reconstructions of actual branch facilities. Rounded furniture, small gestures, open architectural frames and a limited palette replace the previous generic miniature rooms. Static geometry is merged by material, the single translucent screen avoids refraction, and the existing 30 fps cap, visibility suspension, pause control and reduced-motion settings apply. The service scene starts with the car at the check so reduced-motion visitors also receive a complete composition.

Privacy, Terms, Cancellations, Cookies, Copyright, Accessibility and 404 retain focused symbolic objects at their existing sizes, with no continuous ambient animation. New scene dimensions are reserved in the three main pages' HTML before loading. Existing navigation, menu, consent, analytics configuration and the homepage model are preserved. Upload the new builder along with updated HTML and assets, then `release.json` last. No visual or automated tests were run.

#### Focused 3D direction — r8 (historical)

The homepage retains its complete street scene, mobile continuous roads, market and gradient ending without visual changes in this release. All inner-page miniature environments from r7 have been removed, including the unused `page-scenes.js` builder and its script references. About returns to paired architectural arches, Services to keys and a fob, and Contact to conversation forms; these three retain restrained optional motion and pause controls. Policy pages and 404 use their individual symbolic objects without continuous ambient animation or scroll-driven rotation. Desktop pointer interaction remains available, then rendering stops once the object settles. Reduced-motion preferences still apply.

The original object-stage dimensions and accessible descriptions are restored directly in HTML/CSS so loading does not switch from scene-sized to object-sized layouts. Existing navigation, cookie dropdown fix, analytics ID and consent behaviour are retained. Upload updated HTML, `objects.js`, `art-direction.css`, and `release.json` last. If r7 was previously uploaded, its now-unused `page-scenes.js` can be removed from hosting. No tests were run. The r7 entry below is historical and is superseded by this direction.

#### Complete inner-page scenes and continuous mobile street — r7

Mobile now uses the same continuous homepage ground, through-roads and rear market as desktop, framed beneath the copy. The finite mobile model base has been removed. A wider mobile alpha feather makes the artwork fully transparent at the measured hero divider. Mobile rendering retains its 30 fps cap and uses a 1.1 maximum pixel ratio for the expanded scene.

The ten inner pages now load `assets/js/page-scenes.js` before `objects.js`. Each receives its own miniature environment: two branch offices (About), a service bay (Services), reception (Contact), an archive (Privacy), a consultation table (Terms), a cash refund counter (Cancellations), a preferences workspace (Cookies), a print studio (Copyright), a ramp entrance (Accessibility), and a roadside detour (404). These are illustrative environments, not representations or claims about the business's actual facilities. Static details use instanced meshes; activity uses the shared pause/resume, visibility and reduced-motion controls. The original sculptures remain a fallback if the scene builder cannot load. Initial HTML reserves the new scene dimensions to avoid a late size change, and accessible scene descriptions have Gujarati translations.

Upload the new scene-builder file as well as the updated HTML and other assets. Analytics configuration, consent behaviour, the mobile Menu button fix and existing page transitions are retained. No browser or automated tests were run.

#### Live object motion, analytics and disclosures — r6

The owner supplied GA4 measurement ID `G-XS41JPJ318`, now configured in `assets/js/config.js`. The integration loads the tag only after affirmative optional-analytics consent on HTTP(S). A local `file://` preview remains disabled and now explains that distinction. Browser Global Privacy Control or Do Not Track also keeps analytics off. Configuration does not verify ownership, Google-side settings, receipt of events or deployment; those have not been tested. This supersedes earlier instructions describing an empty analytics ID.

The other pages retain their distinctive 3D sculptures and now animate their individual components, with an English/Gujarati Pause/Resume control, a 30 fps rendering cap, offscreen suspension and reduced-motion support. These are animated sculptures, not complete new architectural environments. Disclosure animations measure the actual final box instead of adding partial child heights; this includes the cookie row's padding and prevents its final height snap. Stable scrollbar space prevents a width change inside the cookie dialog. No tests were run.

#### Rear market and soft road ending — r5

The wide homepage scene now fills both sides of the road behind the office with a staggered market frontage, upper rooms, customers, planting and streetlights. A stationery shop also fills the immediate area behind the office in the compact scene. Background details are combined by material, and the outer district is hidden in the compact mobile crop. New shop signs include Gujarati translations. A feathered alpha mask replaces the hard hero-divider clip; the road continues underneath the fade and is completely transparent by the divider. The r4 mobile Menu button visibility fix and the existing navigation behaviour remain unchanged. No tests were run.

#### Market scene and coordinated mobile appearance — r3

The homepage street now includes a kirana shop, cycle repair shop with a parked bicycle, chai counter, produce cart, bench, litter bin and customers. Signs have Gujarati translations. Static details share material batches. The foreground road ends at 3.8 scene units; a separate clip follows the hero-bottom divider's actual position, so artwork cannot continue below that line. Rear and side roads still extend out of frame on desktop.

Mobile now uses a single scripted opacity transition instead of native cross-document snapshots. The header stays in place while content fades. The shared Three.js request starts from a synchronous head bootstrap. Incoming content waits for DOM setup and the hero's first rendered frame, with a 1.5-second maximum from bootstrap, then fades in together. The timeout is a fallback, not a minimum wait: a ready scene reveals immediately. Failed dependencies release the page; exceptionally slow scenes can still finish after the timeout. Links keep real document navigation, native back/forward history, anchors, download and modified-click behaviour. Desktop retains native transitions. Reduced-motion users bypass the fades. This also gives local `file://` previews a mobile fade without requiring native cross-document transition support.

These changes supersede the r2 mobile snapshot description below. No browser, device or automated tests were run. Upload all HTML as well as assets because the transition script has moved from defer to the head bootstrap.

#### Mobile navigation and expanded desktop scene — r2

Hero sculptures now initialize eagerly, including when mobile copy places them below the initial viewport. Three.js and its core dependency are preloaded, scene scripts start before the other deferred enhancements, and shaders compile before the first draw using Three.js `compileAsync`. Mobile canvases no longer run an additional opacity fade. Mobile sculptures use a lower pixel ratio, no shadow-map pass and no scroll-driven rotation; their page-specific geometry is preserved. Outgoing pages stop rendering without synchronously walking and disposing every GPU resource during navigation. The browser releases resources with the document, and back/forward cached pages retain their existing scenes. Gujarati translation still happens before reveal, but font fetching no longer adds a separate 1.2-second page-wide hidden interval.

On the desktop homepage, the ground and through-roads extend beyond the camera instead of ending at the small rectangular base. Framing is slightly closer, and the upper gradient has been removed so the street reaches the top and right hero boundaries. The copy and lower section retain their paper blend. The compact mobile street layout is preserved.

For your checks, open a served HTTP(S) address. A `file://` preview is not a dependable environment for same-origin cross-document view transitions. Native transitions depend on browser support; initial library downloads and GPU initialization still take real time on a cold visit. These edits remove deliberate delays and reduce rendering work, but no device performance measurements or browser tests have been run. References: [Chrome cross-document transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document), [Three.js renderer compilation](https://threejs.org/docs/pages/WebGLRenderer.html).

#### Future updates without a manual hard refresh

After making future edits, run `python tools/prepare_release.py` locally, then upload changed assets and all root HTML pages, and publish `release.json` last. This optional publishing utility generates a content-based release ID and updates local asset URLs and page release markers together; it has not been run or tested in this task. For this release the markers are already set, so running it is unnecessary. If you do not use Python, set a new identical release ID in `release.json`, each HTML `site-release` meta tag and the local asset query versions before upload.

HTML and the release marker are configured not to remain in the HTTP cache; scripts and styles revalidate. Versioned references refresh changed assets. `site-updates.js` checks once on page entry and when a saved tab returns, with throttling. A different release triggers a guarded refresh, deferred while a dialog is open or an enquiry contains input. It does not clear language, appearance or consent choices. The `_site` query marker prevents reload loops. No continuous background polling is used.

The previous folder contains a cache-first worker named `sw.js` using `shreenath-auto-*` caches. The current root `sw.js` replaces it with network documents and an offline contact fallback; it removes earlier caches in that family on activation. Keep it at the exact public worker URL and do not upload the old `shreenath-auto V9/sw.js` over it. Browsers decide when to update previously installed workers. Already-cached legacy HTML which never loads the new code cannot be retroactively controlled; an initial legacy visit may still show old content until the worker update reaches it. Server/proxy caching rules must also honour the deployment headers. Future releases must update the worker cache version and its offline asset references along with HTML; the updated optional release utility handles this and has not been run. These changes avoid routine hard refreshes after migration, not every possible cache circumstance.

#### Chrome's “cookies are not enabled” error

InfinityFree's mandatory free-hosting browser check runs before your site is served and requires JavaScript and cookies. Your website's optional analytics consent cannot disable or repair that host-level check. Open the canonical HTTPS address directly in Chrome, allow site cookies and JavaScript, and avoid embedding it inside another site's frame or forwarding wrapper. If Chrome already permits both and the problem continues, take the exact failing URL/message to InfinityFree support. Changing site code cannot guarantee this error disappears. A hosting service without that mandatory check is needed if that limitation is unacceptable.

Sources: [InfinityFree browser security system](https://forum.infinityfree.com/t/browser-security-system-features-and-limitations/49353), [MDN HTTP caching controls](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control), [MDN cross-document view transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition).

Keep `WEBSITE-BUILD-PROMPT.md` and `tools/prepare_release.py` local. The prompt contains replaceable parameters for future projects; it is not a public website page. No browser, performance or automated tests were run for this release.

Mobile page fades and language-popup dismissal: upload every root HTML page, `assets/js/language.js`, `assets/js/page-transition.js` and `assets/css/page-transition.css`. Mobile internal navigation now uses a brief exit/arrival fade below the steady header, respecting reduced motion. Clicking outside the language dialog closes it when opened through the header control and preserves the mobile dropdown. The first-visit chooser does not dismiss on backdrop clicks. No tests were run.

For the mobile header stability and rebuilt office update, upload every root HTML page plus `assets/css/header.css`, `assets/js/main.js`, `assets/js/appearance.js`, `assets/js/language.js` and `assets/js/scene.js`. Their references use `20261007-stable-header`. Brand sizing now applies before JavaScript setup; desktop active links have a short underline; closing a settings dialog returns to the still-open mobile menu. The office has been rebuilt as a glazed pavilion with a fitted two-person counter and a recessed entrance. No tests have been run.

Latest header/office refinement: upload all root HTML pages, `assets/css/header.css` and `assets/js/scene.js` together. The HTML references use `20261007-office` to refresh cached assets. Mobile settings now share equal card dimensions; desktop links are centred between equal-width side columns without a navigation capsule. The office is a glass-front architectural cutaway with two seated advisers and three customers, and the inspection officer's raised arm stops at 90 degrees. This refinement has not been tested or deployed.

1. Back up the live files. In InfinityFree, open the document root assigned to **shreenathauto.me**. This is an `htdocs` directory; additional domains may have their own `domain/htdocs` folder. Use the directory shown for this domain in your account.
2. Upload the root HTML pages, the complete `assets` folder, `manifest.json`, `robots.txt`, `sitemap.xml` and `.htaccess`. Upload the **contents** of this project into that document root, rather than nesting the project folder inside it. There is no Node server, build command or database requirement.
3. Include `assets/css/appearance.css`, `assets/js/appearance-init.js`, `assets/js/appearance.js`, `assets/css/scrollbar.css`, `assets/js/scrollbar.js` and the new `assets/css/hero-immersive.css`, plus the updated `main.js`, `scene.js` and `objects.js`. Upload the updated `index.html` for the full-width gradient-blended hero. All HTML pages must be uploaded together to make appearance and scroll controls consistent.
4. Keep the existing HTTPS certificate active for the canonical domain. The included Apache rules handle HTTPS, clean page URLs and the custom 404 page. Keep `.htaccess` visible in your upload client. If an old hosting default `index.php` exists, back it up and remove it only after confirming it is unused; this project enters through `index.html`.
5. Do not publish `shreenath-auto V9`, `tools`, Git metadata, README files or these launch notes. Keep any unrelated files you need on the server.

InfinityFree directory reference: [domain document roots](https://forum.infinityfree.com/t/how-to-move-a-website-to-a-different-directory/88900).

### Language update

Upload all 11 root HTML pages together with `assets/css/language.css`, `assets/js/language-init.js`, `assets/js/translations-gu.js`, `assets/js/language.js`, and the updated `main.js`, `interactions.js` and `scene.js`. The files are static and need no hosting configuration or translation API key. The privacy, cookie and accessibility pages now explain language preferences.

Visitors choose English or Gujarati once, then change it through the EN / ગુ button beside appearance settings. Your own saved choice persists too; when you perform your requested checks, a private window or removing only `shreenath_language_v1` from site storage will bring back the first-visit chooser without changing the site's code. Clearing all site storage also resets appearance and cookie choices. No browser or automated tests have been run.

### Search engines and AI discovery

For the header and security refinement, also upload `assets/css/header.css`, `assets/js/header.js`, `assets/css/content-guard.css`, `assets/js/content-guard.js`, the updated language/appearance/scene assets, every root HTML page and `.htaccess`. Gujarati now uses Hind Vadodara. On mobile, appearance and language controls are inside Menu. Keep `SECURITY.md` local; it explains the implemented controls and remaining hosting responsibilities. Security hardening and copying deterrents do not guarantee protection against compromise or duplication.

The project now includes a location-specific home search title, snippet/image preview permissions, WebSite and WebPage structured data, breadcrumb structured data, and connected Organization/branch entities. Existing service schema, canonical links, real business information, sitemap and Google verification are retained. The error page remains noindex. Business content is present in the HTML; reading it does not require the 3D scene to load.

`robots.txt` permits public crawling, including an explicit OAI-SearchBot group for ChatGPT search. No credentials or account verification values were invented. No rankings, rich results, indexing or AI citations can be guaranteed.

After upload, complete these steps in your own accounts:

1. **Google Search Console:** use the existing verified property for `https://shreenathauto.me/`, or verify ownership if it is not yours. Submit `https://shreenathauto.me/sitemap.xml`. Use URL Inspection for the home, services and contact URLs; request indexing after your launch checks. The verification meta tag is already present, but a tag does not establish which account owns the property.
2. **Bing Webmaster Tools:** add the site, or import your verified Search Console property. Submit the same sitemap. Bing supplies discovery for its search experiences; submission is not an indexing guarantee. [Bing sitemap guidance](https://www2.bing.com/webmasters/help/sitemaps-3b5cf6ed).
3. **Google Business Profile:** claim and verify eligible real branches. Keep the actual name, phone, address, hours and website consistent with the site. Add current real photos and collect genuine customer reviews. Follow [Google’s business representation guidance](https://support.google.com/business/answer/3038177?hl=en).
4. Keep service information accurate and helpful. Add material updates when a real process or service changes; do not add invented reviews, awards, guarantees or keyword-filled location pages. Maintain sitemap URLs when adding or retiring pages. Use `lastmod` only for genuine dated updates if you add it later.

Google says its AI search features use the same SEO fundamentals and do **not** require a special AI file or special schema. See [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features). OpenAI documents the separate search crawler in [its crawler reference](https://developers.openai.com/api/docs/bots).

### InfinityFree limitation to understand

InfinityFree’s free hosting includes a mandatory browser security check requiring JavaScript and cookies. Its documentation says major search engines are supported, while some automated tools and bots are blocked. This means an AI crawler or social-preview fetcher may still receive a challenge or 403 even though this site’s robots file allows it. Its security cookies are separate from the site’s optional analytics.

This is a hosting restriction. Editing HTML, schema, robots.txt or `.htaccess` cannot disable it. If the tools above report blocked crawling, ask InfinityFree about the particular crawler. If the free plan cannot support the access you need, use hosting that permits those crawlers. No server firewall configuration or crawler access was verified here. [InfinityFree’s browser security documentation](https://forum.infinityfree.com/t/browser-security-system-features-and-limitations/49353).

### Your review before launch

- Open Change appearance (the half-circle button in the header). Try System, Light and Dark; choose a preset and a custom colour; navigate pages and reload. Change the OS appearance while System is selected. Reset returns to System and the original colours.
- Appearance is saved under `shreenath_appearance_v1`, separate from analytics consent. Blocked storage applies the choice to the current page only. A saved custom hue is adjusted for text readability; it may look lighter in dark mode.
- Open and close appearance settings with keyboard, touch and Escape. Review the narrow mobile header and the existing staggered navigation.
- Review the home Indian street scene: left-hand traffic, cars, a truck, auto-rickshaws, helmeted riders, signals, an inspector at the document-check bay and a visitor approaching another officer. Observe stop lines, queues, clearance intervals and the separate inspection sequence. Geometry is reused and batched; desktop shadows are cached and mobile animation is capped at 30 fps without dynamic shadows. These optimisations have not been profiled or tested.
- Drag the page scrollbar, click its track and use Arrow keys, Page Up/Down, Home/End and Space while it is focused. Review touch dragging, resizing, FAQ expansion and modal dialogs. High-contrast mode retains the browser scrollbar.
- Each other page retains its own object. Decorative background ellipses, glows and numbered object labels remain removed. There is no flat SVG placeholder: the first rendered 3D frame fades in. With unavailable WebGL or a blocked library, a quiet text status replaces the sculpture while page content remains available.
- Review both palettes across forms, FAQs, cookie settings and policy pages. Try reduced motion and the home Pause motion control. Check normal and slow connections yourself.
- Review the live sitemap and canonical routes in Search Console/Bing, and verify the HTTP 404 response for an unknown URL. Live indexing and AI crawler access cannot be inferred from how the site looks in your browser.

Google Analytics remains disabled until you enter your real measurement ID in `assets/js/config.js` and a visitor consents. Search Console verification does not enable analytics. See `LAUNCH-CHECKLIST.md` for the existing analytics and business-policy handoff.


---

<a id="launch-checklist-md"></a>

## Source: LAUNCH-CHECKLIST.md

## Owner launch checklist

The implementation is saved locally. Static publication checks and JavaScript syntax checks passed on 8 October 2026. Interactive browser and hosted checks remain outstanding; nothing was published. See PUBLISH-READINESS.md.

For the current icon, SEO and installable-site update, start with **INFINITYFREE-LAUNCH.md**, release `20261008-r13`. The confirmed host is InfinityFree. Installation needs HTTPS and remains subject to browser support and the host's mandatory security check.

### 1. Confirm the business information

- The legal name is **Shreenath Auto Advisers**, as confirmed by you.
- Confirm both branch addresses, hours, team roles, email and telephone numbers.
- The main contact number is consistently **+91 98258 66262**. An inconsistent number formerly on the privacy page has been aligned with the main contact page and original business details.
- The published refund policy is: **100% if no work has been processed; partial refund based on work completed otherwise; paid in cash.** No fixed deadline or deduction percentage has been added.
- Have the terms, privacy, cancellation, cookie, copyright and accessibility text reviewed against your actual practices and applicable requirements. Confirm your enquiry retention practices and hosting provider's logs/cookies; update those disclosures if needed. Add any legally required business identifiers if applicable.
- Decide whether visitors should keep using email drafts. Direct form delivery requires a real backend/service configuration and corresponding privacy updates; the old Web3Forms placeholder was not reused.

### 2. Decide whether to enable Analytics

The website can launch without Analytics. Leave `analyticsId` blank to keep it off.

If wanted:
1. Create or choose your Google Analytics 4 property and web stream for the production domain.
2. Put its actual **G-…** measurement ID into `assets/js/config.js`.
3. In the stream settings, disable automatic form interaction, site-search and outbound-click measurement before enabling the ID. Use the site's deliberately limited custom events so automatic collection does not capture unexpected URLs or form metadata.
4. Set Analytics account retention and other privacy options to match the published policy and your requirements; keep advertising/Google signals off unless you implement and disclose a separate consent purpose.
5. The consent banner then enables its analytics option. A configured ID alone does not load Google Analytics: an explicit opt-in is also required. No opt-in should be forced or preselected.

The Google Search Console verification key from your old site is already retained.

### 3. Publish the new files

- Back up the current production site before replacing it.
- Upload every new root HTML page, the `assets` directory, `manifest.json`, `robots.txt`, `sitemap.xml`, and `.htaccess` to the web root for **shreenathauto.me**.
- Do not upload the old `shreenath-auto V9` reference folder, the `tools` source folder, development notes, or this checklist. Include `assets/images/responsive`, which now provides the displayed photographs and logo.
- Keep HTTPS enabled. The included `.htaccess` uses Apache; if your hosting is not Apache, configure the equivalent clean routes and 404 handling there.
- Routes: `/`, `/about`, `/services`, `/contact`, `/privacy`, `/terms`, `/cancellations`, `/cookies`, `/copyright`, `/accessibility`.
- If the domain changes, update canonical URLs, social metadata, structured data, sitemap, robots, configuration and redirect rules together.
- Upload the new root `sw.js`, `offline.html`, `manifest.json` and all assets. The current worker replaces the old worker and removes its known caches; do not upload the previous retirement worker. Upload `release.json` last. Use the live HTTPS domain to check native installation, manual Apple shortcuts, clean links, offline contact fallback and reconnection.
- External fonts and animation libraries require network access. They have fallbacks, but self-hosting those dependencies is an optional later improvement if your hosting or network needs it.

### 4. Perform your pre-launch checks

These are your next steps; they have **not** been executed by Codex.

- Review each page at narrow phones (320/375px), larger phones, tablets and desktop widths; also check landscape and browser zoom.
- On both a cold and warm browser cache, scroll through team portraits and branch photographs. Responsive image sizes, early decode preparation and simpler painting are implemented, but scroll performance has not been profiled or measured.
- Open and close FAQs repeatedly, use the mobile menu with touch/keyboard, and try browser reduced-motion settings.
- Review the Every turn / Considered section's existing staggered entrance and focus/hover interactions, each page's distinct 3D motif, and the text-only unavailable state when WebGL cannot load. Flat SVG placeholders are no longer displayed.
- Check the mobile hero sequence (heading, object, explanation, action) and the menu links fading in one by one and closing in reverse order. Reduced-motion settings should make those transitions immediate.
- Confirm all phone, email, branch-map, service enquiry and policy links.
- Prepare an enquiry, open its email draft, copy it, and change fields afterward. Check that nothing says the message was sent automatically.
- Exercise cookie rejection, acceptance, granular preferences, withdrawal, reload, expiry, another tab, blocked storage, and browser privacy signals. Confirm that analytics requests do not occur before consent or after opting out. Confirm optional first-party analytics cookies are removed on withdrawal.
- Check the privacy dialog using Tab, Shift+Tab, Escape and a screen reader; check visible focus, page zoom, text contrast and keyboard FAQ operation.
- Review the homepage 3D scene with and without WebGL/network access, and use its Pause motion button.
- Try Light, Dark and System in the header appearance dialog, change the device theme, choose a preset or custom accent, navigate pages and reset. Review saved preferences, keyboard focus, narrow screens and contrast in both modes.
- Confirm HTTPS redirects, old `.html` links, clean URLs and the actual HTTP 404 status for missing pages on your host.
- Check console errors, performance and basic accessibility in your browser's tools before advertising the site or submitting it for awards.

### 5. Finish the public launch

- Submit **https://shreenathauto.me/sitemap.xml** in Google Search Console and inspect the main URLs.
- Submit the same sitemap in Bing Webmaster Tools. Confirm crawler access on the actual InfinityFree account; its mandatory browser security layer may restrict some automated/AI visitors despite permissive robots.txt rules.
- Check the site's search titles and link-sharing preview once the new files are public.
- Keep a backup and a contact route for reporting problems.
- Consider Awwwards submission only after your visual, performance, accessibility and content review. No award nomination or submission has been made.


---

<a id="publish-readiness-md"></a>

## Source: PUBLISH-READINESS.md

## Publication readiness — 8 October 2026

Release: **20261008-r13**. Ready to upload for final hosted verification; not certified as fully launch-tested. Nothing has been deployed.

### Cleanup and rounded icons

Browser favicons and regular app icons use rounded transparent corners. Apple and Android maskable versions retain opaque backgrounds for system masking. The header logo is unchanged. Icon masters and the preview are in `tools/icon-source/`; production icons are in `assets/images/app-icon/`.

53 unused files were removed after creating and checking a ZIP recovery archive at `C:\Users\HP\.codex\visualizations\2026\10\04\01a105b1-57e5-7df0-9815-9956d4c3554c\cleanup-archive\shreenath-unused-20261008-214157.zip`. This includes the obsolete website folder, old favicon sets, unused SVG illustrations, the abandoned homepage stylesheet, duplicate WebP photos and unused 160px exports. The local checks below passed again after cleanup. Hosted/browser limitations remain unchanged.

### Completed checks

- 1,344 local checks across 12 HTML pages passed with no reported errors: local resources, cross-page fragment links, unique IDs, main headings, metadata, canonical URLs, structured JSON, manifest resources, icon dimensions and circular-mask safe areas, sitemap targets, release markers, and offline-worker references.
- All 23 current JavaScript files, including the service worker, passed `node --check`. This is a syntax check, not proof of runtime behaviour.
- The generated icon was visually inspected as a master and at 16, 32, 48, 96, 180 and 192 pixels. Website header/footer brand artwork remains original. Production icon exports are in `assets/images/app-icon/`; source prompt and provenance are in `tools/ICON-GENERATION.md`.
- GA4 configuration remains `G-XS41JPJ318`. Source retains affirmative analytics consent. No test enquiry, email, analytics opt-in or external submission was made.

The browser tool rejected the `file://` preview under its URL policy. No alternate browser route was used to bypass that restriction. Visual page checks, desktop/mobile interactions, real-device installation, offline runtime behaviour and actual Apache responses remain unverified. The checks above cannot detect every runtime or hosting issue.

### Publish and finish checking

1. Back up the currently hosted site. Upload this project's root HTML pages, `.htaccess`, `manifest.json`, `sw.js`, `robots.txt`, `sitemap.xml` and the complete `assets` folder into the domain's assigned `htdocs`. Keep tools, old website folders and owner Markdown notes local. Upload `release.json` last.
2. On HTTPS, confirm `/services`, `/about` and `/contact` open directly; `.html` versions redirect; and an unknown URL returns the custom page with HTTP 404. Check the desktop/mobile menu, theme/language dialogs, 3D scenes, enquiry preparation and analytics rejection. The enquiry form prepares an email draft; it does not send automatically.
3. Use the footer installation guide on your actual Android/Windows and Apple devices. Confirm the new icon, then check the installed app online, offline and after reconnecting. Previously added shortcuts may need to be removed and added again if the operating system retains an old icon.
4. In Google Search Console, inspect the home page and submit `https://shreenathauto.me/sitemap.xml`. Check whether Google can retrieve the HTML and icon. The verification key is retained, but ownership/indexing was not checked through your account.

InfinityFree warns that its mandatory browser-security challenge can interfere with PWAs. It can also affect non-browser retrieval. If those checks are blocked by the host, contact InfinityFree; site files cannot guarantee installation or crawler access through its security layer.

### Search topics

The public pages include focused meta-keyword lists at the owner's request. Google does not use this tag for ranking. Relevant titles, descriptions and structured page summaries have also been maintained or updated. There is no hidden keyword block or repeated list in the visible design. Keep service/location terms accurate; do not add services or locations the business does not serve. The 404 and offline pages intentionally remain noindex and have no marketing keyword list.

| Page | Relevant topics |
| --- | --- |
| / | Shreenath Auto Advisers, RTO consultant Jamkandorana, RTO services Dhoraji, vehicle registration, RC transfer, driving licence assistance, vehicle NOC, Gujarat RTO consultancy |
| /services | RTO services Gujarat, vehicle registration, ownership transfer, driving licence renewal, duplicate RC, vehicle fitness certificate, NOC, hypothecation removal, RC address change, vehicle insurance, commercial permits, fancy number registration |
| /about | Shreenath Auto Advisers story, Anupam Auto Advisers, Chetan Patel, Jasmin Patel, Divyesh Patel, RTO advisers Jamkandorana, Dhoraji |
| /contact | Shreenath Auto Advisers contact, Jamkandorana office, Dhoraji office, RTO adviser phone number, RTO consultancy enquiry |
| /privacy | Shreenath Auto Advisers privacy policy, enquiry data, browser preferences, analytics consent, offline storage |
| /terms | Shreenath Auto Advisers terms, website terms, RTO consultancy conditions, independent RTO adviser |
| /cancellations | Shreenath Auto Advisers refunds, cancellation policy, cash refund, partial refund, RTO consultancy cancellation |
| /cookies | Shreenath Auto Advisers cookie policy, analytics consent, cookie preferences, browser storage, offline app storage |
| /copyright | Shreenath Auto Advisers copyright, original website content, brand assets, third-party licences |
| /accessibility | Shreenath Auto Advisers accessibility, keyboard navigation, reduced motion, accessible contact, website assistance |

Search visibility and a number-one ranking cannot be guaranteed. Installation prompts and icon refresh timing are controlled partly by browsers and operating systems.

References: [Google on meta keywords](https://developers.google.com/search/docs/crawling-indexing/special-tags), [Google favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search), [InfinityFree PWA limitation](https://forum.infinityfree.com/t/how-do-i-get-pwa-to-work/69018/3).


---

<a id="readme-md"></a>

## Source: README.md

## Shreenath — A clear road ahead

A static HTML/CSS/JavaScript site for Shreenath Auto Advisers. No build step or package install is required. The unused previous website and obsolete assets have been archived outside this project. Current original photos, the logo, maintenance tools and launch notes are retained.

### Pages
- Home: `index.html`
- Services: `services.html` (all twelve original services)
- Our story: `about.html`
- Contact: `contact.html`
- Privacy: `privacy.html`
- Terms: `terms.html`
- Cancellations and refunds: `cancellations.html`
- Cookies: `cookies.html`
- Copyright: `copyright.html`
- Accessibility information: `accessibility.html`
- Error page: `404.html`
- Offline contact fallback: `offline.html`

Public navigation uses `/`, `/services`, `/about`, `/contact` and extensionless policy routes. Apache maps these to the HTML files and redirects old `.html` addresses. Deploy into the domain root on HTTPS. Main-page file previews use `assets/js/urls.js` to restore local HTML links; installation is available only on a served secure origin.

### Implementation
- `assets/css/site.css`: original core layout and light palette.
- `assets/css/appearance.css`: dark palette, colour controls and 3D loading presentation.
- `assets/css/hero-immersive.css`: homepage-only full-width street scene, theme-aware gradient blending, readable copy layer and mobile framing. The canvas has a 2.4-million-pixel rendering budget.
- `assets/js/appearance-init.js`: first-paint light/dark/system preference and contrast-adjusted custom accent; loaded before styles.
- `assets/js/appearance.js`: animated appearance dialog, presets, colour picker, reset and saved preferences.
- `assets/css/refinements.css`: disclosure motion, service animations, touch layouts, policy pages, cookie controls.
- `assets/css/art-direction.css`: editorial hero compositions, phone-specific hero order, object stages, and sequential mobile-menu fades.
- `assets/css/performance.css`: paint containment, reserved media dimensions, and removal of live photo filtering, photo zoom and scrolling-header blur.
- `assets/js/images.js`: early near-viewport photo preparation and sequential decode requests.
- `assets/images/responsive`: sized WebP photographs, JPEG fallbacks, and a display-size logo. Original assets remain untouched.
- `tools/prepare_images.py`: rebuilds delivery images with Pillow; an asset-generation utility, not a test.
- `assets/js/main.js`: navigation, progressive reveals, optional Lenis desktop scrolling, and email enquiry preparation.
- `assets/js/interactions.js`: reversible FAQ animations and service-row entrance timing.
- `assets/js/objects.js`: page-specific Three.js objects, loaded near the viewport, with no continuous idle rendering.
- `assets/js/scene.js`: animated Indian street cutaway with left-hand traffic, cars, a goods truck, auto-rickshaws, helmeted riders, phased signals and a separate document-check bay with officers and a visitor. Reused geometry and merged static details reduce drawing work; shadows are cached on desktop and disabled on mobile. Mobile animation is capped at 30 fps. Includes theme colours, pause/resume, offscreen suspension and reduced motion. No image replacement appears before the first 3D frame.
- `assets/css/scrollbar.css` and `assets/js/scrollbar.js`: minimal draggable page scrollbar with keyboard controls, Lenis synchronisation and native fallback for forced-colour mode or unavailable JavaScript. Nested scrollable content retains slim browser controls.
- `assets/js/consent.js`: first-visit notice, native preferences dialog, accept/reject choices, 180-day preference expiry, cross-tab updates, storage-failure handling, and accessible cookie removal on withdrawal.
- `assets/js/analytics.js`: Google Analytics loaded only after affirmative analytics consent and only with a real configured ID.
- `assets/js/config.js`: owner configuration.
- `manifest.json`, `sitemap.xml`, `robots.txt`, `.htaccess`: deployment metadata and Apache routes.

The founder, team and office photos, logo, and favicons come from the supplied originals; photographs and the logo are served as smaller delivery variants. Each page has a distinct 3D motif: Home has a miniature Indian street and retains its CSS document sculpture in the services section; Services has keys; Our Story has paired arches; Contact has conversation forms; Privacy has a lock; Terms has an agreement and pen; Cancellations has a return arrow and coin; Cookies has switches; Copyright has a seal; Accessibility has steps and a halo; 404 has a wayfinding sign. The street is a decorative fictional illustration, not a representation of a particular branch or official affiliation. Unused SVG loading placeholders were removed during cleanup. A quiet text status is used if WebGL cannot load. No generated photos or video files are needed. There is no custom cursor. Light, dark and system modes, plus English and Gujarati language choices, are implemented.

External fonts come from Google Fonts. Three.js 0.180.0 and Lenis 1.3.26 load from jsDelivr. Ordinary navigation, native FAQ disclosures and system-font fallback remain available without these enhancements. Three.js is preloaded; the canvas becomes visible after its first complete rendered frame. `assets/js/pwa.js` registers the root service worker on supported secure origins and provides an English/Gujarati installation guide. The worker keeps only a small offline contact fallback and its assets; normal pages use the network. The manifest supplies standalone mode, existing icons and app shortcuts. Browser support and InfinityFree's security challenge can limit installation.

Appearance defaults to the device setting. Visitors can override it and choose a preset or custom accent using the header’s half-circle button. `shreenath_appearance_v1` stores this functional preference independently of analytics consent. Existing tabs follow updates; unavailable storage uses the current page only. Reset removes the saved preference. The original light palette is retained when no custom accent is chosen.

### English and Gujarati

Every root page shares a first-visit language chooser and a language control beside appearance on desktop and inside Menu on mobile. Choosing a language stores `en` or `gu` under `shreenath_language_v1` in local storage, independently of analytics. Session storage is the fallback; if both are blocked, the choice only lasts on the current page. Escape dismisses the first prompt without saving; “Continue in English” saves English. A saved choice prevents the automatic prompt on later visits.

- `assets/js/language-init.js` restores the choice before the page is enhanced.
- `assets/js/translations-gu.js` contains the Gujarati copy, keyed by the original English text. When editing English text, update the matching dictionary entry; unknown copy stays in English.
- `assets/js/language.js` switches existing text nodes and accessible labels, preserving markup, entered form data, theme preferences and the live 3D scene.
- `assets/css/language.css` adds Hind Vadodara, script-appropriate spacing, mobile header sizing, and the chooser. Fonts use the existing Google Fonts provider.

Navigation, service content, FAQs, policies, controls, image descriptions, contact email drafts and road signs follow the language choice. Prepared email drafts are cleared when language changes so visitors can prepare them again in the selected language. Reduced-motion preferences disable the language fades. English HTML remains the no-JavaScript fallback and the canonical indexed content; this update does not create separate Gujarati URLs or hreflang routes. No translation API receives visitor content.

### Enquiries
The original Web3Forms access key was a placeholder. The current form prepares an email draft for the visitor to review and send, with a copy alternative. It does not claim to submit the enquiry directly. Names, phone numbers, email addresses, and messages are not sent in our custom analytics events. Prepared message contents are not placed in link attributes.

### Owner-confirmed policy
Legal name: **Shreenath Auto Advisers**.
- No work processed: **100% refund**.
- Some work completed: **partial refund based on the work completed**.
- Refund method: **cash**.

No unconfirmed percentage, refund deadline, business registration number, or statutory certification is invented.

### Analytics and cookies
No real Google Analytics ID was present in the project. `analyticsId` remains blank, so no Google tag loads. After configuration, visitors must explicitly opt in. Advertising consent remains denied. Global Privacy Control and Do Not Track override an analytics opt-in. Cookie settings are available in every footer; the preference is stored under `shreenath_consent_v1` in local storage and is valid for 180 days. Changing the ID prompts a fresh choice.

Withdrawal sets Google's disable flag and denied consent, blocks this site's measurement calls, and clears accessible first-party GA cookies. Previously transmitted data is not erased by this action. Hosting security cookies, server logs, Google Fonts, and CDN requests are separate from optional analytics.

### Launch handoff

The current release includes coordinated mobile fades, desktop content transitions with a stable header, theme-coloured text links, `release.json` and `assets/js/site-updates.js` for guarded update checks. Root `sw.js` replaces older workers and caches only the offline contact fallback and its assets. Read the 8 October publishing instructions in `INFINITYFREE-LAUNCH.md`. `tools/prepare_release.py` can prepare future release markers, asset versions and the worker's offline cache version; it was not executed. `WEBSITE-BUILD-PROMPT.md` is a reusable, parameterised brief for another business or project.
Read `INFINITYFREE-LAUNCH.md` for this update’s upload instructions, appearance handoff, search-account setup and InfinityFree crawler limitations. `LAUNCH-CHECKLIST.md` covers the existing analytics, policy and owner verification steps. Canonical URLs and the sitemap target https://shreenathauto.me. Apache rules preserve clean URLs. Page, website, breadcrumb and branch structured data support discovery; rankings and AI citations are not guaranteed.

**No browser, automated, visual, mobile-device, performance, or accessibility tests were run, as explicitly requested.** Responsive and motion code is implemented, but rendering and runtime behaviour remain unverified. The website has not been deployed or submitted to Awwwards.

### Reference documentation
- [Three.js renderer](https://threejs.org/docs/pages/WebGLRenderer.html)
- [Lenis](https://github.com/darkroomengineering/lenis)
- [Google basic consent implementation](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic)
- [India's official data-protection rules resource](https://www.meity.gov.in/content/digital-personal-data-protection-rules-2025)

The policy pages describe the implemented website and owner-confirmed business policy; they do not constitute an independent legal compliance assessment.

### Header and security refinement

The shared header uses centred pill navigation on desktop and the existing sequential mobile fade. The same appearance and language controls move into the mobile dropdown, retaining their settings and dialog behaviour. Gujarati uses Hind Vadodara for a softer sans-serif style. Shared action labels are centred with rounded buttons.

The home scene includes a glazed Shreenath office and its bilingual sign. The inspection officer raises an open hand before the car stops, holds it during inspection, lowers it, and then releases the car. Existing pause, reduced motion and offscreen suspension continue to apply.

See `SECURITY.md` for the resource policy, private-file and method restrictions, copying deterrents and hosting responsibilities. No tests were run for this update.



---

<a id="security-md"></a>

## Source: SECURITY.md

## Static-site security handoff

These changes are implemented locally and have not been browser-tested, penetration-tested or deployed, at the owner's request. They reduce specific risks; they do not make a website impossible to hack or copy.

### Implemented controls

- Each root HTML page declares a Content Security Policy immediately after its character encoding. Executable scripts are limited to this origin, the currently pinned Three.js and Lenis CDN paths, and Google's configured Analytics loader. Inline handlers and eval are not allowed. Existing inline styling remains allowed because theme colours and 3D layout depend on it.
- The policy blocks embedded frames, plugin objects, base-URL changes and form submissions. Workers are restricted to this origin so the installable site's root service worker can provide an offline contact fallback. That worker does not cache forms, full site documents or analytics. The contact form only prepares a local mailto draft; it does not submit to a server.
- `.htaccess` allows GET, HEAD and OPTIONS for this static deployment. Other methods are rejected. If a real server-side form or API is added later, give it an explicit, validated exception rather than removing this control globally.
- Rewrite rules deny hidden project metadata (except `.well-known`), the old project folder, tools, owner notes and common backup/configuration/database files. Asset directory requests are denied; individual public asset files remain accessible.
- Existing nosniff, referrer, framing and permissions headers are retained. A `frame-ancestors 'self'` response policy and cross-domain policy restriction are added where the host supports `mod_headers`. A meta policy cannot provide frame-ancestor protection; this part depends on actual response headers.
- Right-click, drag-saving images and selecting general page text are deterred in the UI. Form fields, contact links, addresses, policy copy and explicit `data-allow-copy` areas remain usable. Browser shortcuts, zoom and assistive APIs are not blocked. These deterrents are not security boundaries; delivered HTML, CSS, JavaScript, images and fonts remain accessible to a determined visitor.

### Your hosting responsibilities

Upload all updated root HTML pages, `.htaccess` and the updated assets together. Keep HTTPS enabled, protect the hosting account and associated email with unique passwords and available multifactor authentication, remove old public backups, and keep a separate recoverable backup. Never put private API keys, account passwords or identity documents in public files. Infrastructure patching, network attacks and hosting-account access are controlled by the provider and account owner; front-end code cannot secure those on its own.

The allowlist preserves the existing Google Fonts and optional consent-gated Analytics integrations. Adding a new external library or endpoint requires a deliberate policy update. Security headers are conditional on host support; the per-page meta CSP is included so the main resource restrictions do not rely on `mod_headers` alone. Confirm the deployed behaviour during your own launch checks.

References: [MDN CSP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [frame-ancestors limitations](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors), [Google's Hind Vadodara font sources and licence](https://github.com/google/fonts/tree/main/ofl/hindvadodara).


---

<a id="tools-icon-generation-md"></a>

## Source: tools/ICON-GENERATION.md

Generated with the built-in ImageGen tool, using the original car-and-hands mark as its reference. The website header logo is unchanged. Editable masters and the size preview live in `tools/icon-source/`; production exports live in `assets/images/app-icon/`. Browser favicons and regular app icons now have rounded corners with transparency. Apple and maskable exports retain an opaque background for operating-system masks.

Final generation prompt:

Rounded-corner edit (built-in ImageGen, 8 October 2026): Precise icon edit. Use the supplied image as the exact edit target. Preserve the existing dark car-and-hands emblem, its position, proportions, colours, and the ivory background inside the icon. Change ONLY the OUTER FOUR CORNERS: turn the full square ivory tile into a softly rounded Apple-style squircle / continuous rounded-square tile, corner radius approximately 22 percent of width. Tile should still extend to the edges at the middle of each side: no extra padding and no smaller floating tile. The pixels OUTSIDE those rounded corners must be genuinely transparent. Do not redraw, shrink, reinterpret, restyle or add anything to the central logo. No border, no shadow, no 3D, no text. Square PNG with real alpha transparency.

Original master prompt:

Use case: logo-brand. Asset type: production favicon and installed website app icon for Shreenath Auto Advisers, an independent Indian RTO consultancy. Reference image: the supplied existing brand mark showing the FRONT of a car held protectively by two hands. Redesign ONLY the small-size icon version, retain that recognizable car-in-two-hands idea and symmetry. Produce one flat, optically clean square icon, no presentation mockup. Full-bleed solid warm ivory background #f5f3ed and a very dark forest charcoal #252820 emblem. A confident simplified car silhouette with a clearly open large windscreen, two bold headlights, and two broad cupped hand silhouettes beneath/beside it. Very thick uniform forms and large negative spaces, no fine finger lines, no grille details, no wrist buttons, no thin outlines, no letters or words. Essential emblem centered within approximately the middle 72% of the canvas so it stays inside a circular OS mask, but use that area boldly with minimal wasted internal whitespace. Crisp professionally drawn vector-like contours, balanced symmetry and contemporary premium restraint. 1024 x 1024 or larger square. Opaque background all the way to the edges, no rounded outer square (the OS handles the mask), no gradients, no shadow, no border, no texture, no 3D, no watermark. Must remain distinct at favicon sizes.


---


