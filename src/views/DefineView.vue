<script setup lang="ts">
import { Card, Divider, Space, Typography } from 'ant-design-vue'
import HMWQuestions from '@/components/define/HMWQuestions.vue'
import POVBuilder from '@/components/define/POVBuilder.vue'
import ProblemStatementForm from '@/components/define/ProblemStatement.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'

const { Title, Paragraph } = Typography
const step = getStepByKey('define')
</script>

<template>
  <Space direction="vertical" size="large">
    <Card>
      <Title :level="3">{{ step.title }}</Title>
      <Paragraph>{{ step.description }}</Paragraph>
      <Space wrap>
        <AiChainButton chain="define-complete" label="زنجیره Define (مسئله→POV→HMW)" />
        <AiAssistButton action="generate-hmw" label="تولید HMW با AI" />
        <AiAssistButton action="refine-problem" label="پیشنهاد بیان مسئله" />
        <AiAssistButton action="refine-pov" label="پیشنهاد POV" />
        <AiAssistButton action="ux-improve" label="پیشنهاد بهبود UX" />
      </Space>
    </Card>

    <Card title="۱. بیان مسئله">
      <ProblemStatementForm />
    </Card>

    <Divider />

    <Card title="۲. نقطه دید (POV)">
      <POVBuilder />
    </Card>

    <Divider />

    <Card title="۳. سوالات How Might We">
      <HMWQuestions />
    </Card>
  </Space>
</template>
