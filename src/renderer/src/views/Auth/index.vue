<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/auth'
import { setAppLocale } from '@/i18n'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const mode = computed<'login' | 'register'>(() => (route.meta.authMode === 'register' ? 'register' : 'login'))
const busy = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showLoginPassword = ref(false)

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
    errorMessage.value = error instanceof Error ? error.message : String(error)
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
    errorMessage.value = error instanceof Error ? error.message : String(error)
  } finally {
    busy.value = false
  }
}

async function toggleLocale() {
  await setAppLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-2">
        <div class="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{{ t('common.appName') }}</CardTitle>
            <CardDescription>{{ t('auth.brand') }}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" @click="toggleLocale">
            {{ locale === 'zh-CN' ? t('common.english') : t('common.chinese') }}
          </Button>
        </div>
        <CardDescription>{{ t('auth.subtitle') }}</CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <Alert v-if="errorMessage" variant="destructive">
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>
        <Alert v-else-if="successMessage">
          <AlertDescription>{{ successMessage }}</AlertDescription>
        </Alert>

        <Tabs :model-value="mode" class="w-full" @update:model-value="handleModeChange">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="login">{{ t('auth.loginTab') }}</TabsTrigger>
            <TabsTrigger value="register">{{ t('auth.registerTab') }}</TabsTrigger>
          </TabsList>

          <TabsContent value="login" class="space-y-3">
            <Input v-model="loginForm.username" type="text" :placeholder="t('auth.username')" autocomplete="username" />
            <div class="relative">
              <Input
                v-model="loginForm.password"
                :type="showLoginPassword ? 'text' : 'password'"
                :placeholder="t('auth.password')"
                autocomplete="current-password"
                class="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                :aria-label="showLoginPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                @click="showLoginPassword = !showLoginPassword"
              >
                <Eye v-if="showLoginPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </Button>
            </div>
            <Button class="w-full" :disabled="busy" @click="handleLogin">
              {{ busy ? t('common.loading') : t('auth.login') }}
            </Button>
          </TabsContent>

          <TabsContent value="register" class="space-y-3">
            <Input v-model="registerForm.username" :placeholder="t('auth.username')" />
            <Input v-model="registerForm.email" type="email" :placeholder="t('auth.email')" />
            <Input v-model="registerForm.password" type="password" :placeholder="t('auth.password')" />
            <Input v-model="registerForm.confirmPassword" type="password" :placeholder="t('auth.confirmPassword')" />
            <Button class="w-full" :disabled="busy" @click="handleRegister">
              {{ busy ? t('common.loading') : t('auth.register') }}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter class="justify-center text-sm text-muted-foreground">
        {{ mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount') }}
        <Button variant="link" class="px-2" @click="handleModeChange(mode === 'login' ? 'register' : 'login')">
          {{ mode === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin') }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
