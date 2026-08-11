<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  Alert,
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Space,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { usePersona } from '@/composables/usePersona'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useDefineStore } from '@/stores/define'

const Textarea = Input.TextArea
const defineStore = useDefineStore()
const { pov, povSentence, problem } = storeToRefs(defineStore)
const { personas } = usePersona()

const previewReady = computed(() => {
  return (
    pov.value.user.trim().length > 0 ||
    pov.value.need.trim().length > 0 ||
    pov.value.insight.trim().length > 0
  )
})

const personaOptions = computed(() =>
  personas.value.map((p) => ({ value: p.id, label: `${p.name} — ${p.role}` })),
)

watch(
  () => pov.value.personaId,
  (personaId) => {
    if (!personaId) return
    const persona = personas.value.find((p) => p.id === personaId)
    if (!persona) return
    if (!pov.value.user.trim()) {
      defineStore.patchPOV({ user: `${persona.name} (${persona.role})` })
    }
  },
)

function copyFromProblem(): void {
  defineStore.patchPOV({
    user: problem.value.user,
    need: problem.value.need,
    insight: problem.value.insight,
  })
}

function onPersonaChange(value: unknown): void {
  const id = typeof value === 'string' ? value : undefined
  defineStore.patchPOV({ personaId: id })
}
</script>

<template>
  <Space direction="vertical" size="middle">
    <Space wrap>
      <AiAssistButton action="refine-pov" label="پیشنهاد POV با AI" section="نقطه دید (POV)" />
    </Space>
    <Card size="small" title="نقطه دید (POV)">
      <Form layout="vertical">
        <FormItem label="پرسونا (اختیاری)">
          <Select
            :value="pov.personaId"
            allow-clear
            placeholder="اتصال به پرسونا"
            @change="onPersonaChange"
          >
            <SelectOption v-for="opt in personaOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem>
          <Button @click="copyFromProblem">کپی از بیان مسئله</Button>
        </FormItem>

        <FormItem label="کاربر">
          <Input
            :value="pov.user"
            placeholder="کاربر کیست؟"
            @update:value="(v: string) => defineStore.patchPOV({ user: v })"
          />
        </FormItem>
        <FormItem label="نیاز">
          <Textarea
            :value="pov.need"
            :rows="2"
            placeholder="چه نیازی دارد؟"
            @update:value="(v: string) => defineStore.patchPOV({ need: v })"
          />
        </FormItem>
        <FormItem label="بینش">
          <Textarea
            :value="pov.insight"
            :rows="2"
            placeholder="چرا این نیاز مهم است؟"
            @update:value="(v: string) => defineStore.patchPOV({ insight: v })"
          />
        </FormItem>
      </Form>
    </Card>

    <Alert
      v-if="previewReady"
      type="success"
      show-icon
      message="جمله POV"
      :description="povSentence"
    />
    <Alert
      v-else
      type="info"
      show-icon
      message="پیش‌نمایش POV"
      description="با پر کردن فیلدها یا انتخاب پرسونا، جمله POV ساخته می‌شود."
    />
  </Space>
</template>
