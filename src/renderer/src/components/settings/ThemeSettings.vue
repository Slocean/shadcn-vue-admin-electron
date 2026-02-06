<script setup lang="ts">
import { useThemeStore, themes } from '@/store/theme'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Check, Moon, Sun, Settings } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'

const themeStore = useThemeStore()
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline" size="icon">
        <Settings class="w-[1.2rem] h-[1.2rem]" />
        <span class="sr-only">Toggle theme settings</span>
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Theme Settings</SheetTitle>
        <SheetDescription>
          Customize the appearance of the application.
        </SheetDescription>
      </SheetHeader>
      
      <div class="py-6 space-y-6">
        <!-- Mode Toggle -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Mode
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              class="justify-start gap-2"
              :class="{ 'border-primary': themeStore.mode === 'light' }"
              @click="themeStore.setMode('light')"
            >
              <Sun class="h-4 w-4" />
              Light
            </Button>
            <Button
              variant="outline"
              class="justify-start gap-2"
              :class="{ 'border-primary': themeStore.mode === 'dark' }"
              @click="themeStore.setMode('dark')"
            >
              <Moon class="h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Color Toggle -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Color
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <Button
              v-for="(theme, key) in themes"
              :key="key"
              variant="outline"
              class="justify-start gap-2 px-3"
              :class="{ 'border-primary': themeStore.themeColor === key }"
              @click="themeStore.setThemeColor(key)"
            >
              <span 
                class="h-4 w-4 rounded-full border border-gray-200 dark:border-gray-700"
                :style="{ backgroundColor: `oklch(${themeStore.mode === 'dark' ? theme.activeColor.dark : theme.activeColor.light})` }"
              ></span>
              {{ theme.label }}
              <Check 
                v-if="themeStore.themeColor === key" 
                class="ml-auto h-4 w-4 opacity-100" 
              />
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
