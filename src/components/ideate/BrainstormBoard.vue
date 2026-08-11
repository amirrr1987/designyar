<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  FormItem,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { DeleteOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useIdeateStore } from '@/stores/ideate'

interface IdeaForm {
  title: string
  detail: string
  tagsText: string
}

const Textarea = Input.TextArea
const { Paragraph } = Typography
const ideateStore = useIdeateStore()
const { ideas } = storeToRefs(ideateStore)

const open = ref(false)
const formRef = ref<FormInstance>()
const model = reactive<IdeaForm>({
  title: '',
  detail: '',
  tagsText: '',
})

const rules: { [K in keyof IdeaForm]?: Rule[] } = {
  title: [{ required: true, message: 'عنوان ایده الزامی است' }],
}

function resetForm(): void {
  model.title = ''
  model.detail = ''
  model.tagsText = ''
  formRef.value?.clearValidate()
}

function openModal(): void {
  resetForm()
  open.value = true
}

async function onSubmit(): Promise<void> {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  const tags = model.tagsText
    .split(/[,،]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
  ideateStore.addIdea({
    title: model.title,
    detail: model.detail,
    tags,
  })
  message.success('ایده افزوده شد')
  open.value = false
  resetForm()
}
</script>

<template>
  <Space direction="vertical" size="middle">
    <Space wrap>
      <Button type="primary" @click="openModal">
        <template #icon><PlusOutlined /></template>
        ایده جدید
      </Button>
      <AiAssistButton action="brainstorm-ideas" label="طوفان ایده با AI" section="طوفان فکری" />
    </Space>

    <Empty v-if="ideas.length === 0" description="هنوز ایده‌ای ثبت نشده است" />

    <Row v-else :gutter="[16, 16]">
      <Col v-for="idea in ideas" :key="idea.id" :xs="24" :sm="12" :lg="8">
        <Card size="small" :title="idea.title">
          <template #extra>
            <Popconfirm
              title="این ایده حذف شود؟"
              ok-text="حذف"
              cancel-text="انصراف"
              @confirm="ideateStore.removeIdea(idea.id)"
            >
              <Button type="text" danger>
                <template #icon><DeleteOutlined /></template>
              </Button>
            </Popconfirm>
          </template>

          <Paragraph>{{ idea.detail || '—' }}</Paragraph>

          <Space wrap>
            <Tag v-for="tag in idea.tags" :key="`${idea.id}-${tag}`" color="processing">
              {{ tag }}
            </Tag>
            <Tag color="blue">{{ idea.votes }} رأی</Tag>
          </Space>

          <template #actions>
            <Button type="link" @click="ideateStore.voteIdea(idea.id)">
              <template #icon><LikeOutlined /></template>
              رأی
            </Button>
          </template>
        </Card>
      </Col>
    </Row>

    <Modal
      v-model:open="open"
      title="افزودن ایده"
      ok-text="ثبت"
      cancel-text="انصراف"
      @ok="onSubmit"
    >
      <Form ref="formRef" layout="vertical" :model="model" :rules="rules">
        <FormItem label="عنوان" name="title">
          <Input v-model:value="model.title" placeholder="عنوان ایده" />
        </FormItem>
        <FormItem label="جزئیات" name="detail">
          <Textarea v-model:value="model.detail" :rows="3" placeholder="توضیح کوتاه" />
        </FormItem>
        <FormItem label="برچسب‌ها (با ویرگول)" name="tagsText">
          <Input v-model:value="model.tagsText" placeholder="مثلاً موبایل، سرعت، اعتماد" />
        </FormItem>
      </Form>
    </Modal>
  </Space>
</template>
