<script setup lang="ts">
import { computed } from 'vue'
import {
  Button,
  Card,
  Empty,
  List,
  ListItem,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { usePrototypeStore } from '@/stores/prototype'
import {
  MICROCOPY_CATEGORY_LABELS,
  type MicrocopyCategory,
} from '@/types/microcopy'

const { Paragraph, Text } = Typography

const prototypeStore = usePrototypeStore()
const { microcopyBank } = storeToRefs(prototypeStore)

const categoryColor: Record<MicrocopyCategory, string> = {
  cta: 'blue',
  error: 'red',
  empty: 'default',
  hint: 'cyan',
  label: 'purple',
}

const sortedEntries = computed(() =>
  [...microcopyBank.value].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  ),
)

function removeEntry(id: string): void {
  prototypeStore.removeMicrocopy(id)
  message.success('مورد حذف شد')
}
</script>

<template>
  <Space direction="vertical" size="middle">
    <Paragraph type="secondary">
      میکروکپی‌های تولیدشده با AI اینجا ذخیره می‌شوند — برای copy/paste در طراحی UI.
    </Paragraph>

    <AiAssistButton action="microcopy" label="تولید میکروکپی با AI" section="بانک میکروکپی" />

    <Empty v-if="sortedEntries.length === 0" description="بانک میکروکپی خالی است" />

    <Card v-else size="small" title="بانک میکروکپی">
      <List item-layout="vertical">
        <ListItem v-for="item in sortedEntries" :key="item.id">
          <template #actions>
            <Popconfirm
              title="این مورد حذف شود؟"
              ok-text="حذف"
              cancel-text="انصراف"
              @confirm="removeEntry(item.id)"
            >
              <Button type="text" danger>
                <template #icon><DeleteOutlined /></template>
              </Button>
            </Popconfirm>
          </template>
          <Space direction="vertical" size="small">
            <Tag :color="categoryColor[item.category]">
              {{ MICROCOPY_CATEGORY_LABELS[item.category] }}
            </Tag>
            <Text strong>{{ item.text }}</Text>
            <Text v-if="item.context" type="secondary">{{ item.context }}</Text>
          </Space>
        </ListItem>
      </List>
    </Card>
  </Space>
</template>
