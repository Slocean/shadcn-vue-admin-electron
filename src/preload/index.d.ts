import { ElectronAPI } from '@electron-toolkit/preload'

interface WindowControlsApi {
  minimize: () => Promise<void>
  toggleMaximize: () => Promise<boolean>
  isMaximized: () => Promise<boolean>
  close: () => Promise<void>
  onMaximizedChange: (callback: (isMaximized: boolean) => void) => () => void
}

interface AppApi {
  windowControls: WindowControlsApi
  settings: {
    getLocale: () => Promise<'zh-CN' | 'en-US'>
    setLocale: (locale: 'zh-CN' | 'en-US') => Promise<'zh-CN' | 'en-US'>
  }
  auth: {
    getSession: () => Promise<{
      id: number
      username: string
      email: string
      createdAt: string
    } | null>
    login: (payload: { email: string; password: string }) => Promise<{
      id: number
      username: string
      email: string
      createdAt: string
    }>
    register: (payload: { username: string; email: string; password: string }) => Promise<{
      id: number
      username: string
      email: string
      createdAt: string
    }>
    logout: () => Promise<null>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: AppApi
  }
}
