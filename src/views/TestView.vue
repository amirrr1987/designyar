<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, Space, Tabs, Tag } from 'ant-design-vue'
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
import type { JobId } from '@/domain/completion'

type TestTabKey = 'contrast' | 'wcag' | 'heuristics' | 'report'

const projectStore = useProjectStore()
const { phaseProgress } = useCompletion()
const showAdvanced = ref(false)
const activeKey = ref<TestTabKey>(JUNIOR_DEFAULT_TAB.test)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.test
const tools = fa.testTools

const focusJobId = computed(() => phaseProgress('test').nextJob?.id)
const progress = computed(() => phaseProgress('test'))

function showTab(key: TestTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

function tabFromJob(): TestTabKey {
  if (focusJobId.value === 'test.wcag') return 'wcag'
  if (focusJobId.value === 'test.report') return 'report'
  return 'contrast'
}

function isDone(jobId: JobId): boolean {
  return !progress.value.missing.includes(jobId)
}

const primaryAiAction = computed(() => 'summarize-test' as const)

const primaryAiLabel = computed(() => {
  if (focusJobId.value === 'test.wcag') return tools.wcag.aiLabel
  if (focusJobId.value === 'test.contrast') return tools.contrast.aiLabel
  return tools.report.aiLabel
})

watch(
  focusJobId,
  () => {
    if (!isJunior.value) return
    const next = tabFromJob()
    if (showTab(next)) activeKey.value = next
  },
  { immediate: true },
)

watch(isJunior, (junior) => {
  if (junior) {
    activeKey.value = tabFromJob()
    showAdvanced.value = false
  }
})

watch(showAdvanced, (advanced) => {
  if (!advanced && !showTab(activeKey.value)) {
    activeKey.value = tabFromJob()
  }
})

const advancedBtn: ButtonProps = { type: 'dashed', block: true }
</script>

<template>
  <PhaseShell phase="test">
    <template #ai>
      <AiAssistButton
        v-if="isJunior"
        :action="primaryAiAction"
        :label="primaryAiLabel"
        section="تست"
      />
      <AiAssistButton
        v-else
        action="summarize-test"
        :label="tools.report.aiLabel"
        section="تست"
      />
    </template>
    <template #ai-more>
      <AiAssistButton action="test-to-hmw" label="سوالات جدید از یافته‌های تست" section="تست" />
      <AiAssistButton action="test-to-ideas" label="ایده اصلاح از تست" section="تست" />
    </template>

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('contrast')" key="contrast">
          <template #tab>
            <Space>
              <span>{{ tools.contrast.tab }}</span>
              <Tag v-if="focusJobId === 'test.contrast'" color="processing">
                {{ fa.defineTools.currentJob }}
              </Tag>
              <Tag v-else-if="isDone('test.contrast')" color="success">
                {{ fa.defineTools.doneStep }}
              </Tag>
            </Space>
          </template>
          <ContrastChecker />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('wcag')" key="wcag">
          <template #tab>
            <Space>
              <span>{{ isJunior ? tools.wcag.tab : tools.wcag.tabFull }}</span>
              <Tag v-if="focusJobId === 'test.wcag'" color="processing">
                {{ fa.defineTools.currentJob }}
              </Tag>
              <Tag v-else-if="isDone('test.wcag')" color="success">
                {{ fa.defineTools.doneStep }}
              </Tag>
            </Space>
          </template>
          <WCAGChecklist />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('report')" key="report">
          <template #tab>
            <Space>
              <span>{{ tools.report.tab }}</span>
              <Tag v-if="focusJobId === 'test.report'" color="processing">
                {{ fa.defineTools.currentJob }}
              </Tag>
              <Tag v-else-if="isDone('test.report')" color="success">
                {{ fa.defineTools.doneStep }}
              </Tag>
            </Space>
          </template>
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
