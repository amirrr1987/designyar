<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { blue, geekblue, gold, green, magenta, purple, volcano } from '@ant-design/colors'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useDesignSystemStore } from '@/stores/designSystem'
import { useProjectStore } from '@/stores/project'
import { rampFromSeed } from '@/types/design-system'
import { fa } from '@/content/fa'

const { Text, Paragraph } = Typography
const designStore = useDesignSystemStore()
const projectStore = useProjectStore()
const { palette } = storeToRefs(designStore)
const copy = fa.prototypeTools.color
const job = fa.getJob('prototype.color')
const isJunior = computed(() => projectStore.isJuniorMode)

const seedDraft = ref(palette.value.seed)
const accentSeed = ref(gold[5] ?? '#faad14')

const primaryRamp = computed(() => palette.value.primary)
const accentRamp = computed(() => palette.value.accent)

const primaryPresets = [
  blue[5] ?? '#1677ff',
  geekblue[5] ?? '#2f54eb',
  purple[5] ?? '#722ed1',
  magenta[5] ?? '#eb2f96',
  volcano[5] ?? '#fa541c',
  green[5] ?? '#52c41a',
] as const

function tagTextColor(index: number): string | undefined {
  return index > 4 ? '#fff' : undefined
}

function applyPrimarySeed(seed: string): void {
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(seed)) {
    message.warning('یک رنگ hex معتبر وارد کنید (مثلاً #1677ff)')
    return
  }
  seedDraft.value = seed
  designStore.generatePrimaryFromSeed(seed)
  message.success('پالت اصلی ذخیره شد')
}

function onGeneratePrimary(): void {
  applyPrimarySeed(seedDraft.value.trim())
}

function onGenerateAccent(): void {
  const seed = accentSeed.value.trim()
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(seed)) {
    message.warning('یک رنگ hex معتبر وارد کنید')
    return
  }
  designStore.setAccentFromSeed(seed)
  message.success('پالت تأکیدی ذخیره شد')
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
  <Space direction="vertical" size="large" style="width: 100%">
    <Paragraph v-if="job && isJunior" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ fa.whyHeading }}</Text>
      {{ ' ' }}{{ job.why }}
    </Paragraph>

    <AiSectionAssist
      action="review-design-system"
      :label="copy.aiLabel"
      section="پالت رنگ"
    />

    <Card size="small" :title="copy.presetsHint">
      <Space wrap>
        <Button
          v-for="color in primaryPresets"
          :key="color"
          size="small"
          :style="{ backgroundColor: color, borderColor: color, color: '#fff' }"
          @click="applyPrimarySeed(color)"
        >
          {{ color }}
        </Button>
      </Space>
    </Card>

    <Card size="small" :title="copy.primaryTitle">
      <Space wrap>
        <Input v-model:value="seedDraft" :placeholder="copy.seedPh" allow-clear />
        <Button type="primary" @click="onGeneratePrimary">{{ copy.generate }}</Button>
        <Button v-if="!isJunior" @click="onPreviewOnly">{{ copy.applyQuick }}</Button>
      </Space>
      <Paragraph type="secondary">{{ copy.rampHint }}</Paragraph>
      <Space wrap>
        <Tag
          v-for="(color, index) in primaryRamp"
          :key="`primary-${index}-${color}`"
          :style="{ backgroundColor: color, color: tagTextColor(index), border: 'none' }"
        >
          {{ isJunior ? color : `${index} · ${color}` }}
        </Tag>
      </Space>
      <Text v-if="primaryRamp.length === 0" type="secondary">هنوز پالتی نداری</Text>
    </Card>

    <Card size="small" :title="copy.accentTitle">
      <Space wrap>
        <Input v-model:value="accentSeed" :placeholder="copy.accentPh" allow-clear />
        <Button type="primary" @click="onGenerateAccent">{{ copy.generateAccent }}</Button>
      </Space>
      <Space wrap>
        <Tag
          v-for="(color, index) in accentRamp"
          :key="`accent-${index}-${color}`"
          :style="{ backgroundColor: color, color: tagTextColor(index), border: 'none' }"
        >
          {{ isJunior ? color : `${index} · ${color}` }}
        </Tag>
      </Space>
    </Card>
  </Space>
</template>
