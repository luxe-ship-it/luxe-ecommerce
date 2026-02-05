import { Plugin } from "vite";

export function expressPlugin(): Plugin {
    return {
        name: "express-plugin",
        apply: "serve",
        async configureServer(server) {
            // Use dynamic import to avoid bundling server code in frontend build
            try {
                const { createServer } = await import("./server/index");
                const app = createServer();
                server.middlewares.use(app);
            } catch (e) {
                console.error("Failed to load server middleware:", e);
            }
        },
    };
}
