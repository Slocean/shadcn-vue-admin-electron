import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  windowControls: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    toggleMaximize: () => ipcRenderer.invoke('window:toggle-maximize'),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:is-maximized'),
    close: () => ipcRenderer.invoke('window:close'),
    onMaximizedChange: (callback: (isMaximized: boolean) => void): (() => void) => {
      const listener = (_event: Electron.IpcRendererEvent, isMaximized: boolean): void => {
        callback(isMaximized)
      }

      ipcRenderer.on('window:maximized-change', listener)

      return (): void => {
        ipcRenderer.off('window:maximized-change', listener)
      }
    }
  },
  settings: {
    getLocale: () => ipcRenderer.invoke('settings:get-locale'),
    setLocale: (locale: 'zh-CN' | 'en-US') => ipcRenderer.invoke('settings:set-locale', locale)
  },
  auth: {
    getSession: () => ipcRenderer.invoke('auth:get-session'),
    login: (payload: { email: string; password: string }) => ipcRenderer.invoke('auth:login', payload),
    register: (payload: { username: string; email: string; password: string }) => ipcRenderer.invoke('auth:register', payload),
    logout: () => ipcRenderer.invoke('auth:logout')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
