<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Progress,
  Select,
  SelectOption,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { storeToRefs } from 'pinia'
import { useIdeateStore } from '@/stores/ideate'
import { useProjectStore } from '@/stores/project'
import type { FlowNodeKind } from '@/types/ideate'
import { fa } from '@/content/fa'

const KIND_OPTIONS: { value: FlowNodeKind; label: string; color: string }[] = [
  { value: 'start', label: 'شروع', color: 'green' },
  { value: 'action', label: 'اقدام', color: 'blue' },
  { value: 'decision', label: 'تصمیم', color: 'orange' },
  { value: 'end', label: 'پایان', color: 'red' },
]

function kindMeta(kind: FlowNodeKind): { label: string; color: string } {
  const found = KIND_OPTIONS.find((o) => o.value === kind)
  return found ?? { label: kind, color: 'default' }
}

const ideateStore = useIdeateStore()
const projectStore = useProjectStore()
const { flowNodes } = storeToRefs(ideateStore)
const copy = fa.ideateTools.userflow
const glossary = fa.getGlossary('userflow')
const job = fa.getJob('ideate.userflow')
const isJunior = computed(() => projectStore.isJuniorMode)

const GOAL = 2
const progressPercent = computed(() =>
  Math.min(100, Math.round((flowNodes.value.length / GOAL) * 100)),
)

const draftKind = ref<FlowNodeKind>('action')
const draftLabel = ref('')

function onAdd(): void {
  const label = draftLabel.value.trim()
  if (!label) {
    message.warning('برچسب گام را وارد کنید')
    return
  }
  ideateStore.addFlowNode(draftKind.value, label)
  draftLabel.value = ''
  message.success('گام افزوده شد')
}

function onKindChange(id: string, value: unknown): void {
  if (value === 'start' || value === 'action' || value === 'decision' || value === 'end') {
    ideateStore.updateFlowNode(id, { kind: value })
  }
}

const { Paragraph, Text } = Typography
</script>

<template>
  <Space direction="vertical" size="middle" style="width: 100%">
    <Paragraph v-if="glossary" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ glossary.labelFa }}:</Text>
      {{ ' ' }}{{ glossary.definition }}
    </Paragraph>
    <Paragraph v-if="job && isJunior" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ fa.whyHeading }}</Text>
      {{ ' ' }}{{ job.why }}
    </Paragraph>

    <Alert
      v-if="isJunior"
      :type="flowNodes.length >= GOAL ? 'success' : 'info'"
      show-icon
      :message="copy.goalHint"
      :description="`${flowNodes.length} از ${GOAL} گام`"
    />
    <Progress
      v-if="isJunior"
      :percent="progressPercent"
      :status="flowNodes.length >= GOAL ? 'success' : 'active'"
      size="small"
    />

    <AiSectionAssist action="suggest-userflow" :label="copy.aiLabel" section="مسیر کاربر" />

    <Card size="small" :title="copy.addStep">
      <Space wrap>
        <Select v-model:value="draftKind" style="min-width: 120px">
          <SelectOption v-for="opt in KIND_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectOption>
        </Select>
        <Input
          v-model:value="draftLabel"
          :placeholder="copy.labelPh"
          style="min-width: 200px"
          @press-enter="onAdd"
        />
        <Button type="primary" @click="onAdd">
          <template #icon><PlusOutlined /></template>
          افزودن
        </Button>
      </Space>
    </Card>

    <Empty v-if="flowNodes.length === 0" :description="copy.empty" />

    <Space v-else direction="vertical" size="small" style="width: 100%">
      <Card v-for="(node, index) in flowNodes" :key="node.id" size="small">
        <template #title>
          <Space>
            <Tag :color="kindMeta(node.kind).color">{{ kindMeta(node.kind).label }}</Tag>
            <span>گام {{ index + 1 }}</span>
          </Space>
        </template>
        <template #extra>
          <Popconfirm
            title="این گام حذف شود؟"
            ok-text="حذف"
            cancel-text="انصراف"
            @confirm="ideateStore.removeFlowNode(node.id)"
          >
            <Button type="text" danger>
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Popconfirm>
        </template>

        <Space direction="vertical" style="width: 100%">
          <Select
            :value="node.kind"
            style="width: 100%"
            @change="(v: unknown) => onKindChange(node.id, v)"
          >
            <SelectOption v-for="opt in KIND_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectOption>
          </Select>
          <Input
            :value="node.label"
            placeholder="برچسب گام"
            @update:value="(v: string) => ideateStore.updateFlowNode(node.id, { label: v })"
          />
          <Tag v-if="node.nextId" color="default">{{ copy.nextConnected }}</Tag>
        </Space>
      </Card>
    </Space>
  </Space>
</template>
