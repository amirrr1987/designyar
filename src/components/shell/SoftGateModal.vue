<script setup lang="ts">
import { Modal, Space, Typography, Button } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { useSoftGate } from '@/composables/useSoftGate'
import { fa } from '@/content/fa'

const { Title, Paragraph } = Typography
const { isOpen, gate, skipAndContinue, goRecommended, dismiss } = useSoftGate()

const primaryBtn: ButtonProps = { type: 'primary' }
const defaultBtn: ButtonProps = { type: 'default' }
</script>

<template>
  <Modal
    :open="isOpen"
    :title="fa.softGateTitle"
    :footer="null"
    destroy-on-close
    @cancel="dismiss"
  >
    <Space v-if="gate" direction="vertical" size="middle" style="width: 100%">
      <Title :level="5" style="margin: 0">{{ gate.targetTitle }}</Title>
      <Paragraph>{{ gate.body }}</Paragraph>
      <Space wrap>
        <Button v-bind="primaryBtn" @click="goRecommended">
          {{ fa.softGateGo }}: {{ gate.recommendedTitle }}
        </Button>
        <Button v-bind="defaultBtn" @click="skipAndContinue">
          {{ fa.softGateSkip }}
        </Button>
      </Space>
    </Space>
  </Modal>
</template>
