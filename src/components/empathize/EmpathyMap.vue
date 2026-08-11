<script setup lang="ts">
import { computed, watch } from 'vue'
import { Card, Col, Input, Row, Select, SelectOption, Space, Typography } from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { usePersona } from '@/composables/usePersona'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import {
  createEmptyQuadrants,
  type EmpathyMapsByPersona,
  type EmpathyQuadrants,
} from '@/types/empathy-map'

const GENERAL_KEY = 'general'
const Textarea = Input.TextArea
const { Text, Paragraph } = Typography
const { personas } = usePersona()

const maps = useStorage<EmpathyMapsByPersona>(STORAGE_KEYS.empathyMaps, {})
const selectedPersonaId = useStorage<string>(STORAGE_KEYS.empathySelectedPersona, GENERAL_KEY)

const personaOptions = computed(() => [
  { value: GENERAL_KEY, label: 'عمومی (بدون پرسونا)' },
  ...personas.value.map((p) => ({ value: p.id, label: p.name })),
])

const quadrants = computed({
  get(): EmpathyQuadrants {
    const entry = maps.value[selectedPersonaId.value]
    return entry?.quadrants ?? createEmptyQuadrants()
  },
  set(next: EmpathyQuadrants): void {
    maps.value = {
      ...maps.value,
      [selectedPersonaId.value]: {
        personaId: selectedPersonaId.value,
        quadrants: next,
        updatedAt: new Date().toISOString(),
      },
    }
  },
})

function patchQuadrant(key: keyof EmpathyQuadrants, value: string): void {
  quadrants.value = { ...quadrants.value, [key]: value }
}

watch(
  personas,
  (list) => {
    if (selectedPersonaId.value === GENERAL_KEY) return
    const exists = list.some((p) => p.id === selectedPersonaId.value)
    if (!exists) selectedPersonaId.value = GENERAL_KEY
  },
  { deep: true },
)

const cells: { key: keyof EmpathyQuadrants; title: string; placeholder: string }[] = [
  { key: 'says', title: 'می‌گوید (Says)', placeholder: 'چیزی که کاربر می‌گوید…' },
  { key: 'thinks', title: 'فکر می‌کند (Thinks)', placeholder: 'چیزی که در ذهن دارد…' },
  { key: 'does', title: 'انجام می‌دهد (Does)', placeholder: 'رفتار و اقدامات…' },
  { key: 'feels', title: 'احساس می‌کند (Feels)', placeholder: 'احساسات و نگرانی‌ها…' },
]
</script>

<template>
  <Space direction="vertical" size="middle">
    <AiAssistButton action="synthesize-empathy" label="سنتز نقشه همدلی با AI" section="نقشه همدلی" />
    <Row :gutter="[16, 8]">
      <Col :xs="24" :md="12" :lg="8">
        <Text strong>مرتبط با پرسونا</Text>
        <Select v-model:value="selectedPersonaId">
          <SelectOption v-for="opt in personaOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectOption>
        </Select>
      </Col>
    </Row>
    <Paragraph type="secondary">تغییرات به‌صورت خودکار ذخیره می‌شوند.</Paragraph>

    <Row :gutter="[16, 16]">
      <Col v-for="cell in cells" :key="cell.key" :xs="24" :md="12">
        <Card size="small" :title="cell.title">
          <Textarea
            :value="quadrants[cell.key]"
            :rows="5"
            :placeholder="cell.placeholder"
            @update:value="(v: string) => patchQuadrant(cell.key, v)"
          />
        </Card>
      </Col>
    </Row>
  </Space>
</template>
