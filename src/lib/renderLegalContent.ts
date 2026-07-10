export type ParsedSection = { title: string; content: string };

/**
 * Parse CMS legal-page content into sections. Lines starting with "## " begin a
 * new section (the text after ## is the title); everything until the next "## "
 * is that section's body. Text before the first "## " is ignored.
 */
export function parseLegalContent(raw: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of raw.split("\n")) {
    const match = line.match(/^##\s+(.*)$/);
    if (match) {
      if (current) {
        sections.push({ title: current.title, content: current.content.trim() });
      }
      current = { title: match[1].trim(), content: "" };
    } else if (current) {
      current.content += `${line}\n`;
    }
  }
  if (current) {
    sections.push({ title: current.title, content: current.content.trim() });
  }

  return sections;
}
