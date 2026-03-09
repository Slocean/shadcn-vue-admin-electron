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

interface ReportItem {
  id: string
  reportNo: string
  patientName: string
  type: 'CT' | 'MRI' | 'XRAY'
  status: 'draft' | 'reviewing' | 'done'
  updatedAt: string
}

const allReports: ReportItem[] = [
  {
    id: '1',
    reportNo: 'RPT-20260309-001',
    patientName: 'Li Ming',
    type: 'CT',
    status: 'done',
    updatedAt: '2026-03-09 10:28'
  },
  {
    id: '2',
    reportNo: 'RPT-20260309-002',
    patientName: 'Zhao Wei',
    type: 'MRI',
    status: 'reviewing',
    updatedAt: '2026-03-09 11:42'
  },
  {
    id: '3',
    reportNo: 'RPT-20260309-003',
    patientName: 'Sun Yan',
    type: 'XRAY',
    status: 'draft',
    updatedAt: '2026-03-09 13:10'
  }
]

const statusFilter = ref<'all' | ReportItem['status']>('all')

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

const tableColumns = [
  { title: 'Report No', dataIndex: 'reportNo', key: 'reportNo' },
  { title: 'Patient', dataIndex: 'patientName', key: 'patientName' },
  { title: 'Type', dataIndex: 'type', key: 'type' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' }
]

const tableRows = computed(() => {
  if (statusFilter.value === 'all') {
    return allReports
  }

  return allReports.filter((item) => item.status === statusFilter.value)
})
</script>

<template>
  <section class="space-y-4 py-4">
    <div class="w-full max-w-64 space-y-2">
      <Label>Status</Label>
      <Select v-model="statusFilter">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="reviewing">Reviewing</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <AppTable
      title="Report List"
      :columns="tableColumns"
      :data-source="tableRows"
      :bordered="true"
      :filter-columns="['reportNo', 'patientName']"
      filter-placeholder="Search Report No / Patient Name"
    >
      <template #cell-status="{ record }">
        <Badge :variant="statusVariantMap[record.status]">{{ statusTextMap[record.status] }}</Badge>
      </template>
    </AppTable>
  </section>
</template>
