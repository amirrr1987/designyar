<script setup lang="ts">
import { computed } from 'vue'
import { Card, Space } from 'ant-design-vue'
import HMWQuestions from '@/components/define/HMWQuestions.vue'
import POVBuilder from '@/components/define/POVBuilder.vue'
import ProblemStatementForm from '@/components/define/ProblemStatement.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import PhaseShell from '@/components/shell/PhaseShell.vue'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()
const isJunior = computed(() => projectStore.isJuniorMode)
</script>

<template>
  <PhaseShell phase="define">
    <template #ai>
      <AiChainButton chain="define-complete" label="شروع با AI (مسئله→دیدگاه→سوالات)" />
    </template>
    <template #ai-more>
      <AiAssistButton action="refine-problem" label="پیشنهاد بیان مسئله" section="تعریف مسئله" />
      <AiAssistButton action="refine-pov" label="پیشنهاد دیدگاه کاربر" section="تعریف مسئله" />
      <AiAssistButton
        action="generate-hmw"
        label="تولید سوالات «چگونه می‌توانیم»"
        section="تعریف مسئله"
      />
      <AiAssistButton action="ux-improve" label="پیشنهاد بهبود UX" section="تعریف مسئله" />
    </template>

    <Space direction="vertical" size="middle" style="width: 100%">
      <Card title="۱. بیان مسئله">
        <ProblemStatementForm />
      </Card>

      <Card :title="isJunior ? '۲. دیدگاه کاربر' : '۲. نقطه دید (POV)'">
        <POVBuilder />
      </Card>

      <Card :title="isJunior ? '۳. سوالات «چگونه می‌توانیم…»' : '۳. سوالات How Might We'">
        <HMWQuestions />
      </Card>
    </Space>
  </PhaseShell>
</template>
