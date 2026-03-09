<script lang="ts">
export const description = 'A sidebar that collapses to icons.'
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full'
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import GlobalSystemControls from '../components/GlobalSystemControls.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const route = useRoute()
const { t } = useI18n()

type BreadcrumbEntry = {
  title: string
  to?: string
}

function resolveTitle(record: { meta?: Record<string, unknown>; name?: unknown; path: string }) {
  const titleKey = typeof record.name === 'string' ? `${record.name}.title` : ''

  if (titleKey && t(titleKey) !== titleKey) {
    return t(titleKey)
  }

  if (typeof record.meta?.title === 'string' && record.meta.title.length > 0) {
    return record.meta.title
  }

  if (typeof record.name === 'string' && record.name.length > 0) {
    return record.name.charAt(0).toUpperCase() + record.name.slice(1)
  }

  return record.path
}

const breadcrumbs = computed<BreadcrumbEntry[]>(() => {
  return route.matched.map((record, index, records) => ({
    title: resolveTitle(record),
    to: index === records.length - 1 ? undefined : record.path
  }))
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="app-region-drag flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 select-none transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 supports-[backdrop-filter]:bg-background/60"
      >
        <div class="app-region-no-drag flex min-w-0 items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb class="min-w-0">
            <BreadcrumbList>
              <template v-for="(item, index) in breadcrumbs" :key="`${item.title}-${index}`">
                <BreadcrumbItem :class="index < breadcrumbs.length - 1 ? 'hidden md:block' : ''">
                  <BreadcrumbLink v-if="item.to" as-child>
                    <RouterLink :to="item.to">{{ item.title }}</RouterLink>
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>{{ item.title }}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" :class="index < breadcrumbs.length - 1 ? 'hidden md:block' : ''" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="min-w-6 flex-1"></div>

        <div class="app-region-no-drag flex items-center gap-2">
          <GlobalSystemControls />
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <router-view />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
