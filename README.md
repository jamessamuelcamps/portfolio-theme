# Product Design Portfolio · James Samuel Camps

A minimalist, high-performance product design portfolio and writing platform built with [Astro](https://astro.build) and Vanilla CSS. Designed for rapid publishing of design case studies and articles via Astro Content Collections and MDX.

## 📁 Architecture & Structure

```text
portfolio/
├── src/
│   ├── components/       # UI components (Header, Footer, Cards, Callout)
│   ├── content/
│   │   ├── projects/     # Case studies (Markdown / MDX)
│   │   └── writing/      # Articles, essays, and notes
│   ├── layouts/          # Page shells (BaseLayout, ProjectLayout, WritingLayout)
│   ├── pages/            # File-based routing (/, /work, /writing, 404)
│   ├── styles/           # Global styles and design tokens (global.css)
│   └── content.config.ts # Type-safe collection schemas (Zod + Glob loader)
├── public/               # Static assets (favicons, images, resume PDF)
├── astro.config.mjs      # Astro configuration (MDX, Sitemap, static output)
└── package.json
```

## ✍️ Publishing Content

### Adding a Case Study (`projects`)
Create a new `.md` or `.mdx` file in `src/content/projects/my-case-study.mdx`:

```markdown
---
title: "Redesigning Checkout for Mobile"
description: "Reducing friction and boosting conversion on mobile payments."
publishDate: 2026-03-01
client: "FinTech Corp"
role: "Lead Product Designer"
timeline: "3 Months"
tags: ["Mobile UX", "Payments", "Design Systems"]
featured: true
order: 1
---
import Callout from '../../components/Callout.astro';

## The Problem
Write your case study here...

<Callout type="tip" title="Key Finding">
User research showed an 18% improvement with single-tap confirmation.
</Callout>
```

### Adding an Article (`writing`)
Create a new `.md` file in `src/content/writing/my-article.md`:

```markdown
---
title: "The Role of Micro-Interactions in Design"
description: "Why subtle feedback loops matter."
publishDate: 2026-03-01
tags: ["Product Design", "UI"]
---

Your article content goes here...
```

## 🎨 Theme & Styling

The site uses modern **Vanilla CSS** with a design token system located in `src/styles/global.css`.

- **CSS Variables**: Customize colors, typography scales, container widths, and dark mode overrides under `:root`.
- **Prose Styling**: Typography styles for case studies and articles are encapsulated under `.prose`.
- **Component Scoping**: Astro component styles are scoped by default within `<style>` tags in each component.

## 🚀 Development Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local dev server at `http://localhost:4321` |
| `npm run build` | Builds production-ready static site into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npx astro check` | Runs TypeScript and content collection diagnostics |

## 🌐 Deploying to Dreamhost

This site is configured for **static generation** (`output: 'static'`), producing pure HTML, CSS, and JS in the `dist/` directory.

### Option 1: Dreamhost Web Directory
1. Run the build:
   ```bash
   npm run build
   ```
2. Set your Dreamhost domain's **Web Directory** in the Dreamhost Panel to point to the `dist` folder:
   - Path: `/home/username/yourdomain.com/dist`
3. Push your repository to Dreamhost via Git deployment, or upload the contents of `dist/` directly into your web root via SFTP / rsync.

### Option 2: Dreamhost Custom .htaccess (Optional)
If desired, place an `.htaccess` file inside `public/.htaccess` to manage clean redirects, caching, or custom 404 behavior on Apache.
