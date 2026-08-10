// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { keralaCities } from "../src/data/cities";
import { businessCategories } from "../src/data/categories";
import { blogPosts } from "../src/data/blogPosts";
import { directoryLocations } from "../src/data/directoryLocations";
import { approvedBusinesses, isCityCategoryIndexable } from "../src/data/businesses";

const BASE_URL = "https://kdial.in";

interface Entry {
  path: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
}

const entries: Entry[] = [
  {
    path: "",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/blog",
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    path: "/directory",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/categories",
    changefreq: "weekly",
    priority: "0.8",
  },

  // SEO landing pages: /business-directory-{location}
  ...directoryLocations.map((l) => ({
    path: `/business-directory-${l.slug}`,
    changefreq: "weekly",
    priority: l.slug === "kerala" ? "1.0" : "0.9",
  })),

  // Statewide category hubs
  ...businessCategories.map((c) => ({
    path: `/categories/${c.slug}`,
    changefreq: "weekly",
    priority: "0.8",
  })),

  ...blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),

  ...keralaCities.map((c) => ({
    path: `/${c.slug}`,
    changefreq: "weekly",
    priority: "0.8",
  })),

  // City + category pages are only included once they hold real approved
  // listings — empty pages are noindex and stay out of the sitemap.
  ...keralaCities.flatMap((c) =>
    businessCategories
      .filter((cat) => isCityCategoryIndexable(c.slug, cat.slug))
      .map((cat) => ({
        path: `/${c.slug}/${cat.slug}`,
        changefreq: "weekly",
        priority: "0.7",
      }))
  ),

  // Approved business pages
  ...approvedBusinesses().map((b) => ({
    path: `/businesses/${b.slug}`,
    changefreq: "monthly",
    priority: "0.6",
    lastmod: b.updatedAt,
  })),
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,

  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq
        ? `    <changefreq>${e.changefreq}</changefreq>`
        : null,
      e.priority
        ? `    <priority>${e.priority}</priority>`
        : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  ),

  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);

console.log(
  `✅ sitemap.xml written successfully (${entries.length} URLs)`
);
