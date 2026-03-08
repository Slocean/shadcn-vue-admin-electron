<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  ChevronsUpDown,
  Download,
  FolderOpen,
  Info,
  LogOut,
  RefreshCw,
  Settings,
  Upload,
  User
} from 'lucide-vue-next'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/auth'

const props = defineProps<{
  user: {
    name: string
    email: string
    avatar: string
  }
}>()

const { isMobile } = useSidebar()
const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const userInitials = computed(() => {
  const name = props.user.name?.trim()
  const email = props.user.email?.trim()
  const source = name || email || ''

  if (!source) {
    return 'U'
  }

  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
})

async function handleLogout() {
  await authStore.logout()
  await router.push({ name: 'login' })
}

async function openAccountInfo() {
  await router.push({ name: 'accountInfo' })
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg">
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg">
                  {{ userInitials }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="openAccountInfo">
              <User />
              {{ t('userMenu.accountInfo') }}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Upload />
              {{ t('userMenu.dataBackup') }}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download />
              {{ t('userMenu.dataRestore') }}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              {{ t('userMenu.reportSettings') }}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderOpen />
              {{ t('userMenu.dataDirectory') }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RefreshCw />
              {{ t('userMenu.versionUpdate') }}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Info />
              {{ t('userMenu.aboutUs') }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="handleLogout">
              <LogOut />
              {{ t('userMenu.logout') }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
