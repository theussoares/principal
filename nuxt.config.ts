// https://nuxt.com/docs/api/configuration/nuxt-config
import federation from '@originjs/vite-plugin-federation'

// Remote URLs from environment variables (override in Vercel)
const DS_URL = process.env.NUXT_PUBLIC_DS_URL || 'http://localhost:5001'
const HAVY_URL = process.env.NUXT_PUBLIC_HAVY_URL || 'http://localhost:5002'

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  vite: {
    plugins: [
      federation({
        name: 'principal',
        remotes: {
          design_system: `${DS_URL}/assets/remoteEntry.js`,
          havy: `${HAVY_URL}/assets/remoteEntry.js`,
        },
        shared: ['vue']
      })
    ],
    build: {
      target: 'esnext',
    }
  },
  devtools: { enabled: true }
})
