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
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: AppApi
  }
}
