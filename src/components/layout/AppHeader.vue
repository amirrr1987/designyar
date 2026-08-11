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
  Switch,
  Upload,
  Divider,
  message,
} from 'ant-design-vue'
import type { ButtonProps, UploadProps } from 'ant-design-vue'
import { DownloadOutlined, RobotOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AIPanel from '@/components/shared/AIPanel.vue'
import { useAiStore } from '@/stores/ai'
import { useProjectStore } from '@/stores/project'
import { downloadUxFlowExport } from '@/utils/project-export'
import { importUxFlowFromFile } from '@/utils/project-import'
import { fa } from '@/content/fa'

const Header = Layout.Header
const { Text, Title } = Typography
const projectStore = useProjectStore()
const aiStore = useAiStore()
const { panelOpen } = storeToRefs(aiStore)

/** Switch checked = junior (ساده). */
const juniorSwitch = computed({
  get: () => projectStore.isJuniorMode,
  set: (value: boolean) => {
    projectStore.setExperienceMode(value ? 'junior' : 'full')
  },
})

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

const aiButton: ButtonProps = { type: 'primary' }
const exportButton: ButtonProps = { type: 'default' }

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
  <Header style="padding-inline: 24px; line-height: normal; display: flex; align-items: center">
    <Row :gutter="[16, 8]" align="middle" justify="space-between" style="width: 100%">
      <Col :xs="24" :md="12" :lg="14">
        <Space wrap align="center" size="middle">
          <Space direction="vertical" :size="0">
            <Title :level="5" style="margin: 0">دیزاین‌یار</Title>
            <Text type="secondary">
              {{ juniorSwitch ? 'مسیر ساده برای شروع UI/UX' : 'همراه Design Thinking' }}
            </Text>
          </Space>
          <Divider type="vertical" />
          <Input
            v-model:value="projectName"
            placeholder="نام پروژه"
            allow-clear
            style="min-width: 180px; max-width: 280px"
          />
        </Space>
      </Col>
      <Col :xs="24" :md="12" :lg="10">
        <Space wrap style="width: 100%; justify-content: flex-end">
          <Space align="center">
            <Text type="secondary">حالت ساده</Text>
            <Switch v-model:checked="juniorSwitch" checked-children="روشن" un-checked-children="خاموش" />
          </Space>
          <Upload
            :before-upload="beforeUpload"
            :show-upload-list="false"
            accept=".json,application/json"
          >
            <Button v-bind="exportButton">
              <template #icon><UploadOutlined /></template>
              ورود
            </Button>
          </Upload>
          <Button v-bind="exportButton" @click="onExport">
            <template #icon><DownloadOutlined /></template>
            خروجی
          </Button>
          <Button v-bind="aiButton" @click="aiStore.openPanel()">
            <template #icon><RobotOutlined /></template>
            {{ fa.ai.headerButton }}
          </Button>
        </Space>
      </Col>
    </Row>

    <Drawer
      v-model:open="drawerOpen"
      :title="fa.ai.drawerTitle"
      placement="left"
      :width="440"
      destroy-on-close
    >
      <AIPanel />
    </Drawer>
  </Header>
</template>
