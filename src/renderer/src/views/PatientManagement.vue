<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import AppTable from '@/components/common/AppTable.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface PatientItem {
  id: string
  name: string
  age: number
  device: string
  usageDays: number
  lastImportedAt: string
}

const text = {
  patientList: '患者列表',
  searchPatientName: '搜索患者名称',
  patient: '患者',
  age: '年龄',
  device: '设备',
  usageDays: '使用天数',
  lastImportedAt: '最后一次导入时间',
  actions: '操作',
  viewDetail: '查看详情',
  importData: '导入数据',
  printReport: '打印报告'
}

const patientNames = [
  '王伟',
  '李娜',
  '张晨',
  '刘洋',
  '陈涛',
  '赵敏',
  '黄静',
  '周磊',
  '吴昊',
  '徐婷',
  '孙楠',
  '朱琳'
]

const devices = ['CPAP-A1', 'CPAP-A2', 'BIPAP-S3', 'BIPAP-S6', 'AutoPAP-X1']

const patientRows: PatientItem[] = Array.from({ length: 24 }, (_, idx) => {
  const index = idx + 1
  return {
    id: `PAT-${String(index).padStart(3, '0')}`,
    name: patientNames[idx % patientNames.length],
    age: 26 + (idx % 43),
    device: devices[idx % devices.length],
    usageDays: 5 + idx * 3,
    lastImportedAt: `2026-03-${String((idx % 9) + 1).padStart(2, '0')} ${String(8 + (idx % 10)).padStart(2, '0')}:${String(10 + (idx % 45)).padStart(2, '0')}`
  }
})

const tableColumns = [
  { title: text.patient, dataIndex: 'name', key: 'name', align: 'left' as const },
  { title: text.age, dataIndex: 'age', key: 'age', align: 'center' as const },
  { title: text.device, dataIndex: 'device', key: 'device', align: 'center' as const },
  { title: text.usageDays, dataIndex: 'usageDays', key: 'usageDays', align: 'center' as const },
  {
    title: text.lastImportedAt,
    dataIndex: 'lastImportedAt',
    key: 'lastImportedAt',
    align: 'center' as const
  },
  { title: text.actions, dataIndex: 'actions', key: 'actions', align: 'center' as const }
]
</script>

<template>
  <section class="py-4">
    <AppTable
      :title="text.patientList"
      :columns="tableColumns"
      :data-source="patientRows"
      :filter-columns="['name']"
      :filter-placeholder="text.searchPatientName"
      row-key="id"
      :sortable="false"
      :column-filterable="false"
      :pagination="true"
      :default-page-size="10"
      :page-size-options="[10, 20, 30]"
    >
      <template #cell-name="{ value, record }">
        <div class="flex items-center justify-start gap-2">
          <span class="font-medium">{{ value }}</span>
          <span class="text-xs text-muted-foreground">{{ record.id }}</span>
        </div>
      </template>

      <template #cell-lastImportedAt="{ value }">
        <span class="text-muted-foreground">{{ value }}</span>
      </template>

      <template #cell-actions>
        <div class="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="h-8 gap-1.5 px-2">
                <MoreHorizontal class="size-4" />
                <span>{{ text.actions }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="min-w-32">
              <DropdownMenuItem>{{ text.viewDetail }}</DropdownMenuItem>
              <DropdownMenuItem>{{ text.importData }}</DropdownMenuItem>
              <DropdownMenuItem>{{ text.printReport }}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </template>
    </AppTable>
  </section>
</template>
