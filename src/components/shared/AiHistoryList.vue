<script setup lang="ts">
import {
  Button,
  Card,
  Collapse,
  CollapsePanel,
  Empty,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import { HistoryOutlined } from '@ant-design/icons-vue'
import { useAiHistory } from '@/composables/useAiHistory'
import { getAiChain, isAiChainId } from '@/constants/ai-chains'
import { fa } from '@/content/fa'

interface AiHistoryListProps {
  /** When true, skip outer Card (e.g. inside Collapse). */
  embedded?: boolean
}

withDefaults(defineProps<AiHistoryListProps>(), {
  embedded: false,
})

const { Text, Paragraph } = Typography
const { entries, removeEntry, clearHistory } = useAiHistory()

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function chainLabel(chainId: string | undefined): string | undefined {
  if (!chainId || !isAiChainId(chainId)) return undefined
  return getAiChain(chainId).label
}

function onClear(): void {
  clearHistory()
  message.success('تاریخچه پاک شد')
}
</script>

<template>
  <Card v-if="!embedded" size="small">
    <template #title>
      <Space>
        <HistoryOutlined />
        <span>{{ fa.ai.historyCollapse }}</span>
      </Space>
    </template>
    <template #extra>
      <Popconfirm
        v-if="entries.length > 0"
        title="همه تاریخچه حذف شود؟"
        ok-text="حذف"
        cancel-text="انصراف"
        @confirm="onClear"
      >
        <Button type="link" size="small" danger>پاک کردن همه</Button>
      </Popconfirm>
    </template>

    <Empty v-if="entries.length === 0" description="هنوز اعمال AI ثبت نشده" />

    <Collapse v-else accordion>
      <CollapsePanel v-for="entry in entries" :key="entry.id">
        <template #header>
          <Space wrap>
            <Space direction="vertical" size="small">
              <Text strong>{{ entry.summary }}</Text>
              <Text type="secondary">{{ formatWhen(entry.appliedAt) }}</Text>
            </Space>
            <Tag>{{ entry.itemCount }} مورد</Tag>
          </Space>
        </template>

        <Space direction="vertical" size="small">
          <Tag v-if="entry.chainId" color="processing">
            زنجیره: {{ chainLabel(entry.chainId) }}
          </Tag>

          <div v-for="(line, index) in entry.diff" :key="`${entry.id}-${index}`">
            <Text type="secondary">{{ line.label }}</Text>
            <Paragraph v-if="line.before" style="margin-bottom: 4px">
              <Text delete type="secondary">{{ line.before }}</Text>
            </Paragraph>
            <Paragraph v-if="line.after" style="margin-bottom: 8px">
              <Text>{{ line.after }}</Text>
            </Paragraph>
          </div>

          <Popconfirm
            title="این رکورد حذف شود؟"
            ok-text="حذف"
            cancel-text="انصراف"
            @confirm="removeEntry(entry.id)"
          >
            <Button type="link" size="small" danger>حذف رکورد</Button>
          </Popconfirm>
        </Space>
      </CollapsePanel>
    </Collapse>
  </Card>

  <Space v-else direction="vertical" style="width: 100%">
    <Popconfirm
      v-if="entries.length > 0"
      title="همه تاریخچه حذف شود؟"
      ok-text="حذف"
      cancel-text="انصراف"
      @confirm="onClear"
    >
      <Button type="link" size="small" danger>پاک کردن همه</Button>
    </Popconfirm>

    <Empty v-if="entries.length === 0" description="هنوز اعمال AI ثبت نشده" />

    <Collapse v-else accordion>
      <CollapsePanel v-for="entry in entries" :key="`e-${entry.id}`">
        <template #header>
          <Space wrap>
            <Space direction="vertical" size="small">
              <Text strong>{{ entry.summary }}</Text>
              <Text type="secondary">{{ formatWhen(entry.appliedAt) }}</Text>
            </Space>
            <Tag>{{ entry.itemCount }} مورد</Tag>
          </Space>
        </template>

        <Space direction="vertical" size="small">
          <Tag v-if="entry.chainId" color="processing">
            زنجیره: {{ chainLabel(entry.chainId) }}
          </Tag>

          <div v-for="(line, index) in entry.diff" :key="`${entry.id}-${index}`">
            <Text type="secondary">{{ line.label }}</Text>
            <Paragraph v-if="line.before" style="margin-bottom: 4px">
              <Text delete type="secondary">{{ line.before }}</Text>
            </Paragraph>
            <Paragraph v-if="line.after" style="margin-bottom: 8px">
              <Text>{{ line.after }}</Text>
            </Paragraph>
          </div>

          <Popconfirm
            title="این رکورد حذف شود؟"
            ok-text="حذف"
            cancel-text="انصراف"
            @confirm="removeEntry(entry.id)"
          >
            <Button type="link" size="small" danger>حذف رکورد</Button>
          </Popconfirm>
        </Space>
      </CollapsePanel>
    </Collapse>
  </Space>
</template>
