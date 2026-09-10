# Case-study components

**Status:** In progress · **Owner:** James S-C · **Created:** 2026-09-08

The building blocks for case studies in `src/content/projects/*.mdx`. Catalogued from the six
live case studies on james-sc.co.uk + the About page, proven on the hidden
[`/work/kitchen-sink`](../src/content/projects/kitchen-sink.mdx) page, styled in
[`global.css`](../src/styles/global.css) under **"Case Study Components"**.

Migration is one study at a time. `tide-portal-design-system` is the first; the rest still use
the raw-markdown hacks until migrated.

---

## Authoring rules

### 1. Rich text goes in a slot, blank-line delimited

MDX does **not** parse markdown inside a raw HTML block. Every component that takes prose gives
it a `<slot>`, and children must be separated from the tags by blank lines:

```mdx
<LabelledBlock label="The Brief">

Redesign Tide's **core** domestic payment experience for UK SMEs.

</LabelledBlock>
```

Not `<LabelledBlock label="The Brief">Redesign Tide's **core**…</LabelledBlock>` — the `**` would
render literally.

### 2. Sections — number band + About-style label column

Wrap each top-level section in `<Section>`. The `number`/`eyebrow` kicker renders as a
full-width band (with a provisional bottom rule) above a two-column row: the title hangs in a
left label column, the content flows in a `--prose-max` prose column beside it (all stacked on
mobile). The band sitting on its own row lets the title top-align with the body copy.

```mdx
<Section number="01" title="Context">

<LabelledBlock label="The Brief">
…
</LabelledBlock>

</Section>
```

Subsection headings (`###`, `####`) flow inside the prose column as normal markdown.

### 3. Width tiers — text stays narrow, only imagery goes wide

Everything sits in the `--prose-max` (720px) column by default. Imagery — and only imagery
(`Figure`, `ImageGrid`) — can break out via a `width` prop:

| `width` | Rendered | Use for |
|---|---|---|
| `"prose"` *(default)* | 720px, inline with text | everything — quotes, labelled blocks, journeys, cards, stat grids, small diagrams |
| `"wide"` *(default for `Figure` / `ImageGrid`)* | fills the whole section (label column + prose), same measure as the header and hero | screenshots, galleries |

There is no full-bleed tier — `heroLayout` is `"inset"` or `"wide"`, and `Figure` / `ImageGrid`
take `"prose"` or `"wide"`. A `wide` element **must be a direct child of the `<Section>` body**
(a top-level tag between the `<Section>` tags), not nested inside another component, or the
breakout maths won't resolve.

### 3. Images stay as markdown

Components that show images take the image as a **slotted markdown image** (`![alt](./x.png)`),
never an `import`. That keeps the `astro:assets` optimisation pipeline working with no import
boilerplate:

```mdx
<Figure caption="Team whiteboard from the vision workshop">

![Team mapping the target audience on a whiteboard](./tide-payments/Payments-Image-1.png)

</Figure>
```

### 4. Dark mode is automatic

Every component styles with semantic tokens (`--color-text`, `--color-border`, …). Never write a
hex value in component CSS. Check every new component at `/work/kitchen-sink` in both themes.

---

## Component reference

> Snippets are updated to the shipped API as each component lands.

### `Section`
Top-level section wrapper — label column (eyebrow/number + title) beside a prose column.
`number` renders as "01 —"; `eyebrow` is a plain text kicker. Everything for the section goes
in the slot.
```mdx
<Section number="01" title="Context">

… labelled blocks, prose, components …

</Section>

<Section eyebrow="Research" title="Survey">
…
</Section>
```

### `Lead`
Larger standfirst paragraph. Reuses `.statement` type without the em-dash. `width="prose"`.
```mdx
<Lead>

I felt it was important to align the project to vision-based objectives, not just deliverables.

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
`PullQuote` — a pulled sentence or client quote, in the large testimonial type treatment.
Attribution is optional: add `cite` and/or `role`, or omit both for a bare pulled line.
`QuoteStack` wraps a run of research verbatims, set in italic — write the quote marks into the
text itself (curly `“ ”`), not as styling.
```mdx
<PullQuote>

This cross-platform foundation let us ship a single library with 60% fewer components.

</PullQuote>

<PullQuote cite="Head of Product (Payments)" role="Dojo">

That page looks really cool — the previous version didn't inspire enough excitement.

</PullQuote>

<QuoteStack>

> “It's very transparent and clear.”

> “Deciding on the percentage is going to slow me down slightly.”

