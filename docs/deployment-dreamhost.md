# Deploying to DreamHost

**Status:** In progress · **Owner:** James S-C · **Created:** 2026-09-10 · **Updated:** 2026-09-14

How to deploy this portfolio to the existing DreamHost domain + shared hosting.

The site is fully static ([`astro.config.mjs`](../astro.config.mjs), `output: 'static'`), so
DreamHost shared hosting is a good fit — no Node runtime needed on the server. Build locally,
upload `dist/`.

**Domain:** apex `james-sc.co.uk` is canonical; `www` redirects to it. `site` in
`astro.config.mjs` is set accordingly.

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

## `.htaccess`

Place in the web root for the `www` → apex redirect and asset caching. Astro fingerprints
filenames in `_astro/`, so those are safe to cache hard. DreamHost's Let's Encrypt panel setting
handles HTTP→HTTPS, so this only needs the host redirect:

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.james-sc\.co\.uk$ [NC]
RewriteRule ^(.*)$ https://james-sc.co.uk/$1 [L,R=301]

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
```

## Open items

- [x] Confirm the exact domain + apex vs. `www` (apex `james-sc.co.uk` is canonical), then set
      `site` in `astro.config.mjs`
- [ ] Write the GitHub Action (build + rsync over SSH)
- [ ] Write the `.htaccess` file above into the repo (or DreamHost web root directly) and confirm
      the redirect + HTTPS
- [ ] Decide on redirects for any old-site URLs that change
- [ ] Back up the current DreamHost site contents before first deploy
