import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/SkiCrazed/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fonts/*.woff2'],
      manifest: {
        name: 'Ski Crazed',
        short_name: 'SkiCrazed',
        description: 'A faithful PWA recreation of the classic 1987 Apple II ski game by Jason Rubin & Andy Gavin',
        start_url: '/SkiCrazed/',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#000000',
        theme_color: '#0078F0',
        icons: [
          {
            src: '/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        // skipWaiting + clientsClaim = new SW takes over immediately
        skipWaiting: true,
        clientsClaim: true,
        // Version bump forces SW update and cache bust on clients
        additionalManifestEntries: [{ url: 'version', revision: '1.5.0' }],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
