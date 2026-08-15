<script setup lang="ts">
import { computed } from 'vue'
import { Alert, Card, Col, Input, Rate, Row, Space, Statistic, Typography } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import {
  HEURISTIC_RULES,
  type HeuristicEvaluation,
} from '@/constants/heuristic-rules'
import { useProjectStore } from '@/stores/project'
import { useTestStore } from '@/stores/test'
import { fa } from '@/content/fa'

const Textarea = Input.TextArea
const { Paragraph, Text } = Typography

const testStore = useTestStore()
const projectStore = useProjectStore()
const { heuristicEval: evaluations } = storeToRefs(testStore)

const copy = fa.testTools.heuristics
const isJunior = computed(() => projectStore.isJuniorMode)

const average = computed(() => {
  const ratings = HEURISTIC_RULES.map((rule) => evaluations.value[rule.id]?.rating ?? 0)
  const scored = ratings.filter((r) => r > 0)
  if (scored.length === 0) return 0
  const sum = scored.reduce((acc, n) => acc + n, 0)
  return Math.round((sum / scored.length) * 10) / 10
})

function getEval(ruleId: string): HeuristicEvaluation {
  return evaluations.value[ruleId] ?? { ruleId, rating: 0, notes: '' }
}

function setRating(ruleId: string, rating: number): void {
  const current = getEval(ruleId)
  evaluations.value = {
    ...evaluations.value,
    [ruleId]: { ...current, ruleId, rating },
  }
}

function setNotes(ruleId: string, notes: string): void {
  const current = getEval(ruleId)
  evaluations.value = {
    ...evaluations.value,
    [ruleId]: { ...current, ruleId, notes },
  }
}
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <Alert
      type="info"
      show-icon
      :message="copy.alertMessage"
      :description="copy.alertDescription"
    />

    <AiSectionAssist
      v-if="!isJunior"
      action="summarize-test"
      :label="copy.aiLabel"
      section="ارزیابی اکتشافی"
      secondary-action="ux-improve"
      secondary-label="پیشنهاد بهبود UX"
    />

    <Card size="small">
      <Statistic :title="copy.avgTitle" :value="average" :precision="1" suffix="/ ۵" />
      <Paragraph type="secondary">۱۰ اصل نیلسن — امتیاز و یادداشت برای هر اصل ذخیره می‌شود.</Paragraph>
    </Card>

    <Row :gutter="[16, 16]">
      <Col v-for="rule in HEURISTIC_RULES" :key="rule.id" :xs="24" :lg="12">
        <Card size="small" :title="`${rule.number}. ${rule.title}`">
          <Text type="secondary">{{ rule.description }}</Text>
          <Space direction="vertical" style="width: 100%">
            <Rate
              :value="getEval(rule.id).rating"
              @update:value="(v: number) => setRating(rule.id, v)"
            />
            <Textarea
              :value="getEval(rule.id).notes"
              :rows="2"
              :placeholder="copy.notesPh"
              @update:value="(v: string) => setNotes(rule.id, v)"
            />
          </Space>
        </Card>
      </Col>
    </Row>
  </Space>
</template>
