import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export type AppLocale = 'zh-CN' | 'en-US'

export async function setupI18n() {
  const locale = await window.api.settings.getLocale()
  i18n.global.locale.value = locale
}

export async function setAppLocale(locale: AppLocale) {
  const nextLocale = await window.api.settings.setLocale(locale)
  i18n.global.locale.value = nextLocale
}
