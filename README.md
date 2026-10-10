# Shreenath Auto Advisers (V10)

Official website for **Shreenath Auto Advisers** — an independent RTO consultancy based in Gujarat, India (Jamkandorana & Dhoraji).

Live URL: [https://shreenathauto.me](https://shreenathauto.me)
Git URL: [https://frenil0393.github.io/shreenathauto/](https://frenil0393.github.io/shreenathauto/)

---

## Overview

Version 10 represents a complete, modern rewrite and technical evolution of the Shreenath Auto Advisers web platform. Built with progressive enhancement, high-end editorial aesthetics, and strict privacy/compliance principles.

### Key Features
- **Modern Responsive Design**: Editorial typography, fluid layouts, and refined micro-interactions.
- **Multilingual Support**: Dual English & Gujarati (`gu`) interfaces with instant runtime localization.
- **Theme & Appearance Engine**: System preference matching, manual Light/Dark modes, and customizable accent colors.
- **Interactive 3D / WebGL Visuals**: Continuous 3D route animation powered by Three.js with graceful static SVG vector fallbacks.
- **Progressive Web App (PWA)**: Offline resilience (`offline.html`), installable shortcut actions, and Service Worker caching (`sw.js`).
- **Comprehensive Legal & Compliance**: Fully articulated policies for Privacy, Terms & Conditions, Cancellations & Refunds, Cookies, Copyright, and Accessibility.
- **Privacy-First Consent Management**: Granular cookie preferences honoring Global Privacy Control (GPC) and Do Not Track (DNT) browser signals.
- **SEO & Structured Data**: Clean URLs via Apache `mod_rewrite`, Open Graph / Twitter cards, XML sitemaps, and Schema.org `LocalBusiness` / `Service` JSON-LD schemas.

---

## Project Structure

```
├── .htaccess             # Production clean URLs, security headers & compression
├── 404.html              # Custom branded 404 error page
├── about.html            # Company story, team & background
├── accessibility.html    # Accessibility statement & conformance details
├── cancellations.html    # Cancellation & refund policy
├── contact.html          # Contact details, branch information & inquiry draft tool
├── cookies.html          # Cookie policy & preferences
├── copyright.html        # Intellectual property & copyright notices
├── index.html            # Homepage with hero & core service catalog
├── manifest.json         # Web App Manifest for PWA installation
├── offline.html          # Lightweight offline fallback screen
├── privacy.html          # Privacy policy & information handling details
├── release.json          # Deployment release tracking metadata
├── robots.txt            # Search crawler directives
├── services.html         # Complete listing of RTO consultancy services
├── sitemap.xml           # Canonical XML sitemap
├── sw.js                 # Service worker for offline reliability
├── terms.html            # Terms of service
└── assets/
    ├── css/              # Modular stylesheets (site, appearance, language, etc.)
    ├── js/               # Client scripts, scene rendering & translations
    └── images/           # Optimized WebP responsive photos, icons & SVG assets
```

---

## Deployment Instructions

1. Upload the root HTML files, `.htaccess`, `manifest.json`, `robots.txt`, `sitemap.xml`, `sw.js`, and the `assets/` directory to your web server document root (`htdocs` / `public_html`).
2. Ensure HTTPS is enabled.
3. For Apache servers, ensure `mod_rewrite`, `mod_headers`, and `mod_deflate` are enabled to serve clean URLs without `.html` extensions.

---

## License & Ownership

Copyright © 2026 Shreenath Auto Advisers. All rights reserved.
Independent RTO consultancy operating in Jamkandorana and Dhoraji, Rajkot, Gujarat, India.
