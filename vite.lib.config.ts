import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    outDir: "dist/lib",
    lib: {
      entry: resolve(projectRoot, "src/lib/index.ts"),
      name: "GitHubWikiMarkdownPreview",
      fileName: (format) => `index.${format}.js`,
      cssFileName: "style"
    }
  }
});
