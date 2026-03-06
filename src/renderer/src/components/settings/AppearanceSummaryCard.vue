<template>
  <div class="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent p-5 shadow-sm">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-primary">
          <Sparkles class="h-4 w-4" />
          <span class="text-xs font-medium tracking-[0.18em] uppercase">Appearance</span>
        </div>
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <p class="max-w-[28ch] text-sm leading-6 text-muted-foreground">{{ description }}</p>
      </div>

      <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background/80 text-primary shadow-sm ring-1 ring-border/50 backdrop-blur">
        <Palette class="h-5 w-5" />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <Badge variant="secondary" class="rounded-full px-3 py-1 text-xs">
        当前模式：{{ modeLabel }}
      </Badge>
      <Badge variant="secondary" class="rounded-full px-3 py-1 text-xs">
        当前主题：{{ themeLabel }}
      </Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Palette, Sparkles } from 'lucide-vue-next'

withDefaults(defineProps<{
  title?: string
  description?: string
  modeLabel: string
  themeLabel: string
}>(), {
  title: '界面设置',
  description: '调整整体外观风格，让应用更贴合你的使用习惯。'
})
</script>
