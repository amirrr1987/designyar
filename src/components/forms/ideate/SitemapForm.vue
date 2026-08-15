<script setup lang="ts">
import { computed } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useIdeateStore } from '@/stores/ideate'
import { sitemapAiSchema } from '@/types/ideate'
const store = useIdeateStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = computed({
  get: () => store.state.sitemap,
  set: (value: string) => store.setSitemap(value),
})

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: sitemapAiSchema,
  formTitle: 'نقشهٔ سایت',
  phase: 'ideate',
  getCurrentValue: () => ({ sitemap: store.state.sitemap }),
})

const previewText = computed(() => (preview.value ? preview.value.sitemap : ''))

async function onAssist(): Promise<void> {
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setSitemap(preview.value.sitemap)
  clearPreview()
}
</script>

<template>
  <MicroFormShell
    v-if="currentMeta"
    :title="currentMeta.title"
    :hint="currentMeta.hint"
    :ai-assist-label="currentMeta.aiAssistLabel"
    :loading="loading"
    :error-message="errorMessage"
    :preview-text="previewText"
    :has-preview="preview !== null"
    @assist="onAssist"
    @accept="onAccept"
    @reject="clearPreview"
    @next="goNext()"
    @prev="goPrev()"
  >
    <Form layout="vertical">
      <FormItem label="ساختار صفحات">
        <Input.TextArea
          v-model:value="draft"
          :rows="6"
          placeholder="خانه&#10;  - داشبورد&#10;  - تنظیمات"
        />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
