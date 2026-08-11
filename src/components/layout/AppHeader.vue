<script setup lang="ts">
import { computed } from 'vue'
import { Layout, Input, Row, Col, Typography, Button, Drawer } from 'ant-design-vue'
import { RobotOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AIPanel from '@/components/shared/AIPanel.vue'
import { useAiStore } from '@/stores/ai'
import { useProjectStore } from '@/stores/project'

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
        <Button type="default" @click="aiStore.openPanel()">
          <template #icon><RobotOutlined /></template>
          دستیار AI
        </Button>
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
