import { prisma } from "@/lib/prisma";
import CMSSection from "@/components/admin/CMSSection";
import CMSFieldEditor from "@/components/admin/CMSFieldEditor";

export const dynamic = "force-dynamic";

// Display order for the grouped sections.
const SECTION_ORDER = [
  "Homepage Hero",
  "Homepage Collections",
  "Homepage Purpose",
  "Homepage Values",
  "Homepage Newsletter",
  "About Page",
  "Product Page",
  "Footer",
];

export default async function CMSPage() {
  const rows = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });

  const bySection = new Map<string, typeof rows>();
  for (const row of rows) {
    const arr = bySection.get(row.section) ?? [];
    arr.push(row);
    bySection.set(row.section, arr);
  }

  const sections = Array.from(bySection.keys()).sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a);
    const ib = SECTION_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return (
    <div>
      <h1 className="mb-2 font-display text-4xl text-[#f0e6d3]">
        Content Management
      </h1>
      <p className="mb-8 text-sm text-[rgba(240,230,211,0.5)]">
        Edit text and images across the site. Changes go live immediately.
      </p>

      {sections.map((section) => {
        const fields = bySection.get(section) ?? [];
        return (
          <CMSSection key={section} title={section} count={fields.length}>
            {fields.map((field) => (
              <CMSFieldEditor
                key={field.key}
                contentKey={field.key}
                label={field.label}
                value={field.value}
                type={field.type}
              />
            ))}
          </CMSSection>
        );
      })}
    </div>
  );
}
