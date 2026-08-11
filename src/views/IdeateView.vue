<script setup lang="ts">
import { ref } from 'vue'
import { Card, Space, Tabs } from 'ant-design-vue'
import BrainstormBoard from '@/components/ideate/BrainstormBoard.vue'
import CardSorting from '@/components/ideate/CardSorting.vue'
import SitemapTree from '@/components/ideate/SitemapTree.vue'
import UserflowCanvas from '@/components/ideate/UserflowCanvas.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import { getStepByKey } from '@/constants/design-thinking-steps'

type IdeateTabKey = 'brainstorm' | 'userflow' | 'sitemap' | 'cardsort'

const step = getStepByKey('ideate')
const activeKey = ref<IdeateTabKey>('brainstorm')
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <PhaseHero
      :title="step.title"
      :description="step.description"
      :color="step.color"
      :icon="step.icon"
      badge="مرحله ۳ از ۵"
    >
      <template #actions>
        <AiChainButton chain="ideate-complete" label="زنجیره Ideate (ایده→flow→IA→cards)" />
        <AiAssistButton action="brainstorm-ideas" label="طوفان ایده با AI" section="Ideate" />
        <AiAssistButton action="suggest-userflow" label="پیشنهاد جریان کاربر" section="Ideate" />
      </template>
    </PhaseHero>

    <Card>
      <Tabs v-model:activeKey="activeKey" type="card">
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

    <PhaseFlowNav current-key="ideate" />
  </Space>
</template>
