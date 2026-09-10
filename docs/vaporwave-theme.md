# Design Doc: `vaporwave` Easter-egg theme

**Status:** Built (branch `feat/vaporwave-theme`, unreviewed) · **Owner:** James S-C · **Created:** 2026-09-10

> **2026-09-10 — built, then revised.** §2–§6 implemented plus the optional
> special cases. `npm run build` + `npx astro check` clean; verified across `/`,
> `/about`, `/work`, a case study and the mobile menu in all three themes; no
> horizontal overflow at 390/768/1280; switch/persist/FOUC + white-flash checked
> by scripted interaction.
>
> **Revision pass (§10):** the dark-purple gradient was replaced with a bright
> pastel sky (pink→lavender→cyan→mint→citron) and the ink flipped to deep
> purple `#2b1055`; the display quote is much larger (1.4rem → 2.25rem) and now
> **ripples** — an animated SVG turbulence/displacement filter plus a CSS
> RGB-split shimmer, hue oscillation and sway, all gated behind
> `prefers-reduced-motion`; entering or leaving vapor plays a **full-screen
> white-flash transition**; drifting **VHS scanlines** sit behind the content;
> social links + stat numbers joined the pixel-font set; the switch button went
> from 🌴 to the word **Miami**; and body copy switched to **DM Mono**. New
> files: `public/favicon-vapor.svg`, the `#vapor-ripple` filter def in
> `BaseLayout.astro`. Vapor fonts: `@fontsource/press-start-2p` +
> `@fontsource/dm-mono` (latin 400 only), ~27 KB woff2 total, global. Remaining:
> contrast/axe pass on the pastel palette; tune pixel sizes against the real
> header (§9.5).

Add a third theme — an 80s vaporwave treatment — to the light/dark switch,
labelled **Miami** (a Hotline Miami / Miami Vice / vaporwave-sunset nod, cryptic
enough to read as "you found something"). Selecting it re-skins the site with a
neon sunset palette, sets the display/chrome type in a classic 8-bit pixel font
and body copy in DM Mono. It is opt-in only: never auto-selected from
`prefers-color-scheme`.

*(Was an unlabelled 🌴 through the first builds — swapped to a word in §10.7.)*

Decisions taken (2026-09-10):

- **Font scope:** pixel font on display + chrome only (headings, nav, brand
  name, buttons, labels, stat numbers, the display quote). Body copy switches
  from DM Sans to **DM Mono** in vapor (retro feel, same type family) — §10.8.
- **Background:** bright pastel vaporwave sky (pink→lavender→cyan→mint→citron),
  fixed, no animated grid. Dark ink on top. *(Was a dark-purple gradient in the
  first build — see §10.)*
- **Discoverability:** the **Miami** button is always visible in the switch. No
  unlock mechanism.
- **Not in the starter.** Vapor stays personal-site only — it is not folded
  into the `portfolio-theme` starter.

---

## 1. Goals

- A third `data-theme` value, `vapor`, that works from a cold load with no
  flash, exactly like `dark` does today.
- ~All visual work done through the existing semantic colour tokens — one new
  override block in `global.css`, mirroring the dark-mode block.
- Pixel font confined to display/chrome so case studies stay readable and the
  layout holds.
- Body-copy contrast still meets WCAG AA. It's an Easter egg, not an excuse for
  unreadable neon.
- Zero cost to light/dark users beyond a small font payload (see §5).

### Non-goals

- Not part of the `portfolio-theme` starter (see [portfolio-theme.md](portfolio-theme.md)) —
  this stays a personal-site Easter egg. The N-theme `syncTheme()` refactor
  (§2.2) can still land in the starter on its own; the `vapor` value and its
  token/font blocks do not.
- No animated grid horizon, no audio. *(Drifting VHS scanlines were added later
  — §10.6.)*
- No per-theme imagery treatment — real case-study screenshots render untouched.

---

## 2. The theme switch (generalise from binary)

Everything in [Header.astro](../src/components/Header.astro) assumes two themes.
Three small changes make it N-safe.

### 2.1 Markup — add a button to both switch instances

