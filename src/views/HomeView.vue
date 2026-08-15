<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Progress,
  Space,
  Typography,
  Upload,
  message,
} from 'ant-design-vue'
import type { ButtonProps, UploadProps } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project'
import { useEmpathizeStore } from '@/stores/empathize'
import { useDefineStore } from '@/stores/define'
import { useIdeateStore } from '@/stores/ideate'
import { usePrototypeStore } from '@/stores/prototype'
import { useTestStore } from '@/stores/test'
import { getDefaultFormKey } from '@/constants/form-registry'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { parseSnapshotJson, type ProjectSnapshot } from '@/utils/snapshot'
import { getWizardProgress } from '@/utils/wizard-progress'

const router = useRouter()
const projectStore = useProjectStore()
const empathizeStore = useEmpathizeStore()
const defineStore = useDefineStore()
const ideateStore = useIdeateStore()
const prototypeStore = usePrototypeStore()
const testStore = useTestStore()

const { project } = storeToRefs(projectStore)

const formModel = reactive({
  projectName: project.value.name,
})

watch(
  () => project.value.name,
  (name) => {
    if (formModel.projectName !== name) {
      formModel.projectName = name
    }
  },
)

const primaryBtn: ButtonProps = { type: 'primary', size: 'large' }
const defaultBtn: ButtonProps = { size: 'large' }

const nameRules: Rule[] = [
  { required: true, message: 'اول یک نام برای پروژه بنویس', whitespace: true },
]

const canContinue = computed(() => formModel.projectName.trim().length > 0)

const progress = computed(() => {
  const formKey =
    project.value.currentFormKey || getDefaultFormKey(project.value.currentPhase)
  return getWizardProgress(project.value.currentPhase, formKey)
})

const hasStarted = computed(
  () =>
    project.value.name.trim().length > 0 &&
    (progress.value.completedForms > 0 ||
      project.value.currentFormKey !== 'research-goal' ||
      project.value.currentPhase !== 'empathize'),
)

const primaryCtaLabel = computed(() => (hasStarted.value ? 'ادامه' : 'شروع'))

function saveName(): void {
  projectStore.setName(formModel.projectName.trim())
}

async function startWizard(): Promise<void> {
  const name = formModel.projectName.trim()
  if (!name) {
    message.warning('اول یک نام برای پروژه بنویس')
    return
  }
  projectStore.setName(name)
  const phase = project.value.currentPhase
  const formKey = project.value.currentFormKey || getDefaultFormKey(phase)
  await router.push({ name: 'micro-form', params: { phase, formKey } })
}

function buildSnapshot(): ProjectSnapshot {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    project: { ...project.value },
    empathize: { ...empathizeStore.state },
    define: { ...defineStore.state },
    ideate: { ...ideateStore.state },
    prototype: { ...prototypeStore.state },
    test: { ...testStore.state },
  }
}

function exportJson(): void {
  const snapshot = buildSnapshot()
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `designyar-${project.value.name || 'project'}.json`
  anchor.click()
  URL.revokeObjectURL(url)
  message.success('فایل پشتیبان ذخیره شد')
}

function applySnapshot(snapshot: ProjectSnapshot): void {
  projectStore.hydrate(snapshot.project)
  empathizeStore.hydrate(snapshot.empathize)
  defineStore.hydrate(snapshot.define)
  ideateStore.hydrate(snapshot.ideate)
  prototypeStore.hydrate(snapshot.prototype)
  testStore.hydrate(snapshot.test)
  formModel.projectName = snapshot.project.name
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const reader = new FileReader()
  reader.onload = () => {
    const text = typeof reader.result === 'string' ? reader.result : ''
    const snapshot = parseSnapshotJson(text)
    if (!snapshot) {
      message.error('این فایل پشتیبان معتبر نیست')
      return
    }
    applySnapshot(snapshot)
    message.success('پروژه از فایل بازیابی شد')
  }
  reader.readAsText(file as File)
  return false
}
</script>

<template>
  <Space direction="vertical" size="large" class="w-full">
    <header
      class="rounded-2xl bg-white/80 px-5 py-5 shadow-sm ring-1 ring-stone-200/80 backdrop-blur"
    >
      <Typography.Title :level="2" class="mb-2! text-stone-800">دیزاین یار</Typography.Title>
      <Typography.Paragraph class="mb-0! text-base text-stone-600">
        طراحی کاربرمحور را قدم‌به‌قدم، با فرم‌های کوتاه و کمک هوش مصنوعی پیش ببر.
      </Typography.Paragraph>
    </header>

    <Card title="پروژهٔ تو" class="shadow-sm ring-1 ring-stone-200/60">
      <Form layout="vertical" :model="formModel" @finish="startWizard">
        <FormItem label="نام پروژه" name="projectName" :rules="nameRules">
          <Input
            v-model:value="formModel.projectName"
            placeholder="مثلاً اپ سفارش غذا"
            aria-required="true"
            size="large"
            @blur="saveName"
          />
        </FormItem>

        <div
          v-if="canContinue"
          class="mb-4 rounded-xl bg-teal-50/80 p-3 ring-1 ring-teal-100"
          role="status"
          aria-live="polite"
        >
          <Typography.Text class="text-teal-900">
            الان: {{ progress.phaseTitle }} — {{ progress.formTitle }}
          </Typography.Text>
          <Progress
            class="mt-2"
            :percent="progress.percent"
            :format="() => `${progress.completedForms}/${progress.totalForms}`"
            size="small"
            stroke-color="#0f766e"
          />
        </div>

        <Space wrap>
          <Button v-bind="primaryBtn" html-type="submit" @click="startWizard">
            {{ primaryCtaLabel }}
          </Button>
          <Button
            v-bind="defaultBtn"
            aria-label="دانلود پشتیبان پروژه به‌صورت فایل"
            @click="exportJson"
          >
            پشتیبان‌گیری
          </Button>
          <Upload
            :before-upload="beforeUpload"
            :show-upload-list="false"
            accept="application/json,.json"
          >
            <Button
              v-bind="defaultBtn"
              aria-label="بازیابی پروژه از فایل پشتیبان"
            >
              بازیابی از فایل
            </Button>
          </Upload>
        </Space>
      </Form>
    </Card>

    <Card title="مسیر کار" size="small" class="shadow-sm ring-1 ring-stone-200/60">
      <Space direction="vertical" class="w-full" role="list" size="middle">
        <div
          v-for="(step, index) in DESIGN_THINKING_STEPS"
          :key="step.key"
          role="listitem"
          class="flex items-start gap-3"
        >
          <span
            class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-800"
          >
            {{ index + 1 }}
          </span>
          <div>
            <Typography.Text class="font-medium text-stone-800">{{ step.title }}</Typography.Text>
            <Typography.Paragraph class="mb-0! text-stone-500">
              {{ step.description }}
            </Typography.Paragraph>
          </div>
        </div>
      </Space>
    </Card>
  </Space>
</template>
