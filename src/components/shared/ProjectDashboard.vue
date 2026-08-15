<script setup lang="ts">
import { computed, h, ref } from 'vue'
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  CollapsePanel,
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
import { storeToRefs } from 'pinia'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
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
const overviewOpen = ref<string[]>([])

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

const overallPercent = computed(() => projectProgress.value.overallPercent)

const nextJobCopy = computed(() => jobCopy(nextJob.value.id))

const ctaBtn: ButtonProps = { type: 'primary', size: 'large' }
const stepBtn: ButtonProps = { type: 'default', block: true }

function goNextRecommended(): void {
  const job = nextJob.value
  if (job.phase === 'home') {
    // Stay on brief — scroll focus is form above
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

function statusColor(percent: number): string {
  if (percent >= 100) return 'success'
  if (percent >= 40) return 'processing'
  return 'default'
}

const needsBriefFirst = computed(() => nextJob.value.id === 'home.brief')
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <Card>
      <Space direction="vertical" size="middle">
        <Space wrap align="center">
          <Tag color="geekblue">{{ isJunior ? fa.modes.junior : fa.modes.full }}</Tag>
          <Title :level="3" style="margin: 0">خوش آمدید به {{ fa.brand }}</Title>
        </Space>
        <Paragraph type="secondary" style="margin-bottom: 0">
          {{ fa.tagline }}
        </Paragraph>

        <Alert
          v-if="needsBriefFirst"
          type="info"
          show-icon
          :message="nextJobCopy?.title ?? 'شرح پروژه را بنویس'"
          :description="nextJobCopy?.why"
        />
        <Alert
          v-else-if="nextJob.phase !== 'synthesis'"
          type="info"
          show-icon
          :message="`کار بعدی: ${nextJobCopy?.title ?? ''}`"
          :description="nextJobCopy?.why"
        >
          <template #action>
            <Button v-bind="ctaBtn" @click="goNextRecommended">
              <template #icon><RocketOutlined /></template>
              {{ fa.primaryCtaHome }}
            </Button>
          </template>
        </Alert>
        <Alert
          v-else
          type="success"
          show-icon
          message="مسیر اصلی تکمیل شده"
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
            placeholder="محصول چیست؟ برای چه کسی؟ چه مشکلی حل می‌کند؟"
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
            <Button
              v-if="hasProjectBrief && !needsBriefFirst"
              v-bind="ctaBtn"
              @click="goNextRecommended"
            >
              <template #icon><RocketOutlined /></template>
              {{ fa.primaryCtaHome }}
            </Button>
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
    </Card>

    <Card title="پیشرفت کلی">
      <Space direction="vertical" size="large" style="width: 100%">
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
      </Space>
    </Card>

    <Collapse v-model:activeKey="overviewOpen">
      <CollapsePanel key="steps" :header="isJunior ? 'نمای کلی ۵ گام (اختیاری)' : 'مراحل مسیر'">
        <Row :gutter="[16, 16]">
          <Col
            v-for="step in DESIGN_THINKING_STEPS"
            :key="step.key"
            :xs="24"
            :sm="12"
            :md="8"
          >
            <Card size="small">
              <template #title>
                <Space>
                  <Tag :color="step.color" :icon="h(resolveStepIcon(step.icon))">
                    {{ step.step }}
                  </Tag>
                  <Text strong>{{ fa.phaseTitle(step.key, projectStore.experienceMode) }}</Text>
                </Space>
              </template>
              <Space direction="vertical" style="width: 100%">
                <Paragraph type="secondary">
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
                <Button v-bind="stepBtn" @click="goPhase(step.key)">
                  ورود
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </CollapsePanel>
    </Collapse>
  </Space>
</template>
