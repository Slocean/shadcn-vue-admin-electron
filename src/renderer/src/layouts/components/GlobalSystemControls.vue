<script setup lang="ts">
import AlwaysOnTopButton from './AlwaysOnTopButton.vue'
import LanguageSwitcherButton from './LanguageSwitcherButton.vue'
import WindowControls from './WindowControls.vue'
import ThemeSettings from '@/components/settings/ThemeSettings.vue'
</script>

<template>
  <div class="flex items-center gap-2">
    <LanguageSwitcherButton />
    <ThemeSettings />
    <AlwaysOnTopButton />
    <WindowControls />
  </div>
</template>
