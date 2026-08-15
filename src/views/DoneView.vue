<script setup lang="ts">
import { Button, Result, Space } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project'
import { getDefaultFormKey } from '@/constants/form-registry'

const router = useRouter()
const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const primaryBtn: ButtonProps = { type: 'primary', size: 'large' }
const defaultBtn: ButtonProps = { size: 'large' }

async function goHome(): Promise<void> {
  await router.push({ name: 'home' })
}

async function reviewLast(): Promise<void> {
  const phase = project.value.currentPhase
  const formKey = project.value.currentFormKey || getDefaultFormKey(phase)
  await router.push({
    name: 'micro-form',
    params: { phase, formKey },
  })
}

async function startOver(): Promise<void> {
  await router.push({
    name: 'micro-form',
    params: { phase: 'empathize', formKey: getDefaultFormKey('empathize') },
  })
}
</script>

<template>
  <Result
    status="success"
    title="آفرین، مسیر را تمام کردی"
    :sub-title="
      project.name
        ? `پروژه «${project.name}» آمادهٔ مرور و پشتیبان‌گیری است.`
        : 'می‌توانی برگردی و هر بخش را دوباره مرور کنی.'
    "
  >
    <template #extra>
      <Space wrap>
        <Button v-bind="primaryBtn" @click="goHome">خانه و پشتیبان‌گیری</Button>
        <Button v-bind="defaultBtn" @click="reviewLast">مرور آخرین فرم</Button>
        <Button v-bind="defaultBtn" @click="startOver">شروع دوباره از همدلی</Button>
      </Space>
    </template>
  </Result>
</template>
