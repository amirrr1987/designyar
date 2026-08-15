<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Alert, Button, Form, FormItem, Input, Space, Typography, message } from 'ant-design-vue'
import { SendOutlined } from '@ant-design/icons-vue'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useDefineStore } from '@/stores/define'
import {
  challengeAiSchema,
  createEmptyChallenge,
  formatChallengeSentence,
  type ChallengeDefinition,
} from '@/types/define'
import { challengeAiExtraContext } from '@/constants/dt-ai-prompts'

const store = useDefineStore()
const { currentMeta, goNext, goPrev, goToForm } = useFormWizard()

const draft = reactive<ChallengeDefinition>({
  ...createEmptyChallenge(),
  ...store.state.challenge,
})

watch(
  () => store.state.challenge,
  (value) => Object.assign(draft, value),
)

const sentence = computed(() => formatChallengeSentence(draft))

const pulseSummary = computed(() => {
  const filled = [draft.action, draft.person, draft.problem].filter((s) => s.trim().length > 0)
    .length
  if (filled === 0) return 'هنوز Challenge خالی است — بدون راه‌حل ضمنی بنویس.'
  if (filled < 3) return `${filled} از ۳ بخش پر شده`
  return 'Challenge آماده است — می‌توانی به HMW بفرستی.'
})

function persist(): void {
  store.setChallenge({
    action: draft.action,
    person: draft.person,
    problem: draft.problem,
  })
}

function sendToHmw(): void {
  persist()
  const line = formatChallengeSentence(draft)
  const existing = store.state.hmw.map((item) => item.trim()).filter((item) => item.length > 0)
  if (existing.includes(line)) {
    message.info('این سؤال از قبل در HMW هست')
    return
  }
  store.setHmw([...existing, line])
  message.success('به سؤال‌های HMW اضافه شد')
}

async function goHmw(): Promise<void> {
  sendToHmw()
  await goToForm('define', 'hmw')
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: challengeAiSchema,
  formTitle: 'تعریف چالش',
  phase: 'define',
  getCurrentValue: () => ({ challenge: { ...draft } }),
  extraContext: challengeAiExtraContext,
})

const previewText = computed(() =>
  preview.value ? formatChallengeSentence(preview.value.challenge) : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  Object.assign(draft, preview.value.challenge)
  persist()
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
    @next="persist(); goNext()"
    @prev="persist(); goPrev()"
  >
    <Space direction="vertical" class="w-full" size="large">
      <FormPulseHeader :summary="pulseSummary" />

      <Alert
        type="info"
        show-icon
        class="rounded-xl"
        message="اول جمع کن، بعد قضاوت — راه‌حل را داخل چالش ننویس."
      />

      <Form layout="vertical">
        <FormItem label="چه کاری؟ (action)">
          <Input
            v-model:value="draft.action"
            placeholder="مثلاً طراحی راهنمای موبایل"
            @blur="persist"
          />
        </FormItem>
        <FormItem label="برای چه کسی؟ (person)">
          <Input
            v-model:value="draft.person"
            placeholder="مثلاً همکاران تازه‌وارد"
            @blur="persist"
          />
        </FormItem>
        <FormItem label="برای حل چه مسئله‌ای؟ (problem)">
          <Input
            v-model:value="draft.problem"
            placeholder="مثلاً سردرگمی در هفتهٔ اول"
            @blur="persist"
          />
        </FormItem>
      </Form>

      <div class="rounded-2xl bg-teal-50/70 p-4 ring-1 ring-teal-100">
        <Typography.Text class="mb-1 block text-xs text-teal-800">پیش‌نمایش Challenge</Typography.Text>
        <Typography.Paragraph class="mb-0! text-stone-800">{{ sentence }}</Typography.Paragraph>
      </div>

      <Space wrap>
        <Button type="default" html-type="button" @click="sendToHmw">
          <template #icon><SendOutlined /></template>
          افزودن به HMW
        </Button>
        <Button type="primary" html-type="button" @click="goHmw">
          افزودن و برو به HMW
        </Button>
      </Space>
    </Space>
  </MicroFormShell>
</template>
