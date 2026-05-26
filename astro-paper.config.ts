import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://brave-alex.studio/",
    title: "Brave Alex Studio",
    description: "TTRPG games, tools and other curiosities.",
    author: "Danielle M.",
    profile: "https://danielle-m.dev/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "America/Los_Angeles",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: false,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/brave-alex-studio" },
    { name: "itch",  url: "https://brave-alex.itch.io" },
    { name: "mail",     url: "mailto:info@brave-alex.studi" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
