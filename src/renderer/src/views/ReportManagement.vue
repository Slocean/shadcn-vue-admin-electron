<script setup lang="ts">
import { computed } from 'vue'
import AppTable from '@/components/common/AppTable.vue'
import { Badge } from '@/components/ui/badge'

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

const tableRows = computed(() => allReports)
const tableTitle = computed(() => `Report List (${tableRows.value.length})`)
</script>

<template>
  <section class="py-4">
    <AppTable
      :title="tableTitle"
      :columns="tableColumns"
      :data-source="tableRows"
      :bordered="true"
      :filter-columns="['reportNo', ['patient', 'name'], 'type', 'status', 'updatedAt']"
      row-key="id"
      filter-placeholder="Search all columns"
      empty-text="No records found"
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
