import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuthStore } from '@/store/auth'

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../views/Auth/index.vue'),
    meta: {
      title: 'Login',
      navGroup: 'Auth',
      layout: 'auth',
      guestOnly: true,
      authMode: 'login'
    }
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('../views/Auth/index.vue'),
    meta: {
      title: 'Register',
      navGroup: 'Auth',
      layout: 'auth',
      guestOnly: true,
      authMode: 'register'
    }
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home',
      navGroup: 'Workspace',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'About',
      navGroup: 'Workspace',
      requiresAuth: true,
      layout: 'app'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: appRoutes
})

router.beforeEach(async to => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.hydrate()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export default router
