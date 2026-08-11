<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layout, Menu, Progress, Space, Typography } from 'ant-design-vue'
import type { ItemType, MenuProps } from 'ant-design-vue/es/menu'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import { useCompletion } from '@/composables/useCompletion'
import { useSoftGate, type SoftGateTarget } from '@/composables/useSoftGate'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'
import { AuditOutlined, HomeOutlined } from '@ant-design/icons-vue'
import { isDesignStepKey } from '@/types/project'

const Sider = Layout.Sider
const { Text, Title } = Typography
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const { projectProgress, phaseProgress } = useCompletion()
const { requestNavigate } = useSoftGate()

const selectedKeys = computed(() => {
  const name = route.name
  if (typeof name === 'string' && name.length > 0) return [name]
  return ['home']
})

const overall = computed(() => projectProgress.value.overallPercent)

const menuItems = computed((): ItemType[] => {
  const home: ItemType = {
    key: 'home',
    label: 'خانه',
    icon: () => h(HomeOutlined),
  }
  const steps: ItemType[] = DESIGN_THINKING_STEPS.map((step) => {
    const progress = phaseProgress(step.key)
    const labelBase = projectStore.isJuniorMode
      ? `${step.step}. ${fa.phaseTitle(step.key, 'junior')}`
      : fa.phaseTitle(step.key, 'full')
    return {
      key: step.key,
      label: projectStore.isJuniorMode
        ? labelBase
        : `${labelBase} (${progress.percent}٪)`,
      title: `${labelBase} — ${progress.percent}٪`,
      icon: () => h(resolveStepIcon(step.icon)),
    }
  })
  const synthesis: ItemType = {
    key: 'synthesis',
    label: 'جمع‌بندی',
    icon: () => h(AuditOutlined),
  }
  return [home, ...steps, synthesis]
})

const onSelect: MenuProps['onSelect'] = (info) => {
  const key = String(info.key)
  if (key === 'home') {
    void router.push({ name: 'home' })
    return
  }
  if (key === 'synthesis') {
    requestNavigate('synthesis')
    return
  }
  if (!isDesignStepKey(key)) return
  const target: SoftGateTarget = key
  requestNavigate(target)
}
</script>

<template>
  <Sider breakpoint="lg" collapsed-width="0" :width="232" theme="light">
    <Space direction="vertical" size="small" style="width: 100%; padding: 16px 16px 8px">
      <Title :level="4" style="margin: 0">{{ fa.brand }}</Title>
      <Text type="secondary">
        {{ projectStore.isJuniorMode ? '۵ گام به‌ترتیب' : 'مسیر طراحی' }}
      </Text>
      <Progress :percent="overall" size="small" :status="overall >= 100 ? 'success' : 'active'" />
    </Space>
    <Menu
      mode="inline"
      theme="light"
      :selected-keys="selectedKeys"
      :items="menuItems"
      @select="onSelect"
    />
  </Sider>
</template>
