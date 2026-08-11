<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Select,
  SelectOption,
  Space,
  Tag,
  message,
} from 'ant-design-vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { storeToRefs } from 'pinia'
import { useIdeateStore } from '@/stores/ideate'
import type { FlowNodeKind } from '@/types/ideate'

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
const { flowNodes } = storeToRefs(ideateStore)

const draftKind = ref<FlowNodeKind>('action')
const draftLabel = ref('')

function onAdd(): void {
  const label = draftLabel.value.trim()
  if (!label) {
    message.warning('برچسب گره را وارد کنید')
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
</script>

<template>
  <Space direction="vertical" size="middle">
    <AiAssistButton action="suggest-userflow" label="پیشنهاد جریان با AI" section="جریان کاربر" />
    <Card size="small" title="افزودن گام">
      <Space wrap>
        <Select v-model:value="draftKind">
          <SelectOption v-for="opt in KIND_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectOption>
        </Select>
        <Input
          v-model:value="draftLabel"
          placeholder="مثلاً ورود به صفحه محصول"
          @press-enter="onAdd"
        />
        <Button type="primary" @click="onAdd">
          <template #icon><PlusOutlined /></template>
          افزودن
        </Button>
      </Space>
    </Card>

    <Empty v-if="flowNodes.length === 0" description="هنوز جریانی تعریف نشده است" />

    <Space v-else direction="vertical" size="small">
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

        <Space direction="vertical">
          <Select :value="node.kind" @change="(v: unknown) => onKindChange(node.id, v)">
            <SelectOption v-for="opt in KIND_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectOption>
          </Select>
          <Input
            :value="node.label"
            placeholder="برچسب گام"
            @update:value="(v: string) => ideateStore.updateFlowNode(node.id, { label: v })"
          />
          <Tag v-if="node.nextId" color="default">→ گره بعدی متصل است</Tag>
        </Space>
      </Card>
    </Space>
  </Space>
</template>
