// vite.web.config.ts
import { defineConfig } from 'vite'
import electronConfig from './electron.vite.config.js'

export default defineConfig({
  ...electronConfig.renderer,
  root: 'src/renderer' // 或根据实际路径
})
