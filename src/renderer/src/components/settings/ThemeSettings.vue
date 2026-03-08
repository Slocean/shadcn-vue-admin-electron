<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useThemeStore,
  themes,
  fonts,
  type ThemeColor,
  type ThemeFont,
  type ThemeMode
} from '@/store/theme'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Check, Minus, MonitorSmartphone, Moon, Palette, Plus, Sun, Type } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'

const themeStore = useThemeStore()
const { t } = useI18n()

const modeOptions = computed(() => [
  {
    value: 'light' as ThemeMode,
    title: t('themeSettings.mode.light'),
    icon: Sun
  },
  {
    value: 'dark' as ThemeMode,
    title: t('themeSettings.mode.dark'),
    icon: Moon
  },
  {
    value: 'system' as ThemeMode,
    title: t('themeSettings.mode.system'),
    icon: MonitorSmartphone
  }
])

const themeEntries = computed(
  () => Object.entries(themes) as [ThemeColor, (typeof themes)[ThemeColor]][]
)
const fontEntries = computed(
  () => Object.entries(fonts) as [ThemeFont, (typeof fonts)[ThemeFont]][]
)

function getColorValue(color: ThemeColor) {
  const theme = themes[color]
  return `oklch(${themeStore.resolvedMode === 'dark' ? theme.activeColor.dark : theme.activeColor.light})`
}

const sizePreviewText = computed(() => {
  if (themeStore.fontSizeOffset === 0) {
    return t('themeSettings.size.currentDefault')
  }

  const offset = `${themeStore.fontSizeOffset > 0 ? '+' : ''}${themeStore.fontSizeOffset}`
  return t('themeSettings.size.currentOffset', { offset })
})
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon-sm" class="h-8 w-8 rounded-md hover:bg-accent/80">
        <Palette class="h-4 w-4" />
        <span class="sr-only">{{ t('themeSettings.open') }}</span>
      </Button>
    </SheetTrigger>

    <SheetContent
      max-width-class="sm:max-w-[420px]"
      class="w-[420px] border-l border-border/60 bg-background/95 px-0 sm:w-[420px]"
    >
      <div class="flex h-full flex-col">
        <SheetHeader class="sr-only">
          <SheetTitle>{{ t('themeSettings.title') }}</SheetTitle>
          <SheetDescription>{{ t('themeSettings.description') }}</SheetDescription>
        </SheetHeader>

        <div class="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <section class="space-y-4">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold tracking-wide">
                {{ t('themeSettings.modeTitle') }}
              </h3>
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
                      'border-primary/50 bg-primary/[0.08] shadow-[0_10px_30px_-18px_var(--primary)]'
                  )
                "
                @click="themeStore.setMode(option.value)"
              >
                <component
                  :is="option.icon"
                  :class="
                    cn(
                      'h-4 w-4 text-muted-foreground transition-colors',
                      themeStore.mode === option.value && 'text-primary'
                    )
                  "
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
              <h3 class="text-sm font-semibold tracking-wide">
                {{ t('themeSettings.colorTitle') }}
              </h3>
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
                      'border-primary/50 bg-primary/[0.08] shadow-[0_10px_30px_-18px_var(--primary)]'
                  )
                "
                @click="themeStore.setThemeColor(key)"
              >
                <div class="flex items-center gap-2">
                  <div class="relative shrink-0">
                    <span
                      class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/50 shadow-sm ring-1 ring-black/5 dark:border-white/10"
                      :style="{
                        background: `linear-gradient(135deg, ${getColorValue(key)} 0%, color-mix(in oklab, ${getColorValue(key)} 70%, white) 100%)`
                      }"
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
                    <div class="truncate text-sm font-medium text-foreground">
                      {{ t(`themeSettings.colors.${key}`) }}
                    </div>
                    <div class="mt-0.5 truncate text-[11px] text-muted-foreground">{{ key }}</div>
                  </div>
                </div>
              </button>
            </div>
          </section>

          <Separator class="bg-border/60" />

          <section class="space-y-4">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold tracking-wide">
                {{ t('themeSettings.fontTitle') }}
              </h3>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <button
                v-for="[key, font] in fontEntries"
                :key="key"
                type="button"
                :class="
                  cn(
                    'group rounded-xl border border-border/70 bg-card/70 p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md',
                    themeStore.fontFamily === key &&
                      'border-primary/50 bg-primary/[0.08] shadow-[0_10px_30px_-18px_var(--primary)]'
                  )
                "
                @click="themeStore.setFontFamily(key)"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-medium text-foreground">
                      {{ t(`themeSettings.fonts.${key}.label`) }}
                    </div>
                    <div
                      class="mt-2 line-clamp-2 text-sm text-foreground/90"
                      :style="{ fontFamily: font.family }"
                    >
                      {{ t(`themeSettings.fonts.${key}.preview`) }}
                    </div>
                  </div>
                  <Check
                    v-if="themeStore.fontFamily === key"
                    class="h-4 w-4 shrink-0 text-primary"
                  />
                </div>
              </button>
            </div>
          </section>

          <Separator class="bg-border/60" />

          <section class="space-y-4">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold tracking-wide">
                {{ t('themeSettings.sizeTitle') }}
              </h3>
            </div>

            <div class="rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm">
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Type class="h-4 w-4" />
                    <span>{{ sizePreviewText }}</span>
                  </div>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ t('themeSettings.size.hint') }}
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    class="h-8 w-8 rounded-md"
                    :disabled="themeStore.fontSizeOffset <= -2"
                    @click="themeStore.setFontSizeOffset(themeStore.fontSizeOffset - 1)"
                  >
                    <Minus class="h-4 w-4" />
                    <span class="sr-only">{{ t('themeSettings.size.decrease') }}</span>
                  </Button>
                  <Button
                    variant="outline"
                    class="h-8 rounded-md px-3 text-sm"
                    @click="themeStore.setFontSizeOffset(0)"
                  >
                    {{ t('themeSettings.size.reset') }}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    class="h-8 w-8 rounded-md"
                    :disabled="themeStore.fontSizeOffset >= 6"
                    @click="themeStore.setFontSizeOffset(themeStore.fontSizeOffset + 1)"
                  >
                    <Plus class="h-4 w-4" />
                    <span class="sr-only">{{ t('themeSettings.size.increase') }}</span>
                  </Button>
                </div>
              </div>

              <div class="mt-3 rounded-xl bg-muted/40 p-3">
                <div class="text-xs text-muted-foreground">
                  {{ t('themeSettings.size.preview') }}
                </div>
                <div class="mt-2 flex items-end gap-3">
                  <span class="text-xs">12px {{ t('themeSettings.size.sampleText') }}</span>
                  <span class="text-sm">14px {{ t('themeSettings.size.sampleText') }}</span>
                  <span class="text-base">16px {{ t('themeSettings.size.sampleText') }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
