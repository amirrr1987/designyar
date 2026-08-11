<script setup lang="ts">
import { Card, Divider, Space, Typography } from 'ant-design-vue'
import HMWQuestions from '@/components/define/HMWQuestions.vue'
import POVBuilder from '@/components/define/POVBuilder.vue'
import ProblemStatementForm from '@/components/define/ProblemStatement.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
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
        <AiAssistButton action="generate-hmw" label="تولید HMW با AI" />
        <AiAssistButton action="ux-improve" label="پیشنهاد بهبود UX" />
        <AiAssistButton action="microcopy" label="تولید میکروکپی" />
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
