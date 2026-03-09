<script setup lang="ts">
import { computed, ref } from 'vue'
import AppTable from '@/components/common/AppTable.vue'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface ReportItem {
  id: string
  reportNo: string
  patient: {
    id: string
    name: string
  }
  type: 'CT' | 'MRI' | 'XRAY'
  status: 'draft' | 'reviewing' | 'done'
  updatedAt: string
}

type StatusFilter = 'all' | ReportItem['status'] | 'none'
type FilterPreset = 'reportAndPatient' | 'statusAndType' | 'all'
type RowKeyMode = 'id' | 'reportNo'

const patientNames = [
  'Li Ming',
  'Zhao Wei',
  'Sun Yan',
  'Qian Jun',
  'Wang Lei',
  'Chen Xi',
  'Zhou Tao',
  'Xu Nan'
]

const reportTypes: ReportItem['type'][] = ['CT', 'MRI', 'XRAY']
const reportStatuses: ReportItem['status'][] = ['draft', 'reviewing', 'done']

const allReports: ReportItem[] = Array.from({ length: 20 }, (_, idx) => {
  const id = idx + 1
  const type = reportTypes[idx % reportTypes.length]
  const status = reportStatuses[idx % reportStatuses.length]
  const patientName = patientNames[idx % patientNames.length]

  return {
    id: String(id),
    reportNo: `RPT-20260309-${String(id).padStart(3, '0')}`,
    patient: {
      id: `P${String(id).padStart(3, '0')}`,
      name: patientName
    },
    type,
    status,
    updatedAt: `2026-03-${String((idx % 9) + 1).padStart(2, '0')} ${String(9 + (idx % 10)).padStart(2, '0')}:${String(5 + (idx % 50)).padStart(2, '0')}`
  }
})

const statusFilter = ref<StatusFilter>('all')
const bordered = ref(true)
const showTitle = ref(true)
const rowKeyMode = ref<RowKeyMode>('id')
const filterPreset = ref<FilterPreset>('reportAndPatient')

const statusTextMap: Record<ReportItem['status'], string> = {
  draft: 'Draft',
  reviewing: 'Reviewing',
  done: 'Done'
}

const statusVariantMap: Record<ReportItem['status'], 'secondary' | 'outline' | 'default'> = {
  draft: 'secondary',
  reviewing: 'outline',
  done: 'default'
}

const typeVariantMap: Record<ReportItem['type'], 'secondary' | 'outline' | 'default'> = {
  CT: 'default',
  MRI: 'outline',
  XRAY: 'secondary'
}

const tableColumns = [
  {
    title: 'Report No',
    dataIndex: 'reportNo',
    key: 'reportNo',
    align: 'left' as const,
    fixed: 'left' as const,
    width: 180
  },
  {
    title: 'Patient',
    dataIndex: ['patient', 'name'],
    key: 'patientName',
    align: 'left' as const,
    width: 180
  },
  { title: 'Type', dataIndex: 'type', key: 'type', align: 'center' as const, width: 120 },
  { title: 'Status', dataIndex: 'status', key: 'status', align: 'center' as const, width: 140 },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    align: 'right' as const,
    fixed: 'right' as const,
    width: 190
  }
]

const filterColumnsMap: Record<FilterPreset, Array<string | string[]>> = {
  reportAndPatient: ['reportNo', ['patient', 'name']],
  statusAndType: ['status', 'type'],
  all: ['reportNo', ['patient', 'name'], 'type', 'status', 'updatedAt']
}

const filterPlaceholderMap: Record<FilterPreset, string> = {
  reportAndPatient: 'Search by report no or patient name',
  statusAndType: 'Search by status or type',
  all: 'Search all columns'
}

const tableRows = computed(() => {
  if (statusFilter.value === 'none') {
    return []
  }

  if (statusFilter.value === 'all') {
    return allReports
  }

  return allReports.filter((item) => item.status === statusFilter.value)
})

const tableTitle = computed(() => {
  if (!showTitle.value) {
    return ''
  }

  return `Report List (${tableRows.value.length})`
})

const emptyText = computed(() => {
  if (statusFilter.value === 'none') {
    return 'No records (demo empty state)'
  }

  return 'No records found'
})

const currentFilterColumns = computed(() => filterColumnsMap[filterPreset.value])
const filterPlaceholder = computed(() => filterPlaceholderMap[filterPreset.value])
const currentRowKey = computed(() => rowKeyMode.value)
</script>

<template>
  <section class="space-y-4 py-4">
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div class="space-y-2">
        <Label>Status Filter</Label>
        <Select v-model="statusFilter">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="none">None (Empty)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label>Filter Columns</Label>
        <Select v-model="filterPreset">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select filter preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reportAndPatient">Report + Patient</SelectItem>
            <SelectItem value="statusAndType">Status + Type</SelectItem>
            <SelectItem value="all">All Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label>Row Key</Label>
        <Select v-model="rowKeyMode">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select row key" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">id</SelectItem>
            <SelectItem value="reportNo">reportNo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex items-end gap-2 pb-1">
        <Switch id="toggle-bordered" v-model="bordered" />
        <Label for="toggle-bordered">Bordered</Label>
      </div>

      <div class="flex items-end gap-2 pb-1">
        <Switch id="toggle-title" v-model="showTitle" />
        <Label for="toggle-title">Show Title</Label>
      </div>
    </div>

    <AppTable
      :title="tableTitle"
      :columns="tableColumns"
      :data-source="tableRows"
      :bordered="bordered"
      :filter-columns="currentFilterColumns"
      :row-key="currentRowKey"
      :filter-placeholder="filterPlaceholder"
      :empty-text="emptyText"
      :row-selection="true"
      :pagination="true"
      :default-page-size="10"
      :page-size-options="[10, 20, 30]"
    >
      <template #cell-reportNo="{ value }">
        <span class="font-medium">{{ value }}</span>
      </template>

      <template #cell-patientName="{ value, record }">
        <span>{{ value }}</span>
        <span class="ml-2 text-xs text-muted-foreground">#{{ record.patient.id }}</span>
      </template>

      <template #cell-type="{ record }">
        <Badge :variant="typeVariantMap[record.type]">{{ record.type }}</Badge>
      </template>

      <template #cell-status="{ record }">
        <Badge :variant="statusVariantMap[record.status]">{{ statusTextMap[record.status] }}</Badge>
      </template>

      <template #cell-updatedAt="{ value }">
        <span class="text-muted-foreground">{{ value }}</span>
      </template>
    </AppTable>
  </section>
</template>
