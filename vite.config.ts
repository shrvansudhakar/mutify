import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                content: resolve(__dirname, "src/content.tsx"),
            },
            output: {
                entryFileNames: "content.js", // Must match manifest.json
            },
        },
        outDir: "dist",
        emptyOutDir: true,
    },
});
