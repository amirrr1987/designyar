<script setup lang="ts">
import { computed } from 'vue'
import { Button, Space, Typography } from 'ant-design-vue'
import type { MicroFormMeta } from '@/constants/form-registry'

interface Props {
  forms: readonly MicroFormMeta[]
  currentIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [formKey: string]
}>()

const safeIndex = computed(() => Math.max(props.currentIndex, 0))
</script>

<template>
  <nav aria-label="گام‌های این فاز" class="w-full">
    <Typography.Text class="mb-2 block text-sm text-stone-500">
      فرم‌های این فاز
    </Typography.Text>
    <Space wrap size="small" class="w-full">
      <Button
        v-for="(form, index) in props.forms"
        :key="form.key"
        size="middle"
        :type="index === safeIndex ? 'primary' : 'default'"
        :ghost="index !== safeIndex"
        class="rounded-full!"
        :aria-current="index === safeIndex ? 'step' : undefined"
        :aria-label="`${form.title} (گام ${index + 1})`"
        :title="form.title"
        @click="emit('select', form.key)"
      >
        <span class="inline-flex items-center gap-1.5">
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs"
            :class="
              index === safeIndex
                ? 'bg-white/25'
                : index < safeIndex
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-stone-100 text-stone-500'
            "
          >
            {{ index + 1 }}
          </span>
          <span class="hidden max-w-28 truncate sm:inline">{{ form.title }}</span>
        </span>
      </Button>
    </Space>
  </nav>
</template>
