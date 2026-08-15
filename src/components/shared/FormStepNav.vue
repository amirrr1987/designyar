<script setup lang="ts">
import { Button, Space } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'

const emit = defineEmits<{
  prev: []
  next: []
}>()

const prevBtn: ButtonProps = {}
const nextBtn: ButtonProps = { type: 'primary' }
</script>

<template>
  <nav aria-label="جابه‌جایی بین فرم‌ها">
    <Space class="w-full justify-between">
      <Button
        v-bind="prevBtn"
        aria-label="رفتن به فرم قبلی"
        @click="emit('prev')"
      >
        <template #icon>
          <ArrowRightOutlined aria-hidden="true" />
        </template>
        قبلی
      </Button>
      <Button
        v-bind="nextBtn"
        aria-label="رفتن به فرم بعدی"
        @click="emit('next')"
      >
        بعدی
        <template #icon>
          <ArrowLeftOutlined aria-hidden="true" />
        </template>
      </Button>
    </Space>
  </nav>
</template>
