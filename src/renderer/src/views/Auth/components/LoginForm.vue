<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Eye, EyeOff, Lock, User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LoginPayload {
  username: string
  password: string
}

defineProps<{
  busy: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: LoginPayload): void
  (e: 'switch-register'): void
}>()

const { t } = useI18n()
const showPassword = ref(false)
const rememberDevice = ref(true)

const form = reactive<LoginPayload>({
  username: '',
  password: ''
})

function handleSubmit() {
  emit('submit', {
    username: form.username,
    password: form.password
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="text-sm font-medium text-foreground" for="login-username">{{
        t('auth.username')
      }}</label>
      <div class="relative">
        <User
          class="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="login-username"
          v-model="form.username"
          type="text"
          autocomplete="username"
          :placeholder="t('auth.usernamePlaceholder')"
          class="h-12 rounded-xl border-border/70 bg-muted/35 pl-11 pr-4 shadow-none"
        />
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between gap-3">
        <label class="text-sm font-medium text-foreground" for="login-password">{{
          t('auth.password')
        }}</label>
      </div>
      <div class="relative">
        <Lock
          class="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="login-password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          :placeholder="t('auth.passwordPlaceholder')"
          class="h-12 rounded-xl border-border/70 bg-muted/35 pl-11 pr-11 shadow-none"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-muted-foreground"
          :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')"
          @click="showPassword = !showPassword"
        >
          <Eye v-if="showPassword" class="h-4 w-4" />
          <EyeOff v-else class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <div class="flex justify-end px-1">
      <div class="flex items-center gap-4">
        <Button variant="link" type="button" class="h-auto p-0 text-sm text-primary">
          {{ t('auth.forgotPassword') }}
        </Button>
        <Button
          variant="link"
          type="button"
          class="h-auto p-0 text-sm text-primary"
          @click="emit('switch-register')"
        >
          {{ t('auth.registerLocalAccount') }}
        </Button>
      </div>
    </div>
    <label class="flex cursor-pointer items-center gap-3 px-1 text-sm text-muted-foreground select-none">
      <input
        v-model="rememberDevice"
        type="checkbox"
        class="h-4 w-4 rounded border-border accent-[var(--primary)]"
      />
      <span>{{ t('auth.rememberDevice') }}</span>
    </label>

    <Button
      type="submit"
      class="h-12 w-full rounded-[32px] text-sm font-semibold shadow-lg shadow-primary/25"
      :disabled="busy"
    >
      {{ busy ? t('common.loading') : t('auth.login') }}
      <ArrowRight class="h-4 w-4" />
    </Button>
  </form>
</template>
