// https://nuxt.com/docs/api/configuration/nuxt-config
import federation from '@originjs/vite-plugin-federation'

export default defineNuxtConfig({
  ssr: false, // Client-side rendering required for Module Federation
  modules: ['@nuxtjs/tailwindcss'],
  vite: {
    plugins: [
      federation({
        name: 'principal',
        remotes: {
          design_system: 'http://localhost:5001/assets/remoteEntry.js',
          havy: 'http://localhost:5002/assets/remoteEntry.js',
        },
        shared: {
          vue: {
            generate: false,
          }
        }
      })
    ],
    build: {
      target: 'esnext',
    }
  },
  devtools: { enabled: true }
})
