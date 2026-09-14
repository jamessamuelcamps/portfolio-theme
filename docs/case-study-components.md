# Case-study components

The building blocks for case studies in `src/content/projects/*.mdx`. Every
one of them is demonstrated in context on
[`/work/component-showcase`](../src/content/projects/component-showcase.mdx)
(source: `src/content/projects/component-showcase.mdx`) — the fastest way to
learn this reference is to open that file side by side with the rendered
page and copy whichever block you need. Styled in
[`global.css`](../src/styles/global.css) under **"Case Study Components"**.

---

## Authoring rules

### 1. Rich text goes in a slot, blank-line delimited

MDX does **not** parse markdown inside a raw HTML block. Every component that
takes prose gives it a `<slot>`, and children must be separated from the tags
by blank lines:

```mdx
<LabelledBlock label="The Brief">

Redesign the **core** checkout flow for returning customers.

</LabelledBlock>
```

Not `<LabelledBlock label="The Brief">Redesign the **core**…</LabelledBlock>`
— the `**` would render literally.

### 2. Sections — number band + About-style label column

Wrap each top-level section in `<Section>`. The `number`/`eyebrow` kicker
renders as a full-width band above a two-column row: the title hangs in a
left label column, the content flows in a `--prose-max` prose column beside
it (stacked on mobile).

```mdx
<Section number="01" title="Context">

<LabelledBlock label="The Brief">
…
</LabelledBlock>

</Section>
```

Subsection headings (`###`, `####`) flow inside the prose column as normal
markdown.

### 3. Width tiers — text stays narrow, only imagery goes wide

Everything sits in the `--prose-max` (720px) column by default. Imagery —
and only imagery (`Figure`, `ImageGrid`) — can break out via a `width` prop:

| `width` | Rendered | Use for |
|---|---|---|
| `"prose"` *(default)* | 720px, inline with text | everything — quotes, labelled blocks, journeys, cards, stat grids, small diagrams |
| `"wide"` *(default for `Figure` / `ImageGrid`)* | fills the whole section (label column + prose), same measure as the header and hero | screenshots, galleries |

A `wide` element **must be a direct child of the `<Section>` body** (a
top-level tag between the `<Section>` tags), not nested inside another
component, or the breakout maths won't resolve.

### 4. Images stay as markdown

Components that show images take the image as a **slotted markdown image**
(`![alt](./x.png)`), never an `import`. That keeps the `astro:assets`
optimisation pipeline working with no import boilerplate:

```mdx
<Figure caption="Team whiteboard from the vision workshop">

![Team mapping the target audience on a whiteboard](./my-project/workshop.jpg)

</Figure>
```

### 5. Dark mode is automatic

Every component styles with semantic tokens (`--color-text`,
`--color-border`, …). Never write a hex value in component CSS. Check every
new component at `/work/component-showcase` in both themes.

---

## Component reference

### `Section`
Top-level section wrapper — label column (eyebrow/number + title) beside a
prose column. `number` renders as "01 —"; `eyebrow` is a plain text kicker.
Everything for the section goes in the slot.
```mdx
<Section number="01" title="Context">

… labelled blocks, prose, components …

</Section>

<Section eyebrow="Research" title="Survey">
…
</Section>
```

### `Lead`
Larger standfirst paragraph. Reuses `.statement` type without the em-dash.
```mdx
<Lead>

One or two sentences summarising the project.

</Lead>
```

### `LabelledBlock`
Bold label + body. Stack three for a "Context" section.
```mdx
<LabelledBlock label="The Architectural Challenge">

Consolidating disjointed platform libraries into a single source of truth.

</LabelledBlock>
```

