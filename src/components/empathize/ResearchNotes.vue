<script setup lang="ts">
import { computed } from 'vue'
import { Alert, Card, Input, Space } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useEmpathizeStore } from '@/stores/empathize'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'

const Textarea = Input.TextArea
const empathizeStore = useEmpathizeStore()
const projectStore = useProjectStore()
const { researchNotes: notes } = storeToRefs(empathizeStore)

const copy = fa.empathizeTools.notes
const job = fa.getJob('empathize.notes')
const isJunior = computed(() => projectStore.isJuniorMode)
</script>

<template>
  <Space direction="vertical" size="middle" style="width: 100%">
    <Alert type="info" show-icon :message="copy.alertMessage" :description="copy.alertDescription" />
    <Alert
      v-if="job"
      type="success"
      show-icon
      :message="fa.whyHeading"
      :description="job.why"
    />

    <AiSectionAssist
      v-if="!isJunior || notes.trim().length > 0"
      action="analyze-notes"
      :label="copy.analyzeLabel"
      section="یادداشت تحقیق"
    />

    <Card size="small" :title="copy.title">
      <Textarea
        v-model:value="notes"
        :rows="12"
        :placeholder="copy.placeholder"
        allow-clear
      />
    </Card>
  </Space>
</template>
