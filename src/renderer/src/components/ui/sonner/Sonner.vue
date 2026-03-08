<script lang="ts" setup>
import { computed } from "vue"
import type { ToasterProps } from "vue-sonner"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from "lucide-vue-next"
import { Toaster as Sonner } from "vue-sonner"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<ToasterProps>(), {
  richColors: true,
  closeButton: true,
  closeButtonPosition: "top-right",
})

const mergedProps = computed<ToasterProps>(() => ({
  ...props,
  toastOptions: {
    ...props.toastOptions,
    classes: {
      success: "border-emerald-500/40 bg-emerald-500 text-white",
      info: "border-sky-500/40 bg-sky-500 text-white",
      warning: "border-amber-500/40 bg-amber-500 text-black",
      error: "border-rose-500/40 bg-rose-500 text-white",
      ...(props.toastOptions?.classes ?? {}),
    },
  },
}))
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="mergedProps"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>
