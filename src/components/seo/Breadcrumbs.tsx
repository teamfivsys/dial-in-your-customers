import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

export interface Crumb {
  name: string;
  /** Absolute path, e.g. "/business-directory-kochi". Omit for the current page. */
  path?: string;
}

const SITE = "https://kdial.in";

/** Visible breadcrumb trail + matching BreadcrumbList structured data. */
const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: `${SITE}${c.path === "/" ? "" : c.path}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-muted-foreground">
          {trail.map((c, i) => (
            <li key={`${c.name}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden="true" />}
              {c.path ? (
                <Link to={c.path} className="hover:text-primary transition-colors">
                  {c.name}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{c.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;