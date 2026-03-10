<script setup lang="ts">
import { GripVertical } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button
    variant="ghost"
    size="icon-sm"
    class="app-region-drag h-8 w-8 cursor-grab rounded-md hover:bg-accent/80 active:cursor-grabbing"
  >
    <GripVertical class="h-4 w-4" />
    <span class="sr-only">Drag window</span>
  </Button>
</template>
