<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  SelectOption,
  Space,
  message,
} from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { usePersona } from '@/composables/usePersona'
import { getPersonaTemplate } from '@/utils/persona-templates'

export interface PersonaForm {
  name: string
  role: string
  /** antdv InputNumber uses `undefined` when empty (not `null`). */
  age: number | undefined
  goals: string
  pains: string
  bio: string
  avatarColor: string
  templateId: string | undefined
}

const Textarea = Input.TextArea
const { templates, addPersona } = usePersona()
const formRef = ref<FormInstance>()

const model = reactive<PersonaForm>({
  name: '',
  role: '',
  age: undefined,
  goals: '',
  pains: '',
  bio: '',
  avatarColor: '#1677ff',
  templateId: undefined,
})

const rules: { [K in keyof PersonaForm]?: Rule[] } = {
  name: [{ required: true, message: 'نام الزامی است' }],
  role: [{ required: true, message: 'نقش الزامی است' }],
  goals: [{ required: true, message: 'اهداف الزامی است' }],
  pains: [{ required: true, message: 'دردها الزامی است' }],
}

function resetForm(): void {
  model.name = ''
  model.role = ''
  model.age = undefined
  model.goals = ''
  model.pains = ''
  model.bio = ''
  model.avatarColor = '#1677ff'
  model.templateId = undefined
  formRef.value?.clearValidate()
}

function onTemplateChange(value: unknown): void {
  const id = typeof value === 'string' ? value : undefined
  model.templateId = id
  if (!id) return
  const template = getPersonaTemplate(id)
  if (!template) return
  model.name = template.draft.name
  model.role = template.draft.role
  model.age = template.draft.age === null ? undefined : template.draft.age
  model.goals = template.draft.goals
  model.pains = template.draft.pains
  model.bio = template.draft.bio
  model.avatarColor = template.draft.avatarColor ?? '#1677ff'
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
  <Form ref="formRef" layout="vertical" :model="model" :rules="rules" @finish="onSubmit">
    <FormItem label="قالب آماده" name="templateId">
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

    <FormItem label="نام" name="name">
      <Input v-model:value="model.name" placeholder="نام پرسونا" />
    </FormItem>

    <FormItem label="نقش" name="role">
      <Input v-model:value="model.role" placeholder="نقش / شغل" />
    </FormItem>

    <FormItem label="سن" name="age">
      <InputNumber v-model:value="model.age" :min="1" :max="120" placeholder="سن" />
    </FormItem>

    <FormItem label="اهداف" name="goals">
      <Textarea v-model:value="model.goals" :rows="2" placeholder="اهداف کاربر" />
    </FormItem>

    <FormItem label="دردها و موانع" name="pains">
      <Textarea v-model:value="model.pains" :rows="2" placeholder="مشکلات و دردها" />
    </FormItem>

    <FormItem label="بیوگرافی" name="bio">
      <Textarea v-model:value="model.bio" :rows="3" placeholder="توضیح کوتاه" />
    </FormItem>

    <FormItem label="رنگ آواتار" name="avatarColor">
      <Input v-model:value="model.avatarColor" placeholder="#1677ff" />
    </FormItem>

    <FormItem>
      <Space>
        <Button type="primary" html-type="submit">افزودن پرسونا</Button>
        <Button @click="resetForm">پاک کردن فرم</Button>
      </Space>
    </FormItem>
  </Form>
</template>
