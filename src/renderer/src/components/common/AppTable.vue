<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import { SlidersHorizontal } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type DataIndex = string | string[]

interface AppTableColumn {
  title: string
  dataIndex: DataIndex
  key?: string
  align?: 'left' | 'center' | 'right'
}

type SortOrder = 'asc' | 'desc' | null
interface SortState {
  key: string
  order: SortOrder
}

interface AppTableTitleActionTriggerPayload {
  slotName: string
  action: string
  event?: Event
  data?: unknown
}

interface AppTableTitleActionSlot {
  name: string
  onTrigger?: (payload: AppTableTitleActionTriggerPayload) => void
}

const props = withDefaults(
  defineProps<{
    columns: AppTableColumn[]
    dataSource: any[]
    title?: string
    bordered?: boolean
    filterColumns?: DataIndex[]
    rowKey?: string
    filterPlaceholder?: string
    emptyText?: string
    sortable?: boolean
    columnFilterable?: boolean
    pagination?: boolean
    defaultPageSize?: number
    pageSizeOptions?: number[]
    showPaginationTotal?: boolean
    showSizeChanger?: boolean
    titleActionGap?: number | string
    titleActionSlots?: AppTableTitleActionSlot[]
  }>(),
  {
    title: '',
    bordered: true,
    rowKey: 'id',
    filterPlaceholder: '',
    emptyText: '',
    sortable: true,
    columnFilterable: true,
    pagination: false,
    defaultPageSize: 10,
    pageSizeOptions: () => [10, 20, 30, 50],
    showPaginationTotal: true,
    showSizeChanger: true,
    titleActionGap: 8,
    titleActionSlots: () => []
  }
)
const emit = defineEmits<{
  (event: 'title-action-trigger', payload: AppTableTitleActionTriggerPayload): void
}>()
const slots = useSlots()
const { t } = useI18n()

const keyword = ref('')
const sortState = ref<SortState>({ key: '', order: null })
const visibleColumnKeys = ref<string[]>([])
const currentPage = ref(1)

const sanitizePositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback
  }
  return parsed
}

const pageSize = ref(sanitizePositiveInt(props.defaultPageSize, 10))

const textWithFallback = (
  key: string,
  fallback: string,
  values?: Record<string, string | number>
): string => {
  const localized = values ? t(key as never, values as never) : t(key as never)
  return localized === key ? fallback : localized
}

const normalizeDataIndex = (dataIndex: DataIndex): string[] =>
  Array.isArray(dataIndex) ? dataIndex : dataIndex.split('.')

const dataIndexKey = (dataIndex: DataIndex): string => normalizeDataIndex(dataIndex).join('.')
const getColumnKey = (column: AppTableColumn): string => column.key ?? dataIndexKey(column.dataIndex)

const getValueByDataIndex = (record: any, dataIndex: DataIndex): unknown => {
  const path = normalizeDataIndex(dataIndex)
  let current: unknown = record

  for (const key of path) {
    if (current == null || typeof current !== 'object') {
      return undefined
    }

    current = current[key]
  }

  return current
}

const displayText = (value: unknown): string => {
  if (value == null) {
    return ''
  }

  return String(value)
}

const alignClass = (align?: AppTableColumn['align']): string => {
  if (align === 'center') {
    return 'text-center'
  }

  if (align === 'right') {
    return 'text-right'
  }

  return 'text-left'
}

const activeFilterColumns = computed(() => {
  if (props.filterColumns && props.filterColumns.length > 0) {
    return props.filterColumns
  }

  return props.columns.map((column) => column.dataIndex)
})

const visibleColumns = computed(() =>
  props.columns.filter((column) => visibleColumnKeys.value.includes(getColumnKey(column)))
)

const searchedDataSource = computed(() => {
  const search = keyword.value.trim().toLowerCase()

  if (!search) {
    return props.dataSource
  }

  return props.dataSource.filter((record) => {
    return activeFilterColumns.value.some((dataIndex) => {
      const value = getValueByDataIndex(record, dataIndex)
      return displayText(value).toLowerCase().includes(search)
    })
  })
})

const sortedDataSource = computed(() => {
  const { key, order } = sortState.value
  if (!props.sortable || !key || !order) {
    return searchedDataSource.value
  }

  const column = props.columns.find((item) => getColumnKey(item) === key)
  if (!column) {
    return searchedDataSource.value
  }

  const factor = order === 'asc' ? 1 : -1

  return [...searchedDataSource.value].sort((a, b) => {
    const aValue = getValueByDataIndex(a, column.dataIndex)
    const bValue = getValueByDataIndex(b, column.dataIndex)

    if (aValue == null && bValue == null) return 0
    if (aValue == null) return -1 * factor
    if (bValue == null) return 1 * factor

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * factor
    }

    const aText = String(aValue)
    const bText = String(bValue)
    return aText.localeCompare(bText, undefined, { numeric: true, sensitivity: 'base' }) * factor
  })
})

