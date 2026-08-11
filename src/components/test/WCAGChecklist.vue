<script setup lang="ts">
import { computed } from 'vue'
import { Alert, Card, CheckboxGroup, Progress, Space, Tag, Typography } from 'ant-design-vue'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useWCAG } from '@/composables/useWCAG'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'

const { Paragraph, Text } = Typography
const projectStore = useProjectStore()
const { items, checkedIds, progress, checkedCount, total } = useWCAG()

const copy = fa.testTools.wcag
const job = fa.getJob('test.wcag')
const isJunior = computed(() => projectStore.isJuniorMode)

const options = computed(() =>
  items.map((item) => ({
    label: isJunior.value ? item.text : `${item.id} [${item.level}] — ${item.text}`,
    value: item.id,
  })),
)

const helpItems = items.filter((item) => item.help !== undefined)
const goalMet = computed(() => checkedCount.value >= 3)
</script>

<template>
  <Space direction="vertical" size="middle" style="width: 100%">
    <Alert
      v-if="job"
      type="info"
      show-icon
      :message="job.title"
      :description="copy.why"
    />

    <AiSectionAssist
      v-if="!isJunior"
      action="summarize-test"
      :label="copy.aiLabel"
      section="چک‌لیست دسترسی"
      secondary-action="test-to-hmw"
      secondary-label="سوالات جدید از یافته‌ها"
    />

    <Paragraph type="secondary">{{ copy.goalHint }}</Paragraph>

    <Progress :percent="progress" status="active" />
    <Text>
      {{ copy.progressLabel }}:
      <Tag :color="goalMet ? 'success' : 'processing'">{{ checkedCount }} / {{ total }}</Tag>
    </Text>

    <Card size="small" :title="copy.tab">
      <CheckboxGroup v-model:value="checkedIds" :options="options" />
    </Card>

    <Card v-if="!isJunior && helpItems.length > 0" size="small" :title="copy.helpTitle">
      <Space direction="vertical">
        <Text v-for="item in helpItems" :key="`help-${item.id}`">
          <Text strong>{{ item.id }}</Text>
          — {{ item.help }}
        </Text>
      </Space>
    </Card>
  </Space>
</template>
