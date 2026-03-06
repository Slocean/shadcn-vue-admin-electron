<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore, themes, type ThemeColor, type ThemeMode } from '@/store/theme'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Check, MonitorSmartphone, Moon, Palette, Settings, Sparkles, Sun } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'

const themeStore = useThemeStore()

const modeOptions = [
  {
    value: 'light' as ThemeMode,
    title: '浅色',
    icon: Sun
  },
  {
    value: 'dark' as ThemeMode,
    title: '深色',
    icon: Moon
  },
  {
    value: 'system' as ThemeMode,
    title: '跟随系统',
    icon: MonitorSmartphone
  }
]

const themeEntries = computed(() => Object.entries(themes) as [ThemeColor, (typeof themes)[ThemeColor]][])
const modeLabelMap: Record<ThemeMode, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统'
}

function getColorValue(color: ThemeColor) {
  const theme = themes[color]
  return `oklch(${themeStore.resolvedMode === 'dark' ? theme.activeColor.dark : theme.activeColor.light})`
}
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button
        variant="outline"
        size="icon"
        class="size-9 rounded-xl border-border/60 bg-background/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/60 hover:shadow-md"
      >
        <Settings class="h-[1.1rem] w-[1.1rem]" />
        <span class="sr-only">打开主题设置</span>
      </Button>
    </SheetTrigger>

    <SheetContent class="w-[380px] border-l border-border/60 bg-background/95 px-0 sm:w-[440px]">
      <div class="flex h-full flex-col">
        <SheetHeader class="space-y-4 border-b border-border/60 px-6 pb-6 pt-6 text-left">
          <div
            class="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent p-5 shadow-sm"
          >
            <div class="mb-4 flex items-start justify-between gap-3">
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-primary">
                  <Sparkles class="h-4 w-4" />
                  <span class="text-xs font-medium tracking-[0.18em] uppercase">Appearance</span>
                </div>
                <SheetTitle class="text-xl font-semibold">界面设置</SheetTitle>
                <SheetDescription class="max-w-[28ch] text-sm leading-6 text-muted-foreground">
                  调整整体外观风格，让应用更贴合你的使用习惯。
                </SheetDescription>
              </div>

              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background/80 text-primary shadow-sm ring-1 ring-border/50 backdrop-blur"
              >
                <Palette class="h-5 w-5" />
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" class="rounded-full px-3 py-1 text-xs">
                当前模式：{{ modeLabelMap[themeStore.mode] }}
              </Badge>
              <Badge variant="secondary" class="rounded-full px-3 py-1 text-xs">
                当前主题：{{ themes[themeStore.themeColor].label }}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <div class="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <section class="space-y-4">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold tracking-wide">显示模式</h3>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="option in modeOptions"
                :key="option.value"
                type="button"
                :class="
                  cn(
                    'group relative flex items-center justify-center gap-1.5 rounded-2xl border border-border/70 bg-card/70 px-2 py-2.5 text-center shadow-sm transition-all duration-200 hover:border-primary/35 hover:shadow-md',
                    themeStore.mode === option.value &&
                      'border-primary/50 bg-primary/[0.08] shadow-[0_10px_30px_-18px_hsl(var(--primary))]'
                  )
                "
                @click="themeStore.setMode(option.value)"
              >
                <component
                  :is="option.icon"
                  :class="cn('h-4 w-4 text-muted-foreground transition-colors', themeStore.mode === option.value && 'text-primary')"
                />
                <span class="truncate text-sm font-medium text-foreground">{{ option.title }}</span>
                <Check
                  v-if="themeStore.mode === option.value"
                  class="absolute right-2 top-2 h-3.5 w-3.5 text-primary"
                />
              </button>
            </div>
          </section>

          <Separator class="bg-border/60" />

          <section class="space-y-4">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold tracking-wide">主题色</h3>
              <p class="text-sm text-muted-foreground">用一组更舒服的强调色，提升界面的层次感和辨识度。</p>
            </div>

            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="[key, theme] in themeEntries"
                :key="key"
                type="button"
                :class="
                  cn(
                    'group rounded-xl border border-border/70 bg-card/70 p-2.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md',
                    themeStore.themeColor === key &&
                      'border-primary/50 bg-primary/[0.08] shadow-[0_10px_30px_-18px_hsl(var(--primary))]'
                  )
                "
                @click="themeStore.setThemeColor(key)"
              >
                <div class="flex items-center gap-2">
                  <div class="relative shrink-0">
                    <span
                      class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/50 shadow-sm ring-1 ring-black/5 dark:border-white/10"
                      :style="{ background: `linear-gradient(135deg, ${getColorValue(key)} 0%, color-mix(in oklab, ${getColorValue(key)} 70%, white) 100%)` }"
                    >
                      <span class="h-2.5 w-2.5 rounded-full bg-white/90 shadow-sm"></span>
                    </span>
                    <span
                      v-if="themeStore.themeColor === key"
                      class="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                    >
                      <Check class="h-2.5 w-2.5" />
                    </span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-medium text-foreground">{{ theme.label }}</div>
                    <div class="mt-0.5 truncate text-[11px] text-muted-foreground">{{ key }}</div>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
