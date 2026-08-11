<script setup lang="ts">
import { computed } from 'vue'
import {
  Button,
  Card,
  Collapse,
  CollapsePanel,
  Empty,
  Progress,
  Space,
  Tag,
  Typography,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useAiPromptContext } from '@/composables/useAiPromptContext'
import { useMetaStore } from '@/stores/meta'
import { getProjectContextCoverage } from '@/utils/ai-context-coverage'
import { buildSynthesisSections } from '@/utils/project-synthesis-sections'

const { Title, Paragraph, Text } = Typography

const { buildContext } = useAiPromptContext()
const metaStore = useMetaStore()
const { projectSynthesis } = storeToRefs(metaStore)

const ctx = computed(() => buildContext())
const sections = computed(() => buildSynthesisSections(ctx.value))
const coverage = computed(() => getProjectContextCoverage(ctx.value))

const filledCount = computed(() => coverage.value.items.filter((i) => i.filled).length)

function clearSynthesis(): void {
  metaStore.setProjectSynthesis('')
}
</script>

<template>
  <Space direction="vertical" size="large">
    <Card size="small">
      <Space direction="vertical" size="middle">
        <Title :level="4">پوشش داده پروژه</Title>
        <Progress :percent="coverage.percent" status="active" />
        <Text type="secondary">
          {{ filledCount }} از {{ coverage.items.length }} بخش برای AI آماده است
        </Text>
        <Space wrap size="small">
          <Tag
            v-for="entry in coverage.items"
            :key="entry.id"
            :color="entry.filled ? 'success' : 'default'"
          >
            {{ entry.label }}
          </Tag>
        </Space>
      </Space>
    </Card>

    <AiSectionAssist
      action="analyze-project"
      label="تحلیل جامع پروژه با AI"
      section="جمع‌بندی پروژه"
      secondary-action="ux-improve"
      secondary-label="پیشنهاد بهبود UX"
    />

    <Card size="small" title="تحلیل AI (ذخیره‌شده)">
      <Space direction="vertical" size="middle">
        <Empty
          v-if="!projectSynthesis.trim()"
          description="هنوز تحلیل AI ذخیره نشده — از دکمه بالا استفاده کنید"
        />
        <Paragraph v-else style="white-space: pre-wrap; margin-bottom: 0">
          {{ projectSynthesis }}
        </Paragraph>
        <Button v-if="projectSynthesis.trim()" @click="clearSynthesis">پاک کردن تحلیل</Button>
      </Space>
    </Card>

    <Card title="همه آیتم‌های پروژه (تحلیل‌شده)">
      <Paragraph type="secondary">
        خلاصه ساخت‌یافته از تمام مراحل Design Thinking — برای مرور قبل از export یا ارائه.
      </Paragraph>
      <Collapse accordion>
        <CollapsePanel
          v-for="section in sections"
          :key="section.id"
          :header="section.phaseTitle"
        >
          <Space direction="vertical" size="middle">
            <Card
              v-for="entry in section.items"
              :key="entry.id"
              size="small"
              :title="entry.label"
            >
              <Space direction="vertical" size="small">
                <Tag :color="entry.filled ? 'processing' : 'default'">
                  {{ entry.filled ? 'تکمیل‌شده' : 'خالی' }}
                </Tag>
                <Paragraph
                  v-if="entry.filled"
                  style="white-space: pre-wrap; margin-bottom: 0"
                >
                  {{ entry.content }}
                </Paragraph>
                <Text v-else type="secondary">هنوز داده‌ای ثبت نشده است.</Text>
              </Space>
            </Card>
          </Space>
        </CollapsePanel>
      </Collapse>
    </Card>
  </Space>
</template>
