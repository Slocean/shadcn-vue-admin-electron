<script setup lang="ts">
import AlwaysOnTopButton from './AlwaysOnTopButton.vue'
import LanguageSwitcherButton from './LanguageSwitcherButton.vue'
import WindowControls from './WindowControls.vue'
import ThemeSettings from '@/components/settings/ThemeSettings.vue'

withDefaults(
  defineProps<{
    showLanguage?: boolean
    showTheme?: boolean
    showAlwaysOnTop?: boolean
    showWindowControls?: boolean
    class?: string
  }>(),
  {
    showLanguage: true,
    showTheme: true,
    showAlwaysOnTop: true,
    showWindowControls: true,
    class: 'flex items-center gap-2'
  }
)
</script>

<template>
  <div :class="class">
    <LanguageSwitcherButton v-if="showLanguage" />
    <ThemeSettings v-if="showTheme" />
    <AlwaysOnTopButton v-if="showAlwaysOnTop" />
    <WindowControls v-if="showWindowControls" />
  </div>
</template>
