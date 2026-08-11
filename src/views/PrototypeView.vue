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
import PhaseShell from '@/components/shell/PhaseShell.vue'
import { useCompletion } from '@/composables/useCompletion'
import { JUNIOR_DEFAULT_TAB, JUNIOR_ESSENTIAL_TABS } from '@/constants/junior-guide'
import { fa } from '@/content/fa'
import { useProjectStore } from '@/stores/project'

type PrototypeTabKey = 'color' | 'type' | 'grid' | 'spacing' | 'wireframe' | 'checklist' | 'microcopy'

const projectStore = useProjectStore()
const { phaseProgress } = useCompletion()
const showAdvanced = ref(false)
const activeKey = ref<PrototypeTabKey>(JUNIOR_DEFAULT_TAB.prototype)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.prototype

function showTab(key: PrototypeTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

function tabFromJob(): PrototypeTabKey {
  const job = phaseProgress('prototype').nextJob
  if (job?.id === 'prototype.wireframe') return 'wireframe'
  if (job?.id === 'prototype.type') return 'type'
  return 'color'
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
  <PhaseShell phase="prototype">
    <template #ai>
      <AiChainButton chain="prototype-starter" label="شروع با AI (وایرفریم→متن)" />
    </template>
    <template #ai-more>
      <AiAssistButton
        action="review-design-system"
        label="بازبینی دیزاین سیستم"
        section="پروتوتایپ"
      />
      <AiAssistButton action="wireframe-critique" label="نقد وایرفریم" section="پروتوتایپ" />
      <AiAssistButton action="microcopy" label="تولید متن‌های UI" section="پروتوتایپ" />
    </template>

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
        <Tabs.TabPane v-if="showTab('grid')" key="grid" :tab="`${fa.optionalLabel}: گرید`">
          <GridConfigurator />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('spacing')" key="spacing" :tab="`${fa.optionalLabel}: فاصله`">
          <SpacingScale />
        </Tabs.TabPane>
        <Tabs.TabPane
          v-if="showTab('checklist')"
          key="checklist"
          :tab="`${fa.optionalLabel}: چک‌لیست`"
        >
          <ComponentLibrary />
        </Tabs.TabPane>
        <Tabs.TabPane
          v-if="showTab('microcopy')"
          key="microcopy"
          :tab="`${fa.optionalLabel}: متن UI`"
        >
          <MicrocopyBank />
        </Tabs.TabPane>
      </Tabs>

      <Space v-if="isJunior && !showAdvanced" style="width: 100%; margin-top: 16px">
        <Button v-bind="advancedBtn" @click="showAdvanced = true">
          <template #icon><AppstoreOutlined /></template>
          {{ fa.moreTools }} (گرید، فاصله، چک‌لیست، متن UI)
        </Button>
      </Space>
    </Card>
  </PhaseShell>
</template>
