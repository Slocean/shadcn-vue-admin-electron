<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Languages } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { setAppLocale, type AppLocale } from '@/i18n'

const { t, locale } = useI18n()

async function handleLocaleChange(nextLocale: AppLocale) {
  if (nextLocale === locale.value) {
    return
  }

  await setAppLocale(nextLocale)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon-sm"
        class="h-8 w-8 rounded-md hover:bg-accent/80"
      >
        <Languages class="h-4 w-4" />
        <span class="sr-only">{{ t('userMenu.languageBilingual') }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-36 rounded-lg">
      <DropdownMenuRadioGroup
        :model-value="locale"
        @update:model-value="value => handleLocaleChange(value as AppLocale)"
      >
        <DropdownMenuRadioItem value="zh-CN">
          {{ t('userMenu.languageOptionZh') }}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="en-US">
          {{ t('userMenu.languageOptionEn') }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
