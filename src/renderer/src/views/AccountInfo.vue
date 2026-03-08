<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const { t } = useI18n()

const createdAtText = computed(() => {
  const createdAt = authStore.user?.createdAt
  if (!createdAt) {
    return '-'
  }

  return new Date(createdAt).toLocaleString()
})
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <Card class="md:col-span-2">
      <CardHeader>
        <CardTitle>{{ t('accountInfo.title') }}</CardTitle>
        <CardDescription>{{ t('accountInfo.subtitle') }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-2">
          <Badge>{{ t('accountInfo.basicInfo') }}</Badge>
        </div>
        <div class="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p class="text-muted-foreground">{{ t('accountInfo.username') }}</p>
            <p class="font-medium">{{ authStore.user?.username || '-' }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">{{ t('accountInfo.email') }}</p>
            <p class="font-medium">{{ authStore.user?.email || '-' }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">{{ t('accountInfo.createdAt') }}</p>
            <p class="font-medium">{{ createdAtText }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>{{ t('accountInfo.security') }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 text-sm text-muted-foreground">
        <p>{{ t('accountInfo.securityHint') }}</p>
        <Button variant="outline" disabled>
          {{ t('accountInfo.changePassword') }}
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
