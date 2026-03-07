import { defineConfig } from 'vite'
import electronConfig from './electron.vite.config.js'

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number(value)
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    return fallback
  }
  return port
}

const frontendPort = parsePort(process.env.FRONTEND_PORT ?? process.env.VITE_WEB_PORT, 3001)
const backendPort = parsePort(process.env.BACKEND_PORT ?? process.env.VITE_API_PORT, 3000)

export default defineConfig({
  ...electronConfig.renderer,
  root: 'src/renderer',
  server: {
    open: true,
    host: true,
    port: frontendPort,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  }
})
