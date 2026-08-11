<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, Space, Tabs, Tag } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import BrainstormBoard from '@/components/ideate/BrainstormBoard.vue'
import CardSorting from '@/components/ideate/CardSorting.vue'
import SitemapTree from '@/components/ideate/SitemapTree.vue'
import UserflowCanvas from '@/components/ideate/UserflowCanvas.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import PhaseShell from '@/components/shell/PhaseShell.vue'
import { useCompletion } from '@/composables/useCompletion'
import { JUNIOR_DEFAULT_TAB, JUNIOR_ESSENTIAL_TABS } from '@/constants/junior-guide'
import { fa } from '@/content/fa'
import { useProjectStore } from '@/stores/project'
import type { JobId } from '@/domain/completion'

type IdeateTabKey = 'brainstorm' | 'userflow' | 'sitemap' | 'cardsort'

const projectStore = useProjectStore()
const { phaseProgress } = useCompletion()
const showAdvanced = ref(false)
const activeKey = ref<IdeateTabKey>(JUNIOR_DEFAULT_TAB.ideate)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.ideate
const tools = fa.ideateTools

const focusJobId = computed(() => phaseProgress('ideate').nextJob?.id)
const progress = computed(() => phaseProgress('ideate'))

function showTab(key: IdeateTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

function tabFromJob(): IdeateTabKey {
  if (focusJobId.value === 'ideate.userflow') return 'userflow'
  return 'brainstorm'
}

function isDone(jobId: JobId): boolean {
  return !progress.value.missing.includes(jobId)
}

const primaryAiAction = computed(() => {
  if (focusJobId.value === 'ideate.userflow') return 'suggest-userflow' as const
  return 'brainstorm-ideas' as const
})

const primaryAiLabel = computed(() => {
  if (focusJobId.value === 'ideate.userflow') return tools.userflow.aiLabel
  return tools.brainstorm.aiLabel
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
  <PhaseShell phase="ideate">
    <template #ai>
      <AiAssistButton
        v-if="isJunior"
        :action="primaryAiAction"
        :label="primaryAiLabel"
        section="ایده‌پردازی"
      />
      <AiAssistButton
        v-else
        action="brainstorm-ideas"
        :label="tools.brainstorm.aiLabel"
        section="ایده‌پردازی"
      />
    </template>
    <template #ai-more>
      <AiChainButton chain="ideate-complete" label="زنجیره کامل ایده‌پردازی" />
      <AiAssistButton
        action="suggest-userflow"
        :label="tools.userflow.aiLabel"
        section="ایده‌پردازی"
      />
    </template>

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('brainstorm')" key="brainstorm">
          <template #tab>
            <Space>
              <span>{{ tools.brainstorm.tab }}</span>
              <Tag v-if="focusJobId === 'ideate.brainstorm'" color="processing" >
                {{ fa.defineTools.currentJob }}
              </Tag>
              <Tag v-else-if="isDone('ideate.brainstorm')" color="success">
                {{ fa.defineTools.doneStep }}
              </Tag>
            </Space>
          </template>
          <BrainstormBoard />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('userflow')" key="userflow">
          <template #tab>
            <Space>
              <span>{{ tools.userflow.tab }}</span>
              <Tag v-if="focusJobId === 'ideate.userflow'" color="processing">
                {{ fa.defineTools.currentJob }}
              </Tag>
              <Tag v-else-if="isDone('ideate.userflow')" color="success">
                {{ fa.defineTools.doneStep }}
              </Tag>
            </Space>
          </template>
          <UserflowCanvas />
        </Tabs.TabPane>
        <Tabs.TabPane
          v-if="showTab('sitemap')"
          key="sitemap"
          :tab="`${fa.optionalLabel}: نقشه سایت`"
        >
          <SitemapTree />
        </Tabs.TabPane>
        <Tabs.TabPane
          v-if="showTab('cardsort')"
          key="cardsort"
          :tab="`${fa.optionalLabel}: مرتب‌سازی کارت`"
        >
          <CardSorting />
        </Tabs.TabPane>
      </Tabs>

      <Space v-if="isJunior && !showAdvanced" style="width: 100%; margin-top: 16px">
        <Button v-bind="advancedBtn" @click="showAdvanced = true">
          <template #icon><AppstoreOutlined /></template>
          {{ fa.moreTools }} (نقشه سایت، مرتب‌سازی کارت)
        </Button>
      </Space>
    </Card>
  </PhaseShell>
</template>
