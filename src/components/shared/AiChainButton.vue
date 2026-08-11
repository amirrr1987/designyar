<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { ThunderboltOutlined } from '@ant-design/icons-vue'
import type { AiChainId } from '@/constants/ai-chains'
import { useAiStore } from '@/stores/ai'

interface AiChainButtonProps {
  chain: AiChainId
  label?: string
}

const props = withDefaults(defineProps<AiChainButtonProps>(), {
  label: 'اجرای زنجیره AI',
})

const aiStore = useAiStore()

function onClick(): void {
  aiStore.openChain(props.chain)
}
</script>

<template>
  <Button type="primary" @click="onClick">
    <template #icon><ThunderboltOutlined /></template>
    {{ label }}
  </Button>
</template>
