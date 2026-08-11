<script setup lang="ts">
import { computed } from 'vue'
import {
  Layout,
  Input,
  Row,
  Col,
  Typography,
  Button,
  Drawer,
  Space,
  Upload,
  message,
} from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { DownloadOutlined, RobotOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AIPanel from '@/components/shared/AIPanel.vue'
import { useAiStore } from '@/stores/ai'
import { useProjectStore } from '@/stores/project'
import { downloadUxFlowExport } from '@/utils/project-export'
import { importUxFlowFromFile } from '@/utils/project-import'

const Header = Layout.Header
const { Text } = Typography
const projectStore = useProjectStore()
const aiStore = useAiStore()
const { panelOpen } = storeToRefs(aiStore)

const projectName = computed({
  get: () => projectStore.project.name,
  set: (value: string) => {
    projectStore.setName(value)
  },
})

const drawerOpen = computed({
  get: () => panelOpen.value,
  set: (value: boolean) => {
    aiStore.setPanelOpen(value)
  },
})

function onExport(): void {
  const safeName = projectStore.project.name.trim().replace(/\s+/g, '-') || 'designyar'
  downloadUxFlowExport(`${safeName}-export.json`)
  message.success('خروجی JSON دانلود شد')
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  void (async () => {
    const result = await importUxFlowFromFile(file)
    if (!result.ok) {
      message.error(result.error)
      return
    }
    message.success(`ورود موفق (${result.exportedAt}) — در حال بازنشانی…`)
    window.setTimeout(() => {
      window.location.reload()
    }, 600)
  })()
  return false
}
</script>

<template>
  <Header>
    <Row :gutter="16" align="middle" justify="space-between">
      <Col>
        <Row :gutter="16" align="middle">
          <Col>
            <Text strong>دیزاین‌یار</Text>
          </Col>
          <Col :xs="24" :sm="14" :md="10" :lg="8">
            <Input v-model:value="projectName" placeholder="نام پروژه" allow-clear />
          </Col>
        </Row>
      </Col>
      <Col>
        <Space wrap>
          <Upload
            :before-upload="beforeUpload"
            :show-upload-list="false"
            accept=".json,application/json"
          >
            <Button>
              <template #icon><UploadOutlined /></template>
              ورود JSON
            </Button>
          </Upload>
          <Button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            خروجی JSON
          </Button>
          <Button type="default" @click="aiStore.openPanel()">
            <template #icon><RobotOutlined /></template>
            دستیار AI
          </Button>
        </Space>
      </Col>
    </Row>

    <Drawer
      v-model:open="drawerOpen"
      title="دستیار هوش مصنوعی"
      placement="left"
      :width="420"
      destroy-on-close
    >
      <AIPanel />
    </Drawer>
  </Header>
</template>
