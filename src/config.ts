/**
 * Site identity — the one file to edit to make this theme yours.
 *
 * Everything here is read by layouts, components and pages instead of
 * hard-coded strings. Swap the values below, replace the favicon files in
 * `public/`, and you're most of the way to a personalised site.
 */
export const site = {
  /** Your full name — used in the header, footer, and page-title suffixes. */
  name: 'Your Name',
  /** Your role/title — shown under your name in the header and hero. */
  role: 'Product Designer',
  /** Deployed URL, no trailing slash. Also set `site` in astro.config.mjs to match. */
  url: 'https://example.com',
  /** Default meta description, used as a fallback on pages that don't set their own. */
  description: 'Product design portfolio — case studies and writing.',
  /** Contact email. Assembled client-side so it never sits in the static HTML as plain text. */
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
  /** Homepage hero. */
  hero: {
    availability: 'Available for new work. Let’s talk →',
    quote: 'A short, sharp line that sets the tone for the whole site.',
    cite: '— Someone worth quoting',
  },
  /**
   * A small credit link on the homepage, pointing back at wherever you got
   * this theme. Set to `null` to hide it.
   */
  themeCredit: null as { label: string; href: string } | null,
} as const;
