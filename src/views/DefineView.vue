<script setup lang="ts">
import { computed } from 'vue'
import { Card, Space } from 'ant-design-vue'
import HMWQuestions from '@/components/define/HMWQuestions.vue'
import POVBuilder from '@/components/define/POVBuilder.vue'
import ProblemStatementForm from '@/components/define/ProblemStatement.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import PhaseAiActions from '@/components/shared/PhaseAiActions.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import PhaseJuniorGuide from '@/components/shared/PhaseJuniorGuide.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'
import { useProjectStore } from '@/stores/project'

const step = getStepByKey('define')
const projectStore = useProjectStore()
const isJunior = computed(() => projectStore.isJuniorMode)
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <PhaseHero
      :title="step.title"
      :description="
        isJunior
          ? 'مسئله را روشن کنید؛ بعد دیدگاه کاربر و سوالات ایده‌پردازی.'
          : step.description
      "
      :color="step.color"
      :icon="step.icon"
      badge="مرحله ۲ از ۵"
    >
      <template #actions>
        <PhaseAiActions>
          <template #primary>
            <AiChainButton chain="define-complete" label="شروع با AI (مسئله→دیدگاه→سوالات)" />
          </template>
          <template #more>
            <AiAssistButton action="refine-problem" label="پیشنهاد بیان مسئله" section="Define" />
            <AiAssistButton action="refine-pov" label="پیشنهاد دیدگاه کاربر" section="Define" />
            <AiAssistButton
              action="generate-hmw"
              label="تولید سوالات «چگونه می‌توانیم»"
              section="Define"
            />
            <AiAssistButton action="ux-improve" label="پیشنهاد بهبود UX" section="Define" />
          </template>
        </PhaseAiActions>
      </template>
    </PhaseHero>

    <PhaseJuniorGuide phase="define" />

    <Card title="۱. بیان مسئله">
      <ProblemStatementForm />
    </Card>

    <Card :title="isJunior ? '۲. دیدگاه کاربر' : '۲. نقطه دید (POV)'">
      <POVBuilder />
    </Card>

    <Card :title="isJunior ? '۳. سوالات «چگونه می‌توانیم…»' : '۳. سوالات How Might We'">
      <HMWQuestions />
    </Card>

    <PhaseFlowNav current-key="define" />
  </Space>
</template>
