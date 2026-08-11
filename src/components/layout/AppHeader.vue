<script setup lang="ts">
import { computed, ref } from 'vue'
import { Layout, Input, Row, Col, Typography, Button, Drawer } from 'ant-design-vue'
import { RobotOutlined } from '@ant-design/icons-vue'
import AIPanel from '@/components/shared/AIPanel.vue'
import { useProjectStore } from '@/stores/project'

const Header = Layout.Header
const { Text } = Typography
const projectStore = useProjectStore()
const aiOpen = ref(false)

const projectName = computed({
  get: () => projectStore.project.name,
  set: (value: string) => {
    projectStore.setName(value)
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
        <Button type="default" @click="aiOpen = true">
          <template #icon><RobotOutlined /></template>
          دستیار AI
        </Button>
      </Col>
    </Row>

    <Drawer
      v-model:open="aiOpen"
      title="دستیار هوش مصنوعی"
      placement="left"
      :width="420"
      destroy-on-close
    >
      <AIPanel />
    </Drawer>
  </Header>
</template>
