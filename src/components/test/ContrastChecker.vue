<script setup lang="ts">
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useContrast } from '@/composables/useContrast'
import { useDesignSystemStore } from '@/stores/designSystem'

const { Text, Paragraph } = Typography
const designStore = useDesignSystemStore()
const { palette } = storeToRefs(designStore)

const { foreground, background, result, setColors } = useContrast('#000000', '#ffffff')

function pullFromDesignSystem(): void {
  const fg = palette.value.primary[7] ?? '#000000'
  const bg = palette.value.primary[0] ?? '#ffffff'
  setColors(fg, bg)
}

function levelColor(level: string): string {
  if (level === 'AAA') return 'success'
  if (level === 'AA') return 'processing'
  return 'error'
}
</script>

<template>
  <Space direction="vertical" size="large">
    <Card size="small" title="بررسی کنتراست">
      <Space wrap>
        <Input v-model:value="foreground" placeholder="رنگ متن #000000" allow-clear />
        <Input v-model:value="background" placeholder="رنگ زمینه #ffffff" allow-clear />
        <Button @click="pullFromDesignSystem">از پالت دیزاین‌سیستم</Button>
      </Space>
      <Paragraph type="secondary">نسبت کنتراست WCAG برای متن معمولی (AA ≥ 4.5 ، AAA ≥ 7)</Paragraph>
    </Card>

    <Row :gutter="[16, 16]">
      <Col :xs="24" :md="8">
        <Card size="small" title="پیش‌نمایش">
          <Tag
            :style="{
              backgroundColor: background,
              color: foreground,
              border: 'none',
            }"
          >
            نمونه متن
          </Tag>
        </Card>
      </Col>
      <Col :xs="24" :md="8">
        <Card size="small">
          <Statistic
            title="نسبت کنتراست"
            :value="result?.ratio ?? 0"
            :precision="2"
            suffix=":1"
          />
        </Card>
      </Col>
      <Col :xs="24" :md="8">
        <Card size="small" title="سطح">
          <Tag v-if="result" :color="levelColor(result.level)">{{ result.level }}</Tag>
          <Text v-else type="danger">رنگ hex نامعتبر</Text>
        </Card>
      </Col>
    </Row>
  </Space>
</template>
