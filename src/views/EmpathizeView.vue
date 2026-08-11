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
import PhaseAiActions from '@/components/shared/PhaseAiActions.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import PhaseJuniorGuide from '@/components/shared/PhaseJuniorGuide.vue'
import { usePersona } from '@/composables/usePersona'
import { getStepByKey } from '@/constants/design-thinking-steps'
import { JUNIOR_DEFAULT_TAB, JUNIOR_ESSENTIAL_TABS } from '@/constants/junior-guide'
import { useProjectStore } from '@/stores/project'

type EmpathizeTabKey = 'personas' | 'empathy' | 'notes' | 'competitors'

const step = getStepByKey('empathize')
const projectStore = useProjectStore()
const { personas, removePersona } = usePersona()
const showAdvanced = ref(false)
const activeKey = ref<EmpathizeTabKey>(JUNIOR_DEFAULT_TAB.empathize)

const isJunior = computed(() => projectStore.isJuniorMode)
const essentials = JUNIOR_ESSENTIAL_TABS.empathize

function isEssential(key: EmpathizeTabKey): boolean {
  return (essentials as readonly string[]).includes(key)
}

function showTab(key: EmpathizeTabKey): boolean {
  if (!isJunior.value || showAdvanced.value) return true
  return isEssential(key)
}

watch(
  isJunior,
  (junior) => {
    if (junior) {
      activeKey.value = JUNIOR_DEFAULT_TAB.empathize
      showAdvanced.value = false
    }
  },
  { immediate: true },
)

watch(showAdvanced, (advanced) => {
  if (!advanced && !showTab(activeKey.value)) {
    activeKey.value = JUNIOR_DEFAULT_TAB.empathize
  }
})

const advancedBtn: ButtonProps = { type: 'dashed', block: true }
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <PhaseHero
      :title="step.title"
      :description="
        isJunior
          ? 'کاربر را بشناس — یادداشت بنویس، بعد پرسونا بساز.'
          : step.description
      "
      :color="step.color"
      :icon="step.icon"
      badge="مرحله ۱ از ۵"
    >
      <template #actions>
        <PhaseAiActions>
          <template #primary>
            <AiChainButton chain="empathize-starter" label="شروع با AI (یادداشت→پرسونا)" />
          </template>
          <template #more>
            <AiAssistButton
              action="seed-research-notes"
              label="پیشنهاد یادداشت"
              section="Empathize"
            />
            <AiAssistButton action="persona-suggest" label="پیشنهاد پرسونا" section="Empathize" />
            <AiAssistButton action="analyze-notes" label="تحلیل یادداشت" section="Empathize" />
            <AiAssistButton action="analyze-competitors" label="تحلیل رقبا" section="Empathize" />
          </template>
        </PhaseAiActions>
      </template>
    </PhaseHero>

    <PhaseJuniorGuide phase="empathize" />

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
        <Tabs.TabPane v-if="showTab('notes')" key="notes" tab="۱. یادداشت تحقیق">
          <ResearchNotes />
        </Tabs.TabPane>

        <Tabs.TabPane v-if="showTab('personas')" key="personas" tab="۲. پرسوناها">
          <Space direction="vertical" size="large" style="width: 100%">
            <Card size="small" title="افزودن پرسونا">
              <PersonaBuilder />
            </Card>
            <Card size="small" title="لیست پرسوناها">
              <Empty v-if="personas.length === 0" description="هنوز پرسونایی ثبت نشده است" />
              <Row v-else :gutter="[16, 16]">
                <Col v-for="persona in personas" :key="persona.id" :xs="24" :sm="12" :lg="8">
                  <PersonaCard :persona="persona" @remove="removePersona" />
                </Col>
              </Row>
            </Card>
          </Space>
        </Tabs.TabPane>

        <Tabs.TabPane v-if="showTab('empathy')" key="empathy" tab="نقشه همدلی">
          <EmpathyMap />
        </Tabs.TabPane>

        <Tabs.TabPane v-if="showTab('competitors')" key="competitors" tab="رقبا">
          <CompetitorTable />
        </Tabs.TabPane>
      </Tabs>

      <Space v-if="isJunior && !showAdvanced" style="width: 100%; margin-top: 16px">
        <Button v-bind="advancedBtn" @click="showAdvanced = true">
          <template #icon><AppstoreOutlined /></template>
          ابزارهای بیشتر (نقشه همدلی، رقبا)
        </Button>
      </Space>
    </Card>

    <PhaseFlowNav current-key="empathize" />
  </Space>
</template>
