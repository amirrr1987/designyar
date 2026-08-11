<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, Col, Empty, Row, Space, Tabs } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import CompetitorTable from '@/components/empathize/CompetitorTable.vue'
import EmpathyMap from '@/components/empathize/EmpathyMap.vue'
import PersonaBuilder from '@/components/empathize/PersonaBuilder.vue'
import PersonaCard from '@/components/empathize/PersonaCard.vue'
import ResearchNotes from '@/components/empathize/ResearchNotes.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import PhaseShell from '@/components/shell/PhaseShell.vue'
import { usePersona } from '@/composables/usePersona'
import { useCompletion } from '@/composables/useCompletion'
import { JUNIOR_DEFAULT_TAB, JUNIOR_ESSENTIAL_TABS } from '@/constants/junior-guide'
import { fa } from '@/content/fa'
import { useProjectStore } from '@/stores/project'

type EmpathizeTabKey = 'personas' | 'empathy' | 'notes' | 'competitors'

const projectStore = useProjectStore()
const { personas, removePersona } = usePersona()
const { phaseProgress } = useCompletion()
const showAdvanced = ref(false)
const activeKey = ref<EmpathizeTabKey>(JUNIOR_DEFAULT_TAB.empathize)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.empathize
const labels = fa.empathizeTools.persona

const focusJobId = computed(() => phaseProgress('empathize').nextJob?.id)

const primaryAiLabel = computed(() => {
  if (focusJobId.value === 'empathize.persona') return 'پیشنهاد پرسونا با AI'
  return 'پیشنهاد اسکلت یادداشت'
})

const primaryAiAction = computed(() => {
  if (focusJobId.value === 'empathize.persona') return 'persona-suggest' as const
  return 'seed-research-notes' as const
})

function isEssential(key: EmpathizeTabKey): boolean {
  return (essentials as readonly string[]).includes(key)
}

function showTab(key: EmpathizeTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return isEssential(key)
}

function tabFromJob(): EmpathizeTabKey {
  if (focusJobId.value === 'empathize.persona') return 'personas'
  return 'notes'
}

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
  <PhaseShell phase="empathize">
    <template #ai>
      <AiAssistButton
        v-if="isJunior"
        :action="primaryAiAction"
        :label="primaryAiLabel"
        section="همدلی"
      />
      <AiChainButton v-else chain="empathize-starter" label="شروع با AI (یادداشت→پرسونا)" />
    </template>
    <template #ai-more>
      <AiAssistButton action="seed-research-notes" label="پیشنهاد یادداشت" section="همدلی" />
      <AiAssistButton action="persona-suggest" label="پیشنهاد پرسونا" section="همدلی" />
      <AiAssistButton action="analyze-notes" label="تحلیل یادداشت" section="همدلی" />
      <AiAssistButton action="analyze-competitors" label="تحلیل رقبا" section="همدلی" />
    </template>

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('notes')" key="notes" tab="۱. یادداشت تحقیق">
          <ResearchNotes />
        </Tabs.TabPane>

        <Tabs.TabPane v-if="showTab('personas')" key="personas" tab="۲. پرسوناها">
          <Space direction="vertical" size="large" style="width: 100%">
            <Card size="small" :title="labels.formTitle">
              <PersonaBuilder />
            </Card>
            <Card size="small" :title="labels.listTitle">
              <Empty v-if="personas.length === 0" :description="labels.emptyList" />
              <Row v-else :gutter="[16, 16]">
                <Col v-for="persona in personas" :key="persona.id" :xs="24" :sm="12" :lg="8">
                  <PersonaCard :persona="persona" @remove="removePersona" />
                </Col>
              </Row>
            </Card>
          </Space>
        </Tabs.TabPane>

        <Tabs.TabPane
          v-if="showTab('empathy')"
          key="empathy"
          :tab="`${fa.optionalLabel}: نقشه همدلی`"
        >
          <EmpathyMap />
        </Tabs.TabPane>

        <Tabs.TabPane
          v-if="showTab('competitors')"
          key="competitors"
          :tab="`${fa.optionalLabel}: رقبا`"
        >
          <CompetitorTable />
        </Tabs.TabPane>
      </Tabs>

      <Space v-if="isJunior && !showAdvanced" style="width: 100%; margin-top: 16px">
        <Button v-bind="advancedBtn" @click="showAdvanced = true">
          <template #icon><AppstoreOutlined /></template>
          {{ fa.moreTools }} (نقشه همدلی، رقبا)
        </Button>
      </Space>
    </Card>
  </PhaseShell>
</template>
