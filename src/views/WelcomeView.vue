<script setup lang="ts">
import { Button, Card, Tag, Typography } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { ArrowLeftOutlined, RocketOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import OnboardingShell from '@/components/onboarding/OnboardingShell.vue'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import { fa } from '@/content/fa'
import { useProjectStore } from '@/stores/project'

const { Title, Paragraph, Text } = Typography
const router = useRouter()
const projectStore = useProjectStore()

const startBtn: ButtonProps = { type: 'primary', size: 'large' }
const continueBtn: ButtonProps = { type: 'default', size: 'large' }

function goSetup(): void {
  void router.push({ name: 'setup' })
}

function continueProject(): void {
  const meta = projectStore.currentStepMeta
  if (meta) {
    void router.push(meta.route)
    return
  }
  void router.push({ name: 'home' })
}
</script>

<template>
  <OnboardingShell :current="0">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <Tag color="geekblue" class="w-fit">{{ fa.onboarding.welcomeBadge }}</Tag>
        <Title :level="2" class="m-0">{{ fa.onboarding.welcomeTitle }}</Title>
        <Paragraph type="secondary" class="mb-0">
          {{ fa.onboarding.welcomeLead }}
        </Paragraph>
      </div>

      <div class="flex flex-col gap-3">
        <Title :level="4" class="m-0">{{ fa.onboarding.introTitle }}</Title>
        <Paragraph type="secondary" class="mb-0">
          {{ fa.onboarding.introLead }}
        </Paragraph>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card v-for="step in DESIGN_THINKING_STEPS" :key="step.key" size="small">
            <div class="flex items-start gap-3">
              <component :is="resolveStepIcon(step.icon)" />
              <div class="flex min-w-0 flex-col gap-1">
                <Text strong>{{ fa.phaseTitle(step.key, projectStore.experienceMode) }}</Text>
                <Paragraph type="secondary" class="mb-0">
                  {{ fa.phaseDescription(step.key, projectStore.experienceMode) }}
                </Paragraph>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <Button v-bind="startBtn" @click="goSetup">
          <template #icon><RocketOutlined /></template>
          {{ fa.onboarding.startCta }}
        </Button>
        <Button v-if="projectStore.hasBrief" v-bind="continueBtn" @click="continueProject">
          {{ fa.onboarding.continueCta }}
          <template #icon><ArrowLeftOutlined /></template>
        </Button>
      </div>
    </div>
  </OnboardingShell>
</template>
