# Shreenath Auto Advisers — Cloudflare upload guide
Release 20261027-r33, prepared 27 October 2026. This Cloudflare folder is now the deployment copy; the original V10 folder is unchanged.

## What to upload
Upload ../shreenath-cloudflare-r33.zip to your existing Pages project as a new Production deployment. The ZIP contains the full website with index.html at its root. It excludes this private guide. The files are now directly in this folder (there is no nested upload folder).

Structure:
- shreenath-cloudflare-20261027/ — current website source for Cloudflare
  - index.html, other page HTML, 404.html
  - assets/css, assets/js, assets/images
  - _headers, _redirects
  - favicon.ico, apple-touch-icon.png, apple-touch-icon-precomposed.png
  - manifest.json, sw.js, release.json, robots.txt, sitemap.xml
- ../shreenath-cloudflare-r33.zip — upload this ZIP directly
- CLOUDFLARE-GUIDE.md — this private guide; excluded from the ZIP

## r33 transition fix and live checks
Each normal page declares its native navigation opt-in early in the head, before blocking scripts. Late stylesheets only style the transition and no longer change its opt-in. If Chrome skips a native transition, the page controller recovers with the existing content fade. The header stays outside that fade. Mobile and reduced-motion behaviour remain separate.
The corrected files are checked in an isolated Chrome preview before packaging; this does not deploy them. The live site remains on its previous release until you upload the new ZIP.
Live HTTP checks now confirm a server-side 301 to HTTPS. The www redirect still drops query strings: enable Preserve query string and save/deploy that rule in Cloudflare. Web3Forms delivery was verified by the owner.

The original V10 website has not been modified. Designs, translations, contact details, GA4 settings and Web3Forms configuration are copied unchanged. Internal documentation, Git files, archives, Apache configuration and unpublished future-team portraits are excluded.

## 1. Publish a preview
Sign in at https://dash.cloudflare.com/ and open Workers & Pages.
Choose Create application, the Pages/Get started option, then Drag and drop your files.
Name the project shreenath-auto (or another available name), upload the ZIP, and deploy.
Use the actual pages.dev address Cloudflare assigns. No build command, database, paid Worker or GitHub setup is required for this package.
Direct Upload cannot later be converted to Git integration in the same project.
Official guide: https://developers.cloudflare.com/pages/get-started/direct-upload/

Open the preview before changing DNS. Web3Forms domain restrictions, if enabled in your account, may prevent submissions from a temporary preview hostname. Browser checks do not submit real enquiries; delivery on the final domain was confirmed by the owner.

## 2. Move DNS
In Cloudflare, add/onboard shreenathauto.live and select the Free plan.
Review imported DNS against the current provider; preserve mail and verification records.
At the registrar where you bought the domain, replace the nameservers with the exact pair assigned by Cloudflare. If existing DNSSEC is active, disable it before replacing nameservers; re-enable through Cloudflare after activation.
Wait for Active status. Registrar updates may take up to 24 hours.
Keep the InfinityFree website during migration. Your registrar and domain renewal stay unchanged.
Official DNS guide: https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/

## 3. Connect the website
In Workers & Pages, select your project, then Custom domains > Set up a domain.
Add shreenathauto.live and www.shreenathauto.live separately.
Follow Cloudflare's DNS confirmation and wait for both domains/certificates to become active.
If prompted about conflicting website records, replace only the old A/AAAA/CNAME for @ or www pointing at InfinityFree. Preserve unrelated records.
Do not merely create a CNAME without adding the domain to the Pages project: that can produce a 522 error.
Official guide: https://developers.cloudflare.com/pages/configuration/custom-domains/

## 4. Redirect www to the main address
Correction to the earlier chat guide: Pages _redirects does NOT support domain-level source rules. Set this once in the domain dashboard.

Open shreenathauto.live > Rules > Overview > Create rule > Redirect Rule.
Name: WWW to main website.
Choose Custom filter expression:
(http.host eq "www.shreenathauto.live")

URL redirect type: Dynamic.
Expression:
concat("https://shreenathauto.live", http.request.uri.path)

Status: 301.
Preserve query string: enabled.
Deploy the rule. The www DNS record must be proxied (orange cloud).
This retains the original path and query, e.g. www.shreenathauto.live/contact becomes shreenathauto.live/contact.
Official guide: https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/

## Included hosting behaviour
Pages handles extensionless URLs and the root 404.html automatically. Do not add an SPA catch-all to index.html.
_headers carries security/cache settings and prevents pages.dev preview addresses being indexed. It does not block indexing on shreenathauto.live.
_redirects normalizes /index and known page trailing slashes.
Root icon files are actual copies, so conventional favicon and Apple icon requests work directly.
The existing service worker migration is retained to clear old Shreenath caches without reloading tabs. Offline interception remains disabled; this move does not add offline support.
Apache-only .htaccess rules do not execute on Pages. Private project files are physically excluded instead of relying on Apache blocking rules.
No Functions or backend code are included. Enquiries still submit directly to Web3Forms.
Sources:
- https://developers.cloudflare.com/pages/configuration/serving-pages/
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/pages/configuration/redirects/

## After connecting
Visit https://shreenathauto.live on Wi-Fi and mobile data, including returning visits.
Confirm an enquiry reaches your inbox and existing consent-based analytics works.
Keep normal Pages caching; do not add Cache Everything or forced reload logic.
The site remains on its existing domain, so its canonical URLs, sitemap and integrations need no hostname change.
You can keep the supplied pages.dev address as a preview; it is marked noindex.
Keep the old host briefly for rollback, then retire it once satisfied.

## Future updates
This is a snapshot of V10 on 27 October 2026. Later edits to V10 are not automatically copied here.
Update public files in this Cloudflare folder, retain _headers/_redirects and the root icons, then package the COMPLETE public website for Create deployment > Production in the same Pages project.
The supplied ZIP is a snapshot. After further edits, make a new ZIP with index.html at its root. Exclude this guide and any internal documents, backups or future-team portraits.
Cloudflare hosting can use the free plan; domain renewal remains separate.

