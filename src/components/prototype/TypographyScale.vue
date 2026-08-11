<script setup lang="ts">
import { computed } from 'vue'
import { Card, Form, FormItem, Input, InputNumber, Slider, Space, Typography } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useDesignSystemStore } from '@/stores/designSystem'

const { Title, Paragraph, Text } = Typography
const designStore = useDesignSystemStore()
const { typography } = storeToRefs(designStore)

const STEP_COUNT = 6

function buildSteps(baseSize: number, ratio: number): number[] {
  const steps: number[] = []
  for (let i = 0; i < STEP_COUNT; i += 1) {
    const value = baseSize * Math.pow(ratio, i - 2)
    steps.push(Math.round(value * 10) / 10)
  }
  return steps
}

const previewSteps = computed(() => buildSteps(typography.value.baseSize, typography.value.ratio))

function onBaseChange(value: number | string | null): void {
  if (typeof value !== 'number') return
  const steps = buildSteps(value, typography.value.ratio)
  designStore.patchTypography({ baseSize: value, steps })
}

function onRatioChange(value: number | [number, number]): void {
  const ratio = typeof value === 'number' ? value : value[0]
  if (ratio === undefined) return
  const steps = buildSteps(typography.value.baseSize, ratio)
  designStore.patchTypography({ ratio, steps })
}

function onFontFamilyChange(value: string): void {
  designStore.patchTypography({ fontFamily: value })
}

function titleLevel(index: number): 1 | 2 | 3 | 4 | 5 {
  if (index <= 0) return 5
  if (index === 1) return 4
  if (index === 2) return 3
  if (index === 3) return 2
  return 1
}
</script>

<template>
  <Space direction="vertical" size="large">
    <AiSectionAssist
      action="review-design-system"
      label="بازبینی تایپ با AI"
      section="تایپوگرافی"
    />
    <Card size="small" title="مقیاس تایپوگرافی">
      <Form layout="vertical">
        <FormItem label="اندازه پایه (px)">
          <InputNumber
            :value="typography.baseSize"
            :min="10"
            :max="24"
            @update:value="onBaseChange"
          />
        </FormItem>
        <FormItem :label="`نسبت مدولار (${typography.ratio})`">
          <Slider
            :value="typography.ratio"
            :min="1.1"
            :max="1.5"
            :step="0.05"
            @update:value="onRatioChange"
          />
        </FormItem>
        <FormItem label="فونت">
          <Input :value="typography.fontFamily" @update:value="onFontFamilyChange" />
        </FormItem>
      </Form>
    </Card>

    <Card size="small" title="پیش‌نمایش">
      <Space direction="vertical">
        <Space
          v-for="(size, index) in previewSteps"
          :key="`step-${index}`"
          direction="vertical"
          size="small"
        >
          <Text type="secondary">{{ size }}px</Text>
          <Title :level="titleLevel(index)" :style="{ fontSize: `${size}px` }">
            نمونه متن فارسی — دیزاین‌یار
          </Title>
        </Space>
        <Paragraph :style="{ fontSize: `${typography.baseSize}px` }">
          پاراگراف نمونه با اندازه پایه برای خوانایی بدنه متن.
        </Paragraph>
      </Space>
    </Card>
  </Space>
</template>
