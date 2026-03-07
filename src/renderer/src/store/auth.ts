import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface SessionUser {
  id: number
  username: string
  email: string | null
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SessionUser | null>(null)
  const initialized = ref(false)
  const isAuthenticated = computed(() => Boolean(user.value))

  async function hydrate() {
    user.value = await window.api.auth.getSession()
    initialized.value = true
    return user.value
  }

  async function login(payload: { username: string; password: string }) {
    user.value = await window.api.auth.login(payload)
    initialized.value = true
    return user.value
  }

  async function register(payload: { username: string; email?: string | null; password: string }) {
    user.value = await window.api.auth.register(payload)
    initialized.value = true
    return user.value
  }

  async function logout() {
    await window.api.auth.logout()
    user.value = null
  }

  return {
    user,
    initialized,
    isAuthenticated,
    hydrate,
    login,
    register,
    logout
  }
})
