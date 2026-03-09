<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
  }>(),
  {
    title: '',
    bordered: false,
    rowKey: 'id',
    filterPlaceholder: 'Search',
    emptyText: 'No records found',
    sortable: true,
    columnFilterable: true
  }
)

const keyword = ref('')
const sortState = ref<SortState>({ key: '', order: null })
const visibleColumnKeys = ref<string[]>([])

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

const isColumnVisible = (key: string): boolean => visibleColumnKeys.value.includes(key)

const setColumnVisible = (key: string, checked: boolean | 'indeterminate'): void => {
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
</script>

<template>
  <section class="space-y-3">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h3 v-if="props.title" class="text-base font-semibold">{{ props.title }}</h3>
      <div class="flex w-full flex-col gap-2 md:ml-auto md:w-auto md:flex-row">
        <div class="w-full md:w-72">
          <Input v-model="keyword" :placeholder="props.filterPlaceholder" />
        </div>
        <DropdownMenu v-if="props.columnFilterable">
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-52">
            <DropdownMenuLabel>Show Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              v-for="column in props.columns"
              :key="getColumnKey(column)"
              :checked="isColumnVisible(getColumnKey(column))"
              @update:checked="(checked) => setColumnVisible(getColumnKey(column), checked)"
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
                <span class="text-muted-foreground text-xs">{{ getSortIndicator(column) }}</span>
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="(record, rowIndex) in sortedDataSource" :key="getRowKey(record, rowIndex)">
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
                :index="rowIndex"
              >
                {{ displayText(getValueByDataIndex(record, column.dataIndex)) }}
              </slot>
            </TableCell>
          </TableRow>

          <TableEmpty v-if="sortedDataSource.length === 0" :colspan="visibleColumns.length">
            {{ props.emptyText }}
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </section>
</template>
