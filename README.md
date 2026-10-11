# Shreenath Auto Advisers (V10)

Official website for **Shreenath Auto Advisers** — an independent RTO consultancy based in Gujarat, India (Jamkandorana & Dhoraji).

- **Live URL (Primary)**: [https://shreenathauto.me](https://shreenathauto.me)
- **Secondary Domain**: [http://shreenathauto.gt.tc](http://shreenathauto.gt.tc)
- **GitHub Pages**: [https://frenil0393.github.io/shreenathauto/](https://frenil0393.github.io/shreenathauto/)
- **Release**: `20261011-r26`

---

## Overview

Version 10 represents a modern, accessible web platform for Shreenath Auto Advisers. Built with progressive enhancement, high-end editorial aesthetics, bilingual typography (English and Gujarati), and strict privacy/compliance principles.

### Key Features

- **Modern Responsive Design**: Editorial typography, fluid layouts, and refined micro-interactions.
- **Multilingual Support (EN & GU)**: Dual English & Gujarati (`gu`) interface with instant runtime localization. Uses `Hind Vadodara` with `display=swap`, failed-load retry handling, and offline-reconnect awareness.
- **Form Submission via Web3Forms**: Standalone ES5 controller (`enquiry.js`) with dynamic multi-domain access key routing (`shreenathauto.gt.tc` and `shreenathauto.me`), asynchronous AJAX submission, field locking, and live bilingual status feedback.
- **Theme & Appearance Engine**: System preference matching, manual Light/Dark modes, and customizable accent colors.
- **Interactive 3D / WebGL Visuals**: Continuous 3D route animation powered by Three.js with graceful static SVG vector fallbacks (`scene-stills`).
- **Progressive Web App (PWA)**: Offline resilience (`offline.html`), installable shortcut actions, and Service Worker caching (`sw.js`).
- **Comprehensive Legal & Compliance**: Fully articulated policies for Privacy, Terms & Conditions, Cancellations & Refunds, Cookies, Copyright, and Accessibility.
- **Privacy-First Consent Management**: Granular cookie preferences honoring Global Privacy Control (GPC) and Do Not Track (DNT) browser signals.
- **SEO & Structured Data**: Clean URLs via Apache `mod_rewrite`, Open Graph / Twitter cards, XML sitemaps, and Schema.org `LocalBusiness` / `Service` JSON-LD schemas.
- **Automated GitHub Pages Deployment**: Continuous deployment workflow via GitHub Actions (`.github/workflows/deploy.yml`) with `.nojekyll` configuration.

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions continuous deployment to GitHub Pages
├── .htaccess                 # Production clean URLs, security headers & compression
├── .nojekyll                 # Bypasses Jekyll processing on GitHub Pages
├── 404.html                  # Custom branded 404 error page
├── about.html                # Company story, team & background
├── accessibility.html        # Accessibility statement & conformance details
├── cancellations.html        # Cancellation & refund policy
├── contact.html              # Contact details, branch information & enquiry form
├── cookies.html              # Cookie policy & preferences
├── copyright.html            # Intellectual property & copyright notices
├── index.html                # Homepage with hero & core service catalog
├── manifest.json             # Web App Manifest for PWA installation
├── offline.html              # Lightweight offline fallback screen
├── privacy.html              # Privacy policy & information handling details
├── release.json              # Deployment release tracking metadata
├── robots.txt                # Search crawler directives
├── services.html             # Complete listing of RTO consultancy services
├── sitemap.xml               # Canonical XML sitemap
├── sw.js                     # Service worker for offline reliability
├── terms.html                # Terms of service
└── assets/
    ├── css/                  # Modular stylesheets (site, appearance, enquiry, etc.)
    ├── js/                   # Client scripts, enquiry controller, scene rendering & translations
    └── images/               # Optimized WebP responsive photos, editorial portraits, icons & SVG assets
```

---

## Deployment Instructions

### Option 1: GitHub Pages (Automatic)
The repository is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. In repository settings on GitHub, navigate to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions** (or **Deploy from a branch** selecting `main` / `root`).
3. Every push to `main` automatically builds and deploys the latest version.

### Option 2: Apache / InfinityFree Hosting
1. Upload the root HTML files, `.htaccess`, `manifest.json`, `robots.txt`, `sitemap.xml`, `sw.js`, and the `assets/` directory to your web server document root (`htdocs` / `public_html`).
2. Ensure HTTPS is enabled.
3. For Apache servers, ensure `mod_rewrite`, `mod_headers`, and `mod_deflate` are enabled to serve clean URLs without `.html` extensions.

---

## License & Ownership

Copyright © 2026 Shreenath Auto Advisers. All rights reserved.  
Independent RTO consultancy operating in Jamkandorana and Dhoraji, Rajkot, Gujarat, India.
