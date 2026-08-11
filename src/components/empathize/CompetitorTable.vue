<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import {
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { TableColumnsType } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useEmpathizeStore } from '@/stores/empathize'
import { useProjectStore } from '@/stores/project'
import type { CompetitorRow } from '@/types/competitor'
import { fa } from '@/content/fa'

interface CompetitorForm {
  name: string
  strength: string
  weakness: string
  url: string
}

const empathizeStore = useEmpathizeStore()
const projectStore = useProjectStore()
const { competitors } = storeToRefs(empathizeStore)
const formRef = ref<FormInstance>()
const copy = fa.empathizeTools.competitors
const isJunior = computed(() => projectStore.isJuniorMode)

const model = reactive<CompetitorForm>({
  name: '',
  strength: '',
  weakness: '',
  url: '',
})

const rules: { [K in keyof CompetitorForm]?: Rule[] } = {
  name: [{ required: true, message: 'نام رقیب الزامی است' }],
  strength: [{ required: true, message: 'نقطه قوت الزامی است' }],
  weakness: [{ required: true, message: 'نقطه ضعف الزامی است' }],
}

const columns: TableColumnsType<CompetitorRow> = [
  { title: 'نام', dataIndex: 'name', key: 'name' },
  { title: 'نقطه قوت', dataIndex: 'strength', key: 'strength' },
  { title: 'نقطه ضعف', dataIndex: 'weakness', key: 'weakness' },
  { title: 'آدرس', dataIndex: 'url', key: 'url' },
  { title: 'عملیات', key: 'actions' },
]

function resetForm(): void {
  model.name = ''
  model.strength = ''
  model.weakness = ''
  model.url = ''
  formRef.value?.clearValidate()
}

async function onAdd(): Promise<void> {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  empathizeStore.addCompetitor({
    name: model.name,
    strength: model.strength,
    weakness: model.weakness,
    url: model.url.trim() ? model.url.trim() : undefined,
  })
  message.success('رقیب افزوده شد')
  resetForm()
}

function onRemove(id: string): void {
  empathizeStore.removeCompetitor(id)
}
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <Alert
      type="info"
      show-icon
      :message="`${fa.optionalLabel}: ${copy.alertMessage}`"
      :description="copy.alertDescription"
    />
    <Space wrap>
      <AiAssistButton action="suggest-competitors" label="پیشنهاد رقبا با AI" section="جدول رقبا" />
      <AiAssistButton
        v-if="!isJunior"
        action="analyze-competitors"
        label="تحلیل رقبا با AI"
        section="جدول رقبا"
      />
    </Space>
    <Form ref="formRef" layout="vertical" :model="model" :rules="rules" @finish="onAdd">
      <FormItem label="نام رقیب" name="name">
        <Input v-model:value="model.name" placeholder="نام محصول یا شرکت" />
      </FormItem>
      <FormItem label="نقطه قوت" name="strength">
        <Input v-model:value="model.strength" placeholder="چه کاری خوب انجام می‌دهد؟" />
      </FormItem>
      <FormItem label="نقطه ضعف" name="weakness">
        <Input v-model:value="model.weakness" placeholder="کجا ضعیف است؟" />
      </FormItem>
      <FormItem label="آدرس (اختیاری)" name="url">
        <Input v-model:value="model.url" placeholder="https://…" />
      </FormItem>
      <FormItem>
        <Button type="primary" html-type="submit">
          <template #icon><PlusOutlined /></template>
          افزودن رقیب
        </Button>
      </FormItem>
    </Form>

    <Table
      :columns="columns"
      :data-source="competitors"
      row-key="id"
      :pagination="competitors.length > 5 ? { pageSize: 5 } : false"
      :locale="{ emptyText: 'هنوز رقیبی ثبت نشده است' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'url'">
          <a v-if="record.url" :href="record.url" target="_blank" rel="noopener noreferrer">
            {{ record.url }}
          </a>
          <template v-else>—</template>
        </template>
        <template v-else-if="column.key === 'actions'">
          <Popconfirm
            title="این رقیب حذف شود؟"
            ok-text="حذف"
            cancel-text="انصراف"
            @confirm="onRemove(record.id)"
          >
            <Button type="text" danger>
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Popconfirm>
        </template>
      </template>
    </Table>
  </Space>
</template>