const normalizedPageSizeOptions = computed(() => {
  const options = props.pageSizeOptions.map((size) => sanitizePositiveInt(size, 0)).filter((size) => size > 0)
  const merged = new Set<number>([...options, pageSize.value])
  return Array.from(merged).sort((a, b) => a - b)
})

const totalItems = computed(() => sortedDataSource.value.length)
const totalPages = computed(() => {
  if (!props.pagination) {
    return 1
  }
  return Math.max(1, Math.ceil(totalItems.value / pageSize.value))
})

const pagedDataSource = computed(() => {
  if (!props.pagination) {
    return sortedDataSource.value
  }

  const start = (currentPage.value - 1) * pageSize.value
  return sortedDataSource.value.slice(start, start + pageSize.value)
})

const rowIndexOffset = computed(() => {
  if (!props.pagination) {
    return 0
  }
  return (currentPage.value - 1) * pageSize.value
})

const startItem = computed(() => {
  if (totalItems.value === 0) {
    return 0
  }
  return rowIndexOffset.value + 1
})

const endItem = computed(() => {
  if (!props.pagination || totalItems.value === 0) {
    return totalItems.value
  }
  return Math.min(rowIndexOffset.value + pageSize.value, totalItems.value)
})

const filterPlaceholderText = computed(() =>
  props.filterPlaceholder || textWithFallback('appTable.searchPlaceholder', 'Search all columns')
)

const emptyTextValue = computed(() =>
  props.emptyText || textWithFallback('appTable.emptyText', 'No records found')
)

const viewText = computed(() => textWithFallback('appTable.view', 'View'))
const toggleColumnsText = computed(() => textWithFallback('appTable.toggleColumns', 'Toggle columns'))
const rowsPerPageText = computed(() => textWithFallback('appTable.rowsPerPage', 'Rows per page'))
const showingSummaryText = computed(() =>
  textWithFallback('appTable.showingSummary', `Showing ${startItem.value}-${endItem.value} of ${totalItems.value}`, {
    start: startItem.value,
    end: endItem.value,
    total: totalItems.value
  })
)

const resolveGap = (value: number | string): string => {
  if (typeof value === 'number') {
    return `${Math.max(0, value)}px`
  }

  const trimmed = value.trim()
  return trimmed || '8px'
}

const resolvedTitleActionSlots = computed(() =>
  props.titleActionSlots.filter((slotConfig) => typeof slots[slotConfig.name] === 'function')
)

const hasTitleActions = computed(() => resolvedTitleActionSlots.value.length > 0)

const titleActionStyle = computed(() => ({
  gap: resolveGap(props.titleActionGap)
}))

watch(
  () => props.columns,
  (columns) => {
    const allKeys = columns.map((column) => getColumnKey(column))
    if (visibleColumnKeys.value.length === 0) {
      visibleColumnKeys.value = allKeys
      return
    }

    const existed = visibleColumnKeys.value.filter((key) => allKeys.includes(key))
    visibleColumnKeys.value = existed.length > 0 ? existed : allKeys

    if (!allKeys.includes(sortState.value.key)) {
      sortState.value = { key: '', order: null }
    }
  },
  { immediate: true }
)

watch(
  () => props.defaultPageSize,
  (size) => {
    pageSize.value = sanitizePositiveInt(size, 10)
    currentPage.value = 1
  }
)

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

watch(keyword, () => {
  currentPage.value = 1
})

watch(
  () => props.dataSource,
  () => {
    currentPage.value = 1
  }
)

const onPageSizeChange = (value: unknown): void => {
  pageSize.value = sanitizePositiveInt(value, pageSize.value)
  currentPage.value = 1
}

const isColumnVisible = (key: string): boolean => visibleColumnKeys.value.includes(key)

const setColumnVisible = (key: string, checked: boolean): void => {
  const visible = checked === true
  const current = new Set(visibleColumnKeys.value)

  if (visible) {
    current.add(key)
  } else {
    if (current.size <= 1) {
      return
    }
    current.delete(key)
    if (sortState.value.key === key) {
      sortState.value = { key: '', order: null }
    }
  }

  visibleColumnKeys.value = props.columns
    .map((column) => getColumnKey(column))
    .filter((columnKey) => current.has(columnKey))
}

const nextSortOrder = (current: SortOrder): SortOrder => {
  if (current === null) return 'asc'
  if (current === 'asc') return 'desc'
  return null
}

