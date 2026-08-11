<script setup lang="ts">
import { computed } from 'vue'
import {
  Alert,
  Card,
  Checkbox,
  Col,
  Progress,
  Row,
  Space,
  Typography,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { WIREFRAME_BLOCK_DEFS } from '@/constants/wireframe-blocks'
import { usePrototypeStore } from '@/stores/prototype'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'

const { Text, Paragraph } = Typography

const prototypeStore = usePrototypeStore()
const projectStore = useProjectStore()
const { wireframeBlocks: selected } = storeToRefs(prototypeStore)
const copy = fa.prototypeTools.wireframe
const job = fa.getJob('prototype.wireframe')
const isJunior = computed(() => projectStore.isJuniorMode)

const GOAL = 2
const progressPercent = computed(() =>
  Math.min(100, Math.round((selected.value.length / GOAL) * 100)),
)

const selectedSet = computed(() => new Set(selected.value))

function isSelected(id: string): boolean {
  return selectedSet.value.has(id)
}

function onToggle(id: string, checked: boolean | string | number): void {
  const on = checked === true
  if (on) {
    if (!selected.value.includes(id)) selected.value = [...selected.value, id]
    return
  }
  selected.value = selected.value.filter((x) => x !== id)
}
</script>

<template>
  <Space direction="vertical" size="middle" style="width: 100%">
    <Paragraph v-if="job && isJunior" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ fa.whyHeading }}</Text>
      {{ ' ' }}{{ job.why }}
    </Paragraph>

    <Alert
      v-if="isJunior"
      :type="selected.length >= GOAL ? 'success' : 'info'"
      show-icon
      :message="copy.goalHint"
      :description="`${selected.length} از ${GOAL} بلوک`"
    />
    <Progress
      v-if="isJunior"
      :percent="progressPercent"
      :status="selected.length >= GOAL ? 'success' : 'active'"
      size="small"
    />

    <Space wrap>
      <AiAssistButton
        action="suggest-wireframe-blocks"
        :label="copy.aiSuggest"
        section="وایرفریم"
      />
      <AiAssistButton
        v-if="!isJunior"
        action="wireframe-critique"
        :label="copy.aiCritique"
        section="وایرفریم"
      />
    </Space>
    <Paragraph type="secondary">{{ copy.hint }}</Paragraph>

    <Row :gutter="[16, 16]">
      <Col v-for="block in WIREFRAME_BLOCK_DEFS" :key="block.id" :xs="24" :sm="12" :md="8">
        <Card size="small" :title="block.label">
          <Checkbox :checked="isSelected(block.id)" @update:checked="(v) => onToggle(block.id, v)">
            {{ block.description }}
          </Checkbox>
        </Card>
      </Col>
    </Row>

    <Card size="small" :title="copy.selectedTitle">
      <Space direction="vertical">
        <Card
          v-for="block in WIREFRAME_BLOCK_DEFS.filter((b) => isSelected(b.id))"
          :key="`sel-${block.id}`"
          size="small"
        >
          <Text strong>{{ block.label }}</Text>
          — {{ block.description }}
        </Card>
        <Text v-if="selected.length === 0" type="secondary">{{ copy.empty }}</Text>
      </Space>
    </Card>
  </Space>
</template>
