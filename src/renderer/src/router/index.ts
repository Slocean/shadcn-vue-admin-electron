import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home',
      navGroup: 'App'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'About',
      navGroup: 'App'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: appRoutes
})

export default router
