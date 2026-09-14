# Portfolio Theme

A minimal, black-and-white portfolio site for designers — case studies,
an about page, and a writing/blog section. Built with [Astro](https://astro.build),
no framework knowledge required to use it.

This guide assumes you haven't used a tool like this before. If you get stuck,
every step below tells you exactly what to type and where.

## What you get

- A one-page homepage: a big pull-quote, a short bio, your socials
- A **Projects** section for case studies — with a big kit of ready-made
  content blocks (stat grids, quotes, before/after image sliders, image
  grids, icon-and-text "journey" steps, bordered cards) so you can lay out a
  case study without writing any code
- An **About** page and a **Writing** section for articles/notes
- Light and dark mode, switchable in the header, remembered on return visits
- One file to edit for your name, role, socials and homepage copy

Look at **Projects → Component Showcase** once the site is running — it's a
single page that shows every content block this theme has, in order, with
the markup you'd copy to use it. Keep it, delete it, or use it purely as a
reference; it's hidden from search engines either way you leave it (set
`draft: true` in its frontmatter to also hide it from your Projects list).

---

## 1. Before you start

You need two things installed on your computer:

1. **[Node.js](https://nodejs.org)** — download the "LTS" version and run the
   installer. This is what runs the site on your computer while you work on
   it.
2. **A code editor** — [VS Code](https://code.visualstudio.com) is free and
   works well. You'll use it to edit text files; nothing more advanced.

You'll also use the **terminal** (called "Terminal" on a Mac, "Command
Prompt" or "PowerShell" on Windows — or just use the one built into VS Code:
menu **Terminal → New Terminal**). Every command below is something you type
into that window, then press Enter.

## 2. Get the site running on your computer

If you got this project as a `.zip` file, unzip it first. If you used
GitHub's **"Use this template"** button, clone the new repository it created
for you. Either way, open a terminal **inside that project folder** — in VS
Code, opening the folder (**File → Open Folder…**) and using its built-in
terminal does this automatically — then run:

```
npm install
```

This downloads everything the site needs to run (it only takes a minute, and
you only need to do it once, or again later if you pull down updates). Then:

```
npm run dev
```

This starts the site on your own computer. The terminal will print a web
address, usually **http://localhost:4321** — open that in your browser. The
site is now running live: as you edit and save files, it updates
automatically. Press `Ctrl+C` in the terminal when you want to stop it.

## 3. Make it yours

### Your name, role and links

Open **`src/config.ts`**. Everything in here shows up somewhere on the site —
edit the values on the right of each `:`, leave everything else alone:

```ts
export const site = {
  name: 'Your Name',
  role: 'Product Designer',
  url: 'https://example.com',       // your eventual domain
  email: 'you@example.com',
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/you' },
    { label: 'GitHub', href: 'https://github.com/you' },
  ],
  hero: {
    availability: 'Available for new work. Let’s talk →',
    quote: 'A short, sharp line that sets the tone for the whole site.',
    cite: '— Someone worth quoting',
  },
  // ...
};
```

Save the file and check your browser — the header, footer and homepage
should already show your details.

### Your favicon (the little icon in the browser tab)

Replace the three files in `public/` — `favicon.svg`, `favicon.png` and
`favicon.ico` — with your own. They can be different images if you like, but
keeping them all the same icon at different sizes is simplest. Any online
"favicon generator" can produce all three from one image.

### The About page

Open **`src/pages/about.astro`**. Everything between the `<h1>` near the top
and the closing `</BaseLayout>` near the bottom is real, visible text —
search for placeholder sentences like *"A short story about how you got into
this line of work…"* and replace them with your own. Leave anything that
starts with `<` alone (that's structure, not content) unless you're
comfortable editing it.

## 4. Add a case study

Look inside **`src/content/projects/`** — that's where each case study
lives, one file per project. The theme's own `component-showcase.mdx` in
there is both a working example and a catalogue of every block you can use.
For a written reference of every component and prop, see
[`docs/case-study-components.md`](docs/case-study-components.md).

To start a new one:

1. Duplicate `component-showcase.mdx`, rename the copy (e.g.
   `my-first-project.mdx`), and make a matching folder for its images (e.g.
   `my-first-project/`) next to it.
2. Edit the frontmatter at the top of the file (the part between the `---`
   lines):

   | Field | What it does |
   |---|---|
   | `title` | Shown as the page title. Convention here is `"Feature • Client"`. |
   | `description` | A one-line summary, shown under the title and used for link previews. |
   | `publishDate` | Controls sort order alongside `order` below. |
   | `client`, `role`, `timeline` | Small credit line details (all optional). |
   | `heroImage` | Path to a hero image in your project's folder, e.g. `"./my-first-project/hero.jpg"`. Optional. |
   | `heroImageAlt` | Alt text for that image (accessibility + SEO). |
   | `heroLayout` | `"inset"` (narrower) or `"wide"` (fills the section). |
   | `tags` | A list shown as small badges, e.g. `["Mobile", "Fintech"]`. |
   | `order` | Lower numbers show first on the Projects page. |
   | `draft` | Set to `true` to hide a study from the Projects list and search engines while you're still writing it. |

3. Delete everything below the second `---` and write your case study,
   pulling in whichever components you need — copy the examples straight out
   of `component-showcase.mdx`. A minimal one might look like:

   ```mdx
   import Section from '../../components/Section.astro';
   import Lead from '../../components/Lead.astro';

   <Lead>

   One or two sentences summarising the project — this sits at the top of
   the page in a larger, lighter style.

   </Lead>

   <Section number="01" title="The problem">

   Ordinary paragraphs and images can go directly here too — you don't have
   to use a component for everything.

   </Section>
   ```

4. Drop your images into the project's folder and reference them with a
   relative path, e.g. `![Alt text](./my-first-project/screenshot.png)`.
   Astro automatically resizes and optimises them for you — just use normal
   `.jpg`/`.png`/`.svg` files, no extra steps needed.

Save the file — a new card appears on `/work` automatically, no other setup
required.

## 5. Add a writing post

Same idea, in **`src/content/writing/`**. Duplicate `hello-world.mdx`,
rename it, and edit its frontmatter (`title`, `description`, `publishDate`,
`tags`) and body. Writing posts are plain prose — headings, paragraphs,
lists, blockquotes, links — no case-study components needed here.

## 6. Colours, fonts and dark mode

Every colour and size in the site is a **token** — a named value — defined
once at the top of **`src/styles/global.css`**, under `:root`. Change a
token there and it updates everywhere it's used:

```css
:root {
  --color-bg: var(--white);      /* page background */
  --color-text: var(--black);    /* body text */
  --font-sans: "DM Sans Variable", ...;
  --wide-max: 1140px;            /* widest a page section gets */
}
```

Dark mode is a second set of the same token names, applied when the visitor
switches themes (or their device prefers dark). Look just below the `:root`
block for `html[data-theme="dark"]` to see (or change) the dark palette.

## 7. Put it online

This site builds to plain HTML/CSS/JS files — it'll run on almost any host.
Two easy options if you've never deployed a site before:

- **[Netlify](https://netlify.com)** or **[Vercel](https://vercel.com)** —
  create a free account, connect your GitHub repository, and either one
  detects Astro automatically. Every time you push a change, your live site
  updates on its own.
- **Any other static host** (GitHub Pages, Cloudflare Pages, a regular web
  host) — run `npm run build`, then upload the contents of the `dist/`
  folder it creates.

Before deploying, set `url` in `src/config.ts` **and** `site` in
`astro.config.mjs` to your real domain (both need to match).

## 8. If something looks wrong

- **The site says something's missing after you pulled new changes down** —
  stop the dev server (`Ctrl+C`), run `npm install` again in case a
  dependency changed, then `npm run dev` again.
- **An image doesn't show up** — check the path in your `.mdx` file starts
  with `./` and matches the image's actual filename and folder exactly
  (this is case-sensitive once deployed, even if it isn't on your own
  computer).
- **You want to check the whole site builds correctly** before deploying,
  run `npm run build` — it'll list every error with the file and line it's
  in.

---

Built with [Astro](https://astro.build). MIT-licensed — see [LICENSE](LICENSE).
Originally extracted from [james-sc.co.uk](https://james-sc.co.uk).