### `PullQuote` / `QuoteStack`
`PullQuote` — a pulled sentence or client quote, in the large testimonial
type treatment. Attribution is optional: add `cite` and/or `role`, or omit
both for a bare pulled line. `QuoteStack` wraps a run of research verbatims,
set in italic — write the quote marks into the text itself (curly `“ ”`),
not as styling.
```mdx
<PullQuote>

This cross-platform foundation let us ship a single library with 60% fewer components.

</PullQuote>

<PullQuote cite="Head of Product" role="A fictional company">

That page looks really cool — the previous version didn't inspire enough excitement.

</PullQuote>

<QuoteStack>

> “It's very transparent and clear.”

> “Deciding on the percentage is going to slow me down slightly.”

</QuoteStack>
```

### `StatGrid` / `StatTile`
Outcome metrics. `columns` is optional — omit for the current responsive
2→4 behaviour.
```mdx
<StatGrid columns={3}>
  <StatTile value="94%">interacted with the design system often</StatTile>
  <StatTile value="49%">knew the component update process</StatTile>
  <StatTile value="88%">felt the design system's purpose was clear</StatTile>
</StatGrid>
```

### `Figure` / `ImageGrid` / `BeforeAfter`
`Figure` — one image, optional caption, `width` tier. `ImageGrid` — images
in a grid (`cols` 1–4; `cols={1}` is a single stacked column, pair with
`width="prose"`). `BeforeAfter` — a labelled pair. Defaults to
`mode="slider"`: the two images are overlaid with a draggable divider
(pointer drag or keyboard — it's a range input under the hood), so the pair
needs **identical dimensions**. Pass `mode="split"` for the old side-by-side
layout, which tolerates mismatched sizes.
```mdx
<Figure caption="Competitor screens, for comparison" width="wide">

![Comparison of four competitor screens](./my-project/competitors.jpg)

</Figure>

<ImageGrid cols={3}>

![Doc page 1](./my-project/doc-1.png)
![Doc page 2](./my-project/doc-2.png)
![Doc page 3](./my-project/doc-3.png)

</ImageGrid>

<BeforeAfter beforeLabel="Before" afterLabel="After">
{/* add mode="split" for a static side-by-side pair */}
<Fragment slot="before">

![Old form](./my-project/before.png)

</Fragment>
<Fragment slot="after">

![New form](./my-project/after.png)

</Fragment>
</BeforeAfter>
```

Named slots that carry a markdown image (`before`/`after` here, `icon` on
`Stage` / `Card`) need the **same blank-line delimiting** inside the
`<Fragment>` as any other slot.

### `Journey` / `Stage`
Multi-column block, no background, prose width — each `<Stage>` is an icon →
title → subtitle stack. Named for its usual job: the ordered steps of a
journey. `columns` is 2–4 (default 2 from 640px; 3/4 kick in from 900px).
Omit `title` for an icon-only "objectives" list.
```mdx
<Journey columns={4}>

<Stage title="Time estimates">
<Fragment slot="icon">

![](./my-project/icon-time.svg)

</Fragment>

4 weeks discovery, 8 weeks design, split into 4×2-week blocks.

</Stage>

</Journey>
```

### `CardGrid` / `Card`
A bordered card, prose width — every part optional: `icon` slot, `title`
prop, default slot (body), `footer` slot. One component for design
insights (body + an "Idea:" footer), grouped takeaways, or any grid of small
blocks. `columns` is 2–4 (default 2 from 640px; 3/4 from 900px). Equal-height
cards in a row pin the footer to the base.
```mdx
<CardGrid columns={2}>

<Card title="Recipients">

Of payments by active customers, 46% went to one of the last three recipients.

<Fragment slot="footer">

**Idea:** Provide a "Recent" section in the recipients list.

</Fragment>

</Card>

</CardGrid>
```

### `Credits`
Closing metadata in a two-column, strokeless grid (`.meta-grid`).
```mdx
<Credits
  role="Design / Strategic Lead"
  tools={["Figma", "Figjam", "Zeroheight", "Confluence"]}
  date="Spring 2025 – Winter 2025"
  team={["Jordan Lee, Lead UI Designer", "Taylor Reed, Product Designer"]}
/>
```

### `SectionDivider`
`<hr>` rule for the rare case you want a divider *inside* a section body.
Sections themselves are separated by whitespace, not rules.
