<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import type { NavItem } from '@/config'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<{
  item: NavItem
  asSub?: boolean
}>(), {
  asSub: false
})

const route = useRoute()
const hasChildren = computed(() => (props.item.items?.length ?? 0) > 0)

function hasActiveChild(item: NavItem): boolean {
  if (item.url === route.path) {
    return true
  }

  return item.items?.some(child => hasActiveChild(child)) ?? false
}

const isActive = computed(() => hasActiveChild(props.item))
</script>

<template>
  <template v-if="!hasChildren && !asSub">
    <SidebarMenuItem>
      <SidebarMenuButton as-child :tooltip="item.title" :is-active="isActive">
        <router-link :to="item.url">
          <component :is="item.icon" v-if="item.icon" />
          <span>{{ item.title }}</span>
        </router-link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </template>

  <template v-else-if="!hasChildren && asSub">
    <SidebarMenuSubItem>
      <SidebarMenuSubButton as-child :is-active="isActive">
        <router-link :to="item.url">
          <span>{{ item.title }}</span>
        </router-link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  </template>

  <template v-else-if="hasChildren && !asSub">
    <Collapsible as-child :default-open="item.isActive || isActive" class="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger as-child>
          <SidebarMenuButton :tooltip="item.title" :is-active="isActive">
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
            <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <NavMainTreeItem
              v-for="child in item.items"
              :key="`${child.url}-${child.title}`"
              :item="child"
              as-sub
            />
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  </template>

  <template v-else>
    <Collapsible as-child :default-open="item.isActive || isActive" class="group/collapsible">
      <SidebarMenuSubItem>
        <CollapsibleTrigger as-child>
          <SidebarMenuSubButton :is-active="isActive">
            <span>{{ item.title }}</span>
            <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <NavMainTreeItem
              v-for="child in item.items"
              :key="`${child.url}-${child.title}`"
              :item="child"
              as-sub
            />
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  </template>
</template>
