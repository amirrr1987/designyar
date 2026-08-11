<script setup lang="ts">
import { ref } from 'vue'
import { Card, Space, Tabs, Typography } from 'ant-design-vue'
import ColorPalette from '@/components/prototype/ColorPalette.vue'
import ComponentLibrary from '@/components/prototype/ComponentLibrary.vue'
import MicrocopyBank from '@/components/prototype/MicrocopyBank.vue'
import GridConfigurator from '@/components/prototype/GridConfigurator.vue'
import SpacingScale from '@/components/prototype/SpacingScale.vue'
import TypographyScale from '@/components/prototype/TypographyScale.vue'
import WireframeBuilder from '@/components/prototype/WireframeBuilder.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'

type PrototypeTabKey = 'color' | 'type' | 'grid' | 'spacing' | 'wireframe' | 'checklist' | 'microcopy'

const { Title, Paragraph } = Typography
const step = getStepByKey('prototype')
const activeKey = ref<PrototypeTabKey>('color')
</script>

<template>
  <Space direction="vertical" size="large">
    <Card>
      <Title :level="3">{{ step.title }}</Title>
      <Paragraph>{{ step.description }}</Paragraph>
      <Space wrap>
        <AiChainButton chain="prototype-starter" label="زنجیره Prototype (wireframe→microcopy)" />
        <AiAssistButton action="review-design-system" label="بازبینی Design System" section="Prototype" />
        <AiAssistButton action="wireframe-critique" label="نقد وایرفریم" section="Prototype" />
        <AiAssistButton action="microcopy" label="تولید میکروکپی" section="Prototype" />
      </Space>
    </Card>

    <Card>
      <Tabs v-model:activeKey="activeKey">
        <Tabs.TabPane key="color" tab="رنگ">
          <ColorPalette />
        </Tabs.TabPane>
        <Tabs.TabPane key="type" tab="تایپوگرافی">
          <TypographyScale />
        </Tabs.TabPane>
        <Tabs.TabPane key="grid" tab="گرید">
          <GridConfigurator />
        </Tabs.TabPane>
        <Tabs.TabPane key="spacing" tab="فاصله">
          <SpacingScale />
        </Tabs.TabPane>
        <Tabs.TabPane key="wireframe" tab="وایر فریم">
          <WireframeBuilder />
        </Tabs.TabPane>
        <Tabs.TabPane key="checklist" tab="چک‌لیست">
          <ComponentLibrary />
        </Tabs.TabPane>
        <Tabs.TabPane key="microcopy" tab="میکروکپی">
          <MicrocopyBank />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </Space>
</template>
