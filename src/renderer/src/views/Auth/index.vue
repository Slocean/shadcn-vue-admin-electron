<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Building2, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-vue-next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GlobalSystemControls from '@/layouts/components/GlobalSystemControls.vue'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const mode = computed<'login' | 'register'>(() =>
  route.meta.authMode === 'register' ? 'register' : 'login'
)
const busy = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberDevice = ref(true)

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

watch(mode, () => {
  errorMessage.value = ''
  successMessage.value = ''
})

function handleModeChange(value: string | number) {
  router.push(value === 'register' ? '/auth/register' : '/auth/login')
}

function formatAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return String(error)
  }

  switch (error.message) {
    case 'AUTH_INVALID_LOGIN_PAYLOAD':
      return t('auth.errors.invalidLoginPayload')
    case 'AUTH_INVALID_REGISTER_PAYLOAD':
      return t('auth.errors.invalidRegisterPayload')
    case 'AUTH_USERNAME_TOO_SHORT':
      return t('auth.errors.usernameTooShort')
    case 'AUTH_EMAIL_INVALID':
      return t('auth.errors.emailInvalid')
    case 'AUTH_PASSWORD_TOO_SHORT':
      return t('auth.errors.passwordTooShort')
    case 'AUTH_USER_EXISTS':
      return t('auth.errors.userExists')
    case 'AUTH_INVALID_CREDENTIALS':
      return t('auth.errors.invalidCredentials')
    default:
      if (error.message.startsWith('AUTH_')) {
        return t('auth.errors.unknown')
      }
      return error.message
  }
}

async function handleLogin() {
  busy.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })
    successMessage.value = t('auth.successLogin')
    await router.replace('/')
  } catch (error) {
    errorMessage.value = formatAuthError(error)
  } finally {
    busy.value = false
  }
}

async function handleRegister() {
  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = t('auth.passwordMismatch')
    return
  }

  busy.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const email = registerForm.email.trim()
    await authStore.register({
      username: registerForm.username,
      email: email ? email : null,
      password: registerForm.password
    })
    successMessage.value = t('auth.successRegister')
    await router.replace('/')
  } catch (error) {
    errorMessage.value = formatAuthError(error)
  } finally {
    busy.value = false
  }
}

</script>

