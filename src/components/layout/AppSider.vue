<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layout, Menu } from 'ant-design-vue'
import type { ItemType, MenuProps } from 'ant-design-vue/es/menu'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import { useProjectStore } from '@/stores/project'
import { HomeOutlined } from '@ant-design/icons-vue'

const Sider = Layout.Sider
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
    label: step.title,
    icon: () => h(resolveStepIcon(step.icon)),
  }))
  return [home, ...steps]
})

const onSelect: MenuProps['onSelect'] = (info) => {
  const key = String(info.key)
  if (key === 'home') {
    void router.push({ name: 'home' })
    return
  }
  const step = DESIGN_THINKING_STEPS.find((s) => s.key === key)
  if (!step) return
  projectStore.setStep(step.step)
  void router.push(step.route)
}
</script>

<template>
  <Sider breakpoint="lg" collapsed-width="0" :width="220">
    <Menu
      mode="inline"
      theme="dark"
      :selected-keys="selectedKeys"
      :items="menuItems"
      @select="onSelect"
    />
  </Sider>
</template>
