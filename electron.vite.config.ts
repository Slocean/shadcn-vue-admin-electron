import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number(value)
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    return fallback
  }
  return port
}

const rendererPort = parsePort(process.env.FRONTEND_PORT ?? process.env.VITE_DEV_SERVER_PORT, 3001)

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    server: {
      host: true,
      port: rendererPort,
      strictPort: true
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [vue(), tailwindcss()]
  }
})
