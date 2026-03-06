import { defineStore } from 'pinia'
import { usePreferredDark, useStorage } from '@vueuse/core'
import { computed, watch } from 'vue'

export type ThemeColor = 'zinc' | 'red' | 'blue' | 'green' | 'orange' | 'yellow' | 'violet'
export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeConfig {
  name: string
  label: string
  activeColor: {
    light: string
    dark: string
  }
}

export const themes: Record<ThemeColor, ThemeConfig> = {
  zinc: {
    name: 'zinc',
    label: 'Zinc',
    activeColor: {
      light: '0.205 0 0',
      dark: '0.985 0 0'
    }
  },
  red: {
    name: 'red',
    label: 'Red',
    activeColor: {
      light: '0.577 0.245 27.325',
      dark: '0.577 0.245 27.325'
    }
  },
  blue: {
    name: 'blue',
    label: 'Blue',
    activeColor: {
      light: '0.5 0.2 250',
      dark: '0.5 0.2 250'
    }
  },
  green: {
    name: 'green',
    label: 'Green',
    activeColor: {
      light: '0.5 0.2 140',
      dark: '0.5 0.2 140'
    }
  },
  orange: {
    name: 'orange',
    label: 'Orange',
    activeColor: {
      light: '0.6 0.2 50',
      dark: '0.6 0.2 50'
    }
  },
  yellow: {
    name: 'yellow',
    label: 'Yellow',
    activeColor: {
      light: '0.7 0.18 80',
      dark: '0.7 0.18 80'
    }
  },
  violet: {
    name: 'violet',
    label: 'Violet',
    activeColor: {
      light: '0.5 0.2 300',
      dark: '0.5 0.2 300'
    }
  }
}

export const useThemeStore = defineStore('theme', () => {
  const preferredDark = usePreferredDark()
  const mode = useStorage<ThemeMode>('theme-mode', 'light')
  const themeColor = useStorage<ThemeColor>('theme-color', 'zinc')
  const resolvedMode = computed<'light' | 'dark'>(() => {
    if (mode.value === 'system') {
      return preferredDark.value ? 'dark' : 'light'
    }

    return mode.value
  })

  function setMode(newMode: ThemeMode) {
    mode.value = newMode
  }

  function setThemeColor(newColor: ThemeColor) {
    themeColor.value = newColor
  }

  function applyTheme() {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedMode.value)

    const theme = themes[themeColor.value]
    if (theme) {
      const primaryValue = resolvedMode.value === 'dark' ? theme.activeColor.dark : theme.activeColor.light

      root.style.setProperty('--primary', `oklch(${primaryValue})`)
    }
  }

  watch([mode, themeColor, resolvedMode], () => {
    applyTheme()
  }, { immediate: true })

  return {
    mode,
    resolvedMode,
    themeColor,
    setMode,
    setThemeColor
  }
})
