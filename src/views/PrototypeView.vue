<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, Space, Tabs, Tag } from 'ant-design-vue'
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
import type { JobId } from '@/domain/completion'

type PrototypeTabKey = 'color' | 'type' | 'grid' | 'spacing' | 'wireframe' | 'checklist' | 'microcopy'

const projectStore = useProjectStore()
const { phaseProgress } = useCompletion()
const showAdvanced = ref(false)
const activeKey = ref<PrototypeTabKey>(JUNIOR_DEFAULT_TAB.prototype)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.prototype
const tools = fa.prototypeTools

const focusJobId = computed(() => phaseProgress('prototype').nextJob?.id)
const progress = computed(() => phaseProgress('prototype'))

function showTab(key: PrototypeTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return (essentials as readonly string[]).includes(key)
}

function tabFromJob(): PrototypeTabKey {
  if (focusJobId.value === 'prototype.wireframe') return 'wireframe'
  if (focusJobId.value === 'prototype.type') return 'type'
  return 'color'
}

function isDone(jobId: JobId): boolean {
  return !progress.value.missing.includes(jobId)
}

const primaryAiAction = computed(() => {
  if (focusJobId.value === 'prototype.wireframe') return 'suggest-wireframe-blocks' as const
  return 'review-design-system' as const
})

const primaryAiLabel = computed(() => {
  if (focusJobId.value === 'prototype.wireframe') return tools.wireframe.aiSuggest
  if (focusJobId.value === 'prototype.type') return tools.type.aiLabel
  return tools.color.aiLabel
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
  <PhaseShell phase="prototype">
    <template #ai>
      <AiAssistButton
        v-if="isJunior"
        :action="primaryAiAction"
        :label="primaryAiLabel"
        section="پروتوتایپ"
      />
      <AiChainButton v-else chain="prototype-starter" label="شروع با AI (وایرفریم→متن)" />
    </template>
    <template #ai-more>
      <AiAssistButton
        action="review-design-system"
        :label="tools.color.aiLabel"
        section="پروتوتایپ"
      />
      <AiAssistButton
        action="wireframe-critique"
        :label="tools.wireframe.aiCritique"
        section="پروتوتایپ"
      />
      <AiAssistButton action="microcopy" label="تولید متن‌های UI" section="پروتوتایپ" />
    </template>

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('color')" key="color">
          <template #tab>
            <Space>
              <span>{{ tools.color.tab }}</span>
              <Tag v-if="focusJobId === 'prototype.color'" color="processing">
                {{ fa.defineTools.currentJob }}
              </Tag>
              <Tag v-else-if="isDone('prototype.color')" color="success">
                {{ fa.defineTools.doneStep }}
              </Tag>
            </Space>
          </template>
          <ColorPalette />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('wireframe')" key="wireframe">
          <template #tab>
            <Space>
              <span>{{ tools.wireframe.tab }}</span>
              <Tag v-if="focusJobId === 'prototype.wireframe'" color="processing">
                {{ fa.defineTools.currentJob }}
              </Tag>
              <Tag v-else-if="isDone('prototype.wireframe')" color="success">
                {{ fa.defineTools.doneStep }}
              </Tag>
            </Space>
          </template>
          <WireframeBuilder />
        </Tabs.TabPane>
        <Tabs.TabPane v-if="showTab('type')" key="type">
          <template #tab>
            <Space>
              <span>{{ tools.type.tab }}</span>
              <Tag v-if="focusJobId === 'prototype.type'" color="processing">
                {{ fa.defineTools.currentJob }}
              </Tag>
              <Tag v-else-if="isDone('prototype.type')" color="success">
                {{ fa.defineTools.doneStep }}
              </Tag>
            </Space>
          </template>
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
