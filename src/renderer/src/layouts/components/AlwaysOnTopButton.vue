<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Pin } from 'lucide-vue-next'

const isAlwaysOnTop = ref(false)

let disposeAlwaysOnTopListener: (() => void) | undefined

onMounted(async () => {
  isAlwaysOnTop.value = await window.api.windowControls.isAlwaysOnTop()
  disposeAlwaysOnTopListener = window.api.windowControls.onAlwaysOnTopChange((value) => {
    isAlwaysOnTop.value = value
  })
})

onBeforeUnmount(() => {
  disposeAlwaysOnTopListener?.()
})

async function toggleAlwaysOnTop(): Promise<void> {
  isAlwaysOnTop.value = await window.api.windowControls.toggleAlwaysOnTop()
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon-sm"
    :class="[
      'h-8 w-8 rounded-md hover:bg-accent/80',
      isAlwaysOnTop && 'bg-accent/80 text-primary'
    ]"
    @click="toggleAlwaysOnTop"
  >
    <Pin class="h-4 w-4" />
    <span class="sr-only">{{ isAlwaysOnTop ? '取消置顶' : '置顶应用' }}</span>
  </Button>
</template>
