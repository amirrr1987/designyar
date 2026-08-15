<script setup lang="ts">
import { Button, Space } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons-vue'

interface Props {
  isFirst?: boolean
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFirst: false,
  isLast: false,
})

const emit = defineEmits<{
  prev: []
  next: []
}>()

const prevBtn: ButtonProps = { size: 'large' }
const nextBtn: ButtonProps = { type: 'primary', size: 'large' }
</script>

<template>
  <nav
    aria-label="جابه‌جایی بین فرم‌ها"
    class="sticky bottom-0 z-10 -mx-1 rounded-2xl bg-white/95 px-3 py-3 shadow-md ring-1 ring-stone-200/80 backdrop-blur"
  >
    <Space class="w-full justify-between">
      <Button
        v-bind="prevBtn"
        :aria-label="props.isFirst ? 'بازگشت به خانه' : 'رفتن به فرم قبلی'"
        @click="emit('prev')"
      >
        <template #icon>
          <ArrowRightOutlined aria-hidden="true" />
        </template>
        {{ props.isFirst ? 'خانه' : 'قبلی' }}
      </Button>
      <Button
        v-bind="nextBtn"
        class="min-w-28"
        :aria-label="props.isLast ? 'پایان مسیر و مشاهده جمع‌بندی' : 'رفتن به فرم بعدی'"
        @click="emit('next')"
      >
        {{ props.isLast ? 'پایان' : 'بعدی' }}
        <template #icon>
          <CheckOutlined v-if="props.isLast" aria-hidden="true" />
          <ArrowLeftOutlined v-else aria-hidden="true" />
        </template>
      </Button>
    </Space>
  </nav>
</template>
