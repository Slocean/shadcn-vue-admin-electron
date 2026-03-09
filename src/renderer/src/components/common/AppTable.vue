<script setup lang="ts">
import { computed, ref } from 'vue'
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
  }>(),
  {
    title: '',
    bordered: false,
    rowKey: 'id',
    filterPlaceholder: 'Search',
    emptyText: 'No records found'
  }
)

const keyword = ref('')

const normalizeDataIndex = (dataIndex: DataIndex): string[] =>
  Array.isArray(dataIndex) ? dataIndex : dataIndex.split('.')

const dataIndexKey = (dataIndex: DataIndex): string => normalizeDataIndex(dataIndex).join('.')

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

const filteredDataSource = computed(() => {
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
      <div class="w-full md:ml-auto md:w-72">
        <Input v-model="keyword" :placeholder="props.filterPlaceholder" />
      </div>
    </div>

    <div :class="cn('rounded-md', props.bordered && 'border')">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              v-for="column in props.columns"
              :key="column.key ?? dataIndexKey(column.dataIndex)"
              :class="cn(alignClass(column.align), props.bordered && 'border-b')"
            >
              {{ column.title }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="(record, rowIndex) in filteredDataSource" :key="getRowKey(record, rowIndex)">
            <TableCell
              v-for="column in props.columns"
              :key="column.key ?? dataIndexKey(column.dataIndex)"
              :class="alignClass(column.align)"
            >
              <slot
                :name="`cell-${column.key ?? dataIndexKey(column.dataIndex)}`"
                :value="getValueByDataIndex(record, column.dataIndex)"
                :record="record"
                :column="column"
                :index="rowIndex"
              >
                {{ displayText(getValueByDataIndex(record, column.dataIndex)) }}
              </slot>
            </TableCell>
          </TableRow>

          <TableEmpty v-if="filteredDataSource.length === 0" :colspan="props.columns.length">
            {{ props.emptyText }}
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </section>
</template>
