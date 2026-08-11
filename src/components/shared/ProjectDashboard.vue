<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { ArrowLeftOutlined, RocketOutlined } from '@ant-design/icons-vue'
import { useStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { resolveStepIcon } from '@/constants/step-icons'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useWCAG } from '@/composables/useWCAG'
import { useDefineStore } from '@/stores/define'
import { useDesignSystemStore } from '@/stores/designSystem'
import { useIdeateStore } from '@/stores/ideate'
import { usePersonaStore } from '@/stores/persona'
import { useProjectStore } from '@/stores/project'
import type { CompetitorRow } from '@/types/competitor'
import type { EmpathyMapsByPersona } from '@/types/empathy-map'
import type { DesignStepKey } from '@/types/project'

const { Paragraph, Text, Title } = Typography
const router = useRouter()
const projectStore = useProjectStore()
const personaStore = usePersonaStore()
const defineStore = useDefineStore()
const ideateStore = useIdeateStore()
const designStore = useDesignSystemStore()
const { progress: wcagProgress } = useWCAG()

const { personas } = storeToRefs(personaStore)
const { problem, pov, hmw } = storeToRefs(defineStore)
const { ideas, flowNodes, sitemap } = storeToRefs(ideateStore)
const { palette } = storeToRefs(designStore)

const researchNotes = useStorage<string>(STORAGE_KEYS.researchNotes, '')
const competitors = useStorage<CompetitorRow[]>(STORAGE_KEYS.competitors, [])
const empathyMaps = useStorage<EmpathyMapsByPersona>(STORAGE_KEYS.empathyMaps, {})

const projectName = computed({
  get: () => projectStore.project.name,
  set: (value: string) => {
    projectStore.setName(value)
  },
})

const briefTitle = computed({
  get: () => projectStore.briefTitle,
  set: (value: string) => {
    projectStore.setBriefTitle(value)
  },
})

const briefDescription = computed({
  get: () => projectStore.briefDescription,
  set: (value: string) => {
    projectStore.setBriefDescription(value)
  },
})

const hasProjectBrief = computed(
  () => briefTitle.value.trim().length > 0 || briefDescription.value.trim().length > 0,
)

interface StepStat {
  key: DesignStepKey
  title: string
  percent: number
  detail: string
}

const stepStats = computed((): StepStat[] => {
  const empathizeChecks = [
    hasProjectBrief.value,
    personas.value.length > 0,
    researchNotes.value.trim().length > 0,
    competitors.value.length > 0,
    Object.keys(empathyMaps.value).length > 0,
  ]
  const empathizeDone = empathizeChecks.filter(Boolean).length

  const defineChecks = [
    problem.value.user.trim().length > 0 && problem.value.need.trim().length > 0,
    pov.value.user.trim().length > 0 && pov.value.need.trim().length > 0,
    hmw.value.length > 0,
  ]
  const defineDone = defineChecks.filter(Boolean).length

  const ideateChecks = [
    ideas.value.length > 0,
    flowNodes.value.length > 0,
    sitemap.value.length > 0,
  ]
  const ideateDone = ideateChecks.filter(Boolean).length

  const prototypeChecks = [palette.value.primary.length > 0, palette.value.accent.length > 0]
  const prototypeDone = prototypeChecks.filter(Boolean).length

  const testPercent = wcagProgress.value

  return [
    {
      key: 'empathize',
      title: 'همدلی',
      percent: Math.round((empathizeDone / empathizeChecks.length) * 100),
      detail: `${empathizeDone}/${empathizeChecks.length} بخش`,
    },
    {
      key: 'define',
      title: 'تعریف مسئله',
      percent: Math.round((defineDone / defineChecks.length) * 100),
      detail: `${defineDone}/${defineChecks.length} بخش`,
    },
    {
      key: 'ideate',
      title: 'ایده‌پردازی',
      percent: Math.round((ideateDone / ideateChecks.length) * 100),
      detail: `${ideateDone}/${ideateChecks.length} ابزار`,
    },
    {
      key: 'prototype',
      title: 'پروتوتایپ',
      percent: Math.round((prototypeDone / prototypeChecks.length) * 100),
      detail: `${prototypeDone}/${prototypeChecks.length} پالت`,
    },
    {
      key: 'test',
      title: 'تست',
      percent: testPercent,
      detail: `WCAG ${testPercent}%`,
    },
  ]
})

const overallPercent = computed(() => {
  if (stepStats.value.length === 0) return 0
  const sum = stepStats.value.reduce((acc, s) => acc + s.percent, 0)
  return Math.round(sum / stepStats.value.length)
})

/** First incomplete step — primary CTA for flow. */
const nextStep = computed(() => {
  for (const step of DESIGN_THINKING_STEPS) {
    const stat = stepStats.value.find((s) => s.key === step.key)
    if (!stat || stat.percent < 100) return step
  }
  return undefined
})

const ctaBtn: ButtonProps = { type: 'primary', size: 'large' }
const stepBtn: ButtonProps = { type: 'primary', block: true }

function goToStep(route: (typeof DESIGN_THINKING_STEPS)[number]['route'], step: number): void {
  projectStore.setStep(step)
  void router.push(route)
}

