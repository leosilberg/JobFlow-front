import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import removeConsole from "vite-plugin-remove-console";
export default defineConfig({
    plugins: [react(), removeConsole()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "../JobFlow-back/public",
        emptyOutDir: true,
    },
});
