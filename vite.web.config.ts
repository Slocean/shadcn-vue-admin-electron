// vite.web.config.ts
import { defineConfig } from 'vite'
import electronConfig from './electron.vite.config.js'

export default defineConfig({
  ...electronConfig.renderer,
  root: 'src/renderer', // 或根据实际路径
  server: {
    open: true,
    host: true,
    port: 3001
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     secure: false
    //   }
    // }
  }
})
