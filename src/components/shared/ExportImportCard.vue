<script setup lang="ts">
import { Button, Card, Space, Typography, Upload, message } from 'ant-design-vue'
import type { ButtonProps, UploadProps } from 'ant-design-vue'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { useProjectStore } from '@/stores/project'
import { downloadUxFlowExport } from '@/utils/project-export'
import { importUxFlowFromFile } from '@/utils/project-import'
import { fa } from '@/content/fa'

interface ExportImportCardProps {
  /** Hide outer Card (header toolbar). */
  bare?: boolean
}

withDefaults(defineProps<ExportImportCardProps>(), {
  bare: false,
})

const { Paragraph } = Typography
const projectStore = useProjectStore()
const copy = fa.exportIo

const exportBtn: ButtonProps = { type: 'default' }
const importBtn: ButtonProps = { type: 'default' }

function onExport(): void {
  const safeName = projectStore.project.name.trim().replace(/\s+/g, '-') || 'designyar'
  downloadUxFlowExport(`${safeName}-export.json`)
  message.success(copy.exportDone)
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  void (async () => {
    const result = await importUxFlowFromFile(file)
    if (!result.ok) {
      message.error(result.error)
      return
    }
    message.success(`${copy.importDone} (${result.exportedAt})`)
  })()
  return false
}
</script>

<template>
  <Card v-if="!bare" size="small" :title="copy.cardTitle">
    <Space direction="vertical" size="middle" style="width: 100%">
      <Paragraph type="secondary" style="margin-bottom: 0">{{ copy.cardDesc }}</Paragraph>
      <Space wrap>
        <Upload :before-upload="beforeUpload" :show-upload-list="false" accept=".json,application/json">
          <Button v-bind="importBtn">
            <template #icon><UploadOutlined /></template>
            {{ copy.importBtn }}
          </Button>
        </Upload>
        <Button v-bind="exportBtn" @click="onExport">
          <template #icon><DownloadOutlined /></template>
          {{ copy.exportBtn }}
        </Button>
      </Space>
    </Space>
  </Card>

  <Space v-else wrap>
    <Upload :before-upload="beforeUpload" :show-upload-list="false" accept=".json,application/json">
      <Button v-bind="importBtn">
        <template #icon><UploadOutlined /></template>
        {{ copy.importBtn }}
      </Button>
    </Upload>
    <Button v-bind="exportBtn" @click="onExport">
      <template #icon><DownloadOutlined /></template>
      {{ copy.exportBtn }}
    </Button>
  </Space>
</template>
