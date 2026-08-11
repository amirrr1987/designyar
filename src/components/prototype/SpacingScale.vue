<script setup lang="ts">
import { computed } from 'vue'
import {
  Button,
  Card,
  Descriptions,
  DescriptionsItem,
  Form,
  FormItem,
  InputNumber,
  List,
  ListItem,
  ListItemMeta,
  Space,
  Tag,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useDesignSystemStore } from '@/stores/designSystem'
import { SPACING_8PT, buildSpacingScale, toSpacingTokenRows } from '@/utils/spacing-scale'

const designStore = useDesignSystemStore()
const { spacing } = storeToRefs(designStore)

const rows = computed(() => toSpacingTokenRows(spacing.value.scale))

function onBaseChange(value: number | string | null): void {
  if (typeof value !== 'number') return
  const scale = buildSpacingScale(value, spacing.value.scale.length || SPACING_8PT.length)
  designStore.setSpacing({ base: value, scale })
}

function applyCanonical8pt(): void {
  designStore.setSpacing({
    base: 8,
    scale: [...SPACING_8PT],
  })
}
</script>

<template>
  <Space direction="vertical" size="large">
    <Card size="small" title="فاصله‌گذاری (Spacing)">
      <Form layout="inline">
        <FormItem label="واحد پایه (px)">
          <InputNumber
            :value="spacing.base"
            :min="4"
            :max="16"
            :step="2"
            @update:value="onBaseChange"
          />
        </FormItem>
        <FormItem>
          <Button type="link" @click="applyCanonical8pt">اعمال مقیاس استاندارد ۸pt</Button>
        </FormItem>
      </Form>
    </Card>

    <Card size="small" title="توکن‌ها">
      <Descriptions :column="2" size="small" bordered>
        <DescriptionsItem
          v-for="row in rows"
          :key="row.name"
          :label="row.name"
        >
          <Tag>{{ row.value }}px</Tag>
        </DescriptionsItem>
      </Descriptions>
    </Card>

    <Card size="small" title="فهرست">
      <List item-layout="horizontal" :data-source="rows">
        <template #renderItem="{ item }">
          <ListItem>
            <ListItemMeta :title="item.name" :description="`${item.value} پیکسل`" />
            <Tag color="blue">×{{ item.index }}</Tag>
          </ListItem>
        </template>
      </List>
    </Card>
  </Space>
</template>
