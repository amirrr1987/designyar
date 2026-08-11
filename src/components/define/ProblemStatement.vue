<script setup lang="ts">
import { computed } from 'vue'
import { Alert, Form, FormItem, Input, Space, Typography } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useDefineStore } from '@/stores/define'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'

const Textarea = Input.TextArea
const { Paragraph, Text } = Typography
const defineStore = useDefineStore()
const projectStore = useProjectStore()
const { problem, problemSentence } = storeToRefs(defineStore)
const copy = fa.defineTools.problem
const job = fa.getJob('define.problem')
const isJunior = computed(() => projectStore.isJuniorMode)

const previewReady = computed(() => {
  return (
    problem.value.user.trim().length > 0 ||
    problem.value.need.trim().length > 0 ||
    problem.value.insight.trim().length > 0
  )
})

const isComplete = computed(
  () =>
    Boolean(problem.value.user.trim()) &&
    Boolean(problem.value.need.trim()) &&
    Boolean(problem.value.insight.trim()),
)
</script>

<template>
  <Space direction="vertical" size="middle" style="width: 100%">
    <Paragraph v-if="job && isJunior" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ fa.whyHeading }}</Text>
      {{ ' ' }}{{ job.why }}
    </Paragraph>

    <AiSectionAssist
      action="refine-problem"
      :label="copy.aiLabel"
      section="بیان مسئله"
    />

    <Form layout="vertical">
      <FormItem :label="copy.user">
        <Input
          :value="problem.user"
          :placeholder="copy.userPh"
          @update:value="(v: string) => defineStore.patchProblem({ user: v })"
        />
      </FormItem>
      <FormItem :label="copy.need">
        <Textarea
          :value="problem.need"
          :rows="2"
          :placeholder="copy.needPh"
          @update:value="(v: string) => defineStore.patchProblem({ need: v })"
        />
      </FormItem>
      <FormItem :label="copy.insight">
        <Textarea
          :value="problem.insight"
          :rows="2"
          :placeholder="copy.insightPh"
          @update:value="(v: string) => defineStore.patchProblem({ insight: v })"
        />
      </FormItem>
    </Form>

    <Alert
      v-if="previewReady"
      :type="isComplete ? 'success' : 'info'"
      show-icon
      :message="copy.previewReady"
      :description="problemSentence"
    />
    <Alert v-else type="info" show-icon :message="copy.previewEmpty" />
  </Space>
</template>
