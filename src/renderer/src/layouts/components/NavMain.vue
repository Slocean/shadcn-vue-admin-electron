<script setup lang="ts">
import type { NavItem } from '@/config'
import NavMainTreeItem from './NavMainTreeItem.vue'
import {
  SidebarGroup,
  SidebarMenu,
} from '@/components/ui/sidebar'

defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <NavMainTreeItem
        v-for="item in items"
        :key="`${item.url}-${item.title}`"
        :item="item"
      />
    </SidebarMenu>
  </SidebarGroup>
</template>
