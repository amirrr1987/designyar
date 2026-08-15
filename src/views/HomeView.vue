<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Space,
  Typography,
  Upload,
  message,
} from 'ant-design-vue'
import type { ButtonProps, UploadProps } from 'ant-design-vue'
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

const router = useRouter()
const projectStore = useProjectStore()
const empathizeStore = useEmpathizeStore()
const defineStore = useDefineStore()
const ideateStore = useIdeateStore()
const prototypeStore = usePrototypeStore()
const testStore = useTestStore()

const { project } = storeToRefs(projectStore)
const nameDraft = ref(project.value.name)

const primaryBtn: ButtonProps = { type: 'primary', size: 'large' }
const defaultBtn: ButtonProps = { size: 'large' }

const canContinue = computed(() => project.value.name.trim().length > 0)

function saveName(): void {
  projectStore.setName(nameDraft.value.trim())
}

async function startWizard(): Promise<void> {
  saveName()
  if (!canContinue.value) {
    message.warning('اول یک نام برای پروژه بنویس')
    return
  }
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
  nameDraft.value = snapshot.project.name
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
    <header>
      <Typography.Title :level="2" class="mb-1!">دیزاین یار</Typography.Title>
      <Typography.Paragraph type="secondary" class="mb-0!">
        طراحی کاربرمحور را قدم‌به‌قدم، با فرم‌های کوتاه و کمک هوش مصنوعی پیش ببر.
      </Typography.Paragraph>
    </header>

    <Card title="پروژهٔ تو">
      <Form layout="vertical" @finish="startWizard">
        <FormItem label="نام پروژه" name="projectName" required>
          <Input
            v-model:value="nameDraft"
            placeholder="مثلاً اپ سفارش غذا"
            aria-required="true"
            @blur="saveName"
          />
        </FormItem>
        <Space wrap>
          <Button v-bind="primaryBtn" html-type="submit">
            شروع یا ادامه
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

    <Card title="مسیر کار" size="small">
      <Space direction="vertical" class="w-full" role="list">
        <Typography.Text
          v-for="step in DESIGN_THINKING_STEPS"
          :key="step.key"
          role="listitem"
        >
          {{ step.title }} — {{ step.description }}
        </Typography.Text>
      </Space>
    </Card>
  </Space>
</template>
