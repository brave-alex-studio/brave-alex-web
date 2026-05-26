import { defineConfig, envField, fontProviders, svgoOptimizer } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import remarkToc from 'remark-toc'
import remarkCollapse from 'remark-collapse'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from '@shikijs/transformers'
import { transformerFileName } from './src/utils/transformers/fileName'
import config from './astro-paper.config'

export default defineConfig({
  site: config.site.url,
  integrations: [
    sitemap({
      filter: (page) => config.features?.showArchives !== false || !page.endsWith("/archives/")
    }),
    mdx()
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: 'Table of contents' }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: 'min-light', dark: 'night-owl' },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: 'v2', hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: 'v3' })
      ]
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: true,
    layout: 'constrained'
  },
  fonts: [
    {
         name: "Google Sans Code",
         cssVariable: "--font-google-sans-code",
         provider: fontProviders.google(),
         fallbacks: ["monospace"],
         weights: [300, 400, 500, 600, 700],
         styles: ["normal", "italic"],
         formats: ["woff", "ttf"],
    },
    {
      name: "Germania One",
      cssVariable: "--font-germania-one",
      provider: fontProviders.google(),
      fallbacks: ["sans"],
      weights: [400, 700],
      styles: ["normal"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Open Sans",
      cssVariable: "--font-open-sans",
      provider: fontProviders.google(),
      fallbacks: ["sans"],
      weights: [400, 700],
      styles: ["normal"],
      formats: ["woff", "ttf"],
    }
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: 'public',
        context: 'client',
        optional: true
      })
    }
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  }
})
