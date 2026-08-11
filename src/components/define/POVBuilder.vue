<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Space,
  Typography,
} from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { usePersona } from '@/composables/usePersona'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useDefineStore } from '@/stores/define'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'

const Textarea = Input.TextArea
const { Paragraph, Text } = Typography
const defineStore = useDefineStore()
const projectStore = useProjectStore()
const { pov, povSentence, problem } = storeToRefs(defineStore)
const { personas } = usePersona()
const copy = fa.defineTools.pov
const glossary = fa.getGlossary('pov')
const job = fa.getJob('define.pov')
const isJunior = computed(() => projectStore.isJuniorMode)

const copyBtn: ButtonProps = { type: 'dashed' }

const previewReady = computed(() => {
  return (
    pov.value.user.trim().length > 0 ||
    pov.value.need.trim().length > 0 ||
    pov.value.insight.trim().length > 0
  )
})

const isComplete = computed(
  () =>
    Boolean(pov.value.user.trim()) &&
    Boolean(pov.value.need.trim()) &&
    Boolean(pov.value.insight.trim()),
)

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
  <Space direction="vertical" size="middle" style="width: 100%">
    <Paragraph v-if="glossary" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ glossary.labelFa }}</Text>
      <template v-if="!isJunior && glossary.glossEn"> ({{ glossary.glossEn }})</template>
      : {{ glossary.definition }}
    </Paragraph>
    <Paragraph v-if="job && isJunior" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ fa.whyHeading }}</Text>
      {{ ' ' }}{{ job.why }}
    </Paragraph>

    <AiSectionAssist action="refine-pov" :label="copy.aiLabel" section="دیدگاه کاربر" />

    <Form layout="vertical">
      <FormItem :label="copy.persona">
        <Select
          :value="pov.personaId"
          allow-clear
          :placeholder="copy.personaPh"
          @change="onPersonaChange"
        >
          <SelectOption v-for="opt in personaOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectOption>
        </Select>
      </FormItem>

      <FormItem>
        <Button v-bind="copyBtn" @click="copyFromProblem">{{ copy.copyFromProblem }}</Button>
      </FormItem>

      <FormItem :label="copy.user">
        <Input
          :value="pov.user"
          :placeholder="copy.user"
          @update:value="(v: string) => defineStore.patchPOV({ user: v })"
        />
      </FormItem>
      <FormItem :label="copy.need">
        <Textarea
          :value="pov.need"
          :rows="2"
          :placeholder="copy.need"
          @update:value="(v: string) => defineStore.patchPOV({ need: v })"
        />
      </FormItem>
      <FormItem :label="copy.insight">
        <Textarea
          :value="pov.insight"
          :rows="2"
          :placeholder="copy.insight"
          @update:value="(v: string) => defineStore.patchPOV({ insight: v })"
        />
      </FormItem>
    </Form>

    <Alert
      v-if="previewReady"
      :type="isComplete ? 'success' : 'info'"
      show-icon
      :message="copy.previewReady"
      :description="povSentence"
    />
    <Alert v-else type="info" show-icon :message="copy.previewEmpty" />
  </Space>
</template>
