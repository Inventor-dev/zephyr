import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 7105, cors: true },
  base: '/log/',
  build: { rollupOptions: { external: ['qiankun'], output: { globals: { qiankun: 'qiankun' } } } },
});
