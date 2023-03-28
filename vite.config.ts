import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
    // eslint-disable-next-line new-cap
    VitePWA({
      registerType: 'autoUpdate',
    }),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
});
