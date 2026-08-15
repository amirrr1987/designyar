<script setup lang="ts">
import { computed } from 'vue'
import { Alert, Collapse, CollapsePanel, Space, Typography } from 'ant-design-vue'
import type { AlertProps } from 'ant-design-vue'
import { getPhaseJuniorGuide } from '@/constants/junior-guide'
import type { DesignStepKey } from '@/types/project'
import { useProjectStore } from '@/stores/project'

interface PhaseJuniorGuideProps {
  phase: DesignStepKey
}

const props = defineProps<PhaseJuniorGuideProps>()
const projectStore = useProjectStore()
const { Paragraph, Text } = Typography

const guide = computed(() => getPhaseJuniorGuide(props.phase))
const visible = computed(() => projectStore.isJuniorMode)

const alertProps: AlertProps = {
  type: 'success',
  showIcon: true,
}
</script>

<template>
  <Alert v-if="visible" v-bind="alertProps">
    <template #message>
      <Text strong>از اینجا شروع کن</Text>
    </template>
    <template #description>
      <Space direction="vertical" size="small" style="width: 100%">
        <Paragraph style="margin-bottom: 0">{{ guide.startHere }}</Paragraph>
        <ol style="margin: 0; padding-inline-start: 1.25rem">
          <li v-for="(item, index) in guide.checklist" :key="index">
            <Text>{{ item }}</Text>
          </li>
        </ol>
        <Text type="secondary">آمادهٔ مرحله بعد وقتی: {{ guide.doneWhen }}</Text>
        <Collapse ghost>
          <CollapsePanel key="terms" header="این واژه‌ها یعنی چه؟">
            <Space direction="vertical" size="small" style="width: 100%">
              <div v-for="term in guide.terms" :key="term.term">
                <Text strong>{{ term.term }}: </Text>
                <Text type="secondary">{{ term.meaning }}</Text>
              </div>
            </Space>
          </CollapsePanel>
        </Collapse>
      </Space>
    </template>
  </Alert>
</template>
