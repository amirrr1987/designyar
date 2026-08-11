<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, Col, Input, Row, Space, Tag, Typography, message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { gold } from '@ant-design/colors'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useDesignSystemStore } from '@/stores/designSystem'
import { rampFromSeed } from '@/types/design-system'

const { Text, Paragraph } = Typography
const designStore = useDesignSystemStore()
const { palette } = storeToRefs(designStore)

const seedDraft = ref(palette.value.seed)
const accentSeed = ref(gold[5] ?? '#faad14')

const primaryRamp = computed(() => palette.value.primary)
const accentRamp = computed(() => palette.value.accent)

function tagTextColor(index: number): string | undefined {
  return index > 4 ? '#fff' : undefined
}

function onGeneratePrimary(): void {
  const seed = seedDraft.value.trim()
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(seed)) {
    message.warning('یک رنگ hex معتبر وارد کنید (مثلاً #1677ff)')
    return
  }
  designStore.generatePrimaryFromSeed(seed)
  message.success('رمپ اصلی ساخته و ذخیره شد')
}

function onGenerateAccent(): void {
  const seed = accentSeed.value.trim()
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(seed)) {
    message.warning('یک رنگ hex معتبر وارد کنید')
    return
  }
  designStore.setAccentFromSeed(seed)
  message.success('رمپ اکسنت ذخیره شد')
}

function onPreviewOnly(): void {
  const seed = seedDraft.value.trim()
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(seed)) {
    message.warning('hex نامعتبر است')
    return
  }
  const preview = rampFromSeed(seed)
  designStore.setPalette({
    ...palette.value,
    seed,
    primary: preview,
  })
}
</script>

<template>
  <Space direction="vertical" size="large">
    <AiSectionAssist
      action="review-design-system"
      label="بازبینی پالت با AI"
      section="پالت رنگ"
    />
    <Card size="small" title="رنگ اصلی (Primary)">
      <Space wrap>
        <Input v-model:value="seedDraft" placeholder="#1677ff" allow-clear />
        <Button type="primary" @click="onGeneratePrimary">ساخت و ذخیره</Button>
        <Button @click="onPreviewOnly">اعمال سریع</Button>
      </Space>
      <Paragraph type="secondary">رمپ ۱۰ پله‌ای با @ant-design/colors</Paragraph>
      <Space wrap>
        <Tag
          v-for="(color, index) in primaryRamp"
          :key="`primary-${index}-${color}`"
          :style="{ backgroundColor: color, color: tagTextColor(index), border: 'none' }"
        >
          {{ index }} · {{ color }}
        </Tag>
      </Space>
      <Text v-if="primaryRamp.length === 0" type="secondary">رمپی ذخیره نشده است</Text>
    </Card>

    <Card size="small" title="رنگ اکسنت (Accent)">
      <Space wrap>
        <Input v-model:value="accentSeed" placeholder="#faad14" allow-clear />
        <Button type="primary" @click="onGenerateAccent">ساخت اکسنت</Button>
      </Space>
      <Space wrap>
        <Tag
          v-for="(color, index) in accentRamp"
          :key="`accent-${index}-${color}`"
          :style="{ backgroundColor: color, color: tagTextColor(index), border: 'none' }"
        >
          {{ index }} · {{ color }}
        </Tag>
      </Space>
    </Card>
  </Space>
</template>
