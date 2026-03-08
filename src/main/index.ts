import { app, shell, BrowserWindow, ipcMain, type IpcMainInvokeEvent } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { closeDatabase } from './lib/database'
import { ensureDefaultAdmin, getCurrentSession, login, logout, register } from './lib/auth'
import { getLocale, setLocale, type AppLocale } from './lib/store'

function getSenderWindow(event: IpcMainInvokeEvent): BrowserWindow | null {
  return BrowserWindow.fromWebContents(event.sender)
}

function notifyMaximizedState(window: BrowserWindow): void {
  window.webContents.send('window:maximized-change', window.isMaximized())
}

function notifyAlwaysOnTopState(window: BrowserWindow): void {
  window.webContents.send('window:always-on-top-change', window.isAlwaysOnTop())
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 770,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('maximize', () => {
    notifyMaximizedState(mainWindow)
  })

  mainWindow.on('unmaximize', () => {
    notifyMaximizedState(mainWindow)
  })

  mainWindow.on('always-on-top-changed', () => {
    notifyAlwaysOnTopState(mainWindow)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('window:minimize', (event) => {
    getSenderWindow(event)?.minimize()
  })
  ipcMain.handle('window:toggle-maximize', (event) => {
    const window = getSenderWindow(event)

    if (!window) return false

    if (window.isMaximized()) {
      window.unmaximize()
      return false
    }

    window.maximize()
    return true
  })
  ipcMain.handle('window:is-maximized', (event) => {
    return getSenderWindow(event)?.isMaximized() ?? false
  })
  ipcMain.handle('window:toggle-always-on-top', (event) => {
    const window = getSenderWindow(event)

    if (!window) return false

    const nextValue = !window.isAlwaysOnTop()
    window.setAlwaysOnTop(nextValue)
    return nextValue
  })
  ipcMain.handle('window:is-always-on-top', (event) => {
    return getSenderWindow(event)?.isAlwaysOnTop() ?? false
  })
  ipcMain.handle('window:close', (event) => {
    getSenderWindow(event)?.close()
  })
  ipcMain.handle('settings:get-locale', () => {
    return getLocale()
  })
  ipcMain.handle('settings:set-locale', (_event, locale: AppLocale) => {
    return setLocale(locale)
  })
  ipcMain.handle('auth:get-session', () => {
    return getCurrentSession()
  })
  ipcMain.handle('auth:login', (_event, payload) => {
    try {
      return { ok: true, user: login(payload) }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) }
    }
  })
  ipcMain.handle('auth:register', (_event, payload) => {
    try {
      return { ok: true, user: register(payload) }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) }
    }
  })
  ipcMain.handle('auth:logout', () => {
    return logout()
  })

  ensureDefaultAdmin()
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  closeDatabase()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
