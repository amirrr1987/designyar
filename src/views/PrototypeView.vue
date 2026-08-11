<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, Space, Tabs } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import ColorPalette from '@/components/prototype/ColorPalette.vue'
import ComponentLibrary from '@/components/prototype/ComponentLibrary.vue'
import MicrocopyBank from '@/components/prototype/MicrocopyBank.vue'
import GridConfigurator from '@/components/prototype/GridConfigurator.vue'
import SpacingScale from '@/components/prototype/SpacingScale.vue'
import TypographyScale from '@/components/prototype/TypographyScale.vue'
import WireframeBuilder from '@/components/prototype/WireframeBuilder.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import PhaseAiActions from '@/components/shared/PhaseAiActions.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import PhaseJuniorGuide from '@/components/shared/PhaseJuniorGuide.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'
import { JUNIOR_DEFAULT_TAB, JUNIOR_ESSENTIAL_TABS } from '@/constants/junior-guide'
import { useProjectStore } from '@/stores/project'

type PrototypeTabKey = 'color' | 'type' | 'grid' | 'spacing' | 'wireframe' | 'checklist' | 'microcopy'

const step = getStepByKey('prototype')
const projectStore = useProjectStore()
const showAdvanced = ref(false)
const activeKey = ref<PrototypeTabKey>(JUNIOR_DEFAULT_TAB.prototype)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.prototype

function showTab(key: PrototypeTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

watch(
  isJunior,
  (junior) => {
    if (junior) {
      activeKey.value = JUNIOR_DEFAULT_TAB.prototype
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
        isJunior ? 'رنگ و اسکلت صفحه را بسازید — بقیه ابزارها اختیاری‌اند.' : step.description
      "
      :color="step.color"
      :icon="step.icon"
      badge="مرحله ۴ از ۵"
    >
      <template #actions>
        <PhaseAiActions>
          <template #primary>
            <AiChainButton chain="prototype-starter" label="شروع با AI (وایرفریم→متن)" />
          </template>
          <template #more>
            <AiAssistButton
              action="review-design-system"
              label="بازبینی دیزاین سیستم"
              section="Prototype"
            />
            <AiAssistButton action="wireframe-critique" label="نقد وایرفریم" section="Prototype" />
            <AiAssistButton action="microcopy" label="تولید متن‌های UI" section="Prototype" />
          </template>
        </PhaseAiActions>
      </template>
    </PhaseHero>

    <PhaseJuniorGuide phase="prototype" />

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('color')" key="color" tab="۱. رنگ">
          <ColorPalette />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('wireframe')" key="wireframe" tab="۲. وایرفریم">
          <WireframeBuilder />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('type')" key="type" tab="۳. تایپوگرافی">
          <TypographyScale />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('grid')" key="grid" tab="گرید">
          <GridConfigurator />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('spacing')" key="spacing" tab="فاصله">
          <SpacingScale />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('checklist')" key="checklist" tab="چک‌لیست کامپوننت">
          <ComponentLibrary />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('microcopy')" key="microcopy" tab="متن‌های UI">
          <MicrocopyBank />
        </Tabs.TabPane>
      </Tabs>

      <Space v-if="isJunior && !showAdvanced" style="width: 100%; margin-top: 16px">
        <Button v-bind="advancedBtn" @click="showAdvanced = true">
          <template #icon><AppstoreOutlined /></template>
          ابزارهای بیشتر (گرید، فاصله، چک‌لیست، متن UI)
        </Button>
      </Space>
    </Card>

    <PhaseFlowNav current-key="prototype" />
  </Space>
</template>
