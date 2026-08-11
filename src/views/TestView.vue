<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, Space, Tabs } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import ContrastChecker from '@/components/test/ContrastChecker.vue'
import HeuristicEval from '@/components/test/HeuristicEval.vue'
import UsabilityReport from '@/components/test/UsabilityReport.vue'
import WCAGChecklist from '@/components/test/WCAGChecklist.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import PhaseAiActions from '@/components/shared/PhaseAiActions.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import PhaseJuniorGuide from '@/components/shared/PhaseJuniorGuide.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'
import { JUNIOR_DEFAULT_TAB, JUNIOR_ESSENTIAL_TABS } from '@/constants/junior-guide'
import { useProjectStore } from '@/stores/project'

type TestTabKey = 'contrast' | 'wcag' | 'heuristics' | 'report'

const step = getStepByKey('test')
const projectStore = useProjectStore()
const showAdvanced = ref(false)
const activeKey = ref<TestTabKey>(JUNIOR_DEFAULT_TAB.test)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.test

function showTab(key: TestTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

watch(
  isJunior,
  (junior) => {
    if (junior) {
      activeKey.value = JUNIOR_DEFAULT_TAB.test
      showAdvanced.value = false
    }
  },
  { immediate: true },
)

const advancedBtn: ButtonProps = { type: 'dashed', block: true }
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <PhaseHero
      :title="step.title"
      :description="
        isJunior
          ? 'خوانایی رنگ و دسترسی را چک کنید؛ بعد گزارش کوتاه بنویسید.'
          : step.description
      "
      :color="step.color"
      :icon="step.icon"
      badge="مرحله ۵ از ۵"
    >
      <template #actions>
        <PhaseAiActions>
          <template #primary>
            <AiAssistButton action="summarize-test" label="خلاصه یافته‌ها با AI" section="Test" />
          </template>
          <template #more>
            <AiAssistButton
              action="test-to-hmw"
              label="سوالات جدید از یافته‌های تست"
              section="Test"
            />
            <AiAssistButton action="test-to-ideas" label="ایده اصلاح از تست" section="Test" />
          </template>
        </PhaseAiActions>
      </template>
    </PhaseHero>

    <PhaseJuniorGuide phase="test" />

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('contrast')" key="contrast" tab="۱. کنتراست">
          <ContrastChecker />
        </Tabs.TabPane>
        <Tabs.TabPane
          v-if="showTab('wcag')"
          key="wcag"
          :tab="isJunior ? '۲. دسترسی‌پذیری' : '۲. WCAG'"
        >
          <WCAGChecklist />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('report')" key="report" tab="۳. گزارش">
          <UsabilityReport />
        </Tabs.TabPane>
        <Tabs.TabPane
          v-if="showTab('heuristics')"
          key="heuristics"
          :tab="isJunior ? 'قوانین کاربردپذیری' : 'هیوریستیک'"
        >
          <HeuristicEval />
        </Tabs.TabPane>
      </Tabs>

      <Space v-if="isJunior && !showAdvanced" style="width: 100%; margin-top: 16px">
        <Button v-bind="advancedBtn" @click="showAdvanced = true">
          <template #icon><AppstoreOutlined /></template>
          ابزارهای بیشتر (قوانین کاربردپذیری / هیوریستیک)
        </Button>
      </Space>
    </Card>

    <PhaseFlowNav current-key="test" />
  </Space>
</template>
