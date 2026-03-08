<script setup lang="ts">
import { computed } from 'vue'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { setAppLocale, type AppLocale } from '@/i18n'

const { t, locale } = useI18n()

const currentLanguageLabel = computed(() => {
  return locale.value === 'zh-CN' ? t('userMenu.languageOptionZh') : t('userMenu.languageOptionEn')
})

const currentLanguageShortLabel = computed(() => {
  return locale.value === 'zh-CN' ? '中' : 'EN'
})

async function handleLocaleChange(nextLocale: AppLocale) {
  if (nextLocale === locale.value) {
    return
  }

  await setAppLocale(nextLocale)
}
</script>

<template>
  <Tooltip>
    <DropdownMenu>
      <TooltipTrigger as-child>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            class="h-8 gap-1.5 rounded-md px-2 hover:bg-accent/80"
          >
            <Languages class="h-4 w-4 shrink-0" />
            <span class="text-xs leading-none font-medium">
              {{ currentLanguageShortLabel }}
            </span>
            <span class="sr-only">
              {{ `${t('userMenu.languageBilingual')}：${currentLanguageLabel}` }}
            </span>
          </Button>
        </DropdownMenuTrigger>
      </TooltipTrigger>
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
    <TooltipContent side="bottom">
      <p>{{ `${t('userMenu.languageBilingual')}：${currentLanguageLabel}` }}</p>
    </TooltipContent>
  </Tooltip>
</template>
