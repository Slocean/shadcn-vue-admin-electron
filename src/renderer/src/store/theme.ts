import { defineStore } from 'pinia'
import { usePreferredDark, useStorage } from '@vueuse/core'
import { computed, watch } from 'vue'

export type ThemeColor = 'zinc' | 'red' | 'blue' | 'green' | 'orange' | 'yellow' | 'violet'
export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeFont = 'system' | 'yahei' | 'dengxian' | 'songti' | 'kaiti'

interface ThemeConfig {
  name: string
  label: string
  activeColor: {
    light: string
    dark: string
  }
}

interface FontConfig {
  label: string
  family: string
  preview: string
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
      dark: '0.637 0.237 25.331'
    }
  },
  blue: {
    name: 'blue',
    label: 'Blue',
    activeColor: {
      light: '0.5 0.2 250',
      dark: '0.623 0.214 259.815'
    }
  },
  green: {
    name: 'green',
    label: 'Green',
    activeColor: {
      light: '0.5 0.2 140',
      dark: '0.723 0.219 149.579'
    }
  },
  orange: {
    name: 'orange',
    label: 'Orange',
    activeColor: {
      light: '0.6 0.2 50',
      dark: '0.705 0.213 47.604'
    }
  },
  yellow: {
    name: 'yellow',
    label: 'Yellow',
    activeColor: {
      light: '0.7 0.18 80',
      dark: '0.795 0.184 86.047'
    }
  },
  violet: {
    name: 'violet',
    label: 'Violet',
    activeColor: {
      light: '0.5 0.2 300',
      dark: '0.606 0.25 292.717'
    }
  }
}

export const fonts: Record<ThemeFont, FontConfig> = {
  system: {
    label: '系统默认',
    family: 'Inter, sans-serif',
    preview: '界面清晰，适合日常使用'
  },
  yahei: {
    label: '微软雅黑',
    family: '"Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", sans-serif',
    preview: '中文显示更圆润'
  },
  dengxian: {
    label: '等线',
    family: 'DengXian, "Microsoft YaHei UI", sans-serif',
    preview: '现代简洁，字形利落'
  },
  songti: {
    label: '宋体',
    family: 'SimSun, Songti SC, serif',
    preview: '传统衬线，适合阅读'
  },
  kaiti: {
    label: '楷体',
    family: 'KaiTi, STKaiti, serif',
    preview: '书卷风格，更有辨识度'
  }
}

const textSizeVars = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem'
} as const

export const useThemeStore = defineStore('theme', () => {
  const preferredDark = usePreferredDark()
  const mode = useStorage<ThemeMode>('theme-mode', 'light')
  const themeColor = useStorage<ThemeColor>('theme-color', 'zinc')
  const fontFamily = useStorage<ThemeFont>('theme-font-family', 'system')
  const fontSizeOffset = useStorage<number>('theme-font-size-offset', 0)
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

  function setFontFamily(newFont: ThemeFont) {
    fontFamily.value = newFont
  }

  function setFontSizeOffset(offset: number) {
    fontSizeOffset.value = Math.max(-2, Math.min(6, offset))
  }

  function applyTheme() {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedMode.value)
    root.style.colorScheme = resolvedMode.value

    if (themes[themeColor.value]) {
      root.setAttribute('data-theme', themeColor.value)
    } else {
      root.removeAttribute('data-theme')
    }

    const font = fonts[fontFamily.value]
    root.style.setProperty('--font-sans', font?.family ?? fonts.system.family)
    root.style.setProperty('--app-font-family', font?.family ?? fonts.system.family)
    root.style.setProperty('--app-font-size-offset', `${fontSizeOffset.value}px`)

    for (const [size, baseValue] of Object.entries(textSizeVars)) {
      root.style.setProperty(`--text-${size}`, `calc(${baseValue} + ${fontSizeOffset.value}px)`)
    }
  }

  watch(
    [mode, themeColor, resolvedMode, fontFamily, fontSizeOffset],
    () => {
      applyTheme()
    },
    { immediate: true }
  )

  return {
    mode,
    resolvedMode,
    themeColor,
    fontFamily,
    fontSizeOffset,
    setMode,
    setThemeColor,
    setFontFamily,
    setFontSizeOffset
  }
})
