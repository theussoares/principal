// https://nuxt.com/docs/api/configuration/nuxt-config
import federation from '@originjs/vite-plugin-federation'

// Remote URLs from environment variables (override in Vercel)
const DS_URL = process.env.NUXT_PUBLIC_DS_URL || 'http://localhost:5001'
const HAVY_URL = process.env.NUXT_PUBLIC_HAVY_URL || 'http://localhost:5002'

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Pokédex — Micro-Frontends POC',
      meta: [
        { name: 'description', content: 'A Pokédex built with Micro-Frontends architecture using Nuxt 4, Vue 3, and Module Federation.' },
        { name: 'theme-color', content: '#0a0e1a' },
      ],
      link: [
        // DNS-prefetch for external APIs (speed up PokeAPI + sprite image fetches)
        { rel: 'dns-prefetch', href: 'https://pokeapi.co' },
        { rel: 'dns-prefetch', href: 'https://raw.githubusercontent.com' },
        // Preconnect to Google Fonts origins
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Preload the actual font file to eliminate the CSS → WOFF2 chain
        {
          rel: 'preload',
          href: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50Sjla1ZL7W0Q5nw.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        // Load Google Fonts stylesheet (non-blocking because font is already preloaded)
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  routeRules: {
    '/_nuxt/**': {
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  },

  vite: {
    build: {
      target: 'esnext',
    },
  },

  hooks: {
    'vite:extendConfig'(config, { isClient }) {
      if (isClient) {
        config.plugins!.push(
          federation({
            name: 'principal',
            remotes: {
              design_system: `${DS_URL}/assets/remoteEntry.js`,
              havy: `${HAVY_URL}/assets/remoteEntry.js`,
            },
            shared: ['vue'],
          })
        )
      }
    },
  },

  devtools: { enabled: true },
})
