// https://nuxt.com/docs/api/configuration/nuxt-config
import federation from '@originjs/vite-plugin-federation'

// Remote URLs from environment variables (override in Vercel)
const DS_URL = process.env.NUXT_PUBLIC_DS_URL || 'http://localhost:5001'
const HAVY_URL = process.env.NUXT_PUBLIC_HAVY_URL || 'http://localhost:5002'

// Remote versions — controlled via env vars for rollback/pinning (Notion spec §6)
// Use 'latest' to always get the most recent version (via Vercel rewrite)
const DS_VERSION = process.env.NUXT_PUBLIC_DS_VERSION || 'latest'
const HAVY_VERSION = process.env.NUXT_PUBLIC_HAVY_VERSION || 'latest'

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],

  // Expose version config to the client for telemetry
  runtimeConfig: {
    public: {
      dsVersion: DS_VERSION,
      havyVersion: HAVY_VERSION,
    },
  },

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
        // DNS-prefetch for external APIs
        { rel: 'dns-prefetch', href: 'https://pokeapi.co' },
        { rel: 'dns-prefetch', href: 'https://raw.githubusercontent.com' },
        // Preconnect to remote CDNs for faster module loading
        { rel: 'preconnect', href: DS_URL },
        { rel: 'preconnect', href: HAVY_URL },
        // Preconnect to Google Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
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
              // Versioned URLs: /v{version}/assets/remoteEntry.js
              // 'latest' routes through Vercel rewrite to current version
              design_system: `${DS_URL}/v${DS_VERSION}/assets/remoteEntry.js`,
              havy: `${HAVY_URL}/v${HAVY_VERSION}/assets/remoteEntry.js`,
            },
            shared: ['vue'],
          })
        )
      }
    },
  },

  devtools: { enabled: true },
})
