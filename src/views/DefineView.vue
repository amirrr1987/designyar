<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { Card, Space, Tag } from 'ant-design-vue'
import HMWQuestions from '@/components/define/HMWQuestions.vue'
import POVBuilder from '@/components/define/POVBuilder.vue'
import ProblemStatementForm from '@/components/define/ProblemStatement.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import PhaseShell from '@/components/shell/PhaseShell.vue'
import { useCompletion } from '@/composables/useCompletion'
import { fa } from '@/content/fa'
import { useProjectStore } from '@/stores/project'
import type { JobId } from '@/domain/completion'

type DefineStepId = 'define.problem' | 'define.pov' | 'define.hmw'

const projectStore = useProjectStore()
const { phaseProgress } = useCompletion()
const isJunior = computed(() => projectStore.isJuniorMode)
const tools = fa.defineTools

const focusJobId = computed((): DefineStepId | null => {
  const id = phaseProgress('define').nextJob?.id
  if (id === 'define.problem' || id === 'define.pov' || id === 'define.hmw') return id
  return null
})

const progress = computed(() => phaseProgress('define'))

function isDone(jobId: DefineStepId): boolean {
  return !progress.value.missing.includes(jobId as JobId)
}

function isCurrent(jobId: DefineStepId): boolean {
  return focusJobId.value === jobId
}

const primaryAiAction = computed(() => {
  switch (focusJobId.value) {
    case 'define.pov':
      return 'refine-pov' as const
    case 'define.hmw':
      return 'generate-hmw' as const
    default:
      return 'refine-problem' as const
  }
})

const primaryAiLabel = computed(() => {
  switch (focusJobId.value) {
    case 'define.pov':
      return tools.pov.aiLabel
    case 'define.hmw':
      return tools.hmw.aiLabel
    default:
      return tools.problem.aiLabel
  }
})

watch(
  focusJobId,
  async (id) => {
    if (!id || !isJunior.value) return
    await nextTick()
    const el = document.getElementById(`define-step-${id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  },
  { immediate: true },
)
</script>

<template>
  <PhaseShell phase="define">
    <template #ai>
      <AiAssistButton
        v-if="isJunior"
        :action="primaryAiAction"
        :label="primaryAiLabel"
        section="تعریف مسئله"
      />
      <AiChainButton v-else chain="define-complete" label="شروع با AI (مسئله→دیدگاه→سوالات)" />
    </template>
    <template #ai-more>
      <AiAssistButton action="refine-problem" :label="tools.problem.aiLabel" section="تعریف مسئله" />
      <AiAssistButton action="refine-pov" :label="tools.pov.aiLabel" section="تعریف مسئله" />
      <AiAssistButton action="generate-hmw" :label="tools.hmw.aiLabel" section="تعریف مسئله" />
      <AiAssistButton action="ux-improve" label="پیشنهاد بهبود UX" section="تعریف مسئله" />
    </template>

    <Space direction="vertical" size="middle" style="width: 100%">
      <Card id="define-step-define.problem">
        <template #title>
          <Space>
            <span>{{ tools.problem.stepTitle }}</span>
            <Tag v-if="isCurrent('define.problem')" color="processing">{{ tools.currentJob }}</Tag>
            <Tag v-else-if="isDone('define.problem')" color="success">{{ tools.doneStep }}</Tag>
          </Space>
        </template>
        <ProblemStatementForm />
      </Card>

      <Card id="define-step-define.pov">
        <template #title>
          <Space>
            <span>{{ isJunior ? tools.pov.stepTitle : tools.pov.stepTitleFull }}</span>
            <Tag v-if="isCurrent('define.pov')" color="processing">{{ tools.currentJob }}</Tag>
            <Tag v-else-if="isDone('define.pov')" color="success">{{ tools.doneStep }}</Tag>
          </Space>
        </template>
        <POVBuilder />
      </Card>

      <Card id="define-step-define.hmw">
        <template #title>
          <Space>
            <span>{{ isJunior ? tools.hmw.stepTitle : tools.hmw.stepTitleFull }}</span>
            <Tag v-if="isCurrent('define.hmw')" color="processing">{{ tools.currentJob }}</Tag>
            <Tag v-else-if="isDone('define.hmw')" color="success">{{ tools.doneStep }}</Tag>
          </Space>
        </template>
        <HMWQuestions />
      </Card>
    </Space>
  </PhaseShell>
</template>
