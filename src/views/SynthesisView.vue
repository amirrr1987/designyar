<script setup lang="ts">
import { Card, Space, Typography } from 'ant-design-vue'
import ProjectSynthesisPanel from '@/components/synthesis/ProjectSynthesisPanel.vue'

const { Title, Paragraph } = Typography
</script>

<template>
  <Space direction="vertical" size="large">
    <Card>
      <Title :level="3">جمع‌بندی پروژه</Title>
      <Paragraph>
        نمای یکپارچه از تمام داده‌های Design Thinking — با تحلیل AI از کل context پروژه.
      </Paragraph>
    </Card>

    <ProjectSynthesisPanel />
  </Space>
</template>
