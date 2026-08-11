<script setup lang="ts">
import { Card, CheckboxGroup, Progress, Space, Tag, Typography } from 'ant-design-vue'
import { useWCAG } from '@/composables/useWCAG'

const { Paragraph, Text } = Typography
const { items, checkedIds, progress, checkedCount, total } = useWCAG()

const options = items.map((item) => ({
  label: `${item.id} [${item.level}] — ${item.text}`,
  value: item.id,
}))

const helpItems = items.filter((item) => item.help !== undefined)
</script>

<template>
  <Space direction="vertical" size="middle">
    <Paragraph type="secondary">
      موارد مرتبط WCAG را که در محصول رعایت شده علامت بزنید. پیشرفت به‌صورت خودکار ذخیره می‌شود.
    </Paragraph>

    <Progress :percent="progress" status="active" />
    <Text>
      انجام‌شده: <Tag color="blue">{{ checkedCount }} / {{ total }}</Tag>
    </Text>

    <Card size="small" title="چک‌لیست WCAG">
      <CheckboxGroup v-model:value="checkedIds" :options="options" />
    </Card>

    <Card v-if="helpItems.length > 0" size="small" title="راهنما">
      <Space direction="vertical">
        <Text v-for="item in helpItems" :key="`help-${item.id}`">
          <Text strong>{{ item.id }}</Text>
          — {{ item.help }}
        </Text>
      </Space>
    </Card>
  </Space>
</template>
