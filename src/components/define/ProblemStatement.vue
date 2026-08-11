<script setup lang="ts">
import { computed } from 'vue'
import { Alert, Card, Form, FormItem, Input, Space } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useDefineStore } from '@/stores/define'

const Textarea = Input.TextArea
const defineStore = useDefineStore()
const { problem, problemSentence } = storeToRefs(defineStore)

const previewReady = computed(() => {
  return (
    problem.value.user.trim().length > 0 ||
    problem.value.need.trim().length > 0 ||
    problem.value.insight.trim().length > 0
  )
})
</script>

<template>
  <Space direction="vertical" size="middle">
    <AiAssistButton action="refine-problem" label="پیشنهاد بیان مسئله با AI" section="بیان مسئله" />
    <Card size="small" title="بیان مسئله">
      <Form layout="vertical">
        <FormItem label="کاربر (چه کسی؟)">
          <Input
            :value="problem.user"
            placeholder="مثلاً خریدار جوان آنلاین"
            @update:value="(v: string) => defineStore.patchProblem({ user: v })"
          />
        </FormItem>
        <FormItem label="نیاز (چه چیزی؟)">
          <Textarea
            :value="problem.need"
            :rows="2"
            placeholder="مثلاً مقایسه سریع قیمت و تحویل مطمئن"
            @update:value="(v: string) => defineStore.patchProblem({ need: v })"
          />
        </FormItem>
        <FormItem label="بینش (چرا؟)">
          <Textarea
            :value="problem.insight"
            :rows="2"
            placeholder="مثلاً وقت کمی دارد و به اطلاعات ناقص اعتماد نمی‌کند"
            @update:value="(v: string) => defineStore.patchProblem({ insight: v })"
          />
        </FormItem>
      </Form>
    </Card>

    <Alert
      v-if="previewReady"
      type="success"
      show-icon
      message="پیش‌نمایش جمله مسئله"
      :description="problemSentence"
    />
    <Alert
      v-else
      type="info"
      show-icon
      message="پیش‌نمایش"
      description="با پر کردن فیلدها، جمله مسئله اینجا ساخته می‌شود."
    />
  </Space>
</template>
