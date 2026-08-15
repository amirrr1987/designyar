<script setup lang="ts">
import { computed } from 'vue'
import { Alert, Card, Progress, Space, Typography } from 'ant-design-vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useCompletion } from '@/composables/useCompletion'
import { fa } from '@/content/fa'
import type { DesignStepKey } from '@/types/project'
import type { JobId } from '@/domain/completion'

interface PrimaryTaskCardProps {
  phase: DesignStepKey
}

const props = defineProps<PrimaryTaskCardProps>()
const { Title, Paragraph, Text } = Typography
const { phaseProgress, jobCopy, primaryAiFor } = useCompletion()

const progress = computed(() => phaseProgress(props.phase))

const activeJobId = computed((): JobId | null => {
  const next = progress.value.nextJob
  return next?.id ?? null
})

const copy = computed(() => {
  const id = activeJobId.value
  return id ? jobCopy(id) : undefined
})

const ai = computed(() => {
  const id = activeJobId.value
  return id ? primaryAiFor(id) : null
})

const isComplete = computed(() => progress.value.isComplete)
</script>

<template>
  <Card size="small">
    <Space direction="vertical" size="middle" style="width: 100%">
      <Space wrap align="center" style="width: 100%; justify-content: space-between">
        <Text type="secondary">{{ fa.phases[phase].badge }}</Text>
        <Progress
          type="circle"
          :percent="progress.percent"
          :width="48"
          :status="isComplete ? 'success' : 'active'"
        />
      </Space>

      <Alert v-if="isComplete" type="success" show-icon>
        <template #message>
          <Space>
            <CheckCircleOutlined />
            <span>{{ fa.phases[phase].definitionOfDone }}</span>
          </Space>
        </template>
      </Alert>

      <template v-else-if="copy">
        <Title :level="4" style="margin: 0">{{ copy.title }}</Title>
        <Paragraph type="secondary" style="margin-bottom: 0">
          <Text strong>{{ fa.whyHeading }}</Text>
          {{ ' ' }}{{ copy.why }}
        </Paragraph>
        <Paragraph style="margin-bottom: 0">{{ copy.emptyHint }}</Paragraph>
        <Space wrap v-if="ai">
          <AiAssistButton
            :action="ai.action"
            :label="ai.label"
            :section="copy.title"
          />
        </Space>
      </template>
    </Space>
  </Card>
</template>
