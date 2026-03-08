<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Eye, EyeOff, Lock, User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface RegisterPayload {
  username: string
  email: string
  password: string
  confirmPassword: string
}

defineProps<{
  busy: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: RegisterPayload): void
  (e: 'switch-login'): void
}>()

const { t } = useI18n()
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive<RegisterPayload>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function handleSubmit() {
  emit('submit', {
    username: form.username,
    email: form.email,
    password: form.password,
    confirmPassword: form.confirmPassword
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="flex justify-end">
      <Button
        variant="link"
        type="button"
        class="h-auto p-0 text-sm text-primary"
        @click="emit('switch-login')"
      >
        {{ t('auth.backToLogin') }}
      </Button>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium text-foreground" for="register-username">{{
        t('auth.username')
      }}</label>
      <div class="relative">
        <User
          class="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="register-username"
          v-model="form.username"
          autocomplete="username"
          :placeholder="t('auth.usernamePlaceholder')"
          class="h-12 rounded-xl border-border/70 bg-muted/35 pl-11"
        />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium text-foreground" for="register-email">{{
        t('auth.email')
      }}</label>
      <Input
        id="register-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        :placeholder="t('auth.emailPlaceholder')"
        class="h-12 rounded-xl border-border/70 bg-muted/35"
      />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium text-foreground" for="register-password">{{
        t('auth.password')
      }}</label>
      <div class="relative">
        <Lock
          class="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="register-password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          :placeholder="t('auth.passwordPlaceholder')"
          class="h-12 rounded-xl border-border/70 bg-muted/35 pl-11 pr-11"
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

    <div class="space-y-2">
      <label class="text-sm font-medium text-foreground" for="register-confirm-password">{{
        t('auth.confirmPassword')
      }}</label>
      <div class="relative">
        <Lock
          class="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="register-confirm-password"
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          autocomplete="new-password"
          :placeholder="t('auth.confirmPasswordPlaceholder')"
          class="h-12 rounded-xl border-border/70 bg-muted/35 pl-11 pr-11"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-muted-foreground"
          :aria-label="showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <Eye v-if="showConfirmPassword" class="h-4 w-4" />
          <EyeOff v-else class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <Button
      type="submit"
      class="h-12 w-full rounded-[32px] text-sm font-semibold shadow-lg shadow-primary/25"
      :disabled="busy"
    >
      {{ busy ? t('common.loading') : t('auth.register') }}
      <ArrowRight class="h-4 w-4" />
    </Button>
  </form>
</template>
