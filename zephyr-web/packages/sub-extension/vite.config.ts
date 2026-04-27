import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 7112, cors: true },
  base: '/extension/',
  build: { rollupOptions: { external: ['qiankun'], output: { globals: { qiankun: 'qiankun' } } } },
});
