<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layout, Menu, Space, Typography } from 'ant-design-vue'
import type { ItemType, MenuProps } from 'ant-design-vue/es/menu'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import { useProjectStore } from '@/stores/project'
import { AuditOutlined, HomeOutlined } from '@ant-design/icons-vue'

const Sider = Layout.Sider
const { Text, Title } = Typography
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const selectedKeys = computed(() => {
  const name = route.name
  if (typeof name === 'string' && name.length > 0) return [name]
  return ['home']
})

const menuItems = computed((): ItemType[] => {
  const home: ItemType = {
    key: 'home',
    label: 'خانه',
    icon: () => h(HomeOutlined),
  }
  const steps: ItemType[] = DESIGN_THINKING_STEPS.map((step) => ({
    key: step.key,
    label: projectStore.isJuniorMode ? `${step.step}. ${step.title}` : step.title,
    icon: () => h(resolveStepIcon(step.icon)),
  }))
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
    void router.push({ name: 'synthesis' })
    return
  }
  const step = DESIGN_THINKING_STEPS.find((s) => s.key === key)
  if (!step) return
  projectStore.setStep(step.step)
  void router.push(step.route)
}
</script>

<template>
  <Sider breakpoint="lg" collapsed-width="0" :width="232" theme="light">
    <Space direction="vertical" size="small" style="width: 100%; padding: 16px 16px 8px">
      <Title :level="4" style="margin: 0">دیزاین‌یار</Title>
      <Text type="secondary">
        {{ projectStore.isJuniorMode ? '۵ گام به‌ترتیب' : 'Design Thinking' }}
      </Text>
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
