<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Form, FormItem, Input, Space } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useIdeateStore } from '@/stores/ideate'
import { cardSortAiSchema, type CardGroup } from '@/types/ideate'
const store = useIdeateStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const groups = ref<CardGroup[]>(store.state.cardSort.map((g) => ({ ...g, items: [...g.items] })))

watch(
  () => store.state.cardSort,
  (value) => {
    groups.value = value.map((g) => ({ ...g, items: [...g.items] }))
  },
)

function persist(): void {
  store.setCardSort(groups.value.map((g) => ({ name: g.name, items: [...g.items] })))
}

function addGroup(): void {
  groups.value = [...groups.value, { name: `گروه ${groups.value.length + 1}`, items: [''] }]
  persist()
}

function removeGroup(index: number): void {
  groups.value = groups.value.filter((_, i) => i !== index)
  if (groups.value.length === 0) {
    groups.value = [{ name: 'گروه ۱', items: [''] }]
  }
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: cardSortAiSchema,
  formTitle: 'مرتب‌سازی کارت‌ها',
  phase: 'ideate',
  getCurrentValue: () => ({ cardSort: groups.value }),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.cardSort
        .map((g) => `${g.name}: ${g.items.join('، ')}`)
        .join('\n')
    : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setCardSort(preview.value.cardSort.map((g) => ({ ...g, items: [...g.items] })))
  groups.value = preview.value.cardSort.map((g) => ({ ...g, items: [...g.items] }))
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
    @next="persist(); goNext()"
    @prev="persist(); goPrev()"
  >
    <Space direction="vertical" class="w-full" size="middle">
      <Form v-for="(group, index) in groups" :key="index" layout="vertical">
        <FormItem label="نام گروه">
          <Space class="w-full">
            <Input v-model:value="group.name" class="flex-1" @blur="persist" />
            <Button danger @click="removeGroup(index)">
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </FormItem>
        <FormItem label="آیتم‌ها (با ویرگول)">
          <Input
            :value="group.items.join('، ')"
            @update:value="
              (v: string) => {
                group.items = v.split(/،|,/).map((s) => s.trim()).filter(Boolean)
                persist()
              }
            "
          />
        </FormItem>
      </Form>
      <Button type="dashed" block @click="addGroup">
        <template #icon><PlusOutlined /></template>
        افزودن گروه
      </Button>
    </Space>
  </MicroFormShell>
</template>
