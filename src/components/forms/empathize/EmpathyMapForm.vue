<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, Form, FormItem, Input, Select, Space } from 'ant-design-vue'
import type { SelectProps } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useEmpathizeStore } from '@/stores/empathize'
import {
  createEmptyEmpathyMap,
  empathyMapsAiSchema,
  type EmpathyMapEntry,
} from '@/types/empathize'

const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<EmpathyMapEntry[]>(
  store.state.empathyMaps.length > 0
    ? store.state.empathyMaps.map((item) => ({ ...item }))
    : [createEmptyEmpathyMap()],
)

const personaOptions = computed<NonNullable<SelectProps['options']>>(() =>
  store.state.personas
    .filter((p) => p.name.trim().length > 0 || p.role.trim().length > 0)
    .map((p) => ({
      value: p.id,
      label: p.name.trim() || p.role.trim() || 'پرسونا',
    })),
)

function persist(): void {
  store.setEmpathyMaps(items.value.map((item) => ({ ...item })))
}

function persistClean(): void {
  const cleaned = items.value.filter(
    (item) =>
      item.label.trim().length > 0 ||
      item.says.trim().length > 0 ||
      item.thinks.trim().length > 0 ||
      item.does.trim().length > 0 ||
      item.feels.trim().length > 0,
  )
  const next = cleaned.length > 0 ? cleaned : [createEmptyEmpathyMap()]
  store.setEmpathyMaps(next.map((item) => ({ ...item })))
  items.value = next.map((item) => ({ ...item }))
}

function addItem(): void {
  const first = store.state.personas[0]
  items.value = [
    ...items.value,
    createEmptyEmpathyMap(first?.name ?? ''),
  ]
  const last = items.value[items.value.length - 1]
  if (last && first) {
    last.personaId = first.id
    last.label = first.name || first.role
  }
  persist()
}

function removeItem(index: number): void {
  const next = items.value.filter((_, i) => i !== index)
  items.value = next.length > 0 ? next : [createEmptyEmpathyMap()]
  persist()
}

function onPersonaSelect(index: number, personaId: string): void {
  const row = items.value[index]
  if (!row) return
  const persona = store.state.personas.find((p) => p.id === personaId)
  row.personaId = personaId
  if (persona) {
    row.label = persona.name.trim() || persona.role.trim() || row.label
  }
  persist()
}

function onPersonaValueUpdate(index: number, value: SelectProps['value']): void {
  if (typeof value === 'string') {
    onPersonaSelect(index, value)
    return
  }
  const row = items.value[index]
  if (!row) return
  row.personaId = undefined
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: empathyMapsAiSchema,
  formTitle: 'نقشه همدلی',
  phase: 'empathize',
  getCurrentValue: () => ({ empathyMaps: items.value }),
  extraContext: () =>
    JSON.stringify({
      researchGoal: store.state.researchGoal,
      personas: store.state.personas,
    }),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.empathyMaps
        .map(
          (m, i) =>
            `${i + 1}. ${m.label || 'بدون برچسب'}\nمی‌گوید: ${m.says}\nفکر: ${m.thinks}\nعمل: ${m.does}\nاحساس: ${m.feels}`,
        )
        .join('\n\n')
    : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  const next =
    preview.value.empathyMaps.length > 0
      ? preview.value.empathyMaps.map((item) => ({
          ...item,
          id: item.id || createEmptyEmpathyMap().id,
        }))
      : [createEmptyEmpathyMap()]
  store.setEmpathyMaps(next)
  items.value = next.map((item) => ({ ...item }))
  clearPreview()
}
</script>

<template>
  <MicroFormShell
    v-if="currentMeta"
    :title="currentMeta.title"
    :hint="currentMeta.hint"
    :ai-assist-label="currentMeta.aiAssistLabel"
    :loading="loading"
    :error-message="errorMessage"
    :preview-text="previewText"
    :has-preview="preview !== null"
    @assist="onAssist"
    @accept="onAccept"
    @reject="clearPreview"
    @next="persistClean(); goNext()"
    @prev="persistClean(); goPrev()"
  >
    <Space direction="vertical" class="w-full" size="middle">
      <Card
        v-for="(item, index) in items"
        :key="item.id"
        size="small"
        class="ring-1 ring-stone-100"
      >
        <template #title>نقشه {{ index + 1 }}</template>
        <template #extra>
          <Button
            danger
            type="text"
            html-type="button"
            aria-label="حذف نقشه همدلی"
            @click="removeItem(index)"
          >
            <template #icon><DeleteOutlined /></template>
          </Button>
        </template>
        <Form layout="vertical">
          <FormItem v-if="personaOptions.length > 0" label="مرتبط با پرسونا">
            <Select
              :value="item.personaId"
              :options="personaOptions"
              allow-clear
              placeholder="انتخاب پرسونا"
              class="w-full"
              @update:value="(value) => onPersonaValueUpdate(index, value)"
            />
          </FormItem>
          <FormItem label="برچسب / نام">
            <Input
              v-model:value="item.label"
              placeholder="مثلاً نام پرسونا"
              @blur="persist"
            />
          </FormItem>
          <FormItem label="می‌گوید">
            <Input.TextArea v-model:value="item.says" :rows="2" @blur="persist" />
          </FormItem>
          <FormItem label="فکر می‌کند">
            <Input.TextArea v-model:value="item.thinks" :rows="2" @blur="persist" />
          </FormItem>
          <FormItem label="انجام می‌دهد">
            <Input.TextArea v-model:value="item.does" :rows="2" @blur="persist" />
          </FormItem>
          <FormItem label="احساس می‌کند">
            <Input.TextArea v-model:value="item.feels" :rows="2" @blur="persist" />
          </FormItem>
        </Form>
      </Card>

      <Button type="dashed" block html-type="button" @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن نقشه همدلی
      </Button>
    </Space>
  </MicroFormShell>
</template>
