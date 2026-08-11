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
import PhaseShell from '@/components/shell/PhaseShell.vue'
import { useCompletion } from '@/composables/useCompletion'
import { JUNIOR_DEFAULT_TAB, JUNIOR_ESSENTIAL_TABS } from '@/constants/junior-guide'
import { fa } from '@/content/fa'
import { useProjectStore } from '@/stores/project'

type TestTabKey = 'contrast' | 'wcag' | 'heuristics' | 'report'

const projectStore = useProjectStore()
const { phaseProgress } = useCompletion()
const showAdvanced = ref(false)
const activeKey = ref<TestTabKey>(JUNIOR_DEFAULT_TAB.test)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.test

function showTab(key: TestTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

function tabFromJob(): TestTabKey {
  const job = phaseProgress('test').nextJob
  if (job?.id === 'test.wcag') return 'wcag'
  if (job?.id === 'test.report') return 'report'
  return 'contrast'
}

watch(
  isJunior,
  (junior) => {
    if (junior) {
      activeKey.value = tabFromJob()
      showAdvanced.value = false
    }
  },
  { immediate: true },
)

const advancedBtn: ButtonProps = { type: 'dashed', block: true }
</script>

<template>
  <PhaseShell phase="test">
    <template #ai>
      <AiAssistButton action="summarize-test" label="خلاصه یافته‌ها با AI" section="تست" />
    </template>
    <template #ai-more>
      <AiAssistButton action="test-to-hmw" label="سوالات جدید از یافته‌های تست" section="تست" />
      <AiAssistButton action="test-to-ideas" label="ایده اصلاح از تست" section="تست" />
    </template>

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
          :tab="`${fa.optionalLabel}: قوانین کاربردپذیری`"
        >
          <HeuristicEval />
        </Tabs.TabPane>
      </Tabs>

      <Space v-if="isJunior && !showAdvanced" style="width: 100%; margin-top: 16px">
        <Button v-bind="advancedBtn" @click="showAdvanced = true">
          <template #icon><AppstoreOutlined /></template>
          {{ fa.moreTools }} (قوانین کاربردپذیری)
        </Button>
      </Space>
    </Card>
  </PhaseShell>
</template>
