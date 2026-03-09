<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const filters = reactive({
  keyword: '',
  status: 'all'
})

const tableRows = ref<ReportItem[]>([...allReports])

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

const totalCount = computed(() => tableRows.value.length)

const handleSearch = (): void => {
  const keyword = filters.keyword.trim().toLowerCase()

  tableRows.value = allReports.filter((report) => {
    const matchesKeyword =
      keyword.length === 0 ||
      report.reportNo.toLowerCase().includes(keyword) ||
      report.patientName.toLowerCase().includes(keyword)

    const matchesStatus = filters.status === 'all' || report.status === filters.status

    return matchesKeyword && matchesStatus
  })
}

const resetFilters = (): void => {
  filters.keyword = ''
  filters.status = 'all'
  tableRows.value = [...allReports]
}
</script>

<template>
  <section class="space-y-4 py-4">
    <div class="grid gap-4 md:grid-cols-[1fr_220px_auto_auto] md:items-end">
      <div class="space-y-2">
        <Label for="keyword">Keyword</Label>
        <Input
          id="keyword"
          v-model="filters.keyword"
          placeholder="Report No / Patient Name"
          @keyup.enter="handleSearch"
        />
      </div>

      <div class="space-y-2">
        <Label>Status</Label>
        <Select v-model="filters.status">
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

      <Button class="w-full md:w-auto" @click="handleSearch">Query</Button>
      <Button class="w-full md:w-auto" variant="outline" @click="resetFilters">Reset</Button>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Report No</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in tableRows" :key="row.id">
          <TableCell class="font-medium">{{ row.reportNo }}</TableCell>
          <TableCell>{{ row.patientName }}</TableCell>
          <TableCell>{{ row.type }}</TableCell>
          <TableCell>
            <Badge :variant="statusVariantMap[row.status]">{{ statusTextMap[row.status] }}</Badge>
          </TableCell>
          <TableCell>{{ row.updatedAt }}</TableCell>
        </TableRow>
        <TableEmpty v-if="tableRows.length === 0" :colspan="5"> No records found </TableEmpty>
      </TableBody>
    </Table>
  </section>
</template>
