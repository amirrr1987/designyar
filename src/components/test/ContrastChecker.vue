<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useContrast } from '@/composables/useContrast'
import { useDesignSystemStore } from '@/stores/designSystem'
import { useProjectStore } from '@/stores/project'
import { useTestStore } from '@/stores/test'
import { fa } from '@/content/fa'

const { Text, Paragraph } = Typography
const designStore = useDesignSystemStore()
const projectStore = useProjectStore()
const testStore = useTestStore()
const { palette } = storeToRefs(designStore)
const { contrastCheck } = storeToRefs(testStore)

const copy = fa.testTools.contrast
const job = fa.getJob('test.contrast')
const isJunior = computed(() => projectStore.isJuniorMode)

const saved = contrastCheck.value
const { foreground, background, result, setColors } = useContrast(
  saved?.foreground ?? '#000000',
  saved?.background ?? '#ffffff',
)

watch(contrastCheck, (next) => {
  if (next === null) return
  if (next.foreground === foreground.value && next.background === background.value) return
  setColors(next.foreground, next.background)
})

const isSaved = computed(() => {
  const c = contrastCheck.value
  if (c === null) return false
  return c.foreground === foreground.value && c.background === background.value
})

function levelColor(level: string): string {
  if (level === 'AAA') return 'success'
  if (level === 'AA') return 'processing'
  return 'error'
}

function pullFromDesignSystem(): void {
  const fg = palette.value.primary[7] ?? '#000000'
  const bg = palette.value.primary[0] ?? '#ffffff'
  setColors(fg, bg)
}

function saveCheck(): void {
  if (result.value === null) {
    message.warning(copy.invalid)
    return
  }
  testStore.saveContrastCheck({
    foreground: foreground.value.trim(),
    background: background.value.trim(),
  })
  message.success(copy.saved)
}

const saveBtn: ButtonProps = { type: 'primary' }
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <Alert
      v-if="job"
      type="info"
      show-icon
      :message="job.title"
      :description="copy.why"
    />

    <AiSectionAssist
      v-if="!isJunior"
      action="summarize-test"
      :label="copy.aiLabel"
      section="کنتراست"
    />

    <Card size="small" :title="copy.tab">
      <Space direction="vertical" size="middle" style="width: 100%">
        <Space wrap>
          <Input v-model:value="foreground" :placeholder="copy.fgPh" allow-clear />
          <Input v-model:value="background" :placeholder="copy.bgPh" allow-clear />
          <Button @click="pullFromDesignSystem">{{ copy.pullPalette }}</Button>
          <Button v-bind="saveBtn" :disabled="isSaved && result !== null" @click="saveCheck">
            {{ copy.save }}
          </Button>
        </Space>
        <Paragraph type="secondary">{{ copy.hint }}</Paragraph>
        <Tag v-if="contrastCheck !== null" color="success">{{ copy.saved }}</Tag>
      </Space>
    </Card>

    <Row :gutter="[16, 16]">
      <Col :xs="24" :md="8">
        <Card size="small" :title="copy.preview">
          <Tag
            :style="{
              backgroundColor: background,
              color: foreground,
              border: 'none',
            }"
          >
            نمونه متن
          </Tag>
        </Card>
      </Col>
      <Col :xs="24" :md="8">
        <Card size="small">
          <Statistic :title="copy.ratio" :value="result?.ratio ?? 0" :precision="2" suffix=":1" />
        </Card>
      </Col>
      <Col :xs="24" :md="8">
        <Card size="small" :title="copy.level">
          <Tag v-if="result" :color="levelColor(result.level)">{{ result.level }}</Tag>
          <Text v-else type="danger">{{ copy.invalid }}</Text>
        </Card>
      </Col>
    </Row>
  </Space>
</template>
