<script setup lang="ts">
import { ref } from 'vue'
import { Card, Col, Empty, Row, Space, Tabs, Typography } from 'ant-design-vue'
import CompetitorTable from '@/components/empathize/CompetitorTable.vue'
import EmpathyMap from '@/components/empathize/EmpathyMap.vue'
import PersonaBuilder from '@/components/empathize/PersonaBuilder.vue'
import PersonaCard from '@/components/empathize/PersonaCard.vue'
import ResearchNotes from '@/components/empathize/ResearchNotes.vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import AiChainButton from '@/components/shared/AiChainButton.vue'
import { usePersona } from '@/composables/usePersona'
import { getStepByKey } from '@/constants/design-thinking-steps'

type EmpathizeTabKey = 'personas' | 'empathy' | 'notes' | 'competitors'

const { Title, Paragraph } = Typography
const step = getStepByKey('empathize')
const { personas, removePersona } = usePersona()
const activeKey = ref<EmpathizeTabKey>('personas')
</script>

<template>
  <Space direction="vertical" size="large">
    <Card>
      <Title :level="3">{{ step.title }}</Title>
      <Paragraph>{{ step.description }}</Paragraph>
      <Space wrap>
        <AiChainButton chain="empathize-starter" label="زنجیره Empathize" />
        <AiAssistButton action="seed-research-notes" label="پیشنهاد یادداشت" />
        <AiAssistButton action="persona-suggest" label="پیشنهاد پرسونا" />
        <AiAssistButton action="analyze-notes" label="تحلیل یادداشت" />
        <AiAssistButton action="analyze-competitors" label="تحلیل رقبا" />
      </Space>
    </Card>

    <Card>
      <Tabs v-model:activeKey="activeKey">
        <Tabs.TabPane key="personas" tab="پرسوناها">
          <Space direction="vertical" size="large">
            <Card size="small" title="افزودن پرسونا">
              <PersonaBuilder />
            </Card>
            <Card size="small" title="لیست پرسوناها">
              <Empty v-if="personas.length === 0" description="هنوز پرسونایی ثبت نشده است" />
              <Row v-else :gutter="[16, 16]">
                <Col v-for="persona in personas" :key="persona.id" :xs="24" :sm="12" :lg="8">
                  <PersonaCard :persona="persona" @remove="removePersona" />
                </Col>
              </Row>
            </Card>
          </Space>
        </Tabs.TabPane>

        <Tabs.TabPane key="empathy" tab="نقشه همدلی">
          <EmpathyMap />
        </Tabs.TabPane>

        <Tabs.TabPane key="notes" tab="یادداشت تحقیق">
          <ResearchNotes />
        </Tabs.TabPane>

        <Tabs.TabPane key="competitors" tab="رقبا">
          <CompetitorTable />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </Space>
</template>
