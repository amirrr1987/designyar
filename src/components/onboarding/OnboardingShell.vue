<script setup lang="ts">
import { Steps, Typography } from 'ant-design-vue'
import type { StepsProps } from 'ant-design-vue'
import { fa } from '@/content/fa'

interface OnboardingShellProps {
  current: number
}

defineProps<OnboardingShellProps>()

const { Title, Text } = Typography

const items: NonNullable<StepsProps['items']> = [
  { title: fa.onboarding.welcomeStep },
  { title: fa.onboarding.setupStep },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <Text type="secondary">{{ fa.brand }}</Text>
        <Title :level="5" class="m-0">
          {{ current === 0 ? fa.onboarding.welcomeStep : fa.onboarding.setupStep }}
        </Title>
      </div>
      <Steps size="small" :current="current" :items="items" />
    </div>
    <slot />
  </div>
</template>
