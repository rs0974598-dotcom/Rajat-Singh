import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",  // 👈 localhost ki jagah 127.0.0.1
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (err) => console.log("Proxy error:", err));
          proxy.on("proxyReq", (_, req) => console.log("Proxying:", req.method, req.url));
        },
      },
    },
  },
});