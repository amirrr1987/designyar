<script setup lang="ts">
import { computed } from 'vue'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  DescriptionsItem,
  Empty,
  Input,
  Progress,
  Result,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useContrast } from '@/composables/useContrast'
import { useWCAG } from '@/composables/useWCAG'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { HEURISTIC_RULES } from '@/constants/heuristic-rules'
import { useDesignSystemStore } from '@/stores/designSystem'
import { useProjectStore } from '@/stores/project'
import { useTestStore } from '@/stores/test'
import { evaluateContrast } from '@/utils/contrast'
import { fa } from '@/content/fa'

const Textarea = Input.TextArea
const { Paragraph, Text } = Typography
const { progress: wcagProgress, checkedCount, total: wcagTotal } = useWCAG()
const designStore = useDesignSystemStore()
const projectStore = useProjectStore()
const { palette } = storeToRefs(designStore)
const testStore = useTestStore()
const {
  heuristicEval: evaluations,
  usabilityReportSummary: reportSummary,
  contrastCheck,
} = storeToRefs(testStore)

const copy = fa.testTools.report
const job = fa.getJob('test.report')
const isJunior = computed(() => projectStore.isJuniorMode)

const designContrast = computed(() => {
  const fg = palette.value.primary[7] ?? '#000000'
  const bg = palette.value.primary[0] ?? '#ffffff'
  return evaluateContrast(fg, bg)
})

const savedContrast = computed(() => {
  const c = contrastCheck.value
  if (c === null) return null
  return evaluateContrast(c.foreground, c.background)
})

const { result: sampleContrast } = useContrast('#000000', '#ffffff')

const heuristicAverage = computed(() => {
  const ratings = HEURISTIC_RULES.map((rule) => evaluations.value[rule.id]?.rating ?? 0)
  const scored = ratings.filter((r) => r > 0)
  if (scored.length === 0) return 0
  const sum = scored.reduce((acc, n) => acc + n, 0)
  return Math.round((sum / scored.length) * 10) / 10
})

const heuristicRatedCount = computed(
  () => HEURISTIC_RULES.filter((rule) => (evaluations.value[rule.id]?.rating ?? 0) > 0).length,
)

const overallStatus = computed((): 'success' | 'info' | 'warning' => {
  const contrastOk =
    (savedContrast.value !== null && savedContrast.value.level !== 'fail') ||
    (designContrast.value !== null && designContrast.value.level !== 'fail')
  const wcagOk = wcagProgress.value >= 50
  const heurOk = heuristicAverage.value >= 3 || isJunior.value
  if (contrastOk && wcagOk && (heurOk || heuristicRatedCount.value === 0)) return 'success'
  if (!contrastOk && wcagProgress.value < 25) return 'warning'
  return 'info'
})

const overallTitle = computed(() => {
  if (overallStatus.value === 'success') return 'وضعیت ارزیابی خوب است'
  if (overallStatus.value === 'warning') return 'نیاز به بهبود جدی'
  return 'ارزیابی در جریان است'
})

function clearSummary(): void {
  reportSummary.value = ''
}
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <Alert
      v-if="job"
      type="info"
      show-icon
      :message="job.title"
      :description="copy.why"
    />

    <Result :status="overallStatus" :title="overallTitle">
      <template #subTitle>
        <Paragraph>{{ copy.aggregateTitle }}</Paragraph>
      </template>
    </Result>

    <Card size="small" :title="copy.notesTitle">
      <Space direction="vertical" size="middle" style="width: 100%">
        <Textarea
          v-model:value="reportSummary"
          :rows="5"
          :placeholder="copy.notesPh"
          allow-clear
        />
        <Space wrap>
          <AiAssistButton
            action="summarize-test"
            :label="copy.aiLabel"
            section="گزارش کاربردپذیری"
          />
          <Button v-if="reportSummary.trim()" @click="clearSummary">{{ copy.clear }}</Button>
        </Space>
        <Empty v-if="!reportSummary.trim()" :description="copy.empty" />
      </Space>
    </Card>

    <Card size="small" :title="copy.contrastSection">
      <Descriptions :column="1" size="small" bordered>
        <DescriptionsItem label="بررسی ذخیره‌شده">
          <template v-if="savedContrast">
            {{ savedContrast.ratio }}:1
            <Tag :color="savedContrast.level === 'fail' ? 'error' : 'success'">
              {{ savedContrast.level }}
            </Tag>
          </template>
          <Text v-else type="secondary">هنوز ثبت نشده</Text>
        </DescriptionsItem>
        <DescriptionsItem v-if="!isJunior" label="نمونه سیاه/سفید">
          <template v-if="sampleContrast">
            {{ sampleContrast.ratio }}:1
            <Tag>{{ sampleContrast.level }}</Tag>
          </template>
          <Text v-else>—</Text>
        </DescriptionsItem>
        <DescriptionsItem label="از پالت پروژه">
          <template v-if="designContrast">
            {{ designContrast.ratio }}:1
            <Tag :color="designContrast.level === 'fail' ? 'error' : 'success'">
              {{ designContrast.level }}
            </Tag>
          </template>
          <Text v-else>رنگ نامعتبر یا رمپ خالی</Text>
        </DescriptionsItem>
      </Descriptions>
    </Card>

    <Card size="small" :title="copy.wcagSection">
      <Progress :percent="wcagProgress" status="active" />
      <Statistic title="موارد انجام‌شده" :value="checkedCount" :suffix="`/ ${wcagTotal}`" />
    </Card>

    <Card v-if="!isJunior || heuristicRatedCount > 0" size="small" :title="copy.heuristicSection">
      <Statistic title="میانگین امتیاز" :value="heuristicAverage" :precision="1" suffix="/ ۵" />
      <Paragraph type="secondary">
        ارزیابی‌شده: {{ heuristicRatedCount }} از {{ HEURISTIC_RULES.length }} اصل
      </Paragraph>
    </Card>
  </Space>
</template>
