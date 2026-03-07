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
      email: string | null
      createdAt: string
    } | null>
    login: (payload: { username: string; password: string }) => Promise<
      | {
          ok: true
          user: {
            id: number
            username: string
            email: string | null
            createdAt: string
          }
        }
      | {
          ok: false
          error: string
        }
    >
    register: (payload: { username: string; email?: string | null; password: string }) => Promise<
      | {
          ok: true
          user: {
            id: number
            username: string
            email: string | null
            createdAt: string
          }
        }
      | {
          ok: false
          error: string
        }
    >
    logout: () => Promise<null>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: AppApi
  }
}
