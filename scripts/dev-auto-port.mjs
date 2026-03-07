import net from 'node:net'
import { spawn } from 'node:child_process'

const DEFAULT_BACKEND_PORT = 3000
const DEFAULT_FRONTEND_PORT = 3001
const MAX_SCAN = 200

function parsePort(value, fallback) {
  const num = Number(value)
  if (!Number.isInteger(num) || num <= 0 || num > 65535) {
    return fallback
  }
  return num
}

function parseArgs(argv) {
  const result = {
    frontend: 'electron-vite dev',
    backend: '',
    backendPortStart: parsePort(process.env.BACKEND_PORT_START, DEFAULT_BACKEND_PORT),
    frontendPortStart: parsePort(process.env.FRONTEND_PORT_START, DEFAULT_FRONTEND_PORT)
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--frontend' && argv[i + 1]) {
      result.frontend = argv[i + 1]
      i += 1
      continue
    }
    if (arg === '--backend' && argv[i + 1]) {
      result.backend = argv[i + 1]
      i += 1
      continue
    }
    if (arg === '--frontend-port' && argv[i + 1]) {
      result.frontendPortStart = parsePort(argv[i + 1], result.frontendPortStart)
      i += 1
      continue
    }
    if (arg === '--backend-port' && argv[i + 1]) {
      result.backendPortStart = parsePort(argv[i + 1], result.backendPortStart)
      i += 1
    }
  }

  return result
}

function canListen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const server = net.createServer()

    server.once('error', () => {
      resolve(false)
    })

    server.once('listening', () => {
      server.close(() => resolve(true))
    })

    server.listen(port, host)
  })
}

async function findAvailablePort(start, reserved = new Set()) {
  for (let i = 0; i < MAX_SCAN; i += 1) {
    const port = start + i
    if (reserved.has(port)) {
      continue
    }

    // eslint-disable-next-line no-await-in-loop
    if (await canListen(port)) {
      return port
    }
  }

  throw new Error(`No available port found from ${start} to ${start + MAX_SCAN - 1}`)
}

function spawnWithEnv(command, env, label) {
  const child = spawn(command, {
    shell: true,
    stdio: 'inherit',
    env
  })

  child.on('error', (error) => {
    console.error(`[${label}] failed to start:`, error)
  })

  return child
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const backendPort = await findAvailablePort(args.backendPortStart)
  const frontendPort = await findAvailablePort(args.frontendPortStart, new Set([backendPort]))

  const sharedEnv = {
    ...process.env,
    BACKEND_PORT: String(backendPort),
    API_PORT: String(backendPort),
    VITE_API_PORT: String(backendPort),
    FRONTEND_PORT: String(frontendPort),
    VITE_WEB_PORT: String(frontendPort),
    VITE_DEV_SERVER_PORT: String(frontendPort)
  }

  console.log('[auto-port] backend:', backendPort)
  console.log('[auto-port] frontend:', frontendPort)

  const children = []

  if (args.backend) {
    children.push({ label: 'backend', process: spawnWithEnv(args.backend, sharedEnv, 'backend') })
  }

  children.push({ label: 'frontend', process: spawnWithEnv(args.frontend, sharedEnv, 'frontend') })

  let closing = false

  const closeAll = (code = 0) => {
    if (closing) {
      return
    }
    closing = true

    for (const child of children) {
      if (!child.process.killed) {
        child.process.kill()
      }
    }

    process.exit(code)
  }

  for (const child of children) {
    child.process.on('exit', (code) => {
      if (closing) {
        return
      }

      if (code && code !== 0) {
        console.error(`[auto-port] ${child.label} exited with code ${code}`)
        closeAll(code)
        return
      }

      closeAll(0)
    })
  }

  process.on('SIGINT', () => closeAll(0))
  process.on('SIGTERM', () => closeAll(0))
}

main().catch((error) => {
  console.error('[auto-port] startup failed:', error)
  process.exit(1)
})
