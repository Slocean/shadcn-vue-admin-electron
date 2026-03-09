<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Building2 } from 'lucide-vue-next'
import { showToast } from '@/components/ui/sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import GlobalSystemControls from '@/layouts/components/GlobalSystemControls.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm, { type RegisterPayload } from './components/RegisterForm.vue'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const mode = computed<'login' | 'register'>(() =>
  route.meta.authMode === 'register' ? 'register' : 'login'
)
const busy = ref(false)
const successMessage = ref('')
const authContainerRef = ref<HTMLElement | null>(null)
const pointerX = ref(0)
const pointerY = ref(0)
const isPointerInside = ref(false)
const starfieldStyle = computed(() => ({
  '--star-x': `${pointerX.value}px`,
  '--star-y': `${pointerY.value}px`,
  opacity: isPointerInside.value ? '1' : '0'
}))

watch(mode, () => {
  successMessage.value = ''
})

function updatePointerPosition(event: MouseEvent): void {
  const container = authContainerRef.value
  if (!container) {
    return
  }

  const rect = container.getBoundingClientRect()
  pointerX.value = event.clientX - rect.left
  pointerY.value = event.clientY - rect.top
}

function handlePointerEnter(event: MouseEvent): void {
  isPointerInside.value = true
  updatePointerPosition(event)
}

function handlePointerMove(event: MouseEvent): void {
  updatePointerPosition(event)
}

function handlePointerLeave(): void {
  isPointerInside.value = false
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

async function handleLogin(payload: { username: string; password: string }) {
  busy.value = true
  successMessage.value = ''

  try {
    await authStore.login({
      username: payload.username,
      password: payload.password
    })
    successMessage.value = t('auth.successLogin')
    await router.replace('/')
  } catch (error) {
    showToast(formatAuthError(error), { type: 'error', position: 'top-center' })
  } finally {
    busy.value = false
  }
}

async function handleRegister(payload: RegisterPayload) {
  if (payload.password !== payload.confirmPassword) {
    showToast(t('auth.passwordMismatch'), { type: 'error', position: 'top-center' })
    return
  }

  busy.value = true
  successMessage.value = ''

  try {
    const email = payload.email.trim()
    await authStore.register({
      username: payload.username,
      email: email ? email : null,
      password: payload.password
    })
    successMessage.value = t('auth.successRegister')
    await router.replace('/')
  } catch (error) {
    showToast(formatAuthError(error), { type: 'error', position: 'top-center' })
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div
    ref="authContainerRef"
    class="app-region-no-drag relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8"
    @mouseenter="handlePointerEnter"
    @mousemove="handlePointerMove"
    @mouseleave="handlePointerLeave"
  >
    <div class="app-region-drag absolute inset-x-0 top-0 z-20 flex h-14 items-center px-4">
      <div class="flex-1"></div>
      <div class="app-region-no-drag flex items-center">
        <GlobalSystemControls :show-always-on-top="false" class="flex items-center gap-1" />
      </div>
    </div>

    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div class="absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-primary/12 blur-3xl" />
      <div
        class="absolute inset-0 opacity-48"
        style="
          background-image: radial-gradient(
            circle at 1px 1px,
            color-mix(in oklab, var(--primary) 18%, transparent) 1px,
            transparent 0
          );
          background-size: 40px 40px;
        "
      />
      <div
        class="starfield-overlay absolute inset-0 transition-opacity duration-300"
        :style="starfieldStyle"
      />
    </div>

    <div class="app-region-no-drag relative z-10 w-full max-w-sm">
      <Card
        class="overflow-hidden p-8 rounded-[15px] border-border/70 bg-card/80 shadow-[0_30px_70px_-18px_rgba(0,0,0,0.18)] backdrop-blur"
      >
        <CardContent class="p-0">
          <div class="mb-4 flex flex-col items-center text-center">
            <div
              class="mb-3 flex size-14 items-center justify-center rounded-[1.125rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20"
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

          <p
            v-if="successMessage"
            class="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground"
          >
            {{ successMessage }}
          </p>

          <Tabs :model-value="mode" class="w-full">
            <TabsContent value="login" class="mt-0">
              <LoginForm
                :busy="busy"
                @submit="handleLogin"
                @switch-register="router.push('/auth/register')"
              />
            </TabsContent>

            <TabsContent value="register" class="mt-0">
              <RegisterForm
                :busy="busy"
                @submit="handleRegister"
                @switch-login="router.push('/auth/login')"
              />
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
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.starfield-overlay {
  --star-x: 50%;
  --star-y: 50%;
  --star-strong: color-mix(in oklab, var(--primary) 72%, transparent);
  --star-medium: color-mix(in oklab, var(--primary) 56%, transparent);
  --star-soft: color-mix(in oklab, var(--primary) 40%, transparent);
  background-image:
    radial-gradient(circle at 12% 24%, var(--star-strong) 0 1px, transparent 1.8px),
    radial-gradient(circle at 78% 18%, var(--star-medium) 0 1.2px, transparent 2px),
    radial-gradient(circle at 62% 74%, var(--star-strong) 0 1px, transparent 1.6px),
    radial-gradient(circle at 26% 68%, var(--star-soft) 0 1.1px, transparent 1.8px),
    radial-gradient(circle at 1px 1px, var(--star-soft) 1px, transparent 0);
  background-size:
    280px 280px,
    320px 320px,
    260px 260px,
    340px 340px,
    36px 36px;
  background-position:
    0 0,
    40px 20px,
    -30px 50px,
    80px -60px,
    0 0;
  mix-blend-mode: screen;
  opacity: 0;
  animation: starfield-twinkle 6s ease-in-out infinite alternate;
  -webkit-mask-image: radial-gradient(
    circle 180px at var(--star-x) var(--star-y),
    rgba(0, 0, 0, 1) 0,
    rgba(0, 0, 0, 0.75) 55%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-image: radial-gradient(
    circle 180px at var(--star-x) var(--star-y),
    rgba(0, 0, 0, 1) 0,
    rgba(0, 0, 0, 0.75) 55%,
    rgba(0, 0, 0, 0) 100%
  );
}

@keyframes starfield-twinkle {
  0% {
    filter: brightness(0.88) saturate(0.95);
  }
  100% {
    filter: brightness(1.12) saturate(1.05);
  }
}
</style>
