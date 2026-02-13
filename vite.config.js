import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/digital-boyak/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'boyaki.png'],
      manifest: {
        name: '디지털 보약',
        short_name: '디지털보약',
        description: '시니어를 위한 스마트폰 도우미',
        theme_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'boyaki.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'boyaki.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'boyaki.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true
  }
}));
