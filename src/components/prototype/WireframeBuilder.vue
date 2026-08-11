<script setup lang="ts">
import { computed } from 'vue'
import { Card, Checkbox, Col, Row, Space, Typography } from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { WIREFRAME_BLOCK_DEFS } from '@/constants/wireframe-blocks'
import { STORAGE_KEYS } from '@/constants/storage-keys'

const { Text, Paragraph } = Typography

const selected = useStorage<string[]>(STORAGE_KEYS.wireframeBlocks, ['header', 'content', 'footer'])

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
  <Space direction="vertical" size="middle">
    <Space wrap>
      <AiAssistButton action="suggest-wireframe-blocks" label="پیشنهاد چیدمان با AI" />
      <AiAssistButton action="wireframe-critique" label="نقد وایرفریم با AI" />
    </Space>
    <Paragraph type="secondary">
      بلوک‌های ساختاری وایر فریم را انتخاب کنید (فقط ساختار — بدون استایل سفارشی).
    </Paragraph>

    <Row :gutter="[16, 16]">
      <Col v-for="block in WIREFRAME_BLOCK_DEFS" :key="block.id" :xs="24" :sm="12" :md="8">
        <Card size="small" :title="block.label">
          <Checkbox :checked="isSelected(block.id)" @update:checked="(v) => onToggle(block.id, v)">
            {{ block.description }}
          </Checkbox>
        </Card>
      </Col>
    </Row>

    <Card size="small" title="چینش انتخاب‌شده">
      <Space direction="vertical">
        <Card
          v-for="block in WIREFRAME_BLOCK_DEFS.filter((b) => isSelected(b.id))"
          :key="`sel-${block.id}`"
          size="small"
        >
          <Text strong>{{ block.label }}</Text>
          — {{ block.description }}
        </Card>
        <Text v-if="selected.length === 0" type="secondary">هیچ بلوکی انتخاب نشده</Text>
      </Space>
    </Card>
  </Space>
</template>
