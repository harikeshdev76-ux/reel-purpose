import { getContent, c } from "@/lib/content";
import Footer from "@/components/layout/Footer";

// Server wrapper: fetches editable footer content and passes it to the client
// Footer (which needs usePathname to hide itself on /admin and /vendor).
export default async function SiteFooter() {
  const content = await getContent(["footer.tagline", "footer.description"]);

  return (
    <Footer
      tagline={c(content, "footer.tagline", "Built In Florida. Made For Life.")}
      description={c(
        content,
        "footer.description",
        "Premium fishing apparel inspired by faith, family, and the pursuit of unforgettable days on the water.",
      )}
    />
  );
}
