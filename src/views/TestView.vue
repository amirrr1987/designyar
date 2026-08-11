<script setup lang="ts">
import { ref } from 'vue'
import { Card, Space, Tabs, Typography } from 'ant-design-vue'
import ContrastChecker from '@/components/test/ContrastChecker.vue'
import HeuristicEval from '@/components/test/HeuristicEval.vue'
import UsabilityReport from '@/components/test/UsabilityReport.vue'
import WCAGChecklist from '@/components/test/WCAGChecklist.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'

type TestTabKey = 'contrast' | 'wcag' | 'heuristics' | 'report'

const { Title, Paragraph } = Typography
const step = getStepByKey('test')
const activeKey = ref<TestTabKey>('contrast')
</script>

<template>
  <Space direction="vertical" size="large">
    <Card>
      <Title :level="3">{{ step.title }}</Title>
      <Paragraph>{{ step.description }}</Paragraph>
    </Card>

    <Card>
      <Tabs v-model:activeKey="activeKey">
        <Tabs.TabPane key="contrast" tab="کنتراست">
          <ContrastChecker />
        </Tabs.TabPane>
        <Tabs.TabPane key="wcag" tab="WCAG">
          <WCAGChecklist />
        </Tabs.TabPane>
        <Tabs.TabPane key="heuristics" tab="هیوریستیک">
          <HeuristicEval />
        </Tabs.TabPane>
        <Tabs.TabPane key="report" tab="گزارش">
          <UsabilityReport />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </Space>
</template>
