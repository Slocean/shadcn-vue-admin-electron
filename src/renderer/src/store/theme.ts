import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { ref, watch, onMounted } from 'vue'

export type ThemeColor = 'zinc' | 'red' | 'blue' | 'green' | 'orange' | 'yellow' | 'violet'

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
  const mode = useStorage<'light' | 'dark'>('theme-mode', 'light')
  const themeColor = useStorage<ThemeColor>('theme-color', 'zinc')

  function setMode(newMode: 'light' | 'dark') {
    mode.value = newMode
  }

  function setThemeColor(newColor: ThemeColor) {
    themeColor.value = newColor
  }

  function applyTheme() {
    const root = window.document.documentElement
    
    // Apply mode
    root.classList.remove('light', 'dark')
    root.classList.add(mode.value)

    // Apply color
    const theme = themes[themeColor.value]
    if (theme) {
      // We need to update the CSS variable for primary color
      // Since we are using oklch in main.css, we just update the values
      // Note: The main.css defines --primary as full oklch(...) string, 
      // but to make it dynamic easily we might need to parse or just overwrite the whole property.
      // However, our themes definition above only has the numbers. 
      // Let's check main.css again. It has: --primary: oklch(0.205 0 0);
      
      const primaryValue = mode.value === 'dark' ? theme.activeColor.dark : theme.activeColor.light
      
      // Update custom property
      root.style.setProperty('--primary', `oklch(${primaryValue})`)
      
      // Also update ring and other related colors if needed, but for now primary is key
    }
  }

  // Watch for changes and apply
  watch([mode, themeColor], () => {
    applyTheme()
  }, { immediate: true })
  
  onMounted(() => {
    applyTheme()
  })

  return {
    mode,
    themeColor,
    setMode,
    setThemeColor
  }
})
