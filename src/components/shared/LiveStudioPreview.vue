<script setup lang="ts">
import { Card, Typography } from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'پیش‌نمایش زنده',
})

const cardProps: CardProps = {
  size: 'small',
  bordered: true,
}
</script>

<template>
  <Card
    v-bind="cardProps"
    class="overflow-hidden rounded-2xl bg-gradient-to-br from-stone-50 to-teal-50/40 ring-1 ring-teal-100/80"
  >
    <template #title>
      <Typography.Text class="text-sm font-medium text-teal-900">
        {{ title }}
      </Typography.Text>
    </template>
    <slot />
  </Card>
</template>
