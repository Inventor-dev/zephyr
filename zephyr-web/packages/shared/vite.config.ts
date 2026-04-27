import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ZephyrShared',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom', 'antd', '@ant-design/icons', 'axios'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          antd: 'antd',
          '@ant-design/icons': 'icons',
          axios: 'axios',
        },
      },
    },
  },
});
