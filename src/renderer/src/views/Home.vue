<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { setAppLocale } from '@/i18n'

const authStore = useAuthStore()
const { t, locale } = useI18n()

const languageLabel = computed(() => (locale.value === 'zh-CN' ? t('common.english') : t('common.chinese')))

async function toggleLocale() {
  await setAppLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
}

async function handleLogout() {
  await authStore.logout()
  window.location.hash = '#/auth/login'
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <Card class="xl:col-span-2">
      <CardHeader>
        <CardTitle>{{ t('home.title') }}</CardTitle>
        <CardDescription>{{ t('home.welcome') }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-2">
          <Badge>{{ t('home.authStatus') }}</Badge>
          <span class="text-sm text-muted-foreground">
            {{ t('home.signedInAs') }}: {{ authStore.user?.email }}
          </span>
        </div>
        <div class="flex flex-wrap gap-3">
          <Button @click="toggleLocale">{{ t('common.language') }}: {{ languageLabel }}</Button>
          <Button variant="outline" @click="handleLogout">{{ t('common.logout') }}</Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>SQLite</CardTitle>
      </CardHeader>
      <CardContent class="text-sm text-muted-foreground">
        {{ t('home.sqlite') }}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Store</CardTitle>
      </CardHeader>
      <CardContent class="text-sm text-muted-foreground">
        {{ t('home.settings') }}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>i18n</CardTitle>
      </CardHeader>
      <CardContent class="text-sm text-muted-foreground">
        {{ t('home.i18n') }}
      </CardContent>
    </Card>
  </div>
</template>
