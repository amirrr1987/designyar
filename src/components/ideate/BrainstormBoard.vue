<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Form,
  FormItem,
  Input,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { DeleteOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useIdeateStore } from '@/stores/ideate'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'

interface IdeaForm {
  title: string
  detail: string
  tagsText: string
}

const Textarea = Input.TextArea
const { Paragraph, Text } = Typography
const ideateStore = useIdeateStore()
const projectStore = useProjectStore()
const { ideas } = storeToRefs(ideateStore)
const copy = fa.ideateTools.brainstorm
const job = fa.getJob('ideate.brainstorm')
const isJunior = computed(() => projectStore.isJuniorMode)

const GOAL = 3
const progressPercent = computed(() => Math.min(100, Math.round((ideas.value.length / GOAL) * 100)))

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
  <Space direction="vertical" size="middle" style="width: 100%">
    <Paragraph v-if="job && isJunior" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ fa.whyHeading }}</Text>
      {{ ' ' }}{{ job.why }}
    </Paragraph>

    <Alert
      v-if="isJunior"
      :type="ideas.length >= GOAL ? 'success' : 'info'"
      show-icon
      :message="copy.goalHint"
      :description="`${ideas.length} از ${GOAL} ایده`"
    />
    <Progress
      v-if="isJunior"
      :percent="progressPercent"
      :status="ideas.length >= GOAL ? 'success' : 'active'"
      size="small"
    />

    <Space wrap>
      <Button type="primary" @click="openModal">
        <template #icon><PlusOutlined /></template>
        {{ copy.newIdea }}
      </Button>
      <AiSectionAssist action="brainstorm-ideas" :label="copy.aiLabel" section="طوفان فکری" />
    </Space>

    <Empty v-if="ideas.length === 0" :description="copy.empty" />

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
            <Tag color="blue">{{ idea.votes }} {{ copy.vote }}</Tag>
          </Space>

          <template #actions>
            <Button type="link" @click="ideateStore.voteIdea(idea.id)">
              <template #icon><LikeOutlined /></template>
              {{ copy.vote }}
            </Button>
          </template>
        </Card>
      </Col>
    </Row>

    <Modal
      v-model:open="open"
      :title="copy.modalTitle"
      ok-text="ثبت"
      cancel-text="انصراف"
      @ok="onSubmit"
    >
      <Form ref="formRef" layout="vertical" :model="model" :rules="rules">
        <FormItem :label="copy.title" name="title">
          <Input v-model:value="model.title" :placeholder="copy.title" />
        </FormItem>
        <FormItem :label="copy.detail" name="detail">
          <Textarea v-model:value="model.detail" :rows="3" :placeholder="copy.detail" />
        </FormItem>
        <FormItem v-if="!isJunior" :label="copy.tags" name="tagsText">
          <Input v-model:value="model.tagsText" :placeholder="copy.tagsPh" />
        </FormItem>
      </Form>
    </Modal>
  </Space>
</template>
