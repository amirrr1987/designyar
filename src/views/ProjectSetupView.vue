<script setup lang="ts">
import { reactive } from 'vue'
import { Button, Form, FormItem, Input, Typography } from 'ant-design-vue'
import type { ButtonProps, FormProps } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import OnboardingShell from '@/components/onboarding/OnboardingShell.vue'
import { fa } from '@/content/fa'
import { useProjectStore } from '@/stores/project'

interface ProjectBriefForm {
  name: string
  briefTitle: string
  briefDescription: string
}

const { Title, Paragraph } = Typography
const router = useRouter()
const projectStore = useProjectStore()

const model = reactive<ProjectBriefForm>({
  name: projectStore.name,
  briefTitle: projectStore.briefTitle,
  briefDescription: projectStore.briefDescription,
})

const formProps: FormProps = {
  layout: 'vertical',
}

const rules: Record<keyof ProjectBriefForm, Rule[]> = {
  name: [{ required: true, whitespace: true, message: fa.onboarding.nameRequired }],
  briefTitle: [{ required: true, whitespace: true, message: fa.onboarding.titleRequired }],
  briefDescription: [{ required: true, whitespace: true, message: fa.onboarding.descRequired }],
}

const backBtn: ButtonProps = { type: 'default', size: 'large', htmlType: 'button' }
const nextBtn: ButtonProps = { type: 'primary', size: 'large', htmlType: 'submit' }

function goWelcome(): void {
  void router.push({ name: 'welcome' })
}

function onFinish(): void {
  projectStore.setName(model.name.trim())
  projectStore.setBriefTitle(model.briefTitle.trim())
  projectStore.setBriefDescription(model.briefDescription.trim())
  projectStore.setStep(1)
  void router.push({ name: 'empathize' })
}
</script>

<template>
  <OnboardingShell :current="1">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <Title :level="2" class="m-0">{{ fa.onboarding.setupTitle }}</Title>
        <Paragraph type="secondary" class="mb-0">
          {{ fa.onboarding.setupLead }}
        </Paragraph>
      </div>

      <Form
        v-bind="formProps"
        :model="model"
        :rules="rules"
        @finish="onFinish"
      >
        <FormItem :label="fa.onboarding.nameLabel" name="name">
          <Input v-model:value="model.name" :placeholder="fa.onboarding.namePh" allow-clear />
        </FormItem>
        <FormItem :label="fa.onboarding.titleLabel" name="briefTitle">
          <Input
            v-model:value="model.briefTitle"
            :placeholder="fa.onboarding.titlePh"
            allow-clear
          />
        </FormItem>
        <FormItem :label="fa.onboarding.descLabel" name="briefDescription">
          <Input.TextArea
            v-model:value="model.briefDescription"
            :rows="5"
            :placeholder="fa.onboarding.descPh"
            allow-clear
          />
        </FormItem>
        <FormItem>
          <div class="flex flex-wrap gap-3">
            <Button v-bind="backBtn" @click="goWelcome">
              <template #icon><ArrowRightOutlined /></template>
              {{ fa.onboarding.back }}
            </Button>
            <Button v-bind="nextBtn">
              {{ fa.onboarding.next }}
              <template #icon><ArrowLeftOutlined /></template>
            </Button>
          </div>
        </FormItem>
      </Form>
    </div>
  </OnboardingShell>
</template>