</QuoteStack>
```

### `StatGrid` / `StatTile`
Outcome metrics. `columns` is optional — omit for the current responsive 2→4 behaviour.
```mdx
<StatGrid columns={3}>
  <StatTile value="94%">interacted with the design system often</StatTile>
  <StatTile value="49%">knew the component update process</StatTile>
  <StatTile value="88%">felt the design system's purpose was clear</StatTile>
</StatGrid>
```

### `Figure` / `ImageGrid` / `BeforeAfter`
`Figure` — one image, optional caption, `width` tier. `ImageGrid` — images in a grid (`cols` 1–4; `cols={1}` is a single stacked column, pair with `width="prose"`).
`BeforeAfter` — a labelled pair. Defaults to `mode="slider"`: the two images are overlaid
with a draggable divider (pointer drag or keyboard — it's a range input under the hood), so
the pair needs **identical dimensions**. Pass `mode="split"` for the old side-by-side layout,
which tolerates mismatched sizes.
```mdx
<Figure caption="Payment screens on Starling, Dave, Marcus and Betterment" width="wide">

![Comparison of four competitor payment screens](./tide-payments/Payments-Image-3.png)

</Figure>

<ImageGrid cols={3}>

![Zeroheight doc page 1](./tide-portal-design-system/zeroheight-example-1-1024x640.png)
![Zeroheight doc page 2](./tide-portal-design-system/zeroheight-example-4-1024x640.png)
![Zeroheight doc page 3](./tide-portal-design-system/zeroheight-example-2-1-1024x640.png)

</ImageGrid>

<BeforeAfter beforeLabel="Before" afterLabel="After">
{/* add mode="split" for a static side-by-side pair */}
<Fragment slot="before">

![Old form](./application-youlend/financial-info-before.png)

</Fragment>
<Fragment slot="after">

![New form](./application-youlend/financial-info-after.png)

</Fragment>
</BeforeAfter>
```

Named slots that carry a markdown image (`before`/`after` here, `icon` on `Stage` / `Card`)
need the **same blank-line delimiting** inside the `<Fragment>` as any other slot.

### `Journey` / `Stage`
Multi-column block, no background, prose width — each `<Stage>` is an icon → title → subtitle
stack. Named for its usual job: the ordered steps of a journey. `columns` is 2–4 (default 2
from 640px; 3/4 kick in from 900px). Omit `title` for an icon-only "objectives" list.
```mdx
<Journey columns={4}>

<Stage title="Time estimates">
<Fragment slot="icon">

![](./tide-portal-design-system/time-estimates.png)

</Fragment>

4 weeks discovery, 8 weeks design, split into 4×2-week blocks.

</Stage>

</Journey>
```

### `CardGrid` / `Card`
A bordered card, prose width — every part optional: `icon` slot, `title` prop, default slot
(body), `footer` slot. One component for design insights (body + an "Idea:" footer), grouped
takeaways, or any grid of small blocks. `columns` is 2–4 (default 2 from 640px; 3/4 from 900px).
Equal-height cards in a row pin the footer to the base.
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
  tools={["Figma", "Figjam", "Zeroheight", "Confluence", "Invision"]}
  date="Summer 2020 – Apr 2022"
  team={["Oscar Wong, Lead UI Designer", "Liam Thomas, Product Designer"]}
/>
```

### `SectionDivider`
`<hr>` rule for the rare case you want a divider *inside* a section body. Sections themselves
are separated by whitespace, not rules.

---

## Migration map — `tide-portal-design-system.mdx`

Every `## Section` becomes a `<Section number="NN" title="…">` wrapping that section's content.
Within it:

| Current markup | Becomes |
|---|---|
| `### The Brief / Challenge / Win` | 3× `<LabelledBlock label="…">` |
| `### Survey` + `<StatGrid>` (6 tiles) | `### Survey` + `<StatGrid columns={3}>` |
| `### Proposal…` + 4× `![icon]()+####+line` | `<Journey>` + 4× `<Stage>` |
| `### Objectives` + para + image | `<Lead>` + `<Figure>` |
| `### Audit` + 4 stacked images | `<ImageGrid cols={2}>` |
| `### Cross-platform approach` + `>` quote | `<PullQuote>` (no attribution) |
| `### Creating components` + 2 images | `<ImageGrid cols={2}>` |
| IA charts + int-model images + `#### Structural model…` | `<ImageGrid cols={2}>` + `#### …` + `<Figure caption>` |
| `## Documentation` + 6 images | `<ImageGrid cols={3}>` |
| `## Maintenance…` + `>` quote | `<PullQuote>` |
| `## Credits` `**My role**` + `<br>` lines | `<Section title="Credits">` wrapping `<Credits role tools date team />` |
