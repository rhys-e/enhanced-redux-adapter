import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/enhancedAdapter.ts', 
      name: 'enhancedAdapter',
      fileName: (format) => `enhancedAdapter.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
    },
  },
  plugins: [
    dts(),
  ],
});
