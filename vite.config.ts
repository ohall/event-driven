import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: true,
      },
      // Enable TypeScript in Svelte components
      preprocess: require('./svelte.config.js').preprocess,
    })
  ],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $components: path.resolve('./src/components'),
      $routes: path.resolve('./src/routes'),
      $stores: path.resolve('./src/stores'),
      $assets: path.resolve('./src/assets')
    }
  }
});