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
  <Space class="w-full justify-between">
    <Button v-bind="prevBtn" @click="emit('prev')">
      <template #icon><ArrowRightOutlined /></template>
      قبلی
    </Button>
    <Button v-bind="nextBtn" @click="emit('next')">
      بعدی
      <template #icon><ArrowLeftOutlined /></template>
    </Button>
  </Space>
</template>
