<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, Space, Tabs } from 'ant-design-vue'
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

type IdeateTabKey = 'brainstorm' | 'userflow' | 'sitemap' | 'cardsort'

const projectStore = useProjectStore()
const { phaseProgress } = useCompletion()
const showAdvanced = ref(false)
const activeKey = ref<IdeateTabKey>(JUNIOR_DEFAULT_TAB.ideate)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.ideate

function showTab(key: IdeateTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

function tabFromJob(): IdeateTabKey {
  const job = phaseProgress('ideate').nextJob
  if (job?.id === 'ideate.userflow') return 'userflow'
  return 'brainstorm'
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
  <PhaseShell phase="ideate">
    <template #ai>
      <AiAssistButton action="brainstorm-ideas" label="طوفان ایده با AI" section="ایده‌پردازی" />
    </template>
    <template #ai-more>
      <AiChainButton chain="ideate-complete" label="زنجیره کامل ایده‌پردازی" />
      <AiAssistButton action="suggest-userflow" label="پیشنهاد مسیر کاربر" section="ایده‌پردازی" />
    </template>

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('brainstorm')" key="brainstorm" tab="۱. طوفان فکری">
          <BrainstormBoard />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('userflow')" key="userflow" tab="۲. مسیر کاربر">
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
