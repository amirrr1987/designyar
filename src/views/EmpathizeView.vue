<script setup lang="ts">
import { Card } from 'ant-design-vue'
import { getStepByKey } from '@/constants/design-thinking-steps'

const step = getStepByKey('empathize')
</script>

<template>
  <Card :title="step.title">
    {{ step.description }}
  </Card>
</template>
