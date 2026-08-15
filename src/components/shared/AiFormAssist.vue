<script setup lang="ts">
import { Button, Card, Space, Typography } from 'ant-design-vue'
import type { ButtonProps, CardProps } from 'ant-design-vue'
import { ThunderboltOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'

interface Props {
  assistLabel: string
  loading: boolean
  errorMessage: string
  previewText: string
  hasPreview: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  assist: []
  accept: []
  reject: []
}>()

const cardProps: CardProps = {
  size: 'small',
  bordered: true,
}

const assistBtn: ButtonProps = { type: 'primary' }
const acceptBtn: ButtonProps = { type: 'primary' }
</script>

<template>
  <Card
    v-bind="cardProps"
    class="overflow-hidden shadow-sm ring-1 ring-teal-100/80"
    :head-style="{ background: 'rgba(240, 253, 250, 0.9)', borderBottom: '1px solid #ccfbf1' }"
  >
    <template #title>
      <Space size="small">
        <ThunderboltOutlined class="text-teal-700" aria-hidden="true" />
        <span>پیشنهاد هوش مصنوعی</span>
      </Space>
    </template>

    <Space direction="vertical" class="w-full" size="middle">
      <Typography.Text class="text-stone-500">
        خالی‌ها را پر می‌کند و متن‌های موجود را هم بهتر می‌کند. تا وقتی نپذیری فرم عوض نمی‌شود.
      </Typography.Text>

      <Button
        v-bind="assistBtn"
        :loading="props.loading"
        :aria-busy="props.loading"
        :aria-label="props.assistLabel"
        @click="emit('assist')"
      >
        <template #icon>
          <ThunderboltOutlined aria-hidden="true" />
        </template>
        {{ props.assistLabel }}
      </Button>

      <div
        v-if="props.hasPreview"
        role="region"
        aria-label="پیش‌نمایش پیشنهاد هوش مصنوعی"
        aria-live="polite"
        class="rounded-xl bg-teal-50/70 p-4 ring-1 ring-teal-100"
      >
        <Typography.Text class="mb-2 block font-medium text-teal-900">
          پیش‌نمایش پیشنهاد
        </Typography.Text>
        <Typography.Paragraph class="mb-3! whitespace-pre-wrap text-stone-700">
          {{ props.previewText }}
        </Typography.Paragraph>
        <Space wrap>
          <Button
            v-bind="acceptBtn"
            aria-label="پذیرش پیشنهاد و اعمال روی فرم"
            @click="emit('accept')"
          >
            <template #icon>
              <CheckOutlined aria-hidden="true" />
            </template>
            پذیرش
          </Button>
          <Button aria-label="رد پیشنهاد" @click="emit('reject')">
            <template #icon>
              <CloseOutlined aria-hidden="true" />
            </template>
            رد
          </Button>
        </Space>
      </div>
    </Space>
  </Card>
</template>
