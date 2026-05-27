export function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      // Remove accents/diacritics
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      // Replace non-alphanumeric with hyphen
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

