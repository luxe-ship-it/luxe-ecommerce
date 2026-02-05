import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { expressPlugin } from "./vite-express-plugin";

// https://vitejs.dev/config/
export default defineConfig(async () => {
    const plugins: PluginOption[] = [
        react(),
        expressPlugin()
    ];

    return {
        server: {
            host: "::",
            port: 8080,
            fs: {
                allow: [".", "./client", "./shared"],
                deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
            },
        },
        build: {
            outDir: "dist/spa",
        },
        plugins,
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./client"),
                "@shared": path.resolve(__dirname, "./shared"),
            },
        },
    };
});
