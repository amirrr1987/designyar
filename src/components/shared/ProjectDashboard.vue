<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  Button,
  Input,
  Form,
  FormItem,
  Row,
  Col,
  Space,
  Typography,
} from 'ant-design-vue'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import { useProjectStore } from '@/stores/project'

const { Paragraph } = Typography
const router = useRouter()
const projectStore = useProjectStore()

const projectName = computed({
  get: () => projectStore.project.name,
  set: (value: string) => {
    projectStore.setName(value)
  },
})

function goToStep(route: (typeof DESIGN_THINKING_STEPS)[number]['route'], step: number): void {
  projectStore.setStep(step)
  void router.push(route)
}
</script>

<template>
  <Space direction="vertical" size="large">
    <Card title="پروژه">
      <Form layout="vertical">
        <FormItem label="نام پروژه">
          <Input v-model:value="projectName" placeholder="مثلاً اپلیکیشن فروشگاهی" allow-clear />
        </FormItem>
      </Form>
    </Card>

    <Card title="مراحل دیزاین تینکینگ">
      <Row :gutter="[16, 16]">
        <Col
          v-for="step in DESIGN_THINKING_STEPS"
          :key="step.key"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
        >
          <Card size="small" :title="step.title">
            <Paragraph>{{ step.description }}</Paragraph>
            <Button type="primary" @click="goToStep(step.route, step.step)">
              <template #icon>
                <component :is="resolveStepIcon(step.icon)" />
              </template>
              شروع {{ step.title }}
            </Button>
          </Card>
        </Col>
      </Row>
    </Card>
  </Space>
</template>
