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
import PhaseAiActions from '@/components/shared/PhaseAiActions.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import PhaseJuniorGuide from '@/components/shared/PhaseJuniorGuide.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'
import { JUNIOR_DEFAULT_TAB, JUNIOR_ESSENTIAL_TABS } from '@/constants/junior-guide'
import { useProjectStore } from '@/stores/project'

type IdeateTabKey = 'brainstorm' | 'userflow' | 'sitemap' | 'cardsort'

const step = getStepByKey('ideate')
const projectStore = useProjectStore()
const showAdvanced = ref(false)
const activeKey = ref<IdeateTabKey>(JUNIOR_DEFAULT_TAB.ideate)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.ideate

function showTab(key: IdeateTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

watch(
  isJunior,
  (junior) => {
    if (junior) {
      activeKey.value = JUNIOR_DEFAULT_TAB.ideate
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
        isJunior ? 'ایده بسازید، بعد مسیر کاربر را مشخص کنید.' : step.description
      "
      :color="step.color"
      :icon="step.icon"
      badge="مرحله ۳ از ۵"
    >
      <template #actions>
        <PhaseAiActions>
          <template #primary>
            <AiAssistButton action="brainstorm-ideas" label="طوفان ایده با AI" section="Ideate" />
          </template>
          <template #more>
            <AiChainButton chain="ideate-complete" label="زنجیره کامل ایده‌پردازی" />
            <AiAssistButton
              action="suggest-userflow"
              label="پیشنهاد جریان کاربر"
              section="Ideate"
            />
          </template>
        </PhaseAiActions>
      </template>
    </PhaseHero>

    <PhaseJuniorGuide phase="ideate" />

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('brainstorm')" key="brainstorm" tab="۱. طوفان فکری">
          <BrainstormBoard />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('userflow')" key="userflow" tab="۲. جریان کاربر">
          <UserflowCanvas />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('sitemap')" key="sitemap" tab="نقشه سایت">
          <SitemapTree />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('cardsort')" key="cardsort" tab="مرتب‌سازی کارت">
          <CardSorting />
        </Tabs.TabPane>
      </Tabs>

      <Space v-if="isJunior && !showAdvanced" style="width: 100%; margin-top: 16px">
        <Button v-bind="advancedBtn" @click="showAdvanced = true">
          <template #icon><AppstoreOutlined /></template>
          ابزارهای بیشتر (نقشه سایت، مرتب‌سازی کارت)
        </Button>
      </Space>
    </Card>

    <PhaseFlowNav current-key="ideate" />
  </Space>
</template>
