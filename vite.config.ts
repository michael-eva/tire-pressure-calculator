import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePluginRadar } from "vite-plugin-radar";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginRadar({
      // Google Analytics configuration
      analytics: [
        {
          id: "G-XXXXX", // Replace 'G-XXXXX' with your actual Google Analytics Measurement ID
          disable: false, // Set to true if you want to disable tracking
          config: {
            cookie_domain: "auto",
            cookie_expires: 63072000,
            cookie_prefix: "none",
            cookie_update: true,
            send_page_view: true,
            allow_google_signals: true,
            allow_ad_personalization_signals: true,
          },
          consentDefaults: {
            analytics_storage: "granted",
            ad_storage: "denied",
            wait_for_update: 500,
          },
          persistentValues: {
            currency: "USD",
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
