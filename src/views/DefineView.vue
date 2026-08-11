<script setup lang="ts">
import { Card, Space } from 'ant-design-vue'
import HMWQuestions from '@/components/define/HMWQuestions.vue'
import POVBuilder from '@/components/define/POVBuilder.vue'
import ProblemStatementForm from '@/components/define/ProblemStatement.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'

const step = getStepByKey('define')
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <PhaseHero
      :title="step.title"
      :description="step.description"
      :color="step.color"
      :icon="step.icon"
      badge="مرحله ۲ از ۵"
    >
      <template #actions>
        <AiChainButton chain="define-complete" label="زنجیره Define (مسئله→POV→HMW)" />
        <AiAssistButton action="generate-hmw" label="تولید HMW با AI" section="Define" />
        <AiAssistButton action="refine-problem" label="پیشنهاد بیان مسئله" section="Define" />
        <AiAssistButton action="refine-pov" label="پیشنهاد POV" section="Define" />
        <AiAssistButton action="ux-improve" label="پیشنهاد بهبود UX" section="Define" />
      </template>
    </PhaseHero>

    <Card title="۱. بیان مسئله">
      <ProblemStatementForm />
    </Card>

    <Card title="۲. نقطه دید (POV)">
      <POVBuilder />
    </Card>

    <Card title="۳. سوالات How Might We">
      <HMWQuestions />
    </Card>

    <PhaseFlowNav current-key="define" />
  </Space>
</template>
