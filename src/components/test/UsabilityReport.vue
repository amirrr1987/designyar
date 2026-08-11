<script setup lang="ts">
import { computed } from 'vue'
import {
  Card,
  Descriptions,
  DescriptionsItem,
  Progress,
  Result,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { storeToRefs } from 'pinia'
import { useContrast } from '@/composables/useContrast'
import { useWCAG } from '@/composables/useWCAG'
import { HEURISTIC_RULES, type HeuristicEvalMap } from '@/constants/heuristic-rules'
import { useDesignSystemStore } from '@/stores/designSystem'
import { evaluateContrast } from '@/utils/contrast'

const { Paragraph, Text } = Typography
const { progress: wcagProgress, checkedCount, total: wcagTotal } = useWCAG()
const designStore = useDesignSystemStore()
const { palette } = storeToRefs(designStore)

const evaluations = useStorage<HeuristicEvalMap>(STORAGE_KEYS.heuristicEval, {})

const designContrast = computed(() => {
  const fg = palette.value.primary[7] ?? '#000000'
  const bg = palette.value.primary[0] ?? '#ffffff'
  return evaluateContrast(fg, bg)
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
  const contrastOk = designContrast.value !== null && designContrast.value.level !== 'fail'
  const wcagOk = wcagProgress.value >= 50
  const heurOk = heuristicAverage.value >= 3
  if (contrastOk && wcagOk && heurOk) return 'success'
  if (!contrastOk && wcagProgress.value < 25) return 'warning'
  return 'info'
})

const overallTitle = computed(() => {
  if (overallStatus.value === 'success') return 'وضعیت ارزیابی خوب است'
  if (overallStatus.value === 'warning') return 'نیاز به بهبود جدی'
  return 'ارزیابی در جریان است'
})
</script>

<template>
  <Space direction="vertical" size="large">
    <Result :status="overallStatus" :title="overallTitle">
      <template #subTitle>
        <Paragraph>
          خلاصه کنتراست پالت، پیشرفت WCAG و میانگین هیوریستیک — برای خروجی کامل در فاز Export.
        </Paragraph>
      </template>
    </Result>

    <Card size="small" title="کنتراست">
      <Descriptions :column="1" size="small" bordered>
        <DescriptionsItem label="نمونه متن سیاه/سفید">
          <template v-if="sampleContrast">
            {{ sampleContrast.ratio }}:1
            <Tag>{{ sampleContrast.level }}</Tag>
          </template>
          <Text v-else>—</Text>
        </DescriptionsItem>
        <DescriptionsItem label="از پالت دیزاین‌سیستم (primary[7]/[0])">
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

    <Card size="small" title="WCAG">
      <Progress :percent="wcagProgress" status="active" />
      <Statistic title="موارد انجام‌شده" :value="checkedCount" :suffix="`/ ${wcagTotal}`" />
    </Card>

    <Card size="small" title="هیوریستیک نیلسن">
      <Statistic title="میانگین امتیاز" :value="heuristicAverage" :precision="1" suffix="/ ۵" />
      <Paragraph type="secondary">
        ارزیابی‌شده: {{ heuristicRatedCount }} از {{ HEURISTIC_RULES.length }} اصل
      </Paragraph>
    </Card>
  </Space>
</template>
