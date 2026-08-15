<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Button,
  Card,
  Col,
  Collapse,
  CollapsePanel,
  Progress,
  Row,
  Statistic,
  Tag,
  Typography,
} from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { ArrowLeftOutlined, EditOutlined, RocketOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import { useCompletion } from '@/composables/useCompletion'
import { useSoftGate } from '@/composables/useSoftGate'
import { useDefineStore } from '@/stores/define'
import { useEmpathizeStore } from '@/stores/empathize'
import { useIdeateStore } from '@/stores/ideate'
import { usePersonaStore } from '@/stores/persona'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'
import type { DesignStepKey } from '@/types/project'
import { isDesignStepKey } from '@/types/project'

const { Paragraph, Text, Title } = Typography
const router = useRouter()
const projectStore = useProjectStore()
const personaStore = usePersonaStore()
const defineStore = useDefineStore()
const ideateStore = useIdeateStore()
const empathizeStore = useEmpathizeStore()
const { projectProgress, nextJob, jobCopy, phaseProgress } = useCompletion()
const { requestNavigate } = useSoftGate()

const { personas } = storeToRefs(personaStore)
const { hmw } = storeToRefs(defineStore)
const { ideas } = storeToRefs(ideateStore)
const { competitors } = storeToRefs(empathizeStore)

const isJunior = computed(() => projectStore.isJuniorMode)
const overviewOpen = ref<string[]>(['steps'])

const overallPercent = computed(() => projectProgress.value.overallPercent)
const nextJobCopy = computed(() => jobCopy(nextJob.value.id))

const ctaBtn: ButtonProps = { type: 'primary', size: 'large' }
const stepBtn: ButtonProps = { type: 'default', block: true }
const editBtn: ButtonProps = { type: 'link' }

function goNextRecommended(): void {
  const job = nextJob.value
  if (job.phase === 'home') {
    void router.push({ name: 'setup' })
    return
  }
  if (job.phase === 'synthesis') {
    requestNavigate('synthesis')
    return
  }
  if (isDesignStepKey(job.phase)) {
    requestNavigate(job.phase)
  }
}

function goSynthesis(): void {
  requestNavigate('synthesis')
}

function goPhase(key: DesignStepKey): void {
  requestNavigate(key)
}

function goSetup(): void {
  void router.push({ name: 'setup' })
}

function statusColor(percent: number): string {
  if (percent >= 100) return 'success'
  if (percent >= 40) return 'processing'
  return 'default'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <Tag color="geekblue">{{ isJunior ? fa.modes.junior : fa.modes.full }}</Tag>
          <Title :level="3" class="m-0">
            {{ projectStore.name || fa.brand }}
          </Title>
        </div>
        <Paragraph v-if="projectStore.briefTitle" class="mb-0">
          {{ projectStore.briefTitle }}
        </Paragraph>
        <Paragraph v-if="projectStore.briefDescription" type="secondary" class="mb-0">
          {{ projectStore.briefDescription }}
        </Paragraph>
        <Button v-bind="editBtn" class="w-fit p-0" @click="goSetup">
          <template #icon><EditOutlined /></template>
          {{ fa.onboarding.editBrief }}
        </Button>

        <div
          v-if="nextJob.phase !== 'synthesis'"
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex flex-col gap-1">
            <Text strong>{{ nextJobCopy?.title }}</Text>
            <Text type="secondary">{{ nextJobCopy?.why }}</Text>
          </div>
          <Button v-bind="ctaBtn" @click="goNextRecommended">
            <template #icon><RocketOutlined /></template>
            {{ fa.primaryCtaHome }}
          </Button>
        </div>
        <div v-else class="flex flex-wrap items-center gap-3">
          <Text>مسیر اصلی تکمیل شده — می‌توانید جمع‌بندی را ببینید.</Text>
          <Button v-bind="ctaBtn" @click="goSynthesis">
            رفتن به جمع‌بندی
            <template #icon><ArrowLeftOutlined /></template>
          </Button>
        </div>
      </div>
    </Card>

    <Card title="پیشرفت کلی">
      <div class="flex flex-col gap-6">
        <Progress
          :percent="overallPercent"
          :status="overallPercent >= 100 ? 'success' : 'active'"
        />
        <Row :gutter="[16, 16]">
          <Col :xs="12" :sm="8" :md="6">
            <Statistic title="پرسوناها" :value="personas.length" />
          </Col>
          <Col :xs="12" :sm="8" :md="6">
            <Statistic title="ایده‌ها" :value="ideas.length" />
          </Col>
          <Col :xs="12" :sm="8" :md="6">
            <Statistic :title="isJunior ? 'سوالات' : 'HMW'" :value="hmw.length" />
          </Col>
          <Col :xs="12" :sm="8" :md="6">
            <Statistic title="رقبا" :value="competitors.length" />
          </Col>
        </Row>
      </div>
    </Card>

    <Collapse v-model:activeKey="overviewOpen">
      <CollapsePanel key="steps" :header="isJunior ? 'نمای کلی ۵ گام' : 'مراحل مسیر'">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="step in DESIGN_THINKING_STEPS" :key="step.key" size="small">
            <template #title>
              <div class="flex items-center gap-2">
                <Tag :color="step.color" :icon="h(resolveStepIcon(step.icon))">
                  {{ step.step }}
                </Tag>
                <Text strong>{{ fa.phaseTitle(step.key, projectStore.experienceMode) }}</Text>
              </div>
            </template>
            <div class="flex flex-col gap-3">
              <Paragraph type="secondary" class="mb-0">
                {{ fa.phaseDescription(step.key, projectStore.experienceMode) }}
              </Paragraph>
              <Progress
                :percent="phaseProgress(step.key).percent"
                size="small"
                status="active"
              />
              <Tag :color="statusColor(phaseProgress(step.key).percent)">
                {{ phaseProgress(step.key).percent }}٪
              </Tag>
              <Button v-bind="stepBtn" @click="goPhase(step.key)">ورود</Button>
            </div>
          </Card>
        </div>
      </CollapsePanel>
    </Collapse>
  </div>
</template>
