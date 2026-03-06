import type { RouteRecordRaw } from 'vue-router'
import { SquareTerminal, type LucideIcon } from 'lucide-vue-next'
import { appRoutes } from '@/router'

export interface NavItemChild {
  title: string
  url: string
}

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItemChild[]
}

type AppRouteMeta = {
  title?: string
  navGroup?: string
  navIcon?: LucideIcon
}

const DEFAULT_NAV_GROUP = 'App'

function readRouteMeta(route: RouteRecordRaw): AppRouteMeta {
  return (route.meta ?? {}) as AppRouteMeta
}

function resolveRouteTitle(route: RouteRecordRaw) {
  const meta = readRouteMeta(route)
  if (meta.title) {
    return meta.title
  }

  if (typeof route.name === 'string' && route.name.length > 0) {
    return route.name.charAt(0).toUpperCase() + route.name.slice(1)
  }

  return route.path
}

function resolveGroupTitle(route: RouteRecordRaw) {
  const meta = readRouteMeta(route)
  return meta.navGroup || meta.title || DEFAULT_NAV_GROUP
}

function resolveGroupIcon(routes: RouteRecordRaw[]) {
  return routes.map(route => readRouteMeta(route).navIcon).find(Boolean) || SquareTerminal
}

function collectLeafRoutes(routes: RouteRecordRaw[], parentPath = ''): NavItemChild[] {
  return routes.flatMap(route => {
    const currentPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/')

    if (route.children?.length) {
      return collectLeafRoutes(route.children, currentPath)
    }

    return [{
      title: resolveRouteTitle(route),
      url: currentPath
    }]
  })
}

function buildNavMain(routes: RouteRecordRaw[]): NavItem[] {
  const routeGroups = new Map<string, RouteRecordRaw[]>()

  routes.forEach(route => {
    const groupTitle = resolveGroupTitle(route)
    const groupRoutes = routeGroups.get(groupTitle) ?? []
    groupRoutes.push(route)
    routeGroups.set(groupTitle, groupRoutes)
  })

  return Array.from(routeGroups.entries()).map(([title, groupRoutes], index) => ({
    title,
    url: groupRoutes[0]?.path || '#',
    icon: resolveGroupIcon(groupRoutes),
    isActive: index === 0,
    items: collectLeafRoutes(groupRoutes)
  }))
}

export const navMain = buildNavMain(appRoutes)