const toggleSort = (column: AppTableColumn): void => {
  if (!props.sortable) return
  const key = getColumnKey(column)
  const isCurrent = sortState.value.key === key
  const baseOrder = isCurrent ? sortState.value.order : null
  const order = nextSortOrder(baseOrder)
  sortState.value = {
    key: order ? key : '',
    order
  }
}

const getSortIndicator = (column: AppTableColumn): string => {
  const key = getColumnKey(column)
  if (sortState.value.key !== key || sortState.value.order === null) return '↕'
  return sortState.value.order === 'asc' ? '↑' : '↓'
}

const getRowKey = (record: any, rowIndex: number): string => {
  const value = record[props.rowKey]

  if (value == null) {
    return String(rowIndex)
  }

  return String(value)
}

const triggerTitleAction = (
  slotConfig: AppTableTitleActionSlot,
  input?: {
    action?: string
    event?: Event
    data?: unknown
  }
): void => {
  const payload: AppTableTitleActionTriggerPayload = {
    slotName: slotConfig.name,
    action: input?.action ?? 'trigger',
    event: input?.event,
    data: input?.data
  }

  slotConfig.onTrigger?.(payload)
  emit('title-action-trigger', payload)
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h3 v-if="props.title" class="text-base font-semibold">{{ props.title }}</h3>
      <div class="flex w-full flex-col gap-2 md:ml-auto md:w-auto md:flex-row">
        <div v-if="hasTitleActions" class="flex flex-wrap items-center" :style="titleActionStyle">
          <slot
            v-for="slotConfig in resolvedTitleActionSlots"
            :key="slotConfig.name"
            :name="slotConfig.name"
            :slot-config="slotConfig"
            :trigger="(input) => triggerTitleAction(slotConfig, input)"
          />
        </div>
        <div class="w-full md:w-72">
          <Input v-model="keyword" :placeholder="filterPlaceholderText" />
        </div>
        <DropdownMenu v-if="props.columnFilterable">
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" class="gap-2">
              <SlidersHorizontal class="size-4" />
              {{ viewText }}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-52">
            <DropdownMenuLabel>{{ toggleColumnsText }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              v-for="column in props.columns"
              :key="getColumnKey(column)"
              :model-value="isColumnVisible(getColumnKey(column))"
              @update:model-value="(checked) => setColumnVisible(getColumnKey(column), checked)"
              @select.prevent
            >
              {{ column.title }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div :class="cn('rounded-md', props.bordered && 'border')">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              v-for="column in visibleColumns"
              :key="getColumnKey(column)"
              :class="cn(alignClass(column.align), props.bordered && 'border-b')"
            >
              <button
                type="button"
                class="inline-flex items-center gap-1"
                :class="props.sortable ? 'cursor-pointer' : 'cursor-default'"
                :disabled="!props.sortable"
                @click="toggleSort(column)"
              >
                <span>{{ column.title }}</span>
                <span v-if="props.sortable" class="text-muted-foreground text-xs">
                  {{ getSortIndicator(column) }}
                </span>
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="(record, rowIndex) in pagedDataSource" :key="getRowKey(record, rowIndexOffset + rowIndex)">
            <TableCell
              v-for="column in visibleColumns"
              :key="getColumnKey(column)"
              :class="alignClass(column.align)"
            >
              <slot
                :name="`cell-${getColumnKey(column)}`"
                :value="getValueByDataIndex(record, column.dataIndex)"
                :record="record"
                :column="column"
                :index="rowIndexOffset + rowIndex"
              >
                {{ displayText(getValueByDataIndex(record, column.dataIndex)) }}
              </slot>
            </TableCell>
          </TableRow>

          <TableEmpty v-if="sortedDataSource.length === 0" :colspan="visibleColumns.length">
            {{ emptyTextValue }}
          </TableEmpty>
        </TableBody>
      </Table>
    </div>

    <div v-if="props.pagination" class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p v-if="props.showPaginationTotal" class="text-sm text-muted-foreground">
        {{ showingSummaryText }}
      </p>
      <div class="ml-auto flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
        <div v-if="props.showSizeChanger" class="flex items-center gap-2">
          <label class="text-sm text-muted-foreground">{{ rowsPerPageText }}</label>
          <Select :model-value="String(pageSize)" @update:model-value="onPageSizeChange">
            <SelectTrigger class="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in normalizedPageSizeOptions" :key="size" :value="String(size)">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination
          v-model:page="currentPage"
          :items-per-page="pageSize"
          :total="totalItems"
          :sibling-count="1"
          class="mx-0 w-auto justify-start"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />
            <template v-for="(item, index) in items" :key="`page-item-${index}`">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === currentPage"
              >
                {{ item.value }}
              </PaginationItem>
              <PaginationEllipsis v-else />
            </template>
            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </section>
</template>
