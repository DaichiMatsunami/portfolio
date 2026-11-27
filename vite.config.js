import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    base: "/portfolio/",

    input: {
        main: resolve(import.meta.dirname, "index.html"),
        project: resolve(import.meta.dirname, "works/projects.html"),
    },

    build: {
        outDir: "docs",
        emptyOutDir: true,
    },
});