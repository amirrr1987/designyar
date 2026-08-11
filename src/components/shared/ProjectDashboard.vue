<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
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
import { useStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { resolveStepIcon } from '@/constants/step-icons'
import { useWCAG } from '@/composables/useWCAG'
import { useDefineStore } from '@/stores/define'
import { useDesignSystemStore } from '@/stores/designSystem'
import { useIdeateStore } from '@/stores/ideate'
import { usePersonaStore } from '@/stores/persona'
import { useProjectStore } from '@/stores/project'
import type { CompetitorRow } from '@/types/competitor'
import type { EmpathyMapsByPersona } from '@/types/empathy-map'
import type { DesignStepKey } from '@/types/project'

const { Paragraph, Text } = Typography
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

interface StepStat {
  key: DesignStepKey
  title: string
  percent: number
  detail: string
}

const stepStats = computed((): StepStat[] => {
  const empathizeChecks = [
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

function goToStep(route: (typeof DESIGN_THINKING_STEPS)[number]['route'], step: number): void {
  projectStore.setStep(step)
  void router.push(route)
}

function statFor(key: DesignStepKey): StepStat | undefined {
  return stepStats.value.find((s) => s.key === key)
}
</script>

<template>
  <Space direction="vertical" size="large">
    <Card title="پروژه">
      <Form layout="vertical">
        <FormItem label="نام پروژه">
          <Input v-model:value="projectName" placeholder="مثلاً اپلیکیشن فروشگاهی" allow-clear />
        </FormItem>
      </Form>
    </Card>

    <Card title="پیشرفت کلی">
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
          <Card size="small" :title="step.title">
            <Paragraph>{{ step.description }}</Paragraph>
            <Space direction="vertical">
              <Progress :percent="statFor(step.key)?.percent ?? 0" size="small" status="active" />
              <Tag>{{ statFor(step.key)?.detail ?? '—' }}</Tag>
              <Button type="primary" @click="goToStep(step.route, step.step)">
                <template #icon>
                  <component :is="resolveStepIcon(step.icon)" />
                </template>
                ادامه {{ step.title }}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>

    <Card v-if="!projectName.trim()" size="small">
      <Text type="secondary">نام پروژه را وارد کنید تا در خروجی JSON و گزارش‌ها استفاده شود.</Text>
    </Card>
  </Space>
</template>
