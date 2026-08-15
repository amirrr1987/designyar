<script setup lang="ts">
import { computed, watch } from 'vue'
import { Alert, Card, Col, Input, Row, Select, SelectOption, Space, Typography } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { usePersona } from '@/composables/usePersona'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useEmpathizeStore } from '@/stores/empathize'
import { createEmptyQuadrants, type EmpathyQuadrants } from '@/types/empathy-map'
import { fa } from '@/content/fa'

const GENERAL_KEY = 'general'
const Textarea = Input.TextArea
const { Text, Paragraph } = Typography
const { personas } = usePersona()
const empathizeStore = useEmpathizeStore()
const { empathyMaps: maps, empathySelectedPersona: selectedPersonaId } =
  storeToRefs(empathizeStore)

const copy = fa.empathizeTools.empathyMap
const glossary = fa.getGlossary('empathy-map')

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
    empathizeStore.upsertEmpathyMap(selectedPersonaId.value, next)
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

const cells: {
  key: keyof EmpathyQuadrants
  title: string
  placeholder: string
}[] = [
  { key: 'says', title: copy.cells.says.title, placeholder: copy.cells.says.placeholder },
  { key: 'thinks', title: copy.cells.thinks.title, placeholder: copy.cells.thinks.placeholder },
  { key: 'does', title: copy.cells.does.title, placeholder: copy.cells.does.placeholder },
  { key: 'feels', title: copy.cells.feels.title, placeholder: copy.cells.feels.placeholder },
]
</script>

<template>
  <Space direction="vertical" size="middle" style="width: 100%">
    <Alert
      type="info"
      show-icon
      :message="`${fa.optionalLabel}: ${copy.alertMessage}`"
      :description="copy.alertDescription"
    />
    <Paragraph v-if="glossary" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ glossary.labelFa }}</Text>
      <template v-if="glossary.glossEn"> ({{ glossary.glossEn }})</template>
      : {{ glossary.definition }}
    </Paragraph>

    <AiAssistButton
      action="synthesize-empathy"
      label="پر کردن نقشه با AI"
      section="نقشه همدلی"
    />

    <Row :gutter="[16, 8]">
      <Col :xs="24" :md="12" :lg="8">
        <Text strong>{{ copy.linkPersona }}</Text>
        <Select v-model:value="selectedPersonaId" style="width: 100%">
          <SelectOption v-for="opt in personaOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectOption>
        </Select>
      </Col>
    </Row>
    <Paragraph type="secondary">{{ copy.autoSave }}</Paragraph>

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
