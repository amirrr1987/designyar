<script setup lang="ts">
import { computed } from 'vue'
import { Layout, Input, Row, Col, Typography } from 'ant-design-vue'
import { useProjectStore } from '@/stores/project'

const Header = Layout.Header
const { Text } = Typography
const projectStore = useProjectStore()

const projectName = computed({
  get: () => projectStore.project.name,
  set: (value: string) => {
    projectStore.setName(value)
  },
})
</script>

<template>
  <Header>
    <Row :gutter="16" align="middle">
      <Col>
        <Text strong>دیزاین‌یار</Text>
      </Col>
      <Col :xs="24" :sm="14" :md="10" :lg="8">
        <Input v-model:value="projectName" placeholder="نام پروژه" allow-clear />
      </Col>
    </Row>
  </Header>
</template>
