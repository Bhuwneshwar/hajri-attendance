import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 3006,
        proxy: {
            "/v1": {
                target: "http://localhost:5006",
                changeOrigin: true
            }
        }
    }
});