<template>
  <div
    class="app-region-no-drag relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8"
  >
    <div class="app-region-drag absolute inset-x-0 top-0 z-20 flex h-14 items-center px-4">
      <div class="flex-1"></div>
      <div class="app-region-no-drag flex items-center">
        <GlobalSystemControls
          :show-always-on-top="false"
          class="flex items-center gap-1"
        />
      </div>
    </div>

    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
      <div class="absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div
        class="absolute inset-0 opacity-40"
        style="
          background-image: radial-gradient(
            circle at 1px 1px,
            color-mix(in oklab, var(--primary) 14%, transparent) 1px,
            transparent 0
          );
          background-size: 40px 40px;
        "
      />
    </div>

    <div class="app-region-no-drag relative z-10 w-full max-w-md">
      <Card
        class="overflow-hidden p-4 rounded-[1.75rem] border-border/70 bg-card/95 shadow-[0_24px_80px_-32px_color-mix(in_oklab,var(--foreground)_18%,transparent)] backdrop-blur"
      >
        <CardContent class="p-0">
          <div class="mb-4 flex flex-col items-center text-center">
            <div
              class="mb-0 flex size-14 items-center justify-center rounded-[1.125rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Building2 class="h-8 w-8" />
            </div>
            <h1 class="text-xl font-semibold tracking-tight text-foreground">
              {{ t('common.appName') }}
            </h1>
            <p class="mt-1.5 text-sm text-muted-foreground">
              {{ mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount') }}
            </p>
          </div>

          <Alert v-if="errorMessage" variant="destructive" class="mb-4">
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>
          <Alert v-else-if="successMessage" class="mb-4 border-primary/30 text-foreground">
            <AlertDescription>{{ successMessage }}</AlertDescription>
          </Alert>

          <Tabs :model-value="mode" class="w-full" @update:model-value="handleModeChange">
            <TabsList class="mb-5 grid h-10 w-full grid-cols-2 rounded-full bg-muted/70 p-1">
              <TabsTrigger value="login" class="rounded-full">{{ t('auth.loginTab') }}</TabsTrigger>
              <TabsTrigger value="register" class="rounded-full">{{
                t('auth.registerTab')
              }}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" class="mt-0">
              <form class="space-y-4" @submit.prevent="handleLogin">
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
                      v-model="loginForm.username"
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
                    <Button variant="link" type="button" class="h-auto p-0 text-sm text-primary">
                      {{ t('auth.forgotPassword') }}
                    </Button>
                  </div>
                  <div class="relative">
                    <Lock
                      class="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="login-password"
                      v-model="loginForm.password"
                      :type="showLoginPassword ? 'text' : 'password'"
                      autocomplete="current-password"
                      :placeholder="t('auth.passwordPlaceholder')"
                      class="h-12 rounded-xl border-border/70 bg-muted/35 pl-11 pr-11 shadow-none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      class="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-muted-foreground"
                      :aria-label="
                        showLoginPassword ? t('auth.hidePassword') : t('auth.showPassword')
                      "
                      @click="showLoginPassword = !showLoginPassword"
                    >
                      <Eye v-if="showLoginPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <label
                  class="flex cursor-pointer items-center gap-3 px-1 text-sm text-muted-foreground select-none"
                >
                  <input
                    v-model="rememberDevice"
                    type="checkbox"
                    class="h-4 w-4 rounded border-border accent-[var(--primary)]"
                  />
                  <span>{{ t('auth.rememberDevice') }}</span>
                </label>

                <Button
                  type="submit"
                  class="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
                  :disabled="busy"
                >
                  {{ busy ? t('common.loading') : t('auth.login') }}
                  <ArrowRight class="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" class="mt-0">
              <form class="space-y-3.5" @submit.prevent="handleRegister">
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
                      v-model="registerForm.username"
                      autocomplete="username"
                      :placeholder="t('auth.usernamePlaceholder')"
                      class="h-11 rounded-xl border-border/70 bg-muted/35 pl-11"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground" for="register-email">{{
                    t('auth.email')
                  }}</label>
                  <Input
                    id="register-email"
                    v-model="registerForm.email"
                    type="email"
                    autocomplete="email"
                    :placeholder="t('auth.emailPlaceholder')"
                    class="h-11 rounded-xl border-border/70 bg-muted/35"
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
                      v-model="registerForm.password"
                      :type="showRegisterPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      :placeholder="t('auth.passwordPlaceholder')"
                      class="h-11 rounded-xl border-border/70 bg-muted/35 pl-11 pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      class="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-muted-foreground"
                      :aria-label="
                        showRegisterPassword ? t('auth.hidePassword') : t('auth.showPassword')
                      "
                      @click="showRegisterPassword = !showRegisterPassword"
                    >
                      <Eye v-if="showRegisterPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div class="space-y-2">
                  <label
                    class="text-sm font-medium text-foreground"
                    for="register-confirm-password"
                    >{{ t('auth.confirmPassword') }}</label
                  >
                  <div class="relative">
                    <Lock
                      class="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="register-confirm-password"
                      v-model="registerForm.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      :placeholder="t('auth.confirmPasswordPlaceholder')"
                      class="h-11 rounded-xl border-border/70 bg-muted/35 pl-11 pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      class="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-muted-foreground"
                      :aria-label="
                        showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')
                      "
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <Eye v-if="showConfirmPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  class="mt-1 h-11 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
                  :disabled="busy"
                >
                  {{ busy ? t('common.loading') : t('auth.register') }}
                  <ArrowRight class="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div class="mt-4">
            <Separator class="bg-border/70" />
            <div class="mt-4 flex items-center justify-between px-2 text-xs text-muted-foreground">
              <p>© 2026 {{ t('common.appName') }}</p>
              <div class="flex items-center gap-4">
                <button type="button" class="transition-colors hover:text-primary">
                  {{ t('auth.support') }}
                </button>
                <button type="button" class="transition-colors hover:text-primary">
                  {{ t('auth.privacy') }}
                </button>
              </div>
            </div>
            <!-- <div class="pt-2 text-center">
              <div
                class="mt-2.5 flex items-center justify-center gap-4 text-[11px] text-muted-foreground"
              >
                <div class="flex items-center gap-1.5">
                  <ShieldCheck class="h-3.5 w-3.5 text-primary" />
                  <span>{{ t('auth.securityAes') }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <ShieldCheck class="h-3.5 w-3.5 text-primary" />
                  <span>{{ t('auth.securityMfa') }}</span>
                </div>
              </div>
            </div> -->
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
