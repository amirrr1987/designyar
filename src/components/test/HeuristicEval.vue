<script setup lang="ts">
import { computed } from 'vue'
import { Card, Col, Input, Rate, Row, Space, Statistic, Typography } from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
import {
  HEURISTIC_RULES,
  type HeuristicEvalMap,
  type HeuristicEvaluation,
} from '@/constants/heuristic-rules'

const Textarea = Input.TextArea
const { Paragraph, Text } = Typography

const evaluations = useStorage<HeuristicEvalMap>('ux-flow-heuristic-eval', {})

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
  <Space direction="vertical" size="large">
    <Card size="small">
      <Statistic title="میانگین امتیاز (از ۵)" :value="average" :precision="1" suffix="/ ۵" />
      <Paragraph type="secondary"
        >۱۰ اصل نیلسن — امتیاز و یادداشت برای هر اصل ذخیره می‌شود.</Paragraph
      >
    </Card>

    <Row :gutter="[16, 16]">
      <Col v-for="rule in HEURISTIC_RULES" :key="rule.id" :xs="24" :lg="12">
        <Card size="small" :title="`${rule.number}. ${rule.title}`">
          <Text type="secondary">{{ rule.description }}</Text>
          <Space direction="vertical">
            <Rate
              :value="getEval(rule.id).rating"
              @update:value="(v: number) => setRating(rule.id, v)"
            />
            <Textarea
              :value="getEval(rule.id).notes"
              :rows="2"
              placeholder="یادداشت ارزیابی…"
              @update:value="(v: string) => setNotes(rule.id, v)"
            />
          </Space>
        </Card>
      </Col>
    </Row>
  </Space>
</template>
