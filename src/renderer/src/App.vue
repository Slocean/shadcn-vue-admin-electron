<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from '@/layouts/sidebar/index.vue'
import { Toaster } from '@/components/ui/sonner'

const route = useRoute()

const layout = computed(() => route.meta.layout ?? 'app')
</script>

<template>
  <AppSidebar v-if="layout === 'app'" />
  <RouterView v-else />
  <Toaster position="top-center" />
</template>
