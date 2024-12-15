import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// Manifest configuration for PWA
const manifestForPlugin = {
  registerType: "prompt", // or 'auto'
  includeAssets: [
    "Global.ico",
    "apple-icon-180.png",
    "manifest-icon-512.maskable.png",
    "splash-screen.png", // Ensure the splash-screen.png is included here
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
        src: "/icons/icon-192x192.png", // Specify the path to your icon
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png", // Specify the path to your icon
        sizes: "512x512",
        type: "image/png",
      },
    ],
    splash_screen: {
      url: "splash-screen.png", // Ensure this path is correct
      background_color: "#ffffff",
    },
    screenshots: [
      {
        src: "screenshots/Screenshot-desktop.png",
        form_factor: "wide",
        sizes: "1280x720",
      },
      {
        src: "screenshots/Screnshot-mobile.png",
        form_factor: "narrow",
        sizes: "360x640",
      },
    ],
    lang: "en-US",
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
});
