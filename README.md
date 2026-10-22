# Shreenath Auto Advisers — V10

The English/Gujarati website for Shreenath Auto Advisers, an independent RTO consultancy serving Jamkandorana and Dhoraji, Gujarat.

- Production domain: [shreenathauto.live](https://shreenathauto.live)
- Release: `20261011-r30`
- Stack: static HTML, CSS and JavaScript with Three.js enhancements.
- Production hosting: Apache / InfinityFree, deployed at the domain root.
- Git : [https://frenil0393.github.io/shreenathauto/](https://frenil0393.github.io/shreenathauto/)

## Current features

- Responsive layouts, coordinated page transitions, light/dark/system appearance and selectable accent colours.
- English and Gujarati interfaces, a first-visit language choice, and Hind Vadodara font loading with retry handling.
- Live 3D scenes with lightweight local SVG fallback artwork for unavailable graphics support. The fallbacks work without Three.js.
- Service-specific WhatsApp enquiries with service and branch selection. The dedicated WhatsApp destination is used in the outgoing link, not displayed as a contact number.
- English/Gujarati document checklists with conditional requirements, selectable service variants and downloadable text files. Confirm requirements for each customer's case.
- Web3Forms enquiries with sending, success and error feedback.
- Consent-based Google Analytics. Optional analytics must remain off until consent is given.
- Clean URLs, canonical URLs, social metadata, structured data, sitemap and robots instructions.
- Rounded application icons, a web app manifest, installation guidance and an offline contact page.
- Policy pages and accessible controls with reduced-motion support.

SVG fallbacks use the same subjects and palette as the live scenes. Their signs sit on aligned panels; the contact scene uses seated adviser and visitor poses. Native popup scrollbar rails are hidden while touch, wheel and keyboard scrolling remain available.

## Files and maintenance

| Path                          | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `index.html`                  | Homepage                                                                |
| `services.html`               | Services, enquiries and document checklists                             |
| `about.html`, `contact.html`  | Team, branches and contact form                                         |
| Policy HTML files             | Privacy, terms, cancellations, cookies, copyright and accessibility     |
| `404.html`, `offline.html`    | Missing-page and offline experiences                                    |
| `assets/css/`                 | Shared and feature styles                                               |
| `assets/js/`                  | Scene code, forms, consent, navigation, language and other enhancements |
| `assets/images/editorial/`    | Current responsive team and office images                               |
| `assets/images/scene-stills/` | Eleven self-contained SVG scene fallbacks                               |
| `assets/images/logo.svg`      | Website vector logo                                                     |
| `assets/images/app-icon/`     | Browser, Apple and installed-app icons                                  |
| `assets/images/future-team/`  | Requested portrait exports saved for future use; not linked to the site |
| `.htaccess`                   | Apache routes, headers and cache directives                             |
| `manifest.json`, `sw.js`      | Installation metadata and offline support                               |
| `release.json`                | Release identifier used by the update mechanism                         |
| `sitemap.xml`, `robots.txt`   | Search crawler metadata                                                 |
| `PROJECT-GUIDE.md`            | Detailed change history and earlier design/maintenance notes            |

Edit checklist data in `assets/js/service-checklists.js`; its interface is in `service-tools.js` and `service-tools.css`. Update Gujarati copy in `translations-gu.js` alongside English page copy. Keep actual enquiry destinations, branch details and consent settings consistent when changing configuration.

The source uses two-space indentation, LF line endings and readable HTML/CSS/JavaScript/SVG formatting. JavaScript formatting avoids trailing commas for the legacy-compatible scripts. No build step or dependency installation is needed to publish.

## Publish to InfinityFree / Apache

1. Upload all root `.html` files, `.htaccess`, `manifest.json`, `sw.js`, `release.json`, `robots.txt`, `sitemap.xml`, and the runtime `assets/` files into the domain's `htdocs` directory.
2. Exclude `.git/`, `.github/`, `.gitignore`, `.nojekyll`, documentation and `assets/images/future-team/` from the production upload. Keep these locally where applicable.
3. Include hidden `.htaccess`; upload to the domain root, not an extra nested project folder. The site's clean paths, service worker and manifest assume a root deployment.
4. Enable HTTPS and confirm the domain points to the intended hosting account.
5. Keep the configured Web3Forms domain/access-key settings and Google Analytics configuration intact. Form submission is handled by the external Web3Forms endpoint.
6. For future releases, update `release.json` and every page's `site-release` meta tag to the same version. Change query versions on modified cached assets so returning visitors receive the new files. If changing offline resources, also update their service-worker cache version.

The repository's GitHub Actions workflow is retained. GitHub Pages does not apply Apache `.htaccess` rules; a project-path Pages deployment needs separate path/routing work before it can behave like the root-domain InfinityFree deployment.

## Review on the hosted website

No website/browser tests were run for this revision, as requested. Before publishing publicly, you should confirm:

- Clean URLs and missing-page handling after direct navigation and refresh.
- Mobile and desktop navigation, popup scrolling, theme and language changes.
- Live scenes on supported devices and SVG artwork where WebGL is unavailable.
- Web3Forms sending/success/error states, a received enquiry, and WhatsApp service/branch messages.
- English and Gujarati checklist downloads.
- Analytics stays inactive before consent; preferences can be changed later.
- Icons and installation on your target devices. Browser and operating-system installation prompts vary.
- Offline contact behaviour after an initial online visit.

A local `file://` preview cannot demonstrate HTTPS installation, service-worker behaviour or Apache clean routes. Search placement and indexing are not guaranteed by the site's SEO setup.

## Cleanup

The unused older `assets/images/responsive/` photo set, unused PNG logo and empty `assets/video/` folder were removed from this project. A recovery copy of removed assets was retained outside the project. Existing social-preview office JPEGs remain because page metadata still references them. The future-use portrait exports and repository/deployment files were preserved intentionally.

## Ownership

Copyright © 2026 Shreenath Auto Advisers. All rights reserved.
