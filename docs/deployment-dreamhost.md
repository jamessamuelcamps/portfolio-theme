# Deploying to DreamHost

**Status:** Live · **Owner:** James S-C · **Created:** 2026-09-10 · **Updated:** 2026-09-14

How this portfolio deploys to the DreamHost domain + shared hosting.

The site is fully static ([`astro.config.mjs`](../astro.config.mjs), `output: 'static'`), so
DreamHost shared hosting is a good fit — no Node runtime needed on the server. GitHub Actions
builds on push to `main` and rsyncs `dist/` over SSH.

**Domain:** apex `james-sc.co.uk` is canonical; `www` redirects to it. `site` in
`astro.config.mjs` is set accordingly.

**Server:** `iad1-shared-b7-47.dreamhost.com`, user `dh_unjfm5`, web directory
`/home/dh_unjfm5/james-sc.co.uk`.

---

## Build config

```
npm ci
npm run build
```

Produces `dist/` — plain HTML/CSS/JS/assets. Astro's default directory format gives clean URLs
(`/work/foo/` → `dist/work/foo/index.html`), which work on Apache with no extra config. Requires
Node ≥22.12.0 (per `package.json` engines) — the CI workflow pins Node 22.

## Deploying

**Automated:** [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) builds and
rsyncs on every push to `main` (or via manual `workflow_dispatch`). Repo secrets:

- `DREAMHOST_SSH_KEY` — deploy key's private key (ed25519, no passphrase)
- `DREAMHOST_HOST` — `iad1-shared-b7-47.dreamhost.com`
- `DREAMHOST_USER` — `dh_unjfm5`
- `DREAMHOST_PATH` — `/home/dh_unjfm5/james-sc.co.uk`

The rsync step uses `ssh -i ~/.ssh/deploy_key -o IdentitiesOnly=yes` — without
`IdentitiesOnly=yes` the runner's ssh-agent offers other identities first and DreamHost's
`MaxAuthTries` disconnects before the deploy key is tried.

**Manual (fallback):** upload the *contents* of `dist/` (not the folder itself) into the web
directory via SFTP, or:

```
rsync -avz --delete dist/ dh_unjfm5@iad1-shared-b7-47.dreamhost.com:~/james-sc.co.uk/
```

`--delete` clears stale files. There's no `.well-known/` directory in the web root to worry about
preserving — DreamHost's Let's Encrypt renewal doesn't use one here.

## `.htaccess`

Lives at [`public/.htaccess`](../public/.htaccess), copied into `dist/` on every build. Handles
the `www` → apex redirect, a custom 404 page, gzip compression, and asset caching headers.
DreamHost's Let's Encrypt panel setting handles HTTP→HTTPS separately.

## SSH access setup (already done, for reference)

1. Panel → *Websites → Manage Websites → [domain] → Content → Manage Files → Login Info* →
   toggle **Secure Shell Access (SSH)** on for the site's user.
2. No key-management UI in the panel — keys go straight into `~/.ssh/authorized_keys` on the
   server. Set a one-time password via the same Login Info panel, SSH in, then:
   ```
   mkdir -p ~/.ssh && chmod 700 ~/.ssh
   echo "PASTE_PUBLIC_KEY" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```
3. When setting `DREAMHOST_SSH_KEY` as a GitHub secret, prefer `gh secret set DREAMHOST_SSH_KEY <
   path/to/key` over pasting into the browser UI — a browser paste corrupted the key's line
   breaks once and caused `Too many authentication failures` in CI.

## Migration history

The domain previously hosted a live WordPress install at the same web directory. Before the
first deploy (2026-09-14) it was fully backed up: `mysqldump --no-tablespaces` of the DB and a
`tar.gz` of the full file tree, both saved to `~/backups/` on the server and pulled down locally.
No redirects were set up for old WordPress URLs — they 404 under the new site by design.

## Open items

- [x] Confirm the exact domain + apex vs. `www`, set `site` in `astro.config.mjs`
- [x] Write the GitHub Action (build + rsync over SSH)
- [x] Write the `.htaccess` file into the repo, confirm the redirect + HTTPS
- [x] Decide on redirects for old-site URLs — none needed
- [x] Back up the current DreamHost site contents before first deploy
