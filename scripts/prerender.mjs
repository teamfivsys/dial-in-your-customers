import { build } from "vite";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
// Compile a production SSR entry, then render the real homepage for every visitor.
// A compiled entry avoids relying on Vite's development JSX runtime during CI.
await build({
  mode: "production",
  ssr: { noExternal: ["react-helmet-async"] },
  build: { ssr: "src/entry-prerender.tsx", outDir: ".prerender", emptyOutDir: true, rollupOptions: { output: { entryFileNames: "entry.mjs" } } }
});
try {
  const { render } = await import(pathToFileURL(resolve(".prerender/entry.mjs")).href);
  const { head, body } = render();
  let html = readFileSync("dist/index.html", "utf8");
  if (!html.includes('<!--seo-head-start-->') || !html.includes('<div id="root"></div>')) throw new Error("Prerender template markers missing");
  html = html.replace(/<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/, head)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  writeFileSync("dist/index.html", html);
  console.log("Prerendered homepage content, canonical, metadata and structured data");
} finally {
  rmSync(".prerender", { recursive: true, force: true });
}
