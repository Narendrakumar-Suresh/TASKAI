import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: [
    "Global.ico",
    "apple-icon-180.png",
    "manifest-icon-512.maskable.png",
  ],
  manifest: {
    name: "TASKAI",
    short_name: "TASKAI",
    description: "Leveraging the power of AI in todo",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2196f3",
    scope: "/",
    icons: [
      {
        src: "icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
});