Header switch ([Header.astro:27-30](../src/components/Header.astro#L27-L30)) and
the menu-overlay copy ([Header.astro:85-88](../src/components/Header.astro#L85-L88)):

```html
<button type="button" class="theme-option" data-theme-option="vapor">Miami</button>
```

- Plain text label — no `aria-label` needed (that was for the emoji era, §10.7);
  `syncTheme()` maintains `aria-pressed`.
- The header's centre grid column is `auto` ([Header.astro:194](../src/components/Header.astro#L194)),
  so a third button just widens the pill — no grid change.

### 2.2 Script — `syncTheme()` + click handler

Replace the `isDark ? 'dark' : 'light'` coercion
([Header.astro:96-114](../src/components/Header.astro#L96-L114)) with a
value-driven version:

```js
const THEMES = ['light', 'dark', 'vapor'];

function syncTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  options.forEach((option) => {
    const active = option.dataset.themeOption === current;
    option.classList.toggle('active', active);
    option.setAttribute('aria-pressed', String(active));
  });
}

options.forEach((option) => {
  option.addEventListener('click', () => {
    const next = option.dataset.themeOption;
    if (!THEMES.includes(next)) return;
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncTheme();
  });
});
```

### 2.3 FOUC guard — accept the new value

[BaseLayout.astro:27-35](../src/layouts/BaseLayout.astro#L27-L35):

```js
var valid = ['light', 'dark', 'vapor'];
var theme = valid.indexOf(stored) !== -1
  ? stored
  : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);
```

`vapor` is only ever reached via an explicit stored choice — the media-query
branch stays light/dark.

---

## 3. Colour tokens

One block, same names as the dark override
([global.css:86-95](../src/styles/global.css#L86-L95)). Starting palette —
tune against a contrast checker before landing:

```css
html[data-theme="vapor"] {
  --color-bg: #1a0b2e;               /* solid fallback under the gradient */
  --color-text: #f4ecff;            /* ~13:1 on the darkest gradient stop */
  --color-text-secondary: #d6c7f5;
  --color-text-muted: #b3a1de;      /* must stay ≥4.5:1 on the lightest stop */
  --color-border: #ff71ce;          /* hot-pink hairlines */
  --color-border-strong: #01cdfe;   /* cyan — badges, focus rings, dividers */
  --color-surface: #2a1a4f;         /* pills, availability badge */
  --color-dot: rgba(255, 113, 206, 0.35);  /* card dot-field */
}
```

Classic vaporwave accents to draw from: pink `#ff71ce`, cyan `#01cdfe`,
green `#05ffa1`, purple `#b967ff`, yellow `#fffb96`.

### 3.1 Gradient background

`html` already paints `--color-bg`
([global.css:106-116](../src/styles/global.css#L106-L116)) and `body` is
transparent — so add the gradient on the `html` vapor rule:

```css
html[data-theme="vapor"] {
  background-image: linear-gradient(180deg, #1a0b2e 0%, #3d1a5b 55%, #5b2172 100%);
  background-attachment: fixed;
}
```

Keep it mostly-purple — a bright peach horizon behind the footer would sink
the footer text. `background-image` won't tween on switch (only the `html`
`color`/`background-color` transition at [global.css:115](../src/styles/global.css#L115)
does); acceptable, or cross-fade a fixed pseudo-element later. Watch
`background-attachment: fixed` repaint cost on mobile — fall back to a
`position: fixed` `::before` if it janks.

---

## 4. Typography — 8-bit display font

**Family:** [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
via `@fontsource/press-start-2p` (self-hosted, single weight, small latin
subset ≈ 13 KB woff2).

### 4.1 Token plumbing

Introduce a display token that's a no-op for light/dark:

```css
:root  { --font-display: var(--font-sans); }
html[data-theme="vapor"] { --font-display: "Press Start 2P", var(--font-sans); }
```

Point the chrome/display selectors at `var(--font-display)`:
`h1–h6`, `.brand-name` / `.brand-short`, `.nav-link`, `.theme-option`,
`.menu-trigger` / `.menu-close`, `.menu-name`, `.btn`, `.badge`,
`.cs-section-eyebrow` / `.cs-labelled-label` / `.meta-label` (eyebrows), and
the display quote. Body copy (`p`, `.prose`, `.cs-section-body`, cards) keeps
`--font-sans` untouched.

### 4.2 Pixel-font hygiene (vapor block only)

Press Start 2P breaks several global assumptions:

- **Negative tracking must go.** `h1–h6` set `letter-spacing: -0.02em`
  ([global.css:145](../src/styles/global.css#L145)); `.display-quote`,
  `.statement`, `.cs-lead` set `-0.05em`. Reset all to `normal` under
  `[data-theme="vapor"]`.
- **Leading needs air.** Pixel glyphs want ≥1.5; `--line-height-tight: 1.05`
  headings will collide. Bump headings to ~1.6 in vapor.
- **The display quote goes pixel too, and needs hands-on tuning.**
  `.display-quote` hits `--font-size-7xl` (72 px) at ≥768 px
  ([global.css:569-573](../src/styles/global.css#L569-L573)). In Press Start 2P
  that wraps to a wall, so vapor overrides the whole scale for this element —
  roughly `0.95rem` mobile / `1.15rem` at ≥768 px, `line-height: 1.9`,
  `letter-spacing: normal` — so it reads like a game intro crawl rather than a
  headline. The per-line inverted-highlight `<span>`s
  ([global.css:536-547](../src/styles/global.css#L536-L547)) still work; just
  drop the `-0.3em` negative left margin/padding at ≥640 px
  ([global.css:559-562](../src/styles/global.css#L559-L562)) since pixel glyphs
  don't need the optical pull-in. `.display-quote-cite` shrinks to match. This
  is the single fiddliest piece; budget iteration against the real header.
- **Nav width.** `.nav-link` column is right-aligned
  ([global.css:263-271](../src/styles/global.css#L263-L271)); "Projects" in a
  pixel font is wide. Drop `.nav-link` to ~`0.6rem` in vapor, or accept the
  extra width (desktop only — the mobile menu replaces the nav < 640 px).
- **Brand.** `.brand-name` ("James Samuel-Camps") and `.brand-short` ("JSC")
  go pixel. Press Start 2P at the current `--font-size-base` is far too wide for
  the header's left column, so drop `.brand-name` to ~`0.7rem` in vapor and let
  it sit on one line (it's already a flex column with the title beneath). Keep
  `.brand-title` ("Lead Product Designer") in `--font-sans` at `--font-size-xs`
  — a second pixel line under the name is too noisy and too wide. Check the
  `1fr auto 1fr` header grid holds at 1024–1280 px with the pixel brand.
- `font-display: swap` is fontsource's default — keep it.

### 4.3 Loading strategy

Ship it globally (`import '@fontsource/press-start-2p'` in
[BaseLayout.astro](../src/layouts/BaseLayout.astro#L4)) — the subset is small
and Astro fingerprints/caches it. If a bundle audit later objects, switch to
lazy injection: append a `<link rel="stylesheet">` to the self-hosted CSS the
first time `syncTheme()` sees `vapor`. Not worth the complexity up front.

---

## 5. Component special-cases

Most components are pure token consumers and need nothing. Exceptions:

| Component | Issue | Fix |
|---|---|---|
| `.cs-card-icon img` / `.cs-journey-stage-icon img` | invert filter is keyed `light` vs `[data-theme="dark"]` ([global.css:1086-1093](../src/styles/global.css#L1086-L1093), [1211-1218](../src/styles/global.css#L1211-L1218)) | add a `html[data-theme="vapor"]` rule — `filter: brightness(0) invert(1)` (white glyph on the lavender disc), or tint the disc cyan via `--color-border-strong` |
| `.display-quote span`, `.cs-card-title span`, `.marker-link`, `.hero-mark span` | inverted-highlight sweep fills with `--color-text`, flips glyphs to `--color-bg` — works, but mono | optional polish: swap the fill for `linear-gradient(90deg,#ff71ce,#01cdfe)` in vapor. Ship mono first (§9.3) |
| `favicon` | static `/favicon.png` ([BaseLayout.astro:38](../src/layouts/BaseLayout.astro#L38)) | optional: JS-swap the `<link>` + add per-theme `<meta name="theme-color">`. Separate task (§9.4) |
| Moneybox hairline ([global.css:647-650](../src/styles/global.css#L647-L650)) | uses `--color-border` | none — pink hairline is fine |
| Case-study screenshots | — | untouched by decision (§1 non-goals) |

---

## 6. Accessibility

- **Switch button** — the "Miami" text label is its own accessible name; verify
  SR announces "Miami, not pressed / pressed".
- **Contrast:** audit `--color-text`, `--color-text-muted`, `.badge`, links and
  `.prose a` against *both* ends of the gradient. Muted text is the tight one —
  keep ≥ 4.5:1 on the lightest stop or lighten the token.
- **Focus rings:** `:focus-visible` outlines already use `--color-border-strong`
  in places ([global.css:997-1005](../src/styles/global.css#L997-L1005)) — cyan
  on purple is strong; confirm the switch buttons show a ring.
- **Keyboard:** tab to the switch, activate with Enter/Space, palm button in tab
  order in both header and overlay.
- `prefers-reduced-motion`: nothing animates in the chosen scope; the
  150–250 ms colour transitions are within reason. Re-check if the grid or a
  gradient cross-fade is added later.
- `prefers-contrast: more`: vapor is inherently lower-contrast but opt-in and
  never a default — no special handling planned. Note for review.

---

## 7. Testing checklist

- [ ] Cold load with `localStorage.theme = 'vapor'` — no flash, correct paint
- [ ] Toggle light→vapor→dark→vapor with a reload between each
- [ ] Every route in vapor: `/`, `/about`, `/work`, all 5 `/work/[slug]`,
      `/writing`, `/writing/[slug]`, `/404`
- [ ] Mobile menu overlay: "Miami" button present, works, keyboard-reachable, SR-announced
- [ ] Header layout holds at 640 / 768 / 1024 / 1280 with the pixel font
- [ ] Display quote on `/` and `/about` reads without a horizontal scrollbar
- [ ] Contrast audit (axe + manual) — body, muted, links, badges, both gradient stops
- [ ] `npm run build` + `npx astro check` clean
- [ ] Font payload delta acceptable in the build output
- [ ] `prefers-reduced-motion` unaffected (no new motion)

---

## 8. Task checklist

- [x] `syncTheme()` + click handler → value-driven (§2.2)
- [x] FOUC guard accepts `vapor` (§2.3)
- [x] "Miami" button in both switch instances (§2.1)
- [x] `html[data-theme="vapor"]` colour block (§3)
- [x] Gradient background on the `html` vapor rule (§3.1)
- [x] `@fontsource/press-start-2p` dependency + import (latin subset)
- [x] `--font-display` token + apply to chrome/display selectors (§4.1)
- [x] Vapor pixel-font hygiene: kill negative tracking, bump leading (§4.2)
- [x] Restyle `.display-quote` + `.display-quote-cite` for vapor (§4.2)
- [x] Pixel `.brand-name`/`.brand-short`, `.brand-title` stays sans; nav shrunk (§4.2)
- [x] Card / journey icon filter + neon disc rule for vapor (§5)
- [x] Neon-gradient highlight sweep (was §9.3) — built
- [x] Per-theme favicon + `theme-color` (was §9.4) — `public/favicon-vapor.svg`
- [x] Revision pass — bright gradient, big rippling quote, bigger palm, white-flash (§10)
- [ ] Contrast audit + token tuning (§6) — pastel palette is first-pass, needs axe pass
- [ ] Tune pixel sizes + ripple intensity against the real site (§9.5, §10.5)
- [ ] Open a PR

---

## 9. Open questions

1. **Font payload** — ship Press Start 2P globally (simple, ~13 KB) or
   lazy-load on first `vapor` activation? Recommendation: global, revisit only
   if a bundle audit objects.
2. **Second font** — add VT323 for small labels/eyebrows where Press Start 2P
   is too chunky, or keep those in DM Sans? Recommendation: DM Sans first, add
   VT323 only if labels look wrong.
3. **Neon-gradient highlight** — upgrade the marker-sweep / display-quote
   highlight to a pink→cyan gradient, or keep the mono flip? Recommendation:
   mono first, gradient as a follow-up polish PR.
4. **Favicon + `theme-color`** — swap per theme via JS? Recommendation:
   nice-to-have, separate small task.
5. **Exact pixel sizes** — the `.display-quote`, `.brand-name` and `.nav-link`
   sizes in §4.2 are starting points; they need tuning against the real header
   at desktop widths.

---

## 10. Revision pass — 2026-09-10

Feedback after the first build. All in `global.css`'s vapor block unless noted.

### 10.1 Brighter background + ink flip

The dark-purple gradient was replaced with a bright pastel sky (later made to
cycle — §10.9):

```css
background: linear-gradient(180deg,
  #f7c8ec 0%, #c9b3f2 26%, #9fd0ee 52%, #b9f0d8 78%, #f2f5c8 100%);
```

That inverts the contrast model, so the token palette flipped to **dark ink on
pastel**: `--color-text: #2b1055`, secondary `#4a2a7e`, muted `#6f5099`, borders
`#d81b9a` / `#7c3aed`, `--color-surface: rgba(255,255,255,0.55)`. `--color-bg`
is `#f7c8ec` (the top stop) — it's the pair colour for `.marker-link`'s hover
flip, now overridden to stay dark ink on the neon sweep. `theme-color` for vapor
is `#f7c8ec` (updated in both the FOUC script and `applyChrome`).

### 10.2 Bigger, rippling display quote  *(intensity bumped in §10.9)*

- Size: `1.4rem` mobile → `2.25rem` at ≥768 (was 0.95 / 1.15).
- **Ripple + hue drift:** `#vapor-ripple` in `BaseLayout.astro` — an
  `feTurbulence` (`fractalNoise`, animated `baseFrequency`) into an
  `feDisplacementMap` (animated `scale`) into an `feColorMatrix type="hueRotate"`
  whose `values` animate over ~8s (SMIL, `calcMode="spline"`). Everything
  time-varying lives *inside* the SVG filter; the CSS `filter` property stays the
  static `url(#vapor-ripple)`. Animating a CSS `filter` list that contains a
  `url()` falls back to a **discrete/stepped** transition — that was the visible
  "flicking" between hues in the first cut.
- **Shimmer:** `vapor-chroma` keyframes on `.display-quote span` — an RGB
  channel-split via animated `text-shadow` (magenta / cyan).
- **Sway:** `vapor-sway` — `skewX` + `rotate` + `scale`, `transform-origin: left
  center`; verified no horizontal overflow across a full cycle on `/` + `/about`.
- All of the above is disabled under `@media (prefers-reduced-motion: reduce)`.
- Continuous SVG-filter animation on a large text block repaints every frame —
  acceptable for an opt-in Easter egg; `will-change: filter, transform` is set.

### 10.3 Bigger palm → superseded by §10.7

Was: `.theme-option--vapor` enlarged to `1.3rem` with a hover wiggle. All of that
was removed when the emoji became a word — see §10.7.

### 10.4 White-flash mode transition

`.theme-flash` (in `global.css`, theme-agnostic): a `position: fixed` white
layer, `z-index: 9999`. `Header.astro`'s `flashToTheme(next)` appends it with
`is-in` (fade up, 200ms), swaps the theme on `animationend`, then
`is-in`→`is-out` (fade away, 650ms) and removes the node. Fires whenever the
switch enters **or leaves** `vapor` (`next === 'vapor' || current === 'vapor'`);
light↔dark stays instant. Skipped entirely under reduced-motion
(`.theme-flash { display: none }` + an early `setTheme` return).

### 10.5 Social links + stat numbers → pixel font

`.social-links a` added to the pixel-font `:is()` list at `0.6rem` — the hero
column, the footer row and the mobile-menu stack all now match the nav chrome.

`.stat-value` (StatTile) also added, at `var(--font-size-lg)` — 4xl pixel would
blow out the 4-up grid. Verified against all four column counts on
`/work/kitchen-sink`, no overflow.

### 10.6 VHS scanlines

`.vhs-overlay` — a viewport-fixed `<div>` in `BaseLayout.astro`, `display: none`
except in vapor. `z-index: -1` puts it above the root gradient but below in-flow
content, so body copy stays perfectly crisp on top.

- `::before` — `repeating-linear-gradient` of 1px deep-purple lines (α 0.10) on a
  3px pitch, `translateY(0 → 3px)` over 2.6s linear infinite (the slow crawl).
- `::after` — a soft white "tracking" band (26vh tall) sweeping top→bottom over
  7.5s.
- Under `prefers-reduced-motion`: the crawl stops (static lines remain), the
  tracking band is hidden.

### 10.7 Emoji → "Miami"

The 🌴 sat awkwardly next to "Light" / "Dark" (odd weight, needed its own sizing
+ hover wiggle + `aria-label`). Replaced with the plain text label **Miami** —
Hotline Miami / Miami Vice / vaporwave, cryptic without being a puzzle. Now it's
an ordinary `.theme-option`: inherits the pixel font + `0.6rem` in vapor, the
active-pill state, and its text is its own accessible name. Removed:
`.theme-option--vapor` (markup + Header `<style>` block), the
`html[data-theme="vapor"] .theme-option--vapor` size override, and the
`aria-label`/`title` on the button.

### 10.8 Body copy → DM Mono

DM Sans read too clean for the mode. Body copy now uses **DM Mono** in vapor —
monospace for the retro/terminal feel, but the same type family so it still
reads as related to light/dark.

- New token `--font-body` (default `var(--font-sans)`); `--font-display` now
  chains off it (`var(--font-body)` default). `html` uses `font-family:
  var(--font-body)`. In vapor: `--font-body` → DM Mono stack, `--font-display` →
  `"Press Start 2P", var(--font-body)`.
- Everything inherits from `html`, so the one token swap covers all body copy;
  the pixel `:is()` list still wins for chrome. `code`/`pre` keep `--font-mono`.
- Only the **400** weight is loaded (`@fontsource/dm-mono/latin-400.css`,
  ~15 KB). Nothing body-side uses a mono 500; `.statement` / `<strong>` (600+)
  faux-bold off 400, which suits the theme. Load `500.css` if that reads crude.
- Vapor font payload is now ~27 KB (pixel 12.5 + mono 15), still shipped
  globally — nudges §9.1 (lazy-load) closer to worth doing.

### 10.9 Cycling gradient sky + "chewed VHS tape" distortion

**Distortion — reworked** (`#vapor-ripple` + `vapor-glitch` / `vapor-chroma`).
The first amped version animated `baseFrequency` and `scale` *smoothly*, which
read as an underwater ripple. Rebuilt so every time-varying value **snaps
between held states** — the feel is a damaged tape, not water:
- `feTurbulence` — `numOctaves` 1, `baseFrequency` fixed at `0.0025 0.09`
  (near-zero X, high Y → the noise is constant along each row, so whole
  horizontal strips shear together = tape tearing). `seed` animates
  `calcMode="discrete"` (1.3s) — the pattern flicks to a new configuration
  (signal dropout).
- `feDisplacementMap` — `scale` animates `calcMode="discrete"` over a 3s list
  that sits at `5` (barely off) and snaps to `15–40` for one ~167ms slot at a
  time.
- `feColorMatrix` `hueRotate` — also `discrete`; colour holds then jumps.
- `vapor-glitch` (renamed from `vapor-sway`, `step-end`) — a short calm beat
  then repeated bursts: horizontal head-tracking tears, a vertical-hold slip,
  more tears. No skew wobble between bursts.
- `vapor-chroma` (`step-end`) — RGB channel-split now comes in short
  interference bursts (±5–12px) rather than a constant shimmer.
- Verified no horizontal overflow across a full cycle on `/` + `/about`.

**Cycling gradient sky** — the single static gradient became `.vapor-bg`, a
`position: fixed` layer at `z-index: -2` (behind `.vhs-overlay` at -1 and all
content). Three curated bright pastel gradients — A on the element, B on
`::before`, C on `::after` — crossfade their opacity on a staggered 36s
`ease-in-out` loop (A → B → C → A). Dark ink stays ≥8:1 on every stop of all
three. Animations off under `prefers-reduced-motion` (falls back to gradient A).
The `background` was removed from the `html[data-theme="vapor"]` rule;
`--color-bg` stays as the solid fallback behind the layer.

### 10.10 Still open

- Contrast/axe pass on the pastel palette — muted `#6f5099` on the lightest
  stop (`#f2f5c8`) is the tight pair; verify ≥4.5:1.
- Distortion + gradient-cycle intensity/speed are judgement calls — all the
  knobs are in one filter + a handful of keyframes; dial to taste on the real
  site.
- Pixel-size tuning (§9.5) still outstanding.
- DM Mono body: check case-study prose length / readability on the real site;
  consider a small size or line-height nudge for vapor if it reads loose.
