import { Conf } from 'electron-conf/main'
export type AppLocale = 'zh-CN' | 'en-US'

export interface SessionUser {
  id: number
  username: string
  email: string
  createdAt: string
}

type AppStoreSchema = {
  locale: AppLocale
  session: SessionUser | null
}

export const appStore = new Conf<AppStoreSchema>({
  name: 'app-settings',
  defaults: {
    locale: 'zh-CN',
    session: null
  }
})

export function getLocale(): AppLocale {
  return appStore.get('locale')
}

export function setLocale(locale: AppLocale): AppLocale {
  appStore.set('locale', locale)
  return locale
}

export function getSession(): SessionUser | null {
  return appStore.get('session')
}

export function setSession(session: SessionUser | null): SessionUser | null {
  appStore.set('session', session)
  return session
}
