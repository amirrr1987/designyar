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
  <Card size="small" title="پیشنهاد هوش مصنوعی">
    <Space direction="vertical" class="w-full" size="middle">
      <Typography.Text type="secondary">
        پیشنهاد می‌دهد؛ تا وقتی نپذیری چیزی عوض نمی‌شود.
      </Typography.Text>

      <Space wrap>
        <Button
          v-bind="improveBtn"
          :loading="props.loading"
          :aria-busy="props.loading"
          :aria-label="props.improveLabel"
          @click="emit('assist', 'improve')"
        >
          <template #icon>
            <ThunderboltOutlined aria-hidden="true" />
          </template>
          {{ props.improveLabel }}
        </Button>
        <Button
          v-bind="completeBtn"
          :loading="props.loading"
          :aria-busy="props.loading"
          :aria-label="props.completeLabel"
          @click="emit('assist', 'complete')"
        >
          <template #icon>
            <ThunderboltOutlined aria-hidden="true" />
          </template>
          {{ props.completeLabel }}
        </Button>
      </Space>

      <div
        v-if="props.hasPreview"
        role="region"
        aria-label="پیش‌نمایش پیشنهاد هوش مصنوعی"
        aria-live="polite"
      >
        <Typography.Text type="secondary">پیش‌نمایش پیشنهاد</Typography.Text>
        <Typography.Paragraph class="whitespace-pre-wrap mb-0!">
          {{ props.previewText }}
        </Typography.Paragraph>
        <Space class="mt-2">
          <Button
            v-bind="acceptBtn"
            aria-label="پذیرش پیشنهاد و اعمال روی فرم"
            @click="emit('accept')"
          >
            پذیرش پیشنهاد
          </Button>
          <Button aria-label="رد پیشنهاد" @click="emit('reject')">رد پیشنهاد</Button>
        </Space>
      </div>
    </Space>
  </Card>
</template>
