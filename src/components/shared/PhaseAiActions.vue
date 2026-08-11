<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { Button, Space } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()
const slots = useSlots()
const expanded = ref(false)

const isJunior = computed(() => projectStore.isJuniorMode)
const hasMore = computed(() => Boolean(slots.more))

const showMore = computed(() => !isJunior.value || expanded.value)

const toggleBtn: ButtonProps = { type: 'link', size: 'small' }

function toggle(): void {
  expanded.value = !expanded.value
}
</script>

<template>
  <Space wrap align="center">
    <slot name="primary" />
    <template v-if="hasMore">
      <template v-if="showMore">
        <slot name="more" />
      </template>
      <Button v-if="isJunior" v-bind="toggleBtn" @click="toggle">
        <template #icon>
          <UpOutlined v-if="expanded" />
          <DownOutlined v-else />
        </template>
        {{ expanded ? 'کمتر' : 'ابزارهای بیشتر AI' }}
      </Button>
    </template>
  </Space>
</template>
