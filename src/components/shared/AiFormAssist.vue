<script setup lang="ts">
import { Button, Card, Space, Typography } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { ThunderboltOutlined } from '@ant-design/icons-vue'
import type { AiAssistMode } from '@/types/ai'

interface Props {
  improveLabel: string
  completeLabel: string
  loading: boolean
  errorMessage: string
  previewText: string
  hasPreview: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  assist: [mode: AiAssistMode]
  accept: []
  reject: []
}>()

const improveBtn: ButtonProps = { type: 'default' }
const completeBtn: ButtonProps = { type: 'dashed' }
const acceptBtn: ButtonProps = { type: 'primary' }
</script>

<template>
  <Card size="small" title="دستیار AI">
    <Space direction="vertical" class="w-full" size="middle">
      <Space wrap>
        <Button
          v-bind="improveBtn"
          :loading="props.loading"
          @click="emit('assist', 'improve')"
        >
          <template #icon><ThunderboltOutlined /></template>
          {{ props.improveLabel }}
        </Button>
        <Button
          v-bind="completeBtn"
          :loading="props.loading"
          @click="emit('assist', 'complete')"
        >
          <template #icon><ThunderboltOutlined /></template>
          {{ props.completeLabel }}
        </Button>
      </Space>

      <template v-if="props.hasPreview">
        <Typography.Text type="secondary">پیش‌نمایش پیشنهاد:</Typography.Text>
        <Typography.Paragraph class="whitespace-pre-wrap !mb-0">
          {{ props.previewText }}
        </Typography.Paragraph>
        <Space>
          <Button v-bind="acceptBtn" @click="emit('accept')">پذیرش</Button>
          <Button @click="emit('reject')">رد</Button>
        </Space>
      </template>
    </Space>
  </Card>
</template>
