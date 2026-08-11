<script setup lang="ts">
import { ref } from 'vue'
import { Card, Space, Tabs, Typography } from 'ant-design-vue'
import BrainstormBoard from '@/components/ideate/BrainstormBoard.vue'
import CardSorting from '@/components/ideate/CardSorting.vue'
import SitemapTree from '@/components/ideate/SitemapTree.vue'
import UserflowCanvas from '@/components/ideate/UserflowCanvas.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'

type IdeateTabKey = 'brainstorm' | 'userflow' | 'sitemap' | 'cardsort'

const { Title, Paragraph } = Typography
const step = getStepByKey('ideate')
const activeKey = ref<IdeateTabKey>('brainstorm')
</script>

<template>
  <Space direction="vertical" size="large">
    <Card>
      <Title :level="3">{{ step.title }}</Title>
      <Paragraph>{{ step.description }}</Paragraph>
      <Space wrap>
        <AiChainButton chain="ideate-complete" label="زنجیره Ideate (ایده→flow→IA→cards)" />
        <AiAssistButton action="brainstorm-ideas" label="طوفان ایده با AI" section="Ideate" />
        <AiAssistButton action="suggest-userflow" label="پیشنهاد جریان کاربر" section="Ideate" />
      </Space>
    </Card>

    <Card>
      <Tabs v-model:activeKey="activeKey">
        <Tabs.TabPane key="brainstorm" tab="طوفان فکری">
          <BrainstormBoard />
        </Tabs.TabPane>
        <Tabs.TabPane key="userflow" tab="جریان کاربر">
          <UserflowCanvas />
        </Tabs.TabPane>
        <Tabs.TabPane key="sitemap" tab="نقشه سایت">
          <SitemapTree />
        </Tabs.TabPane>
        <Tabs.TabPane key="cardsort" tab="مرتب‌سازی کارت">
          <CardSorting />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </Space>
</template>
