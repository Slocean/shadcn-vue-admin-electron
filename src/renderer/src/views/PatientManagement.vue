<script setup lang="ts">
import AppTable from '@/components/common/AppTable.vue'
import { Button } from '@/components/ui/button'

interface PatientItem {
  id: string
  name: string
  age: number
  device: string
  usageDays: number
  lastImportedAt: string
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
  { title: '患者', dataIndex: 'name', key: 'name', align: 'left' as const },
  { title: '年龄', dataIndex: 'age', key: 'age', align: 'center' as const },
  { title: '设备', dataIndex: 'device', key: 'device', align: 'center' as const },
  { title: '使用天数', dataIndex: 'usageDays', key: 'usageDays', align: 'center' as const },
  {
    title: '最后一次导入时间',
    dataIndex: 'lastImportedAt',
    key: 'lastImportedAt',
    align: 'center' as const
  },
  { title: '操作', dataIndex: 'actions', key: 'actions', align: 'center' as const }
]
</script>

<template>
  <section class="py-4">
    <AppTable
      title="患者列表"
      :columns="tableColumns"
      :data-source="patientRows"
      :filter-columns="['name']"
      filter-placeholder="搜索患者名称"
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
        <div class="flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" size="sm">查看详情</Button>
          <Button size="sm">导入数据</Button>
          <Button variant="secondary" size="sm">打印报告</Button>
        </div>
      </template>
    </AppTable>
  </section>
</template>
