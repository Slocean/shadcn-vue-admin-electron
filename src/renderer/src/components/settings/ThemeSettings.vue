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
    <SheetContent class="w-[350px] sm:w-[400px]">
      <SheetHeader>
        <SheetTitle>Theme Settings</SheetTitle>
        <SheetDescription> Customize the appearance of the application. </SheetDescription>
      </SheetHeader>

      <div class="grid gap-8 py-8">
        <!-- Mode Toggle -->
        <div class="space-y-4">
          <div>
            <h3 class="font-medium leading-none">Interface Mode</h3>
            <p class="text-xs text-muted-foreground pt-1.5">Select your preferred display mode.</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              class="justify-start gap-2 h-auto py-3 px-4"
              :class="{ 'border-primary bg-primary/5': themeStore.mode === 'light' }"
              @click="themeStore.setMode('light')"
            >
              <Sun class="h-4 w-4 shrink-0" />
              <div class="flex flex-col items-start gap-1">
                <span class="font-medium">Light</span>
              </div>
              <Check
                v-if="themeStore.mode === 'light'"
                class="ml-auto h-4 w-4 opacity-100 text-primary"
              />
            </Button>
            <Button
              variant="outline"
              class="justify-start gap-2 h-auto py-3 px-4"
              :class="{ 'border-primary bg-primary/5': themeStore.mode === 'dark' }"
              @click="themeStore.setMode('dark')"
            >
              <Moon class="h-4 w-4 shrink-0" />
              <div class="flex flex-col items-start gap-1">
                <span class="font-medium">Dark</span>
              </div>
              <Check
                v-if="themeStore.mode === 'dark'"
                class="ml-auto h-4 w-4 opacity-100 text-primary"
              />
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Color Toggle -->
        <div class="space-y-4">
          <div>
            <h3 class="font-medium leading-none">Accent Color</h3>
            <p class="text-xs text-muted-foreground pt-1.5">
              Choose the primary accent color for the interface.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <Button
              v-for="(theme, key) in themes"
              :key="key"
              variant="outline"
              class="justify-start gap-3 h-auto py-2.5 px-3"
              :class="{ 'border-primary bg-primary/5': themeStore.themeColor === key }"
              @click="themeStore.setThemeColor(key)"
            >
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700"
                :style="{
                  backgroundColor: `oklch(${themeStore.mode === 'dark' ? theme.activeColor.dark : theme.activeColor.light})`
                }"
              ></span>
              <span class="flex-1 text-left">{{ theme.label }}</span>
              <Check
                v-if="themeStore.themeColor === key"
                class="h-4 w-4 opacity-100 text-primary"
              />
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
