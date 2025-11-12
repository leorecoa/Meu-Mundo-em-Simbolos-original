import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // O 'sw.js' será gerado automaticamente.
      // Você pode remover o seu arquivo sw.js manual.
      workbox: {
        // Define quais arquivos devem ser cacheados.
        // 'globPatterns' garante que todos os assets do build sejam incluídos.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
      manifest: {
        name: 'Meu Mundo em Símbolos',
        short_name: 'Mundo Símbolos',
        description: 'Um aplicativo de comunicação aumentativa e alternativa.',
        theme_color: '#ffffff',
      },
    }),
  ],
});