# Design Doc: `portfolio-theme` starter repo

**Status:** Draft · **Owner:** James S-C · **Created:** 2026-09-07

Turn this portfolio into a clean, brand-neutral Astro starter that anyone can
clone (or "Use this template") for their own portfolio. The homepage already
links to it — the "Steal this theme →" mark in
[index.astro](../src/pages/index.astro#L42) points at
`https://github.com/jamessamuelcamps/portfolio-theme`, which does not exist yet.

---

## 1. Goals

- A working, deployable portfolio on `npm install && npm run dev` with **zero**
  personal content — no real name, copy, images, links, or analytics.
- One obvious place to configure identity (name, role, socials, domain).
- Preserve everything that makes this build good: the flat black/white token
  system, dark mode, `astro:assets` image pipeline, content collections,
  MDX case studies, `StatTile`/`Callout` components.
- A README that gets a non-expert from clone → deployed in ~15 minutes.
- Keep this repo (`portfolio`) as the source of truth; the theme is a
  **periodic snapshot**, not a live dependency.

### Non-goals

- No CMS, no framework UI kit, no multi-language.
- Not publishing to npm — it's a template repo, not a package.
- Not restructuring `portfolio` to consume the theme as an upstream (see §7 for
  why we're deferring that).

---

## 2. Approach

Do the extraction **on a branch of this repo**, not by hand-editing a copy. That
keeps the diff reviewable and lets us keep pulling improvements across with
`git cherry-pick` later.

```
portfolio (main)         ← real content, source of truth
  └─ theme/blank          ← branch: config refactor + placeholder content
                             this branch's tree is what gets pushed to
                             portfolio-theme's main
```

**Sequence**

1. **Finish outstanding work on `main` first** — the remaining case-study /
   section templates. No point snapshotting a moving target.
2. Cut `theme/blank` from `main`.
3. Land the config refactor (§4) on `theme/blank`. This part is genuinely
   useful to merge back to `main` too — do that.
4. Strip + replace content (§5) on `theme/blank`. This part stays on the branch.
5. `npm run build` + `npx astro check` clean; manual smoke test of every route
   in both themes.
6. James creates the empty `jamessamuelcamps/portfolio-theme` on GitHub
   (no README/licence/gitignore — keep it empty).
7. Push the branch tree to the new repo's `main`:
   ```
   git push git@github.com:jamessamuelcamps/portfolio-theme.git theme/blank:main
   ```
8. On GitHub: **Settings → Template repository → on**. Confirm the
   "Use this template" button appears and that
   `…/portfolio-theme/generate` resolves (that's the URL the homepage link
   should end up pointing at — see §6).
9. Add branch protection / a licence / issues templates as desired.

---

## 3. What stays as-is

These are theme assets already in good shape — copy them across untouched:

| Area | Files |
|---|---|
| Token system + reset + prose styles | [src/styles/global.css](../src/styles/global.css) |
| Dark mode (toggle + FOUC script) | [Header.astro](../src/components/Header.astro), [BaseLayout.astro](../src/layouts/BaseLayout.astro) |
| Layouts | [BaseLayout](../src/layouts/BaseLayout.astro), [ProjectLayout](../src/layouts/ProjectLayout.astro), [WritingLayout](../src/layouts/WritingLayout.astro) |
| Components | `ProjectCard`, `WritingCard`, `StatTile`, `StatGrid`, `Callout`, `Footer` |
| Content schema | [src/content.config.ts](../src/content.config.ts) |
| Dynamic routes | `work/[...slug].astro`, `writing/[...slug].astro` |
| Build config | [astro.config.mjs](../astro.config.mjs) (except `site`) |
| Agent docs | [CLAUDE.md](../CLAUDE.md), [AGENTS.md](../AGENTS.md) |

---

## 4. Config refactor (also merge to `main`)

Right now identity strings are scattered across ~10 files. Centralise them so a
forker edits **one file**.

### New: `src/config.ts`

```ts
export const site = {
  name: 'Your Name',
  role: 'Product Designer',
  // Used for <title> suffix, meta, and the footer.
  url: 'https://example.com',
  description: 'Product design portfolio — case studies and writing.',
  email: 'you@example.com',
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/you' },
    { label: 'GitHub', href: 'https://github.com/you' },
  ],
  nav: [
    { href: '/work', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/writing', label: 'Writing' },
  ],
  // Homepage hero
  hero: {
    availability: 'Available for new work. Let’s talk →',
    quote: 'A short, sharp line that sets the tone for the whole site.',
    cite: '— Someone worth quoting',
  },
  // The "Steal this theme" mark on the homepage. Set to null to hide it.
  themeCredit: { label: 'Steal this theme →', href: 'https://github.com/jamessamuelcamps/portfolio-theme' },
} as const;
```

### Call sites to update

| File | Currently hard-coded | Replace with |
|---|---|---|
| [astro.config.mjs](../astro.config.mjs#L9) | `site: 'https://jamessamuelcamps.com'` | import from `config.ts` (or leave a comment; config can't import cleanly into the config file — duplicate with a `// keep in sync` note) |
| [BaseLayout.astro](../src/layouts/BaseLayout.astro#L14-L16) | default title/description | `site.name` / `site.role` / `site.description` |
| [BaseLayout.astro](../src/layouts/BaseLayout.astro#L36) | `href="/favicon.png"` — **broken**, only `favicon.svg`/`.ico` exist in `public/` | fix to `/favicon.svg` |
| [Header.astro](../src/components/Header.astro#L5-L9) | `navLinks`, brand name/title | `site.nav`, `site.name`, `site.role` |
| [Footer.astro](../src/components/Footer.astro#L8-L16) | name, role, email, 3 socials | `site.name`, `site.role`, `site.email`, `site.socials` |
| [index.astro](../src/pages/index.astro) | availability pill, quote + cite, hero bio (2 paras), socials, "Steal this theme" link | `site.hero.*`, `site.socials`, `site.themeCredit` |
| [about.astro](../src/pages/about.astro) | entire bio copy, Tilia link | placeholder prose |
| [work/index.astro](../src/pages/work/index.astro#L11-L14), [writing/index.astro](../src/pages/writing/index.astro#L11-L14) | page title/description/copy | generic copy; title suffix from `site.name` |
| [ProjectLayout.astro](../src/layouts/ProjectLayout.astro#L19), [ProjectLayout.astro](../src/layouts/ProjectLayout.astro#L81) | `· James Samuel Camps` suffix, `hello@james-sc.co.uk` CTA | `site.name`, `site.email` |
| [WritingLayout.astro](../src/layouts/WritingLayout.astro#L19) | `· James Samuel Camps` suffix | `site.name` |
| [404.astro](../src/pages/404.astro#L5) | title suffix | `site.name` |

> **While you're in here:** the title suffix is inconsistent —
> `James Samuel-Camps` (hyphen) in BaseLayout/Header vs `James Samuel Camps`
> (no hyphen) in the three layouts and 404. Consolidating on `site.name` fixes
> that for free.

---

## 5. Content strip + placeholders (stays on `theme/blank`)

### Case studies

- Delete all 5 `src/content/projects/*.mdx` and their image folders
  (~140 PNG/JPG under `src/content/projects/*/`).
- Add **2 demo case studies** that exercise every feature:
  - `example-project.mdx` — full frontmatter (client/role/timeline/tags/
    heroImage), all heading levels, a blockquote, an image with caption,
    a `<StatGrid>` with `<StatTile>`s, a `<Callout>`.
  - `example-project-minimal.mdx` — only required frontmatter, no hero image,
    short body. Proves the optional-field paths render.
- Lorem-ish but coherent copy (a plausible fake project reads better than
  "lorem ipsum" and shows the forker the intended shape).

### Writing

- `src/content/writing/` is currently empty. Add **1 demo post**
  (`hello-world.mdx`) so `/writing` isn't an empty state on first run, and so
  the dynamic route + `WritingLayout` are exercised.

### Images

`astro:assets` requires referenced images to exist at build time, so we need
committed placeholders:

- `src/content/projects/example-project/hero.svg` + 2–3 body images.
  (`src/assets/` no longer exists — the About page's `logos.png` was removed on
  `main` 2026-09-08 when that section was cut. Only re-add an asset there if a
  demo page needs one.)
- Use flat 2-colour SVGs that respect the aesthetic (a labelled rectangle at
  the right aspect ratio is fine). SVG keeps the repo tiny.
- `image()` schema helper + `<Image>` work with SVG, but confirm in the build —
  if SVG proves awkward, fall back to small generated PNGs.

### About page

Replace [about.astro](../src/pages/about.astro) body copy with 3–4 short
placeholder sections in the same structure (Profile / Background / How I work),
so the `.prose` styling is demonstrated. (The page is now prose-only — the
client-logos and contact-box sections were removed on `main` 2026-09-08.)

### Personal data checklist (must be zero hits before push)

```
rg -i "james|samuel|camps|james-sc|jamessamuelcamps|tilia|vml|moneybox|youlend|tide" src/ astro.config.mjs
```

Expected remaining hits after strip: only `site.themeCredit.href`
(the `jamessamuelcamps/portfolio-theme` URL) — see §6.

---

## 6. The "Steal this theme" link, in both repos

| Repo | `site.themeCredit` | Rationale |
|---|---|---|
| `portfolio` (this one) | `{ label: 'Steal this theme →', href: '…/portfolio-theme/generate' }` | send visitors straight into GitHub's template flow |
| `portfolio-theme` | `null` (hidden) **or** `{ label: 'Made with this theme', href: '…/portfolio-theme' }` | someone else's site shouldn't tell its own visitors to take *James's* theme; hiding is the clean default, a small credit link is the friendly one |

Decision needed — see §9. Current homepage link uses the bare repo URL; switch
it to `/generate` once the template flag is on.

---

## 7. Keeping the theme in sync (deferred decision)

**Chosen for v1: manual snapshot.** When this repo gets theme-level
improvements (token tweaks, component fixes, new layouts), port them with:

```
git cherry-pick <sha>        # from portfolio, applied on portfolio-theme
```

Content commits never get cherry-picked. Keep theme changes and content changes
in **separate commits** on `main` to make this painless — this is the main
ongoing discipline the split imposes.

**Rejected for now:** making `portfolio` a fork of `portfolio-theme` with
content layered on top. Cleaner in theory, but it means every content edit
risks merge friction with upstream, and the config refactor isn't mature enough
to guarantee a clean seam. Revisit once the theme has real external users.

---

## 8. README for the new repo (outline)

1. **What this is** — one screenshot (light + dark), one line, live demo link.
2. **Quick start** — `npm install` / `npm run dev` (note the
   `astro dev --background` convention from CLAUDE.md).
3. **Make it yours** — edit `src/config.ts`; swap the favicon in `public/`;
   replace the About copy.
4. **Add a case study** — new `.mdx` in `src/content/projects/`, frontmatter
   table (from `content.config.ts`), where images go, the `order` field, the
   `StatTile`/`Callout`/`StatGrid` components with examples.
5. **Add a writing post** — same pattern, `src/content/writing/`.
6. **Theming** — the token block in `global.css`, how dark mode inverts, that
   there's no Tailwind (vanilla CSS + CSS custom properties).
7. **Deploy** — it's `output: 'static'`; Netlify/Vercel/Cloudflare Pages/GitHub
   Pages all work. Set `site` in `astro.config.mjs`.
8. **Licence** — MIT (add `LICENSE`; this repo has none today).
9. **Credit** — link back to `james-sc.co.uk` / original repo.

Also add: `LICENSE` (MIT), a short `.github/` (issue template + maybe a deploy
CI), and strip `CLAUDE.md`/`AGENTS.md` down to the generic Astro guidance
(they're already almost fully generic).

---

## 9. Open questions

1. **Theme credit in downstream sites** (§6) — hide entirely, or keep a small
   "Made with this theme" link back? Default: hide.
2. **Licence** — MIT assumed. OK? Any attribution requirement beyond the README
   credit?
3. **Demo content tone** — invent a plausible fake design project, or keep it
   obviously skeletal? Recommendation: plausible fake, it's a better teaching
   aid.
4. **SVG vs PNG placeholders** — try SVG first, confirm through the
   `astro:assets` build before committing to it.
5. **Config in `astro.config.mjs`** — `site` can't cleanly import from
   `src/config.ts` at config-eval time. Duplicate the value with a
   `// keep in sync with src/config.ts` comment, or read it via a tiny
   `import` (test it)?
6. **Scope of "page templates" still to build on `main`** — list them here so
   we know the snapshot is complete before cutting `theme/blank`.

---

## 10. Task checklist

- [ ] Finish remaining case-study / section templates on `main`
- [ ] `src/config.ts` + update all call sites (§4) — merge to `main`
- [ ] Fix favicon reference bug in `BaseLayout.astro`
- [ ] Normalise the `James Samuel[-/ ]Camps` title suffix via `site.name`
- [ ] Cut `theme/blank` branch
- [ ] Delete real case studies + `src/content/projects/*/` images
- [ ] Add 2 demo case studies + 1 demo writing post
- [ ] Add SVG placeholder images
- [ ] Rewrite About copy as placeholder
- [ ] Generic copy for `/work` and `/writing` index pages
- [ ] `rg` personal-data sweep returns only the theme-credit URL
- [ ] `npm run build` + `npx astro check` clean
- [ ] Manual route smoke test, light + dark
- [ ] Write README + add `LICENSE` (MIT)
- [ ] Trim `CLAUDE.md` / `AGENTS.md` to generic
- [ ] James: create empty `jamessamuelcamps/portfolio-theme`
- [ ] Push `theme/blank:main` to the new repo
- [ ] Enable Template repository; verify `/generate`
- [ ] Point this repo's "Steal this theme" link at `…/portfolio-theme/generate`
