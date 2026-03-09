import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuthStore } from '@/store/auth'
import { ClipboardList, Layers3, User, Users } from 'lucide-vue-next'

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
  },
  {
    path: '/account-info',
    name: 'accountInfo',
    component: () => import('../views/AccountInfo.vue'),
    meta: {
      title: '账户信息',
      navGroup: '账户',
      navIcon: User,
      isNotMenu: true,
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/report-management',
    name: 'reportManagement',
    component: () => import('../views/ReportManagement.vue'),
    meta: {
      title: '报告管理',
      navGroup: '报告管理',
      navIcon: ClipboardList,
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/patient-management',
    name: 'patientManagement',
    component: () => import('../views/PatientManagement.vue'),
    meta: {
      title: '患者管理',
      navGroup: '患者管理',
      navIcon: Users,
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/menu-lab',
    name: 'menuLab',
    component: () => import('../views/MenuLab/Layout.vue'),
    meta: {
      title: '菜单层级测试',
      navIcon: Layers3,
      requiresAuth: true,
      layout: 'app'
    },
    children: [
      {
        path: 'reports',
        name: 'menuLabReports',
        component: () => import('../views/MenuLab/Reports.vue'),
        meta: {
          title: '报告中心',
          layout: 'app'
        }
      },
      {
        path: 'patients',
        name: 'menuLabPatients',
        component: () => import('../views/MenuLab/Patients.vue'),
        meta: {
          title: '患者中心',
          layout: 'app'
        }
      },
      {
        path: 'advanced',
        name: 'menuLabAdvanced',
        component: () => import('../views/MenuLab/AdvancedLayout.vue'),
        meta: {
          title: '高级分组',
          layout: 'app'
        },
        children: [
          {
            path: 'daily',
            name: 'menuLabAdvancedDaily',
            component: () => import('../views/MenuLab/AdvancedDaily.vue'),
            meta: {
              title: '日报',
              layout: 'app'
            }
          },
          {
            path: 'monthly',
            name: 'menuLabAdvancedMonthly',
            component: () => import('../views/MenuLab/AdvancedMonthly.vue'),
            meta: {
              title: '月报',
              layout: 'app'
            }
          }
        ]
      }
    ]
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