function goNextRecommended(): void {
  const step = nextStep.value
  if (!step) {
    void router.push({ name: 'synthesis' })
    return
  }
  goToStep(step.route, step.step)
}

function goSynthesis(): void {
  void router.push({ name: 'synthesis' })
}

function statFor(key: DesignStepKey): StepStat | undefined {
  return stepStats.value.find((s) => s.key === key)
}

function statusColor(percent: number): string {
  if (percent >= 100) return 'success'
  if (percent >= 40) return 'processing'
  return 'default'
}
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <Card>
      <Space direction="vertical" size="middle">
        <Space wrap align="center">
          <Tag color="geekblue">شروع پروژه</Tag>
          <Title :level="3" style="margin: 0">خوش آمدید به دیزاین‌یار</Title>
        </Space>
        <Paragraph type="secondary" style="margin-bottom: 0">
          مسیر پنج‌مرحله‌ای Design Thinking را با AI طی کنید — از همدلی تا تست و جمع‌بندی.
        </Paragraph>
        <Alert
          v-if="nextStep"
          type="info"
          show-icon
          :message="`گام پیشنهادی: ${nextStep.title}`"
          :description="nextStep.description"
        >
          <template #action>
            <Button v-bind="ctaBtn" @click="goNextRecommended">
              <template #icon><RocketOutlined /></template>
              ادامه {{ nextStep.title }}
            </Button>
          </template>
        </Alert>
        <Alert
          v-else
          type="success"
          show-icon
          message="همه مراحل تکمیل شده‌اند"
          description="می‌توانید جمع‌بندی نهایی پروژه را ببینید."
        >
          <template #action>
            <Button v-bind="ctaBtn" @click="goSynthesis">
              رفتن به جمع‌بندی
              <template #icon><ArrowLeftOutlined /></template>
            </Button>
          </template>
        </Alert>
      </Space>
    </Card>

    <Card title="شرح پروژه">
      <Form layout="vertical">
        <FormItem label="نام پروژه">
          <Input v-model:value="projectName" placeholder="مثلاً اپلیکیشن فروشگاهی" allow-clear />
        </FormItem>
        <FormItem label="عنوان شرح پروژه">
          <Input
            v-model:value="briefTitle"
            placeholder="مثلاً پلتفرم سفارش غذا برای دانشجویان"
            allow-clear
          />
        </FormItem>
        <FormItem label="توضیح پروژه">
          <Input.TextArea
            v-model:value="briefDescription"
            :rows="5"
            placeholder="محصول چیست؟ برای چه کسی؟ چه مشکلی حل می‌کند؟ محدودیت‌ها و اهداف کلیدی…"
            allow-clear
          />
        </FormItem>
        <FormItem>
          <Space wrap>
            <AiAssistButton
              action="improve-project-brief"
              label="بهبود شرح با AI"
              section="شرح پروژه"
            />
          </Space>
        </FormItem>
      </Form>
      <Alert
        v-if="!hasProjectBrief"
        type="warning"
        show-icon
        message="شرح پروژه را بنویسید"
        description="AI و فرم‌های همه مراحل از این context استفاده می‌کنند."
      />
      <Alert
        v-else-if="!projectName.trim()"
        type="warning"
        show-icon
        message="نام پروژه را وارد کنید"
        description="در خروجی JSON و گزارش‌ها استفاده می‌شود."
      />
    </Card>

    <Card title="پیشرفت کلی">
      <Space direction="vertical" size="large" style="width: 100%">
        <Progress :percent="overallPercent" status="active" />
        <Row :gutter="[16, 16]">
          <Col :xs="12" :sm="8" :md="6">
            <Statistic title="پرسوناها" :value="personas.length" />
          </Col>
          <Col :xs="12" :sm="8" :md="6">
            <Statistic title="ایده‌ها" :value="ideas.length" />
          </Col>
          <Col :xs="12" :sm="8" :md="6">
            <Statistic title="HMW" :value="hmw.length" />
          </Col>
          <Col :xs="12" :sm="8" :md="6">
            <Statistic title="رقبا" :value="competitors.length" />
          </Col>
        </Row>
      </Space>
    </Card>

    <Card title="مراحل دیزاین تینکینگ">
      <Row :gutter="[16, 16]">
        <Col
          v-for="step in DESIGN_THINKING_STEPS"
          :key="step.key"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
        >
          <Card size="small" hoverable>
            <template #title>
              <Space>
                <Tag :color="step.color" :icon="h(resolveStepIcon(step.icon))">
                  {{ step.step }}
                </Tag>
                <Text strong>{{ step.title }}</Text>
              </Space>
            </template>
            <Space direction="vertical" style="width: 100%">
              <Paragraph type="secondary">{{ step.description }}</Paragraph>
              <Progress
                :percent="statFor(step.key)?.percent ?? 0"
                size="small"
                status="active"
              />
              <Tag :color="statusColor(statFor(step.key)?.percent ?? 0)">
                {{ statFor(step.key)?.detail ?? '—' }}
              </Tag>
              <Button v-bind="stepBtn" @click="goToStep(step.route, step.step)">
                <template #icon>
                  <component :is="resolveStepIcon(step.icon)" />
                </template>
                ورود به {{ step.title }}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  </Space>
</template>
