import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { samplePatterns } from "./src/data/patterns";
import { defineConfig, type Plugin } from "vite";

const siteUrl = "https://crochet-blog-backup.youssefmoussaddeq00.workers.dev";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function socialMetadataPlugin(): Plugin {
  return {
    name: "pattern-social-metadata",
    apply: "build",
    async closeBundle() {
      const outputDir = fileURLToPath(new URL("./dist", import.meta.url));
      const template = await readFile(join(outputDir, "index.html"), "utf8");

      await Promise.all(
        samplePatterns.map(async (pattern) => {
          const title = pattern.title.trim();
          const description = pattern.description.slice(0, 200);
          const url = `${siteUrl}/patterns/${encodeURIComponent(pattern.id)}`;
          const imageUrl = new URL(pattern.mainImg, `${siteUrl}/`).href;
          const html = template
            .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)} | Crochet Art</title>`)
            .replace(
              /<meta name="description" content="[^"]*"\s*\/>/,
              `<meta name="description" content="${escapeHtml(description)}" />`
            )
            .replace(
              /<meta property="og:title" content="[^"]*"\s*\/>/,
              `<meta property="og:title" content="${escapeHtml(title)}" />`
            )
            .replace(
              /<meta property="og:description" content="[^"]*"\s*\/>/,
              `<meta property="og:description" content="${escapeHtml(description)}" />`
            )
            .replace(
              /<meta property="og:image" content="[^"]*"\s*\/>/,
              `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`
            )
            .replace(
              /<meta property="og:url" content="[^"]*"\s*\/>/,
              `<meta property="og:url" content="${escapeHtml(url)}" />`
            )
            .replace(
              /<meta name="twitter:title" content="[^"]*"\s*\/>/,
              `<meta name="twitter:title" content="${escapeHtml(title)}" />`
            )
            .replace(
              /<meta name="twitter:description" content="[^"]*"\s*\/>/,
              `<meta name="twitter:description" content="${escapeHtml(description)}" />`
            )
            .replace(
              /<meta name="twitter:image" content="[^"]*"\s*\/>/,
              `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`
            );

          const patternDir = join(outputDir, "patterns", pattern.id);
          await mkdir(patternDir, { recursive: true });
          await writeFile(join(patternDir, "index.html"), html);
        })
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), socialMetadataPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});