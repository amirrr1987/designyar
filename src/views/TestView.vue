<script setup lang="ts">
import { ref } from 'vue'
import { Card, Space, Tabs } from 'ant-design-vue'
import ContrastChecker from '@/components/test/ContrastChecker.vue'
import HeuristicEval from '@/components/test/HeuristicEval.vue'
import UsabilityReport from '@/components/test/UsabilityReport.vue'
import WCAGChecklist from '@/components/test/WCAGChecklist.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'

type TestTabKey = 'contrast' | 'wcag' | 'heuristics' | 'report'

const step = getStepByKey('test')
const activeKey = ref<TestTabKey>('contrast')
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <PhaseHero
      :title="step.title"
      :description="step.description"
      :color="step.color"
      :icon="step.icon"
      badge="مرحله ۵ از ۵"
    >
      <template #actions>
        <AiAssistButton action="summarize-test" label="خلاصه یافته‌ها با AI" section="Test" />
        <AiAssistButton action="test-to-hmw" label="HMW از یافته‌های تست" section="Test" />
        <AiAssistButton action="test-to-ideas" label="ایده patch از تست" section="Test" />
      </template>
    </PhaseHero>

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
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

    <PhaseFlowNav current-key="test" />
  </Space>
</template>
