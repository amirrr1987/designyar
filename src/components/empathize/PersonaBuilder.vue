<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  Row,
  Select,
  SelectOption,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { blue, geekblue, gold, green, magenta, purple } from '@ant-design/colors'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { usePersona } from '@/composables/usePersona'
import { useProjectStore } from '@/stores/project'
import { getPersonaTemplate } from '@/utils/persona-templates'
import { fa } from '@/content/fa'

export interface PersonaForm {
  name: string
  role: string
  age: number | undefined
  goals: string
  pains: string
  bio: string
  avatarColor: string
  templateId: string | undefined
}

const Textarea = Input.TextArea
const { Text, Paragraph } = Typography
const { templates, addPersona, addFromTemplate } = usePersona()
const projectStore = useProjectStore()
const formRef = ref<FormInstance>()
const copy = fa.empathizeTools.persona
const glossary = fa.getGlossary('persona')
const isJunior = computed(() => projectStore.isJuniorMode)

const avatarPresets = [
  blue[5] ?? '#1677ff',
  magenta[5] ?? '#eb2f96',
  green[5] ?? '#52c41a',
  gold[5] ?? '#faad14',
  purple[5] ?? '#722ed1',
  geekblue[5] ?? '#2f54eb',
] as const

const model = reactive<PersonaForm>({
  name: '',
  role: '',
  age: undefined,
  goals: '',
  pains: '',
  bio: '',
  avatarColor: avatarPresets[0] ?? '#1677ff',
  templateId: undefined,
})

const rules: { [K in keyof PersonaForm]?: Rule[] } = {
  name: [{ required: true, message: 'نام الزامی است' }],
  role: [{ required: true, message: 'نقش الزامی است' }],
  goals: [{ required: true, message: 'اهداف الزامی است' }],
  pains: [{ required: true, message: 'دردها الزامی است' }],
}

const quickBtn: ButtonProps = { type: 'dashed', size: 'small' }
const primaryBtn: ButtonProps = { type: 'primary', htmlType: 'submit' }

function resetForm(): void {
  model.name = ''
  model.role = ''
  model.age = undefined
  model.goals = ''
  model.pains = ''
  model.bio = ''
  model.avatarColor = avatarPresets[0] ?? '#1677ff'
  model.templateId = undefined
  formRef.value?.clearValidate()
}

function fillFromTemplate(id: string): void {
  const template = getPersonaTemplate(id)
  if (!template) return
  model.templateId = id
  model.name = template.draft.name
  model.role = template.draft.role
  model.age = template.draft.age === null ? undefined : template.draft.age
  model.goals = template.draft.goals
  model.pains = template.draft.pains
  model.bio = template.draft.bio
  model.avatarColor = template.draft.avatarColor ?? avatarPresets[0] ?? '#1677ff'
}

function onTemplateChange(value: unknown): void {
  const id = typeof value === 'string' ? value : undefined
  model.templateId = id
  if (!id) return
  fillFromTemplate(id)
}

function quickAdd(templateId: string): void {
  const persona = addFromTemplate(templateId)
  if (!persona) return
  message.success(`پرسونا «${persona.name}» افزوده شد — می‌توانی بعداً ویرایش کنی`)
}

async function onSubmit(): Promise<void> {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  addPersona({
    name: model.name,
    role: model.role,
    age: model.age ?? null,
    goals: model.goals,
    pains: model.pains,
    bio: model.bio,
    avatarColor: model.avatarColor,
  })
  message.success('پرسونا افزوده شد')
  resetForm()
}
</script>

<template>
  <Space direction="vertical" size="middle" style="width: 100%">
    <Paragraph v-if="glossary" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ glossary.labelFa }}:</Text>
      {{ ' ' }}{{ glossary.definition }}
    </Paragraph>

    <AiSectionAssist
      action="persona-suggest"
      :label="copy.aiLabel"
      section="فرم پرسونا"
      :secondary-action="isJunior ? undefined : 'synthesize-empathy'"
      :secondary-label="isJunior ? undefined : 'سنتز نقشه همدلی'"
    />

    <Card size="small" :title="copy.templateHint">
      <Row :gutter="[8, 8]">
        <Col v-for="t in templates" :key="t.id" :xs="24" :sm="12" :md="8">
          <Space direction="vertical" size="small" style="width: 100%">
            <Tag color="blue">{{ t.label }}</Tag>
            <Space wrap>
              <Button v-bind="quickBtn" @click="fillFromTemplate(t.id)">پر کردن فرم</Button>
              <Button type="primary" size="small" ghost @click="quickAdd(t.id)">
                {{ copy.quickAdd }}
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>
    </Card>

    <Form ref="formRef" layout="vertical" :model="model" :rules="rules" @finish="onSubmit">
      <FormItem v-if="!isJunior" :label="'قالب آماده'" name="templateId">
        <Select
          v-model:value="model.templateId"
          allow-clear
          placeholder="انتخاب قالب (اختیاری)"
          @change="onTemplateChange"
        >
          <SelectOption v-for="t in templates" :key="t.id" :value="t.id">
            {{ t.label }}
          </SelectOption>
        </Select>
      </FormItem>

      <FormItem :label="copy.name" name="name">
        <Input v-model:value="model.name" :placeholder="copy.name" />
      </FormItem>

      <FormItem :label="copy.role" name="role">
        <Input v-model:value="model.role" :placeholder="copy.role" />
      </FormItem>

      <FormItem :label="copy.age" name="age">
        <InputNumber v-model:value="model.age" :min="1" :max="120" :placeholder="copy.age" />
      </FormItem>

      <FormItem :label="copy.goals" name="goals">
        <Textarea v-model:value="model.goals" :rows="2" :placeholder="copy.goals" />
      </FormItem>

      <FormItem :label="copy.pains" name="pains">
        <Textarea v-model:value="model.pains" :rows="2" :placeholder="copy.pains" />
      </FormItem>

      <FormItem v-if="!isJunior || model.bio.length > 0" :label="copy.bio" name="bio">
        <Textarea v-model:value="model.bio" :rows="2" :placeholder="copy.bio" />
      </FormItem>

      <FormItem :label="copy.avatar" name="avatarColor">
        <Space wrap>
          <Button
            v-for="color in avatarPresets"
            :key="color"
            size="small"
            :type="model.avatarColor === color ? 'primary' : 'default'"
            :style="{ backgroundColor: color, borderColor: color, color: '#fff' }"
            @click="model.avatarColor = color"
          >
            ■
          </Button>
          <Input
            v-if="!isJunior"
            v-model:value="model.avatarColor"
            placeholder="#1677ff"
            style="max-width: 140px"
          />
        </Space>
      </FormItem>

      <FormItem>
        <Space>
          <Button v-bind="primaryBtn">{{ copy.submit }}</Button>
          <Button @click="resetForm">{{ copy.reset }}</Button>
        </Space>
      </FormItem>
    </Form>
  </Space>
</template>
