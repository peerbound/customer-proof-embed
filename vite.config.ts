import path, { resolve } from "path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const isRelease = mode === "release";

  return {
    plugins: [preact(), tailwindcss(), svgr()],
    envPrefix: "PB_",
    build: {
      lib: {
        entry: resolve(__dirname, "src/widget.tsx"),
        name: "PeerboundWidgets",
        formats: ["iife"],
      },
      rolldownOptions: {
        output: isRelease
          ? [
              {
                name: "PeerboundWidgets",
                format: "iife",
                entryFileNames: "widget.js",
                minify: false,
              },
              {
                name: "PeerboundWidgets",
                format: "iife",
                entryFileNames: "widget.min.js",
                minify: true,
              },
            ]
          : [
              {
                name: "PeerboundWidgets",
                format: "iife",
                entryFileNames: "v1/widget.js",
                minify: true,
              },
            ],
      },
      outDir: isRelease ? "dist-release" : "dist",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
