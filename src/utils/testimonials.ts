/**
 * The display-quote pool, parsed from src/content/testimonials.md at build
 * time. Each quote is a numbered line under a `## Theme` heading:
 *
 *   1. "Quote text." — Name, Role, Company
 *
 * Bullets and prose (sources, Notes, Removed) are ignored. A numbered line
 * that doesn't fit the shape fails the build rather than silently dropping
 * a quote.
 */
import raw from '../content/testimonials.md?raw';

export type QuoteLength = 'short' | 'medium' | 'long';

export interface Testimonial {
  quote: string;
  cite: string;
  /** The `## heading` the quote sits under; the shuffle never deals two
      from the same theme in a row. */
  theme: string;
  /** The name before the first comma in the attribution; the shuffle never
      deals two from the same person in a row. */
  author: string;
  /** Size tier for the display quote — longer quotes step the type down so
      they still fit the single-screen hero. */
  length: QuoteLength;
}

// Character-count breakpoints for the size tiers (see .display-quote in global.css).
const MEDIUM_FROM = 110;
const LONG_FROM = 170;

/** Straight quotes/apostrophes → typographic, to match the rest of the copy. */
function smarten(text: string): string {
  return text.replace(/(\w)'/g, '$1’').replace(/'/g, '‘');
}

function lengthOf(quote: string): QuoteLength {
  if (quote.length >= LONG_FROM) return 'long';
  if (quote.length >= MEDIUM_FROM) return 'medium';
  return 'short';
}

function parse(source: string): Testimonial[] {
  const out: Testimonial[] = [];
  let theme = '';

  // Split on CRLF too: a Windows checkout leaves a trailing \r, which `.`
  // in the entry pattern won't match.
  for (const line of source.replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)/);
    if (heading) {
      theme = heading[1].trim();
      continue;
    }
    if (!/^\d+\.\s/.test(line)) continue;

    const entry = line.match(/^\d+\.\s+["“](.+)["”]\s+[—–]\s+(.+)$/);
    if (!entry || !theme) {
      throw new Error(`testimonials.md: couldn't parse "${line.slice(0, 60)}…"`);
    }
    const [, quote, cite] = entry;
    out.push({
      quote: smarten(quote.trim()),
      cite: `— ${smarten(cite.trim())}`,
      theme,
      author: cite.split(',')[0].trim(),
      length: lengthOf(quote),
    });
  }

  if (!out.length) throw new Error('testimonials.md: no quotes found');
  return out;
}

export const testimonials = parse(raw);
