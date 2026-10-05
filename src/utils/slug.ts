/** URL-fragment slug for a heading: "Research & Discovery" → "research-discovery". */
export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/&[a-z]+;|&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
