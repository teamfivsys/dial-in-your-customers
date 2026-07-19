// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { keralaCities } from "../src/data/cities";
import { businessCategories } from "../src/data/categories";
import { blogPosts } from "../src/data/blogPosts";

const BASE_URL = "https://kdial.in";
const today = new Date().toISOString().slice(0, 10);

interface Entry {
  path: string;
  changefreq?: string;
  priority?: string;
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

  ...keralaCities.flatMap((c) =>
    businessCategories.map((cat) => ({
      path: `/${c.slug}/${cat.slug}`,
      changefreq: "weekly",
      priority: "0.7",
    }))
  ),
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,

  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${today}</lastmod>`,
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
