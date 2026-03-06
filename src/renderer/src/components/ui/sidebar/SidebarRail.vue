<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { onBeforeUnmount } from "vue"
import { cn } from "@/lib/utils"
import { SIDEBAR_WIDTH_MAX, SIDEBAR_WIDTH_MIN, useSidebar } from "./utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const { isMobile, open, setOpen, setSidebarWidth, toggleSidebar } = useSidebar()

let removeListeners: (() => void) | null = null
let moved = false

function clampWidth(value: number) {
  return Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, value))
}

function handlePointerDown(event: PointerEvent) {
  if (isMobile.value) {
    return
  }

  const target = event.currentTarget as HTMLElement | null
  const sidebar = target?.closest('[data-slot="sidebar"]') as HTMLElement | null
  const side = sidebar?.dataset.side === 'right' ? 'right' : 'left'
  const startX = event.clientX
  moved = false

  const handlePointerMove = (moveEvent: PointerEvent) => {
    const delta = Math.abs(moveEvent.clientX - startX)
    if (delta > 3) {
      moved = true
    }

    const nextWidth = side === 'right' ? window.innerWidth - moveEvent.clientX : moveEvent.clientX
    const clampedWidth = clampWidth(nextWidth)

    if (!open.value) {
      setOpen(true)
    }

    setSidebarWidth(`${clampedWidth}px`)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handlePointerUp = () => {
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    removeListeners = null

    window.setTimeout(() => {
      moved = false
    }, 0)
  }

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp, { once: true })
  removeListeners = () => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }
}

function handleClick(event: MouseEvent) {
  if (moved) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  toggleSidebar()
}

onBeforeUnmount(() => {
  removeListeners?.()
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})
</script>

<template>
  <button
    data-sidebar="rail"
    data-slot="sidebar-rail"
    aria-label="Toggle Sidebar"
    :tabindex="-1"
    title="Toggle Sidebar"
    :class="cn(
      'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex',
      'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
      '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
      'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
      '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
      '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
      props.class,
    )"
    @pointerdown="handlePointerDown"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
