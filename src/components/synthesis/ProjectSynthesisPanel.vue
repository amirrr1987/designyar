<script setup lang="ts">
import { computed } from 'vue'
import {
  Alert,
  Button,
  Card,
  Collapse,
  CollapsePanel,
  Empty,
  Input,
  Progress,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { CopyOutlined } from '@ant-design/icons-vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import ExportImportCard from '@/components/shared/ExportImportCard.vue'
import { useAiPromptContext } from '@/composables/useAiPromptContext'
import { useCompletion } from '@/composables/useCompletion'
import { useMetaStore } from '@/stores/meta'
import { useProjectStore } from '@/stores/project'
import { getProjectContextCoverage } from '@/utils/ai-context-coverage'
import {
  buildSynthesisSections,
  formatFullProjectContext,
} from '@/utils/project-synthesis-sections'
import { fa } from '@/content/fa'

const Textarea = Input.TextArea
const { Paragraph, Text } = Typography

const { buildContext } = useAiPromptContext()
const metaStore = useMetaStore()
const projectStore = useProjectStore()
const { projectSynthesis } = storeToRefs(metaStore)
const { jobCopy, primaryAiFor, projectProgress } = useCompletion()

const copy = fa.synthesis
const isJunior = computed(() => projectStore.isJuniorMode)

const ctx = computed(() => buildContext())
const sections = computed(() => buildSynthesisSections(ctx.value))
const coverage = computed(() => getProjectContextCoverage(ctx.value))
const filledCount = computed(() => coverage.value.items.filter((i) => i.filled).length)

const wrapJob = computed(() => jobCopy('synthesis.wrap'))
const wrapAi = computed(() => primaryAiFor('synthesis.wrap'))
const synthesisDone = computed(() => Boolean(projectSynthesis.value.trim()))
const overallPercent = computed(() => projectProgress.value.overallPercent)

function clearSynthesis(): void {
  metaStore.setProjectSynthesis('')
}

async function copyFullContext(): Promise<void> {
  const text = formatFullProjectContext(ctx.value)
  try {
    await navigator.clipboard.writeText(text)
    message.success(copy.copyDone)
  } catch (e: unknown) {
    message.error(e instanceof Error ? e.message : 'کپی ناموفق')
  }
}
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <Card v-if="wrapJob" size="small">
      <Space direction="vertical" size="middle" style="width: 100%">
        <Alert
          :type="synthesisDone ? 'success' : 'info'"
          show-icon
          :message="wrapJob.title"
          :description="wrapJob.why"
        />
        <Progress :percent="overallPercent" status="active" />
        <Paragraph type="secondary" style="margin-bottom: 0">{{ wrapJob.emptyHint }}</Paragraph>
        <Space wrap v-if="wrapAi">
          <AiAssistButton
            :action="wrapAi.action"
            :label="copy.aiLabel"
            section="جمع‌بندی پروژه"
          />
        </Space>
      </Space>
    </Card>

    <Card size="small" :title="copy.coverageTitle">
      <Space direction="vertical" size="middle" style="width: 100%">
        <Progress :percent="coverage.percent" status="active" />
        <Text type="secondary">
          {{ copy.coverageHint(filledCount, coverage.items.length) }}
        </Text>
        <Space v-if="!isJunior" wrap size="small">
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

    <Card size="small" :title="copy.notesTitle">
      <Space direction="vertical" size="middle" style="width: 100%">
        <Textarea
          v-model:value="projectSynthesis"
          :rows="6"
          :placeholder="copy.notesPh"
          allow-clear
        />
        <Space wrap>
          <AiAssistButton
            action="analyze-project"
            :label="copy.aiLabel"
            section="جمع‌بندی پروژه"
          />
          <AiAssistButton
            v-if="!isJunior"
            action="ux-improve"
            label="پیشنهاد بهبود UX"
            section="جمع‌بندی پروژه"
          />
          <Button v-if="projectSynthesis.trim()" @click="clearSynthesis">{{ copy.clear }}</Button>
          <Button @click="copyFullContext">
            <template #icon><CopyOutlined /></template>
            {{ copy.copyContext }}
          </Button>
        </Space>
        <Empty v-if="!projectSynthesis.trim()" :description="copy.notesEmpty" />
      </Space>
    </Card>

    <ExportImportCard />

    <Card :title="copy.sectionsTitle">
      <Paragraph type="secondary">{{ copy.sectionsHint }}</Paragraph>
      <Collapse accordion>
        <CollapsePanel
          v-for="section in sections"
          :key="section.id"
          :header="section.phaseTitle"
        >
          <Space direction="vertical" size="middle" style="width: 100%">
            <Card
              v-for="entry in section.items"
              :key="entry.id"
              size="small"
              :title="entry.label"
            >
              <Space direction="vertical" size="small">
                <Tag :color="entry.filled ? 'processing' : 'default'">
                  {{ entry.filled ? copy.filled : copy.empty }}
                </Tag>
                <Paragraph
                  v-if="entry.filled"
                  style="white-space: pre-wrap; margin-bottom: 0"
                >
                  {{ entry.content }}
                </Paragraph>
                <Text v-else type="secondary">{{ copy.emptyItem }}</Text>
              </Space>
            </Card>
          </Space>
        </CollapsePanel>
      </Collapse>
    </Card>
  </Space>
</template>
