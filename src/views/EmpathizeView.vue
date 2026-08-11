<script setup lang="ts">
import { Card, Col, Empty, Row, Space, Typography } from 'ant-design-vue'
import CompetitorTable from '@/components/empathize/CompetitorTable.vue'
import EmpathyMap from '@/components/empathize/EmpathyMap.vue'
import PersonaBuilder from '@/components/empathize/PersonaBuilder.vue'
import PersonaCard from '@/components/empathize/PersonaCard.vue'
import ResearchNotes from '@/components/empathize/ResearchNotes.vue'
import { usePersona } from '@/composables/usePersona'
import { getStepByKey } from '@/constants/design-thinking-steps'

const { Title, Paragraph } = Typography
const step = getStepByKey('empathize')
const { personas, removePersona } = usePersona()
</script>

<template>
  <Space direction="vertical" size="large">
    <Card>
      <Title :level="3">{{ step.title }}</Title>
      <Paragraph>{{ step.description }}</Paragraph>
    </Card>

    <Card title="افزودن پرسونا">
      <PersonaBuilder />
    </Card>

    <Card title="پرسوناها">
      <Empty v-if="personas.length === 0" description="هنوز پرسونایی ثبت نشده است" />
      <Row v-else :gutter="[16, 16]">
        <Col v-for="persona in personas" :key="persona.id" :xs="24" :sm="12" :lg="8">
          <PersonaCard :persona="persona" @remove="removePersona" />
        </Col>
      </Row>
    </Card>

    <Card title="نقشه همدلی">
      <EmpathyMap />
    </Card>

    <Card title="یادداشت تحقیق">
      <ResearchNotes />
    </Card>

    <Card title="رقبا">
      <CompetitorTable />
    </Card>
  </Space>
</template>
