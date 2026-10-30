import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Hato Daily | Heartopia community",
    short_name: "Hato Daily",
    description: "Heartopia daily discoveries, community looks, and home builds.",
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#fffdf7",
    theme_color: "#f8e4e7",
    icons: [
      { src: "/icons/hato-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/hato-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
