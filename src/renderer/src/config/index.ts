import type { RouteRecordRaw } from 'vue-router'
import { SquareTerminal, type LucideIcon } from 'lucide-vue-next'
import { appRoutes } from '@/router'
import { i18n } from '@/i18n'

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

type AppRouteMeta = {
  title?: string
  navIcon?: LucideIcon
  isNotMenu?: boolean
}

function readRouteMeta(route: RouteRecordRaw): AppRouteMeta {
  return (route.meta ?? {}) as AppRouteMeta
}

function resolveRouteTitle(route: RouteRecordRaw) {
  const { t } = i18n.global
  const meta = readRouteMeta(route)
  const titleKey = typeof route.name === 'string' ? `${route.name}.title` : ''

  if (titleKey && t(titleKey) !== titleKey) {
    return t(titleKey)
  }

  if (meta.title) {
    return meta.title
  }

  if (typeof route.name === 'string' && route.name.length > 0) {
    return route.name.charAt(0).toUpperCase() + route.name.slice(1)
  }

  return route.path
}

function collectNavItems(
  routes: RouteRecordRaw[],
  parentPath = '',
  inheritedRequiresAuth = false
): NavItem[] {
  return routes.flatMap(route => {
    const meta = readRouteMeta(route)
    const currentPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/')
    const requiresAuth = Boolean(route.meta?.requiresAuth ?? inheritedRequiresAuth)
    const isNotMenu = Boolean(meta.isNotMenu)

    const children = route.children?.length
      ? collectNavItems(route.children, currentPath, requiresAuth)
      : []

    if (children.length > 0) {
      if (isNotMenu) {
        return children
      }

      return [{
        title: resolveRouteTitle(route),
        url: currentPath,
        icon: meta.navIcon || SquareTerminal,
        items: children
      }]
    }

    if (!requiresAuth || isNotMenu) {
      return []
    }

    return [{
      title: resolveRouteTitle(route),
      url: currentPath,
      icon: meta.navIcon || SquareTerminal,
    }]
  })
}

function buildNavMain(routes: RouteRecordRaw[]): NavItem[] {
  return collectNavItems(routes).map((item, index) => ({
    ...item,
    isActive: index === 0
  }))
}

export const navMain = buildNavMain(appRoutes)
