import { mergeConfig } from "vite";
import baseConfig from "../../vite.config.react";

export default mergeConfig(baseConfig, {
  // Add any app-specific Vite configuration here
  server: {
    port: 8082,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
