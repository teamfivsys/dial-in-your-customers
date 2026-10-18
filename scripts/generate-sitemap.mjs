import { writeFileSync } from "node:fs";
// The directory is not launched. Do not advertise unavailable city/category/blog
// routes to crawlers. Add pages only after they are accurate and return HTTP 200.
writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://kdial.in/</loc></url>
</urlset>
`);
console.log("Pre-launch sitemap: 1 canonical URL");
