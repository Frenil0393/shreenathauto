# Shreenath Auto Advisers (શ્રીનાથ ઓટો એડવાઈઝર્સ)

[![Release](https://img.shields.io/badge/Release-20261027--r33-blue?style=flat-square)](https://shreenathauto.live/release.json)
[![Hosting](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Pages-f38020?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com/)
[![Languages](https://img.shields.io/badge/Languages-English%20%7C%20%E0%AA%97%E0%AB%81%E0%AA%9C%E0%AA%B0%E0%AA%BE%E0%AA%A4%E0%AB%80-success?style=flat-square)](#-bilingual-support)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square)](manifest.json)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](#-copyright--ownership)

The official bilingual production web platform for **Shreenath Auto Advisers** (શ્રીનાથ ઓટો એડવાઈઝર્સ), premier independent RTO (Regional Transport Office) consultants serving **Jamkandorana**, **Dhoraji**, and surrounding Saurashtra regions in Gujarat, India.

- **Production Domain**: [https://shreenathauto.live](https://shreenathauto.live)
- **GitHub Pages Preview**: [https://frenil0393.github.io/shreenathauto/](https://frenil0393.github.io/shreenathauto/)
- **Current Site Release**: `20261027-r33`
- **Primary Hosting Target**: Cloudflare Pages (Direct Upload / Git integration)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [RTO Services Covered](#-rto-services-covered)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Deployment Guide](#-deployment-guide)
  - [Cloudflare Pages (Recommended)](#1-cloudflare-pages-recommended)
  - [GitHub Pages](#2-github-pages)
  - [Apache / Legacy Hosting](#3-apache--legacy-hosting)
- [Local Development](#-local-development)
- [Branch Locations & Contact](#-branch-locations--contact)
- [Copyright & Ownership](#-copyright--ownership)

---

## 🌟 Overview

**Shreenath Auto Advisers** provides professional, transparent, and hassle-free vehicle registration, driving licensing, and compliance liaison services across Gujarat RTO jurisdictions (including **GJ03** Rajkot, **GJ11** Junagadh, **GJ36** Morbi, Gondal, Jetpur, Upleta, and Porbandar). 

This repository houses the complete front-end codebase: an ultra-fast, zero-dependency static web application engineered with modern web standards, native View Transitions, Three.js 3D scenes with vector fallbacks, bilingual Gujarati typography, and custom PWA capabilities.

---

## 🚀 Key Features

### 🌐 Bilingual Support (English & ગુજરાતી)
- Full-site translation across all pages, checklists, modals, and meta descriptions.
- Native typography using Google Fonts **Hind Vadodara** for authentic Gujarati rendering with graceful font fallback handling.
- First-visit language selection dialog with persistent `localStorage` preference.

### 🎨 Theme & Appearance Engine
- Light, Dark, and System appearance modes with instant boot script (`appearance-init.js`) preventing flash of unstyled content (FOUC).
- 4 selectable accent themes with dynamic CSS variable scoping.
- Accessible focus states, high contrast ratios, and `prefers-reduced-motion` compliance.

### ⚡ View Transitions & Smooth Navigation
- Native CSS View Transitions API (`@view-transition { navigation: auto; }`) for fluid multi-page app transitions.
- Client-side navigation coordination with Lenis smooth scrolling.
- Bounded performance budgets ensuring fast transitions even on lower-tier mobile hardware.

### 🧊 Interactive 3D Scenes & Local SVG Fallbacks
- Rich interactive Three.js scenes representing vehicles, offices, documents, and consultancies.
- **Zero-failure fallback**: 11 hand-crafted, self-contained SVG scene illustrations (`assets/images/scene-stills/`) load automatically on devices without WebGL/GPU acceleration or with high memory constraints.

### 📑 Dynamic Document Checklists
- Interactive RTO document checklists for 12 core services with conditional requirements based on customer status (individual, commercial, loan, deceased owner, etc.).
- Instant one-click **downloadable text checklist (`.txt`)** in both English and Gujarati for offline reference.

### 💬 Branch-Smart Inquiries & WhatsApp Routing
- Context-aware WhatsApp enquiry dialog asking visitors to select their preferred branch (**Jamkandorana** or **Dhoraji**).
- Dynamic message synthesis deep-linking to the respective consultant's WhatsApp.
- Serverless enquiry submissions via **Web3Forms** with real-time feedback (submitting, success, error) and client-side validation.

### 📱 Progressive Web App (PWA)
- Complete Web App Manifest (`manifest.json`) with maskable and adaptive icons.
- Dedicated offline experience (`offline.html`).
- Automated service worker cache migration (`sw.js`) that safely cleans deprecated caches without disrupting visitor settings or active sessions.

### 🔒 Security & Privacy First
- Strict **Content Security Policy (CSP)** preventing unauthorized scripts, frames, and injection vectors.
- Strict cookie consent manager: **zero analytics tracking** until explicit visitor consent is granted.
- Right-click and copy-deterrent content protection on branded assets while keeping forms and phone numbers accessible.

---

## 🚗 RTO Services Covered

| Service Category | Procedures & Descriptions |
| ---------------- | ------------------------- |
| **RC Transfer & Ownership** | Two-wheeler and four-wheeler ownership transfer, inter-state transfer, death/inheritance transfer, Form 29 & 30 preparation. |
| **Driving Licences** | Learning licence test booking, permanent driving licence, DL renewal, duplicate licence, commercial badge, International Driving Permit (IDP). |
| **New Vehicle Registration** | Temporary registration, permanent RC issuance, smart card RC, high security registration plates (HSRP). |
| **Hypothecation (HP)** | Bank loan endorsement on RC, hypothecation termination / HP cancellation (Form 35), bank NOC clearance. |
| **Vehicle NOC** | Inter-state vehicle NOC issuance, state-to-state clearance certificates. |
| **Fitness & Passing** | Commercial vehicle fitness certificate (CF) renewal, passing for trucks, buses, tempos, and auto-rickshaws. |
| **Permits & Taxation** | All India Tourist Permit (AITP), state goods carriage permit, temporary permits, road tax payment, green tax assessment. |
| **Challan & Insurance** | Pending traffic police e-challan verification and payment, third-party and comprehensive motor insurance coverage. |
| **Alterations & Updates** | CNG / LPG kit endorsement on RC, address changes, name correction, engine replacement approval. |

---

## 🛠️ Tech Stack & Architecture

- **Core**: Vanilla HTML5, modern CSS3, ES6+ JavaScript.
- **3D Graphics**: [Three.js](https://threejs.org/) (`0.180.0`) via CDN with graceful vector fallback.
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/) (`1.3.26`).
- **Typography**: [Hind Vadodara](https://fonts.google.com/specimen/Hind+Vadodara) (Google Fonts).
- **Edge Hosting**: Cloudflare Pages with customized `_headers` and `_redirects`.
- **Forms**: [Web3Forms](https://web3forms.com/) serverless form submission gateway.
- **Analytics**: Google Analytics 4 (`G-K0WZE7SSCS`) — strictly consent-gated.
- **Build Step**: **None**. Zero build tooling, zero bundlers, zero framework lock-in. Clean, debuggable, fast static files.

---

## 📂 Project Structure

```text
shreenathauto/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── assets/
│   ├── css/                    # Modular stylesheets (theme, layout, components, transitions)
│   ├── images/
│   │   ├── app-icon/           # PWA icons, favicons, Apple touch icons
│   │   ├── editorial/          # Team and branch office photography
│   │   ├── future-team/        # Reserved team portrait assets
│   │   ├── scene-stills/       # 11 SVG vector fallbacks for 3D scenes
│   │   └── logo.svg            # Official brand vector emblem
│   └── js/                     # Component modules, 3D scenes, language, PWA & consent
├── 404.html                    # Branded missing page experience
├── about.html                  # About the firm, founders, and branch history
├── accessibility.html          # Accessibility statement and standards compliance
├── cancellations.html          # Service cancellation and refund policy
├── contact.html                # Contact info, interactive map links, and form
├── cookies.html                # Cookie policy and consent declaration
├── copyright.html              # Intellectual property and copyright terms
├── index.html                  # Homepage with interactive 3D hero scene
├── manifest.json               # Web App Manifest for mobile/desktop PWA installation
├── offline.html                # Offline fallback notice for PWA visitors
├── privacy.html                # Comprehensive privacy policy
├── release.json                # Version indicator (20261027-r33) for cache tracking
├── robots.txt                  # Search engine crawling directives
├── services.html               # 12 RTO services, WhatsApp triggers & checklists
├── sitemap.xml                 # XML sitemap for SEO discovery
├── sw.js                       # Service worker with migration and cache management
├── terms.html                  # Terms of service and legal agreement
├── _headers                    # Cloudflare Pages security & caching header rules
├── _redirects                  # Cloudflare Pages 301 URL normalization rules
├── CLOUDFLARE-GUIDE.md         # Deployment & DNS operational guide for Cloudflare
└── README.md                   # Project documentation
```

---

## 🚢 Deployment Guide

### 1. Cloudflare Pages (Recommended)

The website is configured natively for Cloudflare Pages:

1. **Deploy Repository**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select `Frenil0393/shreenathauto`.
   - **Build settings**:
     - Framework preset: `None`
     - Build command: *(leave empty)*
     - Build output directory: `.` (or root `/`)
2. **Custom Domain**:
   - In Pages settings, navigate to **Custom domains** > **Set up a domain**.
   - Add `shreenathauto.live` and `www.shreenathauto.live`.
3. **WWW Redirection Rule**:
   - Under your Cloudflare domain dashboard (`shreenathauto.live`), open **Rules** > **Redirect Rules** > **Create rule**.
   - Rule Name: `WWW to main website`
   - Filter Expression: `(http.host eq "www.shreenathauto.live")`
   - URL redirect: Dynamic -> `concat("https://shreenathauto.live", http.request.uri.path)`
   - Status code: `301`, Preserve query string: `Enabled`.
4. **Headers & Redirects**:
   - The included `_headers` and `_redirects` files automatically configure security policies, clean extensionless URLs, and preview indexing guards.

> [!NOTE]
> For manual drag-and-drop deployment instructions, see [CLOUDFLARE-GUIDE.md](CLOUDFLARE-GUIDE.md).

---

### 2. GitHub Pages

The repository includes a ready-to-run GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

- On any push to the `main` branch, the workflow will automatically deploy the site to GitHub Pages.
- Settings: In repository **Settings** > **Pages**, ensure source is set to **GitHub Actions**.

---

### 3. Apache / Legacy Hosting

For traditional cPanel, Apache, or InfinityFree hosting:
- Upload all root files and `assets/` to `htdocs` or `public_html`.
- Retain the `.htaccess` file for URL rewriting, security headers, and MIME-type settings.

---

## 💻 Local Development

No Node.js compilation, npm installation, or build pipeline is required. You can serve the static files with any local web server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000
```

**Using Node.js (`npx serve`):**
```bash
npx serve .
```

**Using VS Code:**
- Install the **Live Server** extension.
- Right-click `index.html` and click **Open with Live Server**.

Then open `http://localhost:8000` in your browser.

> [!TIP]
> To test Progressive Web App (PWA) features or service workers locally, access the site via `http://localhost` or `http://127.0.0.1`, which browsers treat as secure origins.

---

## 📍 Branch Locations & Contact

### 🏢 Jamkandorana Branch (Head Office)
- **Address**: Near Bharat Gas Agency, 1st Floor, Kalavad Road, Jamkandorana, Gujarat 360405
- **Phone**: [+91 98258 66262](tel:+919825866262)
- **Hours**: Monday – Saturday, 09:00 AM – 08:30 PM
- **Google Maps**: [Jamkandorana Office](https://shreenathauto.live/contact#jamkandorana)

### 🏢 Dhoraji Branch
- **Address**: Near Naqsh Pan, Jetpur Road, Dhoraji, Gujarat 360410
- **Phone**: [+91 90995 61439](tel:+919099561439)
- **Hours**: Monday – Saturday, 09:00 AM – 08:30 PM
- **Google Maps**: [Dhoraji Office](https://shreenathauto.live/contact#dhoraji)

**General Email**: [shreenath.auto3930@gmail.com](mailto:shreenath.auto3930@gmail.com)

---

## 📄 Copyright & Ownership

Copyright © 2026 **Shreenath Auto Advisers**. All rights reserved.  
All brand graphics, custom 3D scene compositions, document checklists, and translations are proprietary intellectual property.
