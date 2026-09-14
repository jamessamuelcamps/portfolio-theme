# Deploying to DreamHost

**Status:** Not started · **Owner:** James S-C · **Created:** 2026-09-10

How to deploy this portfolio to the existing DreamHost domain + shared hosting.

The site is fully static ([`astro.config.mjs`](../astro.config.mjs), `output: 'static'`), so
DreamHost shared hosting is a good fit — no Node runtime needed on the server. Build locally,
upload `dist/`.

> Parked while mobile issues are sorted out first.

---

## One-time setup on DreamHost

1. **Host the domain (not just DNS).** Panel → *Websites → Manage Websites → Add a website*
   (or edit the existing entry). Set it to **fully host** the domain, pointing at a web
   directory like `/home/USERNAME/james-sc.co.uk/`. If the old site lives there now, note the
   path and back up its contents first.
2. **Enable HTTPS.** Panel → *Websites → [domain] → HTTPS/SSL* → add the free Let's Encrypt
   certificate. Turn on "redirect HTTP to HTTPS".
3. **Set up SSH access** (for the automated option below). Panel → *Servers → SSH Keys*, or
   *Users* → enable shell access for the user and add a public key.

## Build config

Update the `site` value in [`astro.config.mjs`](../astro.config.mjs) to the real domain before
building — currently the placeholder `https://jamessamuelcamps.com`. It drives the sitemap and
canonical URLs, so it must match exactly what gets served (apex vs. `www`).

```
npm ci
npm run build
```

Produces `dist/` — plain HTML/CSS/JS/assets. Astro's default directory format gives clean URLs
(`/work/foo/` → `dist/work/foo/index.html`), which work on Apache with no extra config.

## Deploying

**Manual (simplest to start):** upload the *contents* of `dist/` (not the folder itself) into
the domain's web directory via SFTP (FileZilla, Cyberduck) or:

```
rsync -avz --delete dist/ USERNAME@SERVER.dreamhost.com:~/james-sc.co.uk/
```

`--delete` clears stale files from the old site. Preserve any `.well-known/` directory the SSL
panel created (or re-issue the cert afterwards).

**Automated (recommended):** a GitHub Action on push to `main` that builds and rsyncs over SSH.
Add the DreamHost SSH private key as a repo secret. Workflow file not written yet.

## Optional `.htaccess`

Place in the web root for asset caching and a www↔apex redirect. Astro fingerprints filenames
in `_astro/`, so those are safe to cache hard:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
```

## Open items

- [ ] Confirm the exact domain + apex vs. `www`, then set `site` in `astro.config.mjs`
- [ ] Write the GitHub Action (build + rsync over SSH)
- [ ] Write the `.htaccess` (caching + redirect + HTTP→HTTPS)
- [ ] Decide on redirects for any old-site URLs that change
- [ ] Back up the current DreamHost site contents before first deploy
