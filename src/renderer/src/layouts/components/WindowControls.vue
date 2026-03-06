<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Copy, Minus, Square, X } from 'lucide-vue-next'

const isMaximized = ref(false)

let disposeMaximizedListener: (() => void) | undefined

onMounted(async () => {
  isMaximized.value = await window.api.windowControls.isMaximized()
  disposeMaximizedListener = window.api.windowControls.onMaximizedChange((value) => {
    isMaximized.value = value
  })
})

onBeforeUnmount(() => {
  disposeMaximizedListener?.()
})

function minimizeWindow(): void {
  void window.api.windowControls.minimize()
}

function toggleMaximizeWindow(): void {
  void window.api.windowControls.toggleMaximize()
}

function closeWindow(): void {
  void window.api.windowControls.close()
}
</script>

<template>
  <div class="flex items-center gap-1">
    <Button
      variant="ghost"
      size="icon-sm"
      class="h-8 w-8 rounded-md hover:bg-accent/80"
      @click="minimizeWindow"
    >
      <Minus class="h-4 w-4" />
      <span class="sr-only">最小化</span>
    </Button>
    <Button
      variant="ghost"
      size="icon-sm"
      class="h-8 w-8 rounded-md hover:bg-accent/80"
      @click="toggleMaximizeWindow"
    >
      <Copy v-if="isMaximized" class="h-3.5 w-3.5" />
      <Square v-else class="h-3.5 w-3.5" />
      <span class="sr-only">{{ isMaximized ? '还原' : '最大化' }}</span>
    </Button>
    <Button
      variant="ghost"
      size="icon-sm"
      class="h-8 w-8 rounded-md hover:bg-destructive hover:text-white dark:hover:text-white"
      @click="closeWindow"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">关闭</span>
    </Button>
  </div>
</template>
