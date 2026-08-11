<script setup lang="ts">
import {
  Card,
  Col,
  Descriptions,
  DescriptionsItem,
  Form,
  FormItem,
  InputNumber,
  Row,
  Space,
  Typography,
} from 'ant-design-vue'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useGrid } from '@/composables/useGrid'

const { Text } = Typography
const { grid, result, patchGrid } = useGrid()

function onNumber(
  key: 'columns' | 'gutter' | 'margin' | 'maxWidth',
  value: number | string | null,
): void {
  if (typeof value !== 'number') return
  patchGrid({ [key]: value })
}
</script>

<template>
  <Space direction="vertical" size="large">
    <AiSectionAssist action="review-design-system" label="بازبینی گرید با AI" section="گرید" />
    <Card size="small" title="پیکربندی گرید">
      <Form layout="vertical">
        <FormItem label="تعداد ستون">
          <InputNumber
            :value="grid.columns"
            :min="1"
            :max="24"
            @update:value="(v) => onNumber('columns', v)"
          />
        </FormItem>
        <FormItem label="Gutter (px)">
          <InputNumber
            :value="grid.gutter"
            :min="0"
            :max="64"
            @update:value="(v) => onNumber('gutter', v)"
          />
        </FormItem>
        <FormItem label="Margin (px)">
          <InputNumber
            :value="grid.margin"
            :min="0"
            :max="120"
            @update:value="(v) => onNumber('margin', v)"
          />
        </FormItem>
        <FormItem label="حداکثر عرض (px)">
          <InputNumber
            :value="grid.maxWidth"
            :min="320"
            :max="1920"
            :step="40"
            @update:value="(v) => onNumber('maxWidth', v)"
          />
        </FormItem>
      </Form>
    </Card>

    <Card size="small" title="محاسبه">
      <Descriptions :column="1" size="small" bordered>
        <DescriptionsItem label="عرض محتوا">{{ result.contentWidth }}px</DescriptionsItem>
        <DescriptionsItem label="عرض ستون">{{ result.columnWidth }}px</DescriptionsItem>
        <DescriptionsItem label="مجموع gutterها">{{ result.totalGutters }}px</DescriptionsItem>
      </Descriptions>
    </Card>

    <Card size="small" title="پیش‌نمایش ستون‌ها">
      <Row :gutter="grid.gutter">
        <Col v-for="n in grid.columns" :key="n" :span="Math.max(1, Math.floor(24 / grid.columns))">
          <Card size="small">
            <Text>{{ n }}</Text>
          </Card>
        </Col>
      </Row>
      <Text type="secondary"> پیش‌نمایش تقریبی با سیستم ۲۴ ستونی antdv (span ≈ ۲۴ / columns) </Text>
    </Card>
  </Space>
</template>
